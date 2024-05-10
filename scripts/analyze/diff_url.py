def find_different_urls(filename):
    different_urls = {}

    with open(filename, 'r') as file:
        current_hash = None
        urls = []
        for line in file:
            line = line.strip()
            if line.startswith("Hash: "):
                # Check if there are multiple URLs under the previous hash
                if current_hash and len(set(urls)) > 1:
                    different_urls[current_hash] = urls
                # Reset variables for the new hash
                current_hash = line.split("Hash: ")[1]
                urls = []
            elif line.startswith("  - "):
                urls.append(line.split("  - ")[1])

        # Check the last hash
        if current_hash and len(set(urls)) > 1:
            different_urls[current_hash] = urls

    return different_urls

filename = 'vox_collide3.txt'
result = find_different_urls(filename)

if result:
    print("URLs with differences found under these hashes:")
    for hash_value, urls in result.items():
        print(f"Hash: {hash_value}")
        for url in urls:
            print(f"  - {url}")
else:
    print("No URLs with differences found.")
