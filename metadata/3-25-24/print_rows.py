import csv

# Open the CSV file
with open('vox-models-unique.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file)
    
    # Create a dictionary to store the rows by the first column value
    rows_by_id = {}
    for row in csv_reader:
        if row[0] in rows_by_id:
            rows_by_id[row[0]].append(row)
        else:
            rows_by_id[row[0]] = [row]

# Open the list.txt file and print the matching rows
with open('list.txt', 'r') as list_file:
    for line in list_file:
        id_value = line.strip()
        if id_value in rows_by_id:
            for row in rows_by_id[id_value]:
                print(','.join(row))
        else:
            print(f"No rows found for ID {id_value}")
