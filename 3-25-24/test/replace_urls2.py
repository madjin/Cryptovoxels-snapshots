import os
import json
import csv
import argparse

def extract_urls(json_data):
    urls = set()

    def find_urls(obj):
        if isinstance(obj, dict):
            for key, value in obj.items():
                if key == 'url':
                    urls.add(value)
                else:
                    find_urls(value)
        elif isinstance(obj, list):
            for item in obj:
                find_urls(item)

    find_urls(json_data)
    return urls

def replace_urls(json_file, csv_file, created_file):
    print("Starting URL replacement process...")

    # Load the JSON data from the file
    with open(json_file, 'r') as file:
        json_data = json.load(file)

    # Extract unique URLs from the main JSON file
    urls_to_replace = extract_urls(json_data)

    # Load the created JSON data from the file
    with open(created_file, 'r') as file:
        created_data = json.load(file)

    # Create a dictionary to store the mapping of URL hashes to dataTxIds
    url_hash_to_data_tx_id = {
        item['entityName'].split('.')[0]: item['dataTxId']
        for item in created_data['created']
        if 'dataTxId' in item
    }

    # Open the CSV file and create a dictionary to store the mapping of original URLs to URL hashes
    url_to_url_hash = {}
    with open(csv_file, 'r') as file:
        csv_reader = csv.reader(file)
        next(csv_reader)  # Skip the header row

        for row in csv_reader:
            _, _, original_url, url_hash = row
            url_to_url_hash[original_url] = url_hash

    # Iterate over each unique URL in the main JSON file
    for original_url in urls_to_replace:
        # Find the corresponding URL hash from the CSV file
        url_hash = url_to_url_hash.get(original_url)

        if url_hash:
            # Find the corresponding dataTxId from the created JSON data using the URL hash
            data_tx_id = url_hash_to_data_tx_id.get(url_hash)

            # Replace the URL in the JSON data if a match is found
            if data_tx_id:
                print(f"Match found for {original_url}. Replacing URL...")
                new_url = f"https://arweave.net/{data_tx_id}"

                # Recursively search for objects with the 'url' key and replace the value
                def replace_url(obj):
                    if isinstance(obj, dict):
                        for key, value in obj.items():
                            if key == 'url' and value == original_url:
                                obj[key] = new_url
                            else:
                                replace_url(value)
                    elif isinstance(obj, list):
                        for item in obj:
                            replace_url(item)

                replace_url(json_data)
                print(f"URL replaced for {original_url}")
            else:
                print(f"No match found for {original_url} in the created JSON file. Skipping...")
        else:
            print(f"No match found for {original_url} in the CSV file. Skipping...")

    # Write the updated JSON data back to the file
    with open(json_file, 'w') as file:
        json.dump(json_data, file, indent=2)

    print(f"URL replacement process completed for {json_file}.")

# Parse command-line arguments
parser = argparse.ArgumentParser(description='Replace URLs in a JSON file based on a CSV file and created JSON file.')
parser.add_argument('json_file', help='Path to the JSON file')
parser.add_argument('csv_file', help='Path to the CSV file')
parser.add_argument('created_file', help='Path to the created JSON file')
args = parser.parse_args()

print(f"JSON file: {args.json_file}")
print(f"CSV file: {args.csv_file}")
print(f"Created file: {args.created_file}")

# Call the function to replace URLs
replace_urls(args.json_file, args.csv_file, args.created_file)
