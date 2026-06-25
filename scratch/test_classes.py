import urllib.request
import re

url = "https://www.nefisyemektarifleri.com/kiymali-kabak-spagetti-tarifi/"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print("Fetching URL...")
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
        # Let's search for some text like "4 adet kabak" (ingredient) or "Kabakları yıkayıp" (step) and print the surrounding tags
        # Ingredients are usually wrapped in some specific class. Let's list classes of ul/ol/li
        all_classes = re.findall(r'class="([^"]+)"', html)
        unique_classes = set(all_classes)
        recipe_related_classes = [c for c in unique_classes if any(keyword in c.lower() for keyword in ["recipe", "tarif", "malzeme", "step", "instruction", "yapilis", "hazirlan"])]
        
        print("\nRecipe related classes found in HTML:")
        for c in recipe_related_classes[:30]:
            print("-", c)
            
except Exception as e:
    print("Failed to fetch:", e)
