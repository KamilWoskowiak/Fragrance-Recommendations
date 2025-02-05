from selenium import webdriver
from bs4 import BeautifulSoup


def extractData(url):
    driver = webdriver.Chrome()
    driver.get(url)
    html = driver.page_source
    driver.quit()

    soup = BeautifulSoup(html, "html.parser")
    accord_bars = soup.find_all(class_="accord-bar")

    description = soup.find("div", itemprop="description").find("p").find_all('b')[0:2]
    name = description[0].text
    brand = description[1].text

    print(name, brand)

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

    seasonsAndTimesOfDay = ["winter", "spring", "summer", "fall", "day", "night"]

    seasonsAndTimesOfDay_span = soup.find_all(lambda tag: tag.name == "span" and "vote-button-legend" in tag.get("class", []) and tag.text.strip().lower() in seasonsAndTimesOfDay)

    seasons = {}
    timeOfDay = {}

    for span in seasonsAndTimesOfDay_span:
        text = span.text.strip().lower()
        bar = span.parent.parent.find("div", class_="voting-small-chart-size").find('div').find('div')
        style = bar.get("style", "")
        if "width" in style:
            width_value = float(style.split("width:")[-1].split(";")[0].strip().replace("%",""))/100
            if (text in ["day", "night"]):
                timeOfDay[text] = width_value
            else:
                seasons[text] = width_value

    print(seasons, timeOfDay)

    extraPolling = ["gender", "price value"]

    extraPolling_span = soup.find_all(lambda tag: tag.name == "span" and tag.text.strip().lower() in extraPolling)

    gender = {}
    priceValue = {}

    for span in extraPolling_span:
        text = span.text.strip().lower()
        stats = span.parent.parent.find("div", style="margin-top: 1.5rem;").children
        for child in stats:
            catType = child.find("div", class_="cell small-5 medium-5 large-5").find("span").text.strip()
            numVotes = int(child.find("div", class_="cell small-1 medium-1 large-1").find("span").text.strip())
            if (text in ["gender"]):
                gender[catType] = numVotes
            else:
                priceValue[catType] = numVotes

    print(gender, priceValue)

    return {
        "name": name,
        "brand": brand,
        "accords": accords,
        "rating_value": rating_value,
        "rating_count": rating_count,
        "seasons": seasons,
        "timeOfDay": timeOfDay,
        "seasonsAndTimesOfDay": seasonsAndTimesOfDay,
        "gender": gender,
        "priceValue": priceValue
    }

# Example usage
if __name__ == "__main__":
    url = "https://www.fragrantica.com/perfume/Montale/Arabians-Tonka-57384.html"
    extracted_html = extractData(url)
