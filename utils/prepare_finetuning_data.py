import requests
from bs4 import BeautifulSoup



def get_appwrite_data(path: str):
    url = f"https://appwrite.io/docs/{path}"
    data = requests.get(url).text
    soup = BeautifulSoup(data, 'html.parser')
    results = soup.select('body > main > div > div > div.col.span-10 > article > div > div')
    for result in results:
        

get_appwrite_data('client/account?sdk=web-default&v=1.1.x')