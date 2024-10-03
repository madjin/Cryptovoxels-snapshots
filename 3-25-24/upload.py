import json
from time import sleep
import os
import requests
from requests.exceptions import RequestException

SKETCHFAB_API_URL = 'https://api.sketchfab.com/v3'
API_TOKEN = 'YOUR_API_KEY'
MAX_RETRIES = 50
MAX_ERRORS = 10
RETRY_TIMEOUT = 5  # seconds
POLL_DELAY = 600  # 10 minutes in seconds

MODEL_FOLDER = '/home/jin/repo/Cryptovoxels-snapshots/3-25-24/glbs'

def _get_request_payload(*, data=None, files=None, json_payload=False):
    data = data or {}
    files = files or {}
    headers = {'Authorization': f'Token {API_TOKEN}'}

    if json_payload:
        headers.update({'Content-Type': 'application/json'})
        data = json.dumps(data)

    return {'data': data, 'files': files, 'headers': headers}

def upload(model_file):
    model_endpoint = f'{SKETCHFAB_API_URL}/models'

    # Extract filename without extension
    filename = os.path.splitext(os.path.basename(model_file))[0]

    data = {
        'name': f'{filename} 2024',
        'description': f'Snapshot of "{filename}" district taken 3-25-24 in Voxels (formally Cryptovoxels), a virtual world build on Ethereum.\n\nOpenvoxels info\n- https://twitter.com/openvoxels\n- Notes: https://hackmd.io/@xr/voxels',
        'tags': ['2024', 'voxelart', 'cryptovoxels', 'openvoxels', 'voxels', 'nft', 'cryptoart'],
        'categories': ['architecture', 'art-abstract'],
        'license': 'by',
        'isPublished': False,
        'isInspectable': True
    }

    print(f'Uploading {filename}...')

    with open(model_file, 'rb') as file_:
        files = {'modelFile': file_}
        payload = _get_request_payload(data=data, files=files)

        try:
            response = requests.post(model_endpoint, **payload)
        except RequestException as exc:
            print(f'An error occurred: {exc}')
            return

    if response.status_code != requests.codes.created:
        print(f'Upload failed with error: {response.json()}')
        return

    model_url = response.headers['Location']
    print(f'Upload successful. Your model is being processed: {model_url}')

    return model_url

def poll_processing_status(model_url):
    errors = 0
    retry = 0

    print(f'Waiting for {POLL_DELAY} seconds before starting to poll...')
    sleep(POLL_DELAY)
    print('Start polling processing status for model')

    while (retry < MAX_RETRIES) and (errors < MAX_ERRORS):
        print(f'Try polling processing status (attempt #{retry})...')

        payload = _get_request_payload()

        try:
            response = requests.get(model_url, **payload)
        except RequestException as exc:
            print(f'Try failed with error {exc}')
            errors += 1
            retry += 1
            continue

        result = response.json()

        if response.status_code != requests.codes.ok:
            print(f'Upload failed with error: {result["error"]}')
            errors += 1
            retry += 1
            continue

        processing_status = result['status']['processing']

        if processing_status == 'PENDING':
            print(f'Your model is in the processing queue. Will retry in {RETRY_TIMEOUT} seconds')
            retry += 1
            sleep(RETRY_TIMEOUT)
            continue
        elif processing_status == 'PROCESSING':
            print(f'Your model is still being processed. Will retry in {RETRY_TIMEOUT} seconds')
            retry += 1
            sleep(RETRY_TIMEOUT)
            continue
        elif processing_status == 'FAILED':
            print(f'Processing failed: {result["error"]}')
            return False
        elif processing_status == 'SUCCEEDED':
            print(f'Processing successful. Check your model here: {model_url}')
            return True

        retry += 1

    print('Stopped polling after too many retries or too many errors')
    return False

def process_all_models():
    for filename in os.listdir(MODEL_FOLDER):
        if filename.endswith('.zip'):
            model_file = os.path.join(MODEL_FOLDER, filename)
            if model_url := upload(model_file):
                poll_processing_status(model_url)
            print('\n')  # Add a newline for better readability between uploads

if __name__ == '__main__':
    process_all_models()
