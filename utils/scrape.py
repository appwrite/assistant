import json
import os
from pprint import PrettyPrinter
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
    get_appwrite_data("databases"),
    get_appwrite_data("storage"),
    get_appwrite_data("functions"),
    get_appwrite_data("authentication"),
]

# Delete all files in docs
for filename in os.listdir("docs"):
    os.remove(f"docs/{filename}")

for source in sources:
    json.dump(source, open(f"docs/{uuid1()}.json", "w"))