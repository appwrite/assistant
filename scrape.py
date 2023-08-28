import json
import os
from uuid import uuid1

import requests
from bs4 import BeautifulSoup

import re

def extract_hrefs(html_code):
    hrefs = re.findall(r'href=["\'](.*?)["\']', html_code)
    return hrefs

def get_appwrite_data(url: str):
    print(f"Getting data from {url}...")
    data = requests.get(url).text
    soup = BeautifulSoup(data, 'html.parser')

    contents = soup.select('.docs > .row > .col:nth-child(2) > article')
    if len(contents) == 0:
        return dict(
        page_content=json.dumps(data),
        metadata={"source": url},
    )
    content = contents[0]

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


links = []
def get_docs_data(base: str, path: str = ""):
    print()
    data = requests.get(f"{base}{path}").text
    hrefs = extract_hrefs(data)
    print(f"Found {len(hrefs)} links in {base}{path}")


    for href in hrefs:
        newPath = href.split("#")[0]
        newUrl = f"{base}{newPath}"
        if newPath and newPath.startswith("/docs")  and newUrl not in links:
            print(f"Found new valid link {newUrl}")
            links.append(newUrl)
            print(f"New total links: {len(links)}")
            get_docs_data(base, newPath)



get_docs_data("http://167.172.175.165:2080")
print(f"\nTotal docs links found: {len(links)}")

print("Getting data from links...")
sources = [get_appwrite_data(link) for link in links]
print("Done!")


print(f"Total sources: {len(sources)}")
print("\nSaving data...")
# Delete all files in docs
for filename in os.listdir("docs"):
    os.remove(f"docs/{filename}")

for source in sources:
    with open(f"docs/{uuid1()}.json", "w") as f:
        json.dump(source, f)
print("Done! Bye!")