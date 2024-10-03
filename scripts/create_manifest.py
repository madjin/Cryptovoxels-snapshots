import json

def generate_manifest(folder_data):
    manifest = {
        "manifest": "arweave/paths",
        "version": "0.1.0",
        "paths": {}
    }

    for item in folder_data:
        if item['entityType'] == 'file':
            path = item['name']
            manifest['paths'][path] = {
                "id": item['dataTxId']
            }

    return manifest

with open('vox-model_upload.json', 'r') as f:
    folder_data = json.load(f)

manifest = generate_manifest(folder_data)

with open('vox-model_manifest2.json', 'w') as f:
    json.dump(manifest, f, indent=2)

print("Manifest file created: manifest.json")
