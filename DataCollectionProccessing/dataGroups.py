import csv
import time

from dotenv import load_dotenv
import os
import requests

from DataCollectionProccessing.collectPageData import extractData

load_dotenv()

csv_filename = "fragrance_list_brands.csv"

def fetch(link, api):
    payload = {'api_key': api, 'url': link, 'render':'true'}
    r = requests.get('https://api.scraperapi.com', params=payload)
    return r.text

def countRows(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return sum(1 for _ in enumerate(f))


def processCsv(inputFile, outputFile, api):

    numRows = countRows(inputFile)-1

    with open(inputFile, mode='r', encoding='utf-8') as infile, open(outputFile, mode='w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        next(reader)

        outputHeaders = ['name', 'brand', 'accords', 'ratingValue', 'ratingCount', 'seasons', 'timeOfDay', 'gender', 'priceValue', 'notesBreakdown']
        writer.writerow(outputHeaders)
        print(outputHeaders)

        for i, row in enumerate(reader):
            link = row[2]
            try:
                html = fetch(link, api)
                # with open("test.html", "w", encoding="utf-8") as f:
                #     f.write(html)
                extractedData = extractData(html)
                writer.writerow([extractedData.get(key, "") for key in outputHeaders])
            except Exception as e:
                print(e)
                print(f"ERROR AT INDEX {i} NAMED {str(row[0:2])}")
                input("Continue?")
                writer.writerow([row[0], row[1]])

            print(f"Completed row {i+1} : {(i+1)/numRows*100}%")
            print("Sleeping...")
            time.sleep(4)
            print("Awake...")

apikey = os.getenv("proxy_api")
processCsv(csv_filename, "raw_data.csv", apikey)
