import json


def load_companies():
    with open("config/companies.json", "r", encoding="utf-8") as file:
        return json.load(file)