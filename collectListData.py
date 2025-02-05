import time
import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("https://www.fragrantica.com/search/?spol=unisex~male")

wait = WebDriverWait(driver, 10)

reps = 150
for i in range(reps):
    try:
        print (f"{i}/150 ... {i/150*100}% ... {(reps-1-i) * 10} seconds left")
        show_more_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Show more results')]")))
        driver.execute_script("arguments[0].click();", show_more_button)
        print("Clicked 'Show more results' button")
        time.sleep(10)
    except Exception as e:
        print("Button not found or already loaded all results:", e)
        break
time.sleep(5)

fragrance_items = driver.find_elements(By.XPATH, "//div[contains(@class, 'card fr-news-box')]//a")

fragrance_data = []
for item in fragrance_items:
    name = item.text.strip()
    link = item.get_attribute("href")
    if name and link:
        fragrance_data.append([name, link])

csv_filename = "fragrance_list.csv"
with open(csv_filename, mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Fragrance Name", "Link"])
    writer.writerows(fragrance_data)

for i, (name, link) in enumerate(fragrance_data, 1):
    print(f"{i}. {name} - {link}")

print(f"\nData saved successfully to {csv_filename}")

driver.quit()