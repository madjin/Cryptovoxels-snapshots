#!/bin/bash

# Function to replace URLs in the JSON file
replace_urls() {
  local json_file="$1"
  local csv_file="$2"
  local created_file="$3"
  
  echo "Starting URL replacement process..."
  
  # Extract the base filename from the JSON file path
  base_filename=$(basename "$json_file" | cut -d. -f1)
  
  echo "Processing JSON file: $json_file (Base filename: $base_filename)"
  
  # Iterate over each row in the CSV file
  while IFS=',' read -r filename type original_url url_hash; do
    # Skip header row
    [[ "$filename" == "Filename" ]] && continue
    
    # Check if the current row matches the base filename
    if [[ "$filename" == "$base_filename" ]]; then
      echo "Processing file: $filename"
      
      # Find the corresponding dataTxId from the created JSON file
      data_tx_id=$(jq -r --arg name "$type" '.created[] | select(.entityName == $name) | .dataTxId' "$created_file")
      
      # Replace the URL in the JSON file if a match is found
      if [[ -n "$data_tx_id" ]]; then
        echo "Match found for $type. Replacing URL..."
        new_url="https://arweave.net/$data_tx_id"
        jq --arg url "$original_url" --arg new_url "$new_url" '(.. | objects | select(.url? == $url)) |= .url = $new_url' "$json_file" > tmp.json
        mv tmp.json "$json_file"
        echo "URL replaced for $type"
      else
        echo "No match found for $type. Skipping..."
      fi
    fi
  done < "$csv_file"
  
  echo "URL replacement process completed for $json_file."
}

# Check if the required files are provided as arguments
if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <json_file> <csv_file> <created_file>"
  exit 1
fi

json_file="$1"
csv_file="$2"
created_file="$3"

echo "JSON file: $json_file"
echo "CSV file: $csv_file"
echo "Created file: $created_file"

# Call the function to replace URLs
replace_urls "$json_file" "$csv_file" "$created_file"
