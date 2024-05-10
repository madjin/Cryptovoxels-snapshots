import csv

def remove_duplicate_urls(input_csv, output_csv):
    url_set = set()
    
    with open(input_csv, newline='') as input_file, open(output_csv, 'w', newline='') as output_file:
        reader = csv.DictReader(input_file)
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(output_file, fieldnames=fieldnames)
        
        writer.writeheader()
        
        for row in reader:
            url = row['Original URL']
            if url not in url_set:
                url_set.add(url)
                writer.writerow(row)

input_csv = 'combined_image.csv'
output_csv = 'combined_image_unique.csv'

remove_duplicate_urls(input_csv, output_csv)
print(f"Unique URLs written to {output_csv}")
