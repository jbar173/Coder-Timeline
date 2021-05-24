import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'coder_timeline.settings')

import django
django.setup()

import requests
from api.models import Account

x = 'jbar173'

def repo_api_call(x):
    acc = Account.objects.get(username=x)
    url = f'https://api.github.com/users/{acc.username}/repos'
    account_data = requests.get(url).json()
    # print(f"Account data: {account_data}")
    return account_data

def render_data(account_data):
    repo_list = [x for x in account_data]
    print(f"number of repos: {len(account_data)}")
    print(repo_list[0])



if __name__ == '__main__':
    print("**starting")
    y = repo_api_call(x)
    render_data(y)
    print("**finished")
