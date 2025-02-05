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

def countRows(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return sum(1 for _ in enumerate(f))


def processCsv(inputFile, outputFile, proxies):

    numRows = countRows(inputFile)-1

    with open(inputFile, mode='r', encoding='utf-8') as infile, open(outputFile, mode='w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        next(reader)

        outputHeaders = extractData(None).keys()
        writer.writerow(outputHeaders)
        print(outputHeaders)

        for i, row in enumerate(reader):
            link = row[2]
            try:
                html = fetch(link, proxies)
                extractedData = extractData(html)
                writer.writerow([extractedData.get(key, "") for key in outputHeaders])
            except:
                print(f"ERROR AT INDEX {i} NAMED {str(row[0:2])}")
                input("Continue?")
                writer.writerow([row[0], row[1]])

            print(f"Completed row {i} : {i/numRows*100}%")
            print("Sleeping...")
            time.sleep(2)
            print("Awake...")

proxies = {
    "https": os.getenv("PROXY_URL")
}

processCsv(csv_filename, "raw_data.csv", proxies)
