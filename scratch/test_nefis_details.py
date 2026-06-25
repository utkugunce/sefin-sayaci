import urllib.request
import re

url = "https://www.nefisyemektarifleri.com/kiymali-kabak-spagetti-tarifi/"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print("Fetching URL...")
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
        # Find all occurrences of type="application/ld+json" or type='application/ld+json' or type=application/ld+json
        matches = re.findall(r'application/ld\+json', html)
        print("Occurrences of application/ld+json:", len(matches))
        
        # Find all script tags and check their content for "Recipe"
        script_contents = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
        print("Total script tags:", len(script_contents))
        
        for idx, content in enumerate(script_contents):
            if "Recipe" in content or "recipe" in content:
                print(f"\n--- Script {idx+1} contains 'Recipe' (length={len(content)}) ---")
                print(content.strip()[:300])
                
except Exception as e:
    print("Failed to fetch:", e)
