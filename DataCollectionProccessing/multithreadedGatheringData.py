import csv
import os
import requests
import time
from queue import Queue
from threading import Thread, Lock

from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()
apikey = os.getenv("proxy_api")


def extractData(html, fragrance_name):
    soup = BeautifulSoup(html, "html.parser")

    try:
        description = soup.find("div", itemprop="description").find("p").find_all('b')[0:2]
        name = description[0].text
        brand = description[1].text
    except Exception as e:
        print(f"[extractData] Parsing 'description' failed for {fragrance_name} with error: {e}")
        name = f"ERROR - {e}"
        brand = f"ERROR - {e}"

    try:
        accord_bars = soup.find_all(class_="accord-bar")
        accords = {}
        for bar in accord_bars:
            text = bar.get_text(strip=True)
            style = bar.get("style", "")
            if "width" in style:
                width_value = float(style.split("width:")[-1].split(";")[0].strip().replace("%", "")) / 100
                accords[text] = width_value
    except Exception as e:
        print(f"[extractData] Parsing 'accords' failed with error: {e}")
        accords = f"ERROR - {e}"

    try:
        rating_value_tag = soup.find("span", itemprop="ratingValue")
        rating_value = rating_value_tag.get_text(strip=True) if rating_value_tag else None
    except Exception as e:
        print(f"[extractData] Parsing 'ratingValue' failed with error: {e}")
        rating_value = f"ERROR - {e}"

    try:
        rating_count_tag = soup.find("span", itemprop="ratingCount")
        rating_count = rating_count_tag.get_text(strip=True) if rating_count_tag else None
    except Exception as e:
        print(f"[extractData] Parsing 'ratingCount' failed with error: {e}")
        rating_count = f"ERROR - {e}"

    seasonsAndTimesOfDay = ["winter", "spring", "summer", "fall", "day", "night"]
    seasons = {}
    timeOfDay = {}

    try:
        spans = soup.find_all(
            lambda tag: (
                tag.name == "span"
                and "vote-button-legend" in tag.get("class", [])
                and tag.text.strip().lower() in seasonsAndTimesOfDay
            )
        )
        for span in spans:
            text = span.text.strip().lower()
            bar = span.parent.parent.find("div", class_="voting-small-chart-size").find('div').find('div')
            style = bar.get("style", "")
            if "width" in style:
                width_value = float(style.split("width:")[-1].split(";")[0].strip().replace("%", "")) / 100
                if text in ["day", "night"]:
                    timeOfDay[text] = width_value
                else:
                    seasons[text] = width_value
    except Exception as e:
        print(f"[extractData] Parsing 'seasons/timeOfDay' failed with error: {e}")
        seasons = f"ERROR - {e}"
        timeOfDay = f"ERROR - {e}"

    extraPolling = ["gender", "price value"]
    gender = {}
    priceValue = {}

    try:
        extraPolling_span = soup.find_all(
            lambda tag: tag.name == "span" and tag.text.strip().lower() in extraPolling
        )
        for span in extraPolling_span:
            text = span.text.strip().lower()
            stats = span.parent.parent.find("div", style="margin-top: 1.5rem;").children
            for child in stats:
                catType = child.find("div", class_="cell small-5 medium-5 large-5").find("span").text.strip()
                numVotes = int(child.find("div", class_="cell small-1 medium-1 large-1").find("span").text.strip())
                if text == "gender":
                    gender[catType] = numVotes
                elif text == "price value":
                    priceValue[catType] = numVotes
    except Exception as e:
        print(f"[extractData] Parsing 'gender/priceValue' failed with error: {e}")
        gender = f"ERROR - {e}"
        priceValue = f"ERROR - {e}"

    topnotes = []
    midnotes = []
    bottomnotes = []
    notesBreakdown = {}

    try:
        pyramid = (
            soup.find("div", id="pyramid")
            .find("div", class_="cell")
            .find("div")
            .find("div", class_=lambda x: x != "strike-title")
        )

        breakdown = [
            child
            for child in pyramid
            if child.get("style") != "display: flex; justify-content: center;"
            and not {"text-center", "notes-box"}.intersection(child.get("class", []))
        ]

        if len(breakdown) == 6:
            topnotes = list({a.parent.get_text(strip=True) for a in breakdown[1].find_all("a")})
            midnotes = list({a.parent.get_text(strip=True) for a in breakdown[3].find_all("a")})
            bottomnotes = list({a.parent.get_text(strip=True) for a in breakdown[5].find_all("a")})
        elif len(breakdown) == 1:
            topnotes = list({a.parent.get_text(strip=True) for a in breakdown[0].find_all("a")})

        notesBreakdown["topnotes"] = topnotes
        notesBreakdown["midnotes"] = midnotes
        notesBreakdown["bottomnotes"] = bottomnotes
    except Exception as e:
        print(f"[extractData] Parsing 'notesBreakdown' failed with error: {e}")
        notesBreakdown = f"ERROR - {e}"

    output = {
        "name": name,
        "brand": brand,
        "accords": accords,
        "ratingValue": rating_value,
        "ratingCount": rating_count,
        "seasons": seasons,
        "timeOfDay": timeOfDay,
        "gender": gender,
        "priceValue": priceValue,
        "notesBreakdown": notesBreakdown
    }

    print(f"[extractData] Final output for {fragrance_name}: {output}")
    return output


