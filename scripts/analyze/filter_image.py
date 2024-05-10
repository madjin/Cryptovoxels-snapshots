import csv

def filter_image(csv_file):
    filtered_rows = []

    with open(csv_file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['Type'] == 'image':
                filtered_rows.append(row)

    return filtered_rows

csv_file = 'combined.csv'
image_rows = filter_image(csv_file)

if image_rows:
    print("Filtered image rows:")
    for row in image_rows:
        print(row)
else:
    print("No image rows found.")
