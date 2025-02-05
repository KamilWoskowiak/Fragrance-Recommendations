import csv
import time

from dotenv import load_dotenv
import os
import requests

from DataCollectionProccessing.collectPageData import extractData

load_dotenv()

csv_filename = "fragrance_list_brands.csv"

def fetch(link, proxies):
    return requests.get(link, proxies=proxies, verify=False)


def processCsv(inputFile, outputFile, proxies):
    with open(inputFile, mode='r', encoding='utf-8') as infile, open(outputFile, mode='w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        next(reader)

        outputHeaders = extractData(None).keys()
        writer.writerow(outputHeaders)

        for i, row in enumerate(reader):
            link = row[2]

            html = fetch(link, proxies)
            extractedData = extractData(html)
            writer.writerow([extractedData.get(key, "") for key in outputHeaders])
            print(f"Completed row {i}")
            time.sleep(2)

proxies = {
    "https": os.getenv("PROXY_URL")
}

processCsv(csv_filename, "raw_data.csv", proxies)