def fetch(link, api, max_retries=3, wait_between=2):
    for attempt in range(1, max_retries + 1):
        print(f"[fetch] Attempt {attempt} for URL: {link}")
        payload = {
            "api_key": api,
            "url": link,
            "render": "true",
            "wait_seconds": "3",
        }
        r = requests.get("https://api.scraperapi.com", params=payload)
        html = r.text

        if 'itemprop="description"' in html:
            print(f"[fetch] Successfully found 'itemprop=\"description\"' on attempt {attempt}")
            return html
        else:
            print(f"[fetch] 'description' not found on attempt {attempt}, retrying in {wait_between}s...")
            time.sleep(wait_between)

    print("[fetch] Max retries reached, returning last HTML response anyway.")
    return html


def countRows(filename):
    with open(filename, "r", encoding="utf-8") as f:
        return sum(1 for _ in f) - 1


def process_row(row, api):
    link = row[2]
    print(f"[process_row] Fetching link for fragrance: {row[0]}")
    html = fetch(link, api)
    return extractData(html, row[0])


def worker(row_queue, writer, output_headers, lock, api):
    while True:
        item = row_queue.get()
        if item is None:
            row_queue.task_done()
            break

        idx, row = item
        print(f"[worker] Starting row {idx} - {row[0]}")
        try:
            result = process_row(row, api)
            output_data = [result.get(h, "") for h in output_headers]
            with lock:
                writer.writerow(output_data)
            print(f"[worker] Finished row {idx} - {row[0]}")
        except Exception as e:
            print(f"[worker] Error processing row {idx} - {row[0]}: {e}")
            with lock:
                writer.writerow([f"ERROR: {e}"] + row)

        row_queue.task_done()


def processCsv(inputFile, outputFile, api):
    numRows = countRows(inputFile)
    print(f"[processCsv] Found {numRows} data rows (excluding header).")

    with open(inputFile, mode="r", encoding="utf-8") as infile:
        reader = csv.reader(infile)
        header = next(reader)
        rows = list(reader)

    outputHeaders = [
        "name", "brand", "accords", "ratingValue",
        "ratingCount", "seasons", "timeOfDay",
        "gender", "priceValue", "notesBreakdown"
    ]

    out_file = open(outputFile, mode="w", newline="", encoding="utf-8")
    writer = csv.writer(out_file)
    writer.writerow(outputHeaders)

    row_queue = Queue()
    lock = Lock()
    threads = []
    num_workers = 18

    for _ in range(num_workers):
        t = Thread(target=worker, args=(row_queue, writer, outputHeaders, lock, api), daemon=True)
        t.start()
        threads.append(t)

    for i, row in enumerate(rows):
        row_queue.put((i, row))

    print(f"[processCsv] Queued {len(rows)} rows with {num_workers} worker threads.")

    for _ in range(num_workers):
        row_queue.put(None)

    row_queue.join()

    for t in threads:
        t.join()

    out_file.close()
    print(f"[processCsv] Done. Output written to {outputFile}")


if __name__ == "__main__":
    csv_filename = "extra_fragrance_list_brands.csv"
    output_filename = "extra_raw_data.csv"
    processCsv(csv_filename, output_filename, apikey)
