import os
import json
import csv
import argparse

def replace_urls(json_file, csv_file, created_file):
    print("Starting URL replacement process...")

    # Extract the base filename from the JSON file path
    base_filename = os.path.splitext(os.path.basename(json_file))[0]

    print(f"Processing JSON file: {json_file} (Base filename: {base_filename})")

    # Load the JSON data from the file
    with open(json_file, 'r') as file:
        json_data = json.load(file)

    # Load the created JSON data from the file
    with open(created_file, 'r') as file:
        created_data = json.load(file)

    # Create a dictionary to store the mapping of URL hashes to dataTxIds
    url_hash_to_data_tx_id = {
        item['entityName'].split('.')[0]: item['dataTxId']
        for item in created_data['created']
        if 'dataTxId' in item
    }

    # Open the CSV file and iterate over each row
    with open(csv_file, 'r') as file:
        csv_reader = csv.reader(file)
        next(csv_reader)  # Skip the header row

        for row in csv_reader:
            filename, entity_type, original_url, url_hash = row

            # Check if the current row matches the base filename
            if filename == base_filename:
                print(f"Processing file: {filename}")

                # Find the corresponding dataTxId from the created JSON data using the URL hash
                data_tx_id = url_hash_to_data_tx_id.get(url_hash)

                # Replace the URL in the JSON data if a match is found
                if data_tx_id:
                    print(f"Match found for {entity_type}. Replacing URL...")
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
                    print(f"URL replaced for {entity_type}")
                else:
                    print(f"No match found for {entity_type}. Skipping...")

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
