import urllib.request
import re

url = "https://www.nefisyemektarifleri.com/kiymali-kabak-spagetti-tarifi/"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print("Fetching URL...")
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
        # Let's find all img tags with "recipe" or "attachment" in them
        img_tags = re.findall(r'<img[^>]+src="([^"]+)"[^>]*>', html)
        print("All image sources:")
        for img in img_tags[:15]:
            if "attachment" in img or "tarif" in img or "recipe" in img:
                print("-", img)
            else:
                print("  (other):", img[:100])
                
        # Also look for lazy loaded image sources like data-src, data-lazy, or attachment-recipe
        lazy_imgs = re.findall(r'<img[^>]+(?:data-src|data-lazy|srcset)="([^"]+)"[^>]*>', html)
        print("\nAll data-src/lazy sources:")
        for img in lazy_imgs[:10]:
            print("-", img)
            
except Exception as e:
    print("Failed:", e)
