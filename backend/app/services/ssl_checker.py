import socket
import ssl
import ipaddress
import certifi

from urllib.parse import urlparse
from datetime import datetime, timezone


def check_website_security(url: str):
    """
    Checks HTTPS availability and basic SSL certificate details.
    """

    try:
        url = url.strip()

        if not url.startswith(("https://", "http://")):
            url = "https://" + url

        parsed = urlparse(url)
        hostname = parsed.hostname

        if not hostname:
            raise ValueError("Invalid website URL")

        if parsed.scheme not in ("http", "https"):
            raise ValueError("Only HTTP and HTTPS URLs are supported")

        # Resolve hostname and reject private or local IP addresses.
        addresses = socket.getaddrinfo(
            hostname,
            443,
            type=socket.SOCK_STREAM
        )

        for address in addresses:
            ip = ipaddress.ip_address(address[4][0])

            if not ip.is_global:
                raise ValueError(
                    "Private or local addresses are not allowed"
                )

        # Use Certifi's trusted certificate authority bundle.
        context = ssl.create_default_context(
            cafile=certifi.where()
        )

        # Connect securely and verify the SSL certificate.
        with socket.create_connection(
            (hostname, 443),
            timeout=5
        ) as connection:

            with context.wrap_socket(
                connection,
                server_hostname=hostname
            ) as secure_connection:

                certificate = secure_connection.getpeercert()

                issuer = dict(
                    item
                    for group in certificate.get("issuer", [])
                    for item in group
                ).get("organizationName", "Unknown")

                expiry_date = datetime.strptime(
                    certificate["notAfter"],
                    "%b %d %H:%M:%S %Y %Z"
                ).replace(tzinfo=timezone.utc)

                now = datetime.now(timezone.utc)

                valid = expiry_date > now

                days_remaining = (
                    expiry_date - now
                ).days

                return {
                    "url": url,
                    "https_available": True,
                    "ssl_valid": valid,
                    "certificate_issuer": issuer,
                    "expiry_date": expiry_date.isoformat(),
                    "days_remaining": days_remaining,
                    "status": "Secure" if valid else "Expired"
                }

    except Exception as error:

        return {
            "url": url,
            "https_available": False,
            "ssl_valid": False,
            "certificate_issuer": None,
            "expiry_date": None,
            "days_remaining": None,
            "status": "Check failed",
            "error": str(error)
        }