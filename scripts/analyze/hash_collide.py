import csv

def find_duplicate_hashes(csv_file):
    hash_urls = {}

    with open(csv_file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            url = row['Original URL']
            url_hash = row['URL Hash']
            if url_hash in hash_urls:
                hash_urls[url_hash].append(url)  # Add the URL to the list of URLs for this hash
            else:
                hash_urls[url_hash] = [url]  # Initialize a new list with the URL

    return {hash_value: urls for hash_value, urls in hash_urls.items() if len(urls) > 1}

csv_file = 'combined_image.csv'
duplicates = find_duplicate_hashes(csv_file)

if duplicates:
    print("Duplicate hashes found:")
    for hash_value, urls in duplicates.items():
        # Print hash
        print(f"Hash: {hash_value}")
        # Print corresponding URLs
        for url in urls:
            print(f"  - {url}")
else:
    print("No duplicate hashes found.")

