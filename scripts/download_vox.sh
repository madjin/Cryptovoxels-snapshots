#!/bin/bash

# Get the JSON file path from the first command line argument
JSON_FILE="$1"

# Check if the JSON file exists
if [ ! -f "$JSON_FILE" ]; then
  echo "Error: JSON file not found"
  exit 1
fi

# Extract the URLs and UUIDs for vox-models
while read -r url uuid; do
  # Check if both URL and UUID are present
  if [ -n "$url" ] && [ -n "$uuid" ]; then
    # Extract the filename from the URL
    filename=$(basename "$url" | sed "s/'//g" | sed "s/?dl=0//g")
    # Download the file using wget and save it with the UUID as the filename
    wget -q "$url" -O "$uuid.$(echo "$filename" | awk -F . '{print $NF}')"
    # Check if download was successful
    if [ "$?" -eq 0 ]; then
      echo "Downloaded $filename $uuid.$(echo "$filename" | awk -F . '{print $NF}')"
    else
      echo "Error downloading $url"
    fi
    # Export the URL and UUID to a CSV file
    echo "$url,$uuid" >> $(basename $JSON_FILE .json).csv
  else
    echo "Error: invalid URL or UUID"
  fi
done < <(jq -r '.parcel.features[] | select(.type == "vox-model") | "\(.url) \(.uuid)"' "$JSON_FILE")
