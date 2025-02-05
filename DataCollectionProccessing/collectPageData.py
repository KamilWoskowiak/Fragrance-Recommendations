from selenium import webdriver
from bs4 import BeautifulSoup


def extractData(html):

    if html is not None:
        soup = BeautifulSoup(html, "html.parser")

    try:
        description = soup.find("div", itemprop="description").find("p").find_all('b')[0:2]
        name = description[0].text
        brand = description[1].text
    except Exception as e:
        name = f"ERROR - {e}"
        brand = f"ERROR - {e}"

    try:
        accord_bars = soup.find_all(class_="accord-bar")
        accords = {}
        for bar in accord_bars:
            text = bar.get_text(strip=True)
            style = bar.get("style", "")
            if "width" in style:
                width_value = float(style.split("width:")[-1].split(";")[0].strip().replace("%",""))/100
                accords[text] = width_value
    except Exception as e:
        accords = f"ERROR - {e}"

    try:
        rating_value_tag = soup.find("span", itemprop="ratingValue")
        rating_value = rating_value_tag.get_text(strip=True) if rating_value_tag else None
    except Exception as e:
        rating_value = f"ERROR - {e}"

    try:
        rating_count_tag = soup.find("span", itemprop="ratingCount")
        rating_count = rating_count_tag.get_text(strip=True) if rating_count_tag else None
    except Exception as e:
        rating_count = f"ERROR - {e}"


    seasonsAndTimesOfDay = ["winter", "spring", "summer", "fall", "day", "night"]
    seasons = {}
    timeOfDay = {}

    try:
        seasonsAndTimesOfDay_span = soup.find_all(lambda tag: tag.name == "span" and "vote-button-legend" in tag.get("class", []) and tag.text.strip().lower() in seasonsAndTimesOfDay)

        for span in seasonsAndTimesOfDay_span:
            text = span.text.strip().lower()
            bar = span.parent.parent.find("div", class_="voting-small-chart-size").find('div').find('div')
            style = bar.get("style", "")
            if "width" in style:
                width_value = float(style.split("width:")[-1].split(";")[0].strip().replace("%",""))/100
                if (text in ["day", "night"]):
                    timeOfDay[text] = width_value
                elif (text in ["summer", "winter", "spring", "fall"]):
                    seasons[text] = width_value
    except Exception as e:
        seasons = f"ERROR - {e}"
        timeOfDay = f"ERROR - {e}"

    extraPolling = ["gender", "price value"]
    gender = {}
    priceValue = {}

    try:
        extraPolling_span = soup.find_all(lambda tag: tag.name == "span" and tag.text.strip().lower() in extraPolling)

        for span in extraPolling_span:
            text = span.text.strip().lower()
            stats = span.parent.parent.find("div", style="margin-top: 1.5rem;").children
            for child in stats:
                catType = child.find("div", class_="cell small-5 medium-5 large-5").find("span").text.strip()
                numVotes = int(child.find("div", class_="cell small-1 medium-1 large-1").find("span").text.strip())
                if (text in ["gender"]):
                    gender[catType] = numVotes
                elif (text in ["price value"]):
                    priceValue[catType] = numVotes
    except Exception as e:
        gender = f"ERROR - {e}"
        priceValue = f"ERROR - {e}"

    topnotes = []
    midnotes = []
    bottomnotes = []
    notesBreakdown = {}

    try:
        pyramid = soup.find("div", id="pyramid").find("div", class_="cell").find("div").find("div", class_=lambda
            x: x != "strike-title")

        breakdown = [
            child for child in pyramid
            if child.get("style") != "display: flex; justify-content: center;"
                and not {"text-center", "notes-box"}.intersection(child.get("class", []))
        ]

        if (len(breakdown) == 6):
            topnotes = list(set(a.parent.get_text(strip=True) for a in breakdown[1].find_all("a")))
            midnotes = list(set(a.parent.get_text(strip=True) for a in breakdown[3].find_all("a")))
            bottomnotes = list(set(a.parent.get_text(strip=True) for a in breakdown[5].find_all("a")))
        elif (len(breakdown) == 1):
            topnotes = list(set(a.parent.get_text(strip=True) for a in breakdown[0].find_all("a")))

        notesBreakdown["topnotes"] = topnotes
        notesBreakdown["midnotes"] = midnotes
        notesBreakdown["bottomnotes"] = bottomnotes

    except Exception as e:
        notesBreakdown = f"ERROR - {e}"

    output = {
        "name": name,
        "brand": brand,
        "accords": accords,
        "ratingValue": rating_value,
        "ratingCount": rating_count,
        "seasons": seasons,
        "timeOfDay": timeOfDay,
        "seasonsAndTimesOfDay": seasonsAndTimesOfDay,
        "gender": gender,
        "priceValue": priceValue,
        "notesBreakdown": notesBreakdown
    }
    print(output)
    return output