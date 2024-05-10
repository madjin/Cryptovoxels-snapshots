import json
import sys


def parse_json_file(file_path, type_filter):
    with open(file_path, 'r') as file:
        data = json.load(file)
        parcel = data['parcel']
        content = parcel['content']
        
        # Check if the 'features' key exists in the 'content' object
        if 'features' in content:
            features = content['features']

            for feature in features:
                feature_type = feature['type']
                if feature_type == type_filter:
                    url = feature.get('url', 'N/A')
                    print(url)
        else:
            print(f"No 'features' key found in {file_path}")

# Check if the required command-line arguments are provided
if len(sys.argv) < 3:
    print("Usage: python script.py <type_filter> <file1> <file2> ...")
    sys.exit(1)

# Get the type filter from the command-line arguments
type_filter = sys.argv[1]

# Parse the JSON files provided as command-line arguments
for file_path in sys.argv[2:]:
    parse_json_file(file_path, type_filter)
