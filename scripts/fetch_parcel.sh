#!/bin/bash
parcel_id="$1"

if [ ! -f "$parcel_id".json ]; then
  echo "Fetching content of parcel $parcel_id"
  wget -nc "https://www.voxels.com/grid/parcels/$parcel_id" -O "$parcel_id".json
fi

declare -A file_types=(
  [1]="vox"
  [2]="jpg"
  [3]="gif"
  [4]="png"
)

echo "Choose the file type you want to see:"
for key in "${!file_types[@]}"; do
  echo "$key. ${file_types[$key]}"
done
echo "5. all"

read choice

if [ "$choice" -ge 1 ] && [ "$choice" -le 4 ]; then
  selected_type=${file_types[$choice]}
  urls=$(jq -r '.parcel.features[].url' $parcel_id.json | grep ".$selected_type" | sort -u)
elif [ "$choice" -eq 5 ]; then
  urls=$(jq -r '.parcel.features[].url' $parcel_id.json | grep -E ".vox|.jpg|.gif|.png" | sort -u)
else
  echo "Invalid choice"
  exit 1
fi

IFS=$'\n' urls=($urls)
for i in "${!urls[@]}"; do
  echo "$((i+1)). ${urls[$i]}"
done

echo "Enter the numbers of the files you want to download separated by commas, a range like 1-9, or type 'all' to download all:"
read file_numbers

if [ "$file_numbers" == "all" ]; then
  selected_files=("${urls[@]}")
else
  IFS=',' read -ra individual_numbers <<< "$file_numbers"
  selected_files=()
  for number in "${individual_numbers[@]}"; do
    if [[ $number =~ ^[0-9]+$ ]]; then
      selected_files+=("${urls[$((number-1))]}")
    elif [[ $number =~ ^[0-9]+-[0-9]+$ ]]; then
      IFS='-' read -ra range <<< "$number"
      for i in $(seq ${range[0]} ${range[1]}); do
        selected_files+=("${urls[$((i-1))]}")
      done
    fi
  done
fi

if [ "$choice" -eq 5 ]; then
  for url in "${selected_files[@]}"; do
    ext="${url##*.}" # Get the extension of the url
    for key in "${!file_types[@]}"; do
      if [ "$ext" == "${file_types[$key]}" ]; then
        dir="${file_types[$key]}" # Assign the extension as the directory name
        break
      fi
    done
    if [ "$ext" != "${file_types[$key]}" ]; then
      dir="other" # If the extension doesn't match any of the file_types, put it in the other directory
      echo "File with weird extension found: $url" # Print the url to the console
    fi 
    mkdir -p "$dir" # Create the directory if it doesn't exist
    wget -nc -P "$dir" "$url" # Download the file to the directory
  done
else
  dir="${selected_type}"
  mkdir -p "$dir"
  for url in "${selected_files[@]}"; do
    wget -nc -P "$dir" "$url"
  done
fi
