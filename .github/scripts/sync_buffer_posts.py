"""Add published LinkedIn posts from Buffer to the portfolio's static index."""

import html
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import unquote, urlsplit
from urllib.request import Request, urlopen

# The existing archive covers posts published before Buffer was connected.
SYNC_FROM = datetime.fromisoformat("2026-11-22T00:00:00+01:00")

POST_LIST = re.compile(r'(<ul class="post-list">\n)(.*?)(^  </ul>)', re.DOTALL | re.MULTILINE)
SYNCED_ROW = re.compile(r'^    <li data-published-at="([^"]+)">.*</li>\n', re.MULTILINE)
FEED_PATH = re.compile(r"/feed/update/urn:li:(?:activity|share|ugcPost):(\d+)/?")
POST_PATH = re.compile(r"/posts/[\w%-]+-activity-(\d+)(?:-[\w-]+)?/?")


def query_buffer(token, query, **variables):
    request = Request(
        "https://api.buffer.com",
        data=json.dumps({"query": query, "variables": variables}).encode(),
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    try:
        with urlopen(request, timeout=25) as response:
            payload = json.load(response)
    except HTTPError as error:
        raise RuntimeError(f"Buffer API returned HTTP {error.code}.") from None
    if payload.get("errors"):
        messages = "; ".join(str(error.get("message", "")) for error in payload["errors"])
        raise RuntimeError(f"Buffer GraphQL query failed: {messages.replace(token, '[redacted]')}")
    return payload["data"]


def find_channel(token, query):
    data = query(token, "query { account { organizations { id } } }")
    profiles = []
    for organization in data["account"]["organizations"]:
        organization_id = organization["id"]
        data = query(token, """
          query Channels($organization: OrganizationId!) {
            channels(input: {organizationId: $organization}) {
              id service type isDisconnected isLocked externalLink
            }
          }
        """, organization=organization_id)
        for channel in data["channels"]:
            if (channel["service"] == "linkedin" and channel["type"] == "profile"
                    and not channel["isDisconnected"] and not channel["isLocked"]):
                path = urlsplit(channel["externalLink"] or "").path.rstrip("/").lower()
                profiles.append((path, organization_id, channel["id"]))

    matching = [profile for profile in profiles if profile[0] == "/in/alexcoch"]
    candidates = matching or profiles
    if len(candidates) != 1:
        raise RuntimeError("Could not identify a single connected personal LinkedIn profile in Buffer.")
    _, organization_id, channel_id = candidates[0]
    return {"organization": organization_id, "channel": channel_id}


def get_posts(token, query, channel):
    cursor = None
    seen_cursors = set()
    while True:
        data = query(token, """
          query SentPosts($organization: OrganizationId!, $channel: ChannelId!, $after: String) {
            posts(first: 100, after: $after, input: {
              organizationId: $organization,
              filter: {status: [sent], channelIds: [$channel]},
              sort: [{field: dueAt, direction: desc}, {field: createdAt, direction: desc}]
            }) {
              edges { node { sentAt externalLink text } }
              pageInfo { hasNextPage endCursor }
            }
          }
        """, **channel, after=cursor)["posts"]
        yield from (edge["node"] for edge in data["edges"])
        if not data["pageInfo"]["hasNextPage"]:
            return
        cursor = data["pageInfo"]["endCursor"]
        if not cursor or cursor in seen_cursors:
            raise RuntimeError("Buffer returned an invalid posts pagination cursor.")
        seen_cursors.add(cursor)


def linkedin_link(url):
    if not url:
        return None
    parts = urlsplit(url)
    if parts.scheme != "https" or parts.netloc.lower() not in {"linkedin.com", "www.linkedin.com"}:
        return None
    path = unquote(parts.path)
    match = FEED_PATH.fullmatch(path) or POST_PATH.fullmatch(path)
    if not match:
        return None
    return match[1], f"https://www.linkedin.com{path.rstrip('/')}/"


def post_title(text, sent_at):
    first_line = next((" ".join(line.split()) for line in text.splitlines() if line.strip()), "")
    if not first_line:
        return f"LinkedIn post · {sent_at.date().isoformat()}"
    return first_line if len(first_line) <= 110 else first_line[:109].rstrip() + "…"


def add_posts(page, posts):
    match = POST_LIST.search(page)
    if not match:
        raise RuntimeError("Could not find the Posts list in index.html.")
    current = match[2]
    known = {
        link[0] for url in re.findall(r'href="([^"]+)"', current)
        if (link := linkedin_link(html.unescape(url)))
    }
    new_rows = []
    for post in posts:
        if not post["sentAt"] or not (link := linkedin_link(post["externalLink"])):
            continue
        post_id, url = link
        if post_id in known:
            continue
        sent_at = datetime.fromisoformat(post["sentAt"].replace("Z", "+00:00")).astimezone(timezone.utc)
        if sent_at < SYNC_FROM:
            continue
        known.add(post_id)
        date = sent_at.isoformat()
        title = html.escape(post_title(post["text"], sent_at))
        new_rows.append((date, f'    <li data-published-at="{date}"><a href="{html.escape(url)}">{title}</a></li>\n'))

    if not new_rows:
        return page, 0

    synced_rows = [(row[1], row[0]) for row in SYNCED_ROW.finditer(current)]
    rows = sorted(synced_rows + new_rows, key=lambda row: row[0], reverse=True)
    result = "".join(row for _, row in rows) + SYNCED_ROW.sub("", current)
    return page[:match.start(2)] + result + page[match.end(2):], len(new_rows)


def main():
    token = os.environ.get("BUFFER_API_KEY")
    if not token:
        raise RuntimeError("Set the BUFFER_API_KEY repository secret before running this workflow.")

    cache = Path(os.environ["RUNNER_TEMP"]) / "portfolio-buffer-channel.json"
    if cache.exists():
        channel = json.loads(cache.read_text())
    else:
        channel = find_channel(token, query_buffer)
        cache.write_text(json.dumps(channel))

    page = Path("index.html")
    posts = list(get_posts(token, query_buffer, channel))
    updated, added = add_posts(page.read_text(), posts)
    if added:
        page.write_text(updated)

    print(f"Buffer connection verified. Read {len(posts)} sent post(s), added {added} LinkedIn link(s).")
    without_link = sum(not linkedin_link(post["externalLink"]) for post in posts)
    if without_link:
        print(f"Skipped {without_link} post(s) without a supported LinkedIn URL. They will be checked again.")


if __name__ == "__main__":
    main()
