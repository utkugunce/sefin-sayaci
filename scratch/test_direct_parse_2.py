import urllib.request
import re

url = "https://www.nefisyemektarifleri.com/kiymali-kabak-spagetti-tarifi/"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print("Fetching URL...")
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
        # Title (let's match <h1> regardless of class, but containing recipe-name or itemprop="name")
        title_match = re.search(r'<h1[^>]*class="[^"]*recipe-name[^"]*"[^>]*>(.*?)</h1>', html, re.DOTALL)
        if not title_match:
            title_match = re.search(r'<h1[^>]*itemprop="name"[^>]*>(.*?)</h1>', html, re.DOTALL)
        title = title_match.group(1).strip() if title_match else "Bulunamadı"
        print("Parsed Title:", title)
        
        # Image
        img_match = re.search(r'<img[^>]*class="[^"]*recipe-image[^"]*"[^>]*src="([^"]+)"', html)
        if not img_match:
            img_match = re.search(r'<img[^>]*itemprop="image"[^>]*src="([^"]+)"', html)
        img = img_match.group(1) if img_match else "Bulunamadı"
        print("Parsed Image:", img)
        
        # Materials (Ingredients)
        # Using tag-generic regex for the parent container
        materials_block = re.search(r'<(div|ul|ol)[^>]*class="[^"]*recipe-materials[^"]*"[^>]*>(.*?)</\1>', html, re.DOTALL)
        if materials_block:
            ingredients = re.findall(r'<li[^>]*>(.*?)</li>', materials_block.group(2), re.DOTALL)
            ingredients = [re.sub(r'<[^>]+>', '', ing).strip() for ing in ingredients]
            print("Ingredients count:", len(ingredients))
            print("First 3 ingredients:", ingredients[:3])
            
        # Instructions (Steps)
        instructions_block = re.search(r'<(div|ol|ul)[^>]*class="[^"]*recipe-instructions[^"]*"[^>]*>(.*?)</\1>', html, re.DOTALL)
        if not instructions_block:
            instructions_block = re.search(r'<(div|ol|ul)[^>]*class="[^"]*recipe-preparation[^"]*"[^>]*>(.*?)</\1>', html, re.DOTALL)
            
        if instructions_block:
            steps = re.findall(r'<li[^>]*>(.*?)</li>', instructions_block.group(2), re.DOTALL)
            steps = [re.sub(r'<[^>]+>', '', step).strip() for step in steps]
            if not steps:
                # If no list items, find paragraphs
                steps = re.findall(r'<p[^>]*>(.*?)</p>', instructions_block.group(2), re.DOTALL)
                steps = [re.sub(r'<[^>]+>', '', step).strip() for step in steps]
            print("Steps count:", len(steps))
            print("First 3 steps:", steps[:3])
            
except Exception as e:
    print("Failed:", e)
