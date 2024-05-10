import csv

# Function to check if two URLs are the same
def are_urls_same(url1, url2):
    return url1 == url2

# Function to compare URL hashes and URLs
def compare_hashes_and_urls(filename):
    # Dictionary to store URL hashes and corresponding URLs
    hash_urls = {}

    # Read the CSV file
    with open(filename, 'r', newline='') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip the header
        for row in reader:
            hash_value = row[3]
            url = row[2]
            if hash_value in hash_urls:
                if not are_urls_same(hash_urls[hash_value], url):
                    print(f"Hash: {hash_value}, URL 1: {hash_urls[hash_value]}, URL 2: {url}")
            else:
                hash_urls[hash_value] = url

# Call the function with the filename
compare_hashes_and_urls('combined_image.csv')
