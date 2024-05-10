import csv

def filter_vox_models(csv_file):
    filtered_rows = []

    with open(csv_file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['Type'] == 'vox-model':
                filtered_rows.append(row)

    return filtered_rows

csv_file = 'combined.csv'
vox_model_rows = filter_vox_models(csv_file)

if vox_model_rows:
    print("Filtered Vox Model Rows:")
    for row in vox_model_rows:
        print(row)
else:
    print("No vox-model rows found.")
