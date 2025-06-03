import time
import csv
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import urlparse, unquote

site = input("Link: ")
driver = webdriver.Chrome()
driver.get(site)

wait = WebDriverWait(driver, 10)

for _ in range(50):
    try:
        show_more_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Show more results')]")))
        driver.execute_script("arguments[0].click();", show_more_button)
        print("Clicked 'Show more results' button")
        time.sleep(5)
    except Exception as e:
        print("Button not found or already loaded all results:", e)
        break

time.sleep(5)

fragrance_items = driver.find_elements(By.XPATH, "//div[contains(@class, 'card fr-news-box')]//a")

fragrance_data = []
for item in fragrance_items:
    name = item.text.strip()
    link = item.get_attribute("href")

    brand = ""
    if link:
        try:
            parsed_url = urlparse(link)
            path_parts = parsed_url.path.split("/")
            if "perfume" in path_parts:
                brand_index = path_parts.index("perfume") + 1
                if brand_index < len(path_parts):
                    brand = unquote(path_parts[brand_index]).replace("-", " ")
        except Exception as e:
            print(f"Error extracting brand from {link}: {e}")

    if name and link:
        fragrance_data.append([name, brand, link])

csv_filename = "extra_fragrance_list_brands.csv"
file_exists = os.path.isfile(csv_filename)

with open(csv_filename, mode="a", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    if not file_exists:
        writer.writerow(["Fragrance Name", "Brand Name", "Link"])
    writer.writerows(fragrance_data)

for i, (name, brand, link) in enumerate(fragrance_data, 1):
    print(f"{i}. {name} - {brand} - {link}")

print(f"\nData successfully appended to {csv_filename}")

driver.quit()
