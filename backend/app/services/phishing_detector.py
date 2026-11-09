
from urllib.parse import urlsplit, urlunsplit
import ipaddress
import re


SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co",
    "is.gd", "cutt.ly", "shorturl.at"
}

BRANDS = {
    "google": "google.com",
    "paypal": "paypal.com",
    "amazon": "amazon.com",
    "microsoft": "microsoft.com",
    "apple": "apple.com",
    "facebook": "facebook.com",
    "instagram": "instagram.com",
    "netflix": "netflix.com"
}


def normalize_url(raw_url):
    raw_url = raw_url.strip()

    if not raw_url:
        raise ValueError("URL cannot be empty.")

    if not re.match(r"^https?://", raw_url, re.IGNORECASE):
        raw_url = "https://" + raw_url

    parsed = urlsplit(raw_url)

    if parsed.scheme.lower() not in ("http", "https"):
        raise ValueError("Only HTTP and HTTPS URLs are supported.")

    if not parsed.hostname:
        raise ValueError("Invalid website address.")

    if parsed.username or parsed.password:
        raise ValueError("URLs containing credentials are not accepted.")

    try:
        hostname = parsed.hostname.encode("idna").decode("ascii").lower()
        port = parsed.port
    except (UnicodeError, ValueError):
        raise ValueError("Invalid domain or port.")

    if any(char.isspace() for char in hostname):
        raise ValueError("Invalid domain name.")

    if ":" in hostname and not hostname.startswith("["):
        host_for_url = f"[{hostname}]"
    else:
        host_for_url = hostname

    netloc = host_for_url + (f":{port}" if port else "")

    normalized = urlunsplit((
        parsed.scheme.lower(),
        netloc,
        parsed.path,
        parsed.query,
        parsed.fragment
    ))

    return normalized, hostname, parsed


def analyze_url(url, hostname, parsed):
    score = 0
    findings = []

    def add_finding(points, title, description):
        nonlocal score
        score += points

        findings.append({
            "title": title,
            "description": description,
            "points": points
        })

    # Check whether the hostname is an IP address.
    try:
        ipaddress.ip_address(hostname)

        add_finding(
            25,
            "IP address used as hostname",
            "The website uses a direct IP address instead of a domain."
        )
    except ValueError:
        pass

    # Check for suspicious keywords.
    suspicious_words = [
        "login", "verify", "account", "secure",
        "update", "signin", "banking", "password"
    ]

    matched_words = [
        word for word in suspicious_words
        if word in url.lower()
    ]

    if matched_words:
        add_finding(
            10,
            "Sensitive keywords found",
            "The URL contains: " + ", ".join(matched_words)
        )

    # Check for unusually many subdomains.
    if len(hostname.split(".")) > 4:
        add_finding(
            15,
            "Unusually many subdomains",
            "The hostname contains several subdomain levels."
        )

    # Check for encoded internationalized domains.
    if "xn--" in hostname:
        add_finding(
            25,
            "Punycode domain detected",
            "The domain uses an encoded internationalized hostname."
        )

    # Check for shortened URLs.
    if hostname in SHORTENERS:
        add_finding(
            20,
            "URL shortener detected",
            "The destination is hidden behind a shortened URL."
        )

    # Check for possible brand impersonation.
    for brand, official_domain in BRANDS.items():
        if brand in hostname and not (
            hostname == official_domain
            or hostname.endswith("." + official_domain)
        ):
            add_finding(
                25,
                "Possible brand impersonation",
                f"The hostname contains '{brand}' but is not "
                f"the official domain {official_domain}."
            )
            break

    # Check URL length.
    if len(url) > 100:
        add_finding(
            10,
            "Unusually long URL",
            "Long URLs can sometimes hide suspicious paths or parameters."
        )

    # Check whether HTTPS is used.
    if parsed.scheme.lower() == "http":
        add_finding(
            10,
            "HTTPS not used",
            "The URL uses HTTP instead of encrypted HTTPS."
        )

    # Calculate final risk score.
    score = min(score, 100)

    if score >= 60:
        risk_level = "High"
    elif score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "findings": findings,
        "indicators": [
            item["title"] for item in findings
        ]
    }
