import urllib.request
import re

url = "https://www.nefisyemektarifleri.com/kiymali-kabak-spagetti-tarifi/"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print("Fetching URL...")
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
        # Check if "Recipe" is in the HTML
        print("Does HTML contain 'Recipe' (case-sensitive)?", "Recipe" in html)
        
        # Check script type="application/ld+json" tags
        scripts = re.findall(r'<script\b[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.DOTALL)
        print("Found", len(scripts), "JSON-LD scripts.")
        for idx, script in enumerate(scripts):
            snippet = script.strip()[:150]
            print(f"Script {idx+1}: {snippet}...")
            
except Exception as e:
    print("Failed to fetch:", e)
