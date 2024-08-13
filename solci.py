import requests

url = "https://www.ncbi.nlm.nih.gov/sviewer/viewer.fcgi?id=NP_001070890.2&db=nuccore&report=fasta"

response = requests.get(url)
sequence = response.text.strip()

print(sequence)
