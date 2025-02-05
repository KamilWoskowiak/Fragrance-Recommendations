from selenium import webdriver
from bs4 import BeautifulSoup


def extractData(url):
    driver = webdriver.Chrome()
    driver.get(url)
    html = driver.page_source
    driver.quit()

    soup = BeautifulSoup(html, "html.parser")
    accord_bars = soup.find_all(class_="accord-bar")

    accords = {}
    for bar in accord_bars:
        text = bar.get_text(strip=True)
        style = bar.get("style", "")
        if "width" in style:
            width_value = float(style.split("width:")[-1].split(";")[0].strip().replace("%",""))/100
            accords[text] = width_value
    print(accords)

    rating_value_tag = soup.find("span", itemprop="ratingValue")
    rating_value = rating_value_tag.get_text(strip=True) if rating_value_tag else None

    rating_count_tag = soup.find("span", itemprop="ratingCount")
    rating_count = rating_count_tag.get_text(strip=True) if rating_count_tag else None

    print(f"{rating_value}/5 out of {rating_count} votes")

    return (accords, rating_value, rating_count)

# Example usage
if __name__ == "__main__":
    url = "https://www.fragrantica.com/perfume/Montale/Arabians-Tonka-57384.html"
    extracted_html = extractData(url)
