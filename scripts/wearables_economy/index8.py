import os
import argparse
import json
from moralis import evm_api
from datetime import datetime, timedelta
from dotenv import load_dotenv
from collections import defaultdict
import statistics

# Load environment variables
load_dotenv()

# Moralis API key
api_key = os.getenv("MORALIS_API_KEY")

def verbose_print(message, verbose=False):
    if verbose:
        print(message)
        
def parse_timestamp(timestamp_str):
    return datetime.strptime(timestamp_str, "%Y-%m-%dT%H:%M:%S.%fZ")

def get_nft_transfers(contract_address, years_back=6, verbose=False):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=years_back * 365)
    
    params = {
        "address": contract_address,
        "chain": "eth",
        "from_date": start_date.strftime("%Y-%m-%d"),
        "to_date": end_date.strftime("%Y-%m-%d"),
        "limit": 100,
    }
    
    transfers = []
    cursor = None
    page = 1
    
    while True:
        if cursor:
            params["cursor"] = cursor
        
        verbose_print(f"Fetching transfer data: page {page}", verbose)
        result = evm_api.nft.get_nft_contract_transfers(api_key=api_key, params=params)
        transfers.extend(result["result"])
        
        if not result.get("cursor"):
            break
        
        cursor = result["cursor"]
        page += 1
    
    verbose_print(f"Total transfers fetched: {len(transfers)}", verbose)
    return transfers

def analyze_transfers(transfers, contract_address, verbose=False):
    total_volume = 0
    initial_sale_volume = 0
    secondary_sale_volume = 0
    unique_holders = set()
    transfer_count = len(transfers)
    mints = 0
    token_to_first_sale = {}
    prices = []
    token_volumes = defaultdict(float)
    wallet_volumes = defaultdict(float)
    monthly_volumes = defaultdict(float)

    verbose_print("Starting transfer analysis...", verbose)

    for i, transfer in enumerate(transfers):
        if verbose and i % 100 == 0:
            verbose_print(f"Analyzing transfer {i+1}/{transfer_count}", verbose)

        from_address = transfer["from_address"].lower()
        to_address = transfer["to_address"].lower()
        token_id = transfer["token_id"]
        timestamp = parse_timestamp(transfer["block_timestamp"])
        
        if timestamp > datetime.now():
            continue
        
        if from_address == "0x0000000000000000000000000000000000000000":
            mints += 1
            token_to_first_sale[token_id] = {"mint_time": timestamp}
        
        unique_holders.add(to_address)
        
        if transfer.get("value") is not None and float(transfer["value"]) > 0:
            value = float(transfer["value"]) / 1e18  # Convert from Wei to ETH
            
            if token_id not in token_to_first_sale or "sale_time" not in token_to_first_sale[token_id]:
                token_to_first_sale[token_id] = token_to_first_sale.get(token_id, {})
                token_to_first_sale[token_id]["sale_time"] = timestamp
                initial_sale_volume += value
            else:
                secondary_sale_volume += value
            
            total_volume += value
            prices.append(value)
            token_volumes[token_id] += value
            wallet_volumes[to_address] += value
            monthly_volumes[timestamp.strftime("%Y-%m")] += value

    verbose_print("Transfer analysis complete.", verbose)

    non_zero_prices = [p for p in prices if p > 0]
    avg_price = statistics.mean(non_zero_prices) if non_zero_prices else 0
    median_price = statistics.median(non_zero_prices) if non_zero_prices else 0
    price_range = (min(non_zero_prices), max(non_zero_prices)) if non_zero_prices else (0, 0)
    
    top_tokens = sorted(token_volumes.items(), key=lambda x: x[1], reverse=True)[:10]
    top_wallets = sorted(wallet_volumes.items(), key=lambda x: x[1], reverse=True)[:10]

    return {
        "total_volume": total_volume,
        "initial_sale_volume": initial_sale_volume,
        "secondary_sale_volume": secondary_sale_volume,
        "unique_holders": len(unique_holders),
        "transfer_count": transfer_count,
        "mints": mints,
        "avg_price": avg_price,
        "median_price": median_price,
        "price_range": price_range,
        "top_tokens": top_tokens,
        "top_wallets": top_wallets,
        "monthly_volumes": dict(sorted(monthly_volumes.items()))
    }

def get_contract_metadata(contract_address, verbose=False):
    verbose_print("Fetching contract metadata...", verbose)
    params = {
        "address": contract_address,
        "chain": "eth",
    }
    return evm_api.nft.get_nft_contract_metadata(api_key=api_key, params=params)

def main(contract_address, output_file=None, verbose=False):
    verbose_print(f"Analyzing NFT collection: {contract_address}", verbose)
    
    metadata = get_contract_metadata(contract_address, verbose)
    collection_info = {
        "Collection Name": metadata['name'],
        "Symbol": metadata['symbol'],
        "Token Type": metadata['contract_type']
    }
    
    verbose_print("Fetching transfer history...", verbose)
    transfers = get_nft_transfers(contract_address, verbose=verbose)
    
    verbose_print("Analyzing transfers...", verbose)
    analysis = analyze_transfers(transfers, contract_address, verbose=verbose)

    result = {
        "Collection Info": collection_info,
        "Economic Analysis (6-year period)": {
            "Total Trading Volume": f"{analysis['total_volume']:.2f} ETH",
            "Initial Sale Volume": f"{analysis['initial_sale_volume']:.2f} ETH",
            "Secondary Sale Volume": f"{analysis['secondary_sale_volume']:.2f} ETH",
            "Unique Holders": analysis['unique_holders'],
            "Total Transfers": analysis['transfer_count'],
            "Mints": analysis['mints'],
            "Average Price": f"{analysis['avg_price']:.4f} ETH",
            "Median Price": f"{analysis['median_price']:.4f} ETH",
            "Price Range": f"{analysis['price_range'][0]:.4f} - {analysis['price_range'][1]:.4f} ETH",
            "Top 10 Tokens by Volume": [f"Token {token}: {volume:.2f} ETH" for token, volume in analysis['top_tokens']],
            "Top 10 Wallets by Volume": [f"{wallet}: {volume:.2f} ETH" for wallet, volume in analysis['top_wallets']],
            "Monthly Volumes": {k: f"{v:.2f} ETH" for k, v in analysis['monthly_volumes'].items()}
        }
    }

    if output_file:
        verbose_print(f"Writing results to {output_file}", verbose)
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"Results written to {output_file}")
    else:
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analyze NFT collection economics")
    parser.add_argument("contract_address", help="Ethereum address of the NFT contract")
    parser.add_argument("-o", "--output", help="Output file for results (JSON format)")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose output")
    args = parser.parse_args()
    
    main(args.contract_address, args.output, args.verbose)
