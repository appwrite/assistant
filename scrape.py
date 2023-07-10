import json
import os
from uuid import uuid1

import requests
from bs4 import BeautifulSoup


def get_appwrite_data(path: str):
    url = f"https://appwrite.io/docs/{path}"
    data = requests.get(url).text
    soup = BeautifulSoup(data, 'html.parser')

    content = soup.select('.docs > .row > .col:nth-child(2) > article')[0]

    sections = []
    current_section = None
    headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    for element in content.findChildren(recursive=False):
        if element.name not in headings and not current_section:
            continue

        if element.name in headings:
            if current_section:
                sections.append(current_section)

            current_section = {
                "level": int(element.name[1]),
                "title": element.text,
                "body": [],
            }

        elif current_section != None:
            current_section['body'].append(element.text)
    # pp = PrettyPrinter(indent=4)
    # pp.pprint(sections)

    return dict(
        page_content=json.dumps(sections),
        metadata={"source": url},
    )


sources = [
    get_appwrite_data("getting-started-for-web"),
    get_appwrite_data("getting-started-for-flutter"),
    get_appwrite_data("getting-started-for-apple"),
    get_appwrite_data("getting-started-for-android"),
    get_appwrite_data("getting-started-for-server"),
    get_appwrite_data("command-line"),
    get_appwrite_data("command-line-deployment"),
    get_appwrite_data("command-line-commands"),
    get_appwrite_data("command-line-ci"),
    get_appwrite_data("sdks"),
    get_appwrite_data("rest"),
    get_appwrite_data("graphql"),
    get_appwrite_data("realtime"),
    get_appwrite_data("client/account"),
    get_appwrite_data("server/users"),
    get_appwrite_data("client/teams"),
    get_appwrite_data("client/databases"),
    get_appwrite_data("client/storage"),
    get_appwrite_data("client/functions"),
    get_appwrite_data("client/locale"),
    get_appwrite_data("client/avatars"),
    get_appwrite_data("server/health"),
    get_appwrite_data("databases"),
    get_appwrite_data("databases-queries"),
    get_appwrite_data("databases-pagination"),
    get_appwrite_data("databases-relationships"),
    get_appwrite_data("storage"),
    get_appwrite_data("authentication"),
    get_appwrite_data("authentication-server"),
    get_appwrite_data("authentication-security"),
    get_appwrite_data("functions"),
    get_appwrite_data("keys"),
    get_appwrite_data("permissions"),
    get_appwrite_data("events"),
    get_appwrite_data("queries"),
    get_appwrite_data("pagination"),
    get_appwrite_data("webhooks"),
    get_appwrite_data("custom-domains"),
    get_appwrite_data("response-codes"),
    get_appwrite_data("rate-limits"),
    get_appwrite_data("self-hosting"),
    get_appwrite_data("configuration"),
    get_appwrite_data("environment-variables"),
    get_appwrite_data("email-delivery"),
    get_appwrite_data("sms-delivery"),
    get_appwrite_data("certificates"),
    get_appwrite_data("debugging"),
    get_appwrite_data("upgrade"),
    get_appwrite_data("production"),
]

# Delete all files in docs
for filename in os.listdir("docs"):
    os.remove(f"docs/{filename}")

for source in sources:
    json.dump(source, open(f"docs/{uuid1()}.json", "w"))
