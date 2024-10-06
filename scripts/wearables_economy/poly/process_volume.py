import csv
import json
import subprocess
import os
from datetime import datetime

# Historical prices
historical_prices = {
    "2021-09-27": 1.9933717304475989,
    "2021-10-01": 1.8927104918465856,
    "2021-11-01": 1.9397797205425282,
    "2021-12-01": 2.3635176113822554,
    "2022-01-01": 1.6210291417196812,
    "2022-02-01": 1.6937976600928397,
    "2022-03-01": 1.2575160005691495,
    "2022-04-01": 0.6802012940736749,
    "2022-05-01": 0.4828437032126636,
    "2022-06-01": 0.9148853097608298,
    "2022-07-01": 0.888632718907294,
    "2022-08-01": 0.7859547611194424,
    "2022-09-01": 0.9151966547157149,
    "2022-10-01": 0.8504239507613556,
    "2022-11-01": 0.96427608784697,
    "2022-12-01": 1.4917300249955219,
    "2023-01-01": 1.0586259366953505,
    "2023-02-01": 0.9596424435119623,
    "2023-03-01": 0.8910861043901599,
    "2023-04-01": 0.6682404810787701,
    "2023-05-01": 0.6756260211713991,
    "2023-06-01": 0.5193269788797895,
    "2023-07-01": 0.5192507706702386,
    "2023-08-01": 0.857228335992562,
    "2023-09-01": 0.7747284670372023,
    "2023-10-01": 0.7156042304268335,
    "2023-11-01": 1.0696081034406615,
    "2023-12-01": 0.9997980925346871,
    "2024-01-01": 0.7744561693662452,
    "2024-02-01": 0.6430178494733023,
    "2024-03-01": 0.5149827556546692,
    "2024-04-01": 0.42092484316906087,
    "2024-05-01": 0.3996796991018485,
    "2024-06-01": 0.4171273031280193,
    "2024-07-01": 0.4171273031280193,
    "2024-08-01": 0.416791366686125,
    "2024-09-01": 0.41698906282667253
}

# jq command to extract monthly volumes
jq_command = """jq -r '.["Economic Analysis (6-year period)"]["Monthly Volumes"] | to_entries[] | [.key, (.value | rtrimstr(" MATIC"))] | @csv'"""

# Process all JSON files in the current directory
all_volumes = []
for filename in os.listdir('.'):
    if filename.endswith('.json'):
        try:
            output = subprocess.check_output(f"{jq_command} {filename}", shell=True).decode('utf-8')
            volumes = list(csv.reader(output.splitlines()))
            all_volumes.extend(volumes)
        except subprocess.CalledProcessError:
            print(f"Error processing {filename}")

# Save all volumes to matic_prices.csv
with open('matic_prices.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['date', 'volume'])
    writer.writerows(all_volumes)

# Process the data
print("Date,Volume (MATIC),MATIC Price,Estimated USD Value")
total_usd = 0

for date, volume in all_volumes:
    volume = float(volume)
    price_date = datetime.strptime(date, "%Y-%m").strftime("%Y-%m-01")
    
    if price_date in historical_prices:
        price = historical_prices[price_date]
        usd_value = volume * price
        total_usd += usd_value
        print(f"{date},{volume:.2f},{price:.4f},{usd_value:.2f}")
    else:
        print(f"{date},{volume:.2f},Price not available,N/A")

print(f"\nTotal Estimated USD Value: ${total_usd:.2f}")
