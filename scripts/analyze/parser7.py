import os
import glob
import csv
import hashlib

# Get a list of all CSV files in the current directory
csv_files = glob.glob('*.csv')

# Sort the CSV files numerically
csv_files.sort(key=lambda x: int(x.split('.')[0]))

# Open the output CSV file for writing
with open('combined.csv', 'w', newline='') as output_file:
    writer = csv.writer(output_file)
    
    # Write the header row
    writer.writerow(['Filename', 'Type', 'Original URL', 'UUID', 'URL Hash'])
    
    # Iterate over each CSV file
    for csv_file in csv_files:
        # Get the base filename (e.g., "1", "2", "3")
        base_filename = os.path.splitext(csv_file)[0]
        
        # Open the CSV file for reading
        with open(csv_file, 'r') as input_file:
            reader = csv.reader(input_file)
            
            # Skip the header row
            next(reader, None)
            
            # Iterate over each row in the CSV file
            for row in reader:
                url = row[1]  # Assuming the URL is in the second column (index 1)
                
                # Generate MD5 hash of the URL
                url_hash = hashlib.md5(url.encode('utf-8')).hexdigest()[:12]  # Take the first 12 characters
                
                # Add the base filename and URL hash as new columns
                row.insert(0, base_filename)
                row.append(url_hash)
                
                # Write the modified row to the output CSV file
                writer.writerow(row)

print("CSV files combined successfully into 'combined.csv'.")
