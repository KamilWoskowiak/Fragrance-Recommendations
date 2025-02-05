import csv

csv_filename = "fragrance_list_brands.csv"

collections = {}

with open(csv_filename, 'r', encoding="utf-8") as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
        if row[1] in collections:
            collections[row[1]].append(row[0])
        else:
            collections[row[1]] = [row[0]]

print(collections)
for x in collections.keys():
    print(f"{x}: {len(collections[x])}")