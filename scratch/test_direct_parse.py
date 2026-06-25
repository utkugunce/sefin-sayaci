import urllib.request
import re

url = "https://www.nefisyemektarifleri.com/kiymali-kabak-spagetti-tarifi/"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print("Fetching URL...")
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
        # Let's try parsing with simple regex first or bs4
        # We can extract text between <div class="recipe-materials">...</div> or <ul class="recipe-materials">...</ul>
        # and <div class="recipe-instructions">...</div>
        
        # Title
        title_match = re.search(r'<h1[^>]*class="[^"]*recipe-name[^"]*"[^>]*>(.*?)</h1>', html, re.DOTALL)
        if not title_match:
            title_match = re.search(r'<h1[^>]* itemprop="name"[^>]*>(.*?)</h1>', html, re.DOTALL)
        title = title_match.group(1).strip() if title_match else "Bulunamadı"
        print("Parsed Title:", title)
        
        # Image
        img_match = re.search(r'<img[^>]*class="[^"]*recipe-image[^"]*"[^>]*src="([^"]+)"', html)
        if not img_match:
            img_match = re.search(r'<img[^>]*itemprop="image"[^>]*src="([^"]+)"', html)
        img = img_match.group(1) if img_match else "Bulunamadı"
        print("Parsed Image:", img)
        
        # Materials (Ingredients)
        # Usually list of items inside .recipe-materials
        materials_block = re.search(r'<div[^>]*class="[^"]*recipe-materials[^"]*"[^>]*>(.*?)</div>', html, re.DOTALL)
        if materials_block:
            # extract all li contents
            ingredients = re.findall(r'<li[^>]*>(.*?)</li>', materials_block.group(1), re.DOTALL)
            # clean html tags inside ingredients
            ingredients = [re.sub(r'<[^>]+>', '', ing).strip() for ing in ingredients]
            print("Ingredients count:", len(ingredients))
            print("First 3 ingredients:", ingredients[:3])
            
        # Instructions
        instructions_block = re.search(r'<div[^>]*class="[^"]*recipe-instructions[^"]*"[^>]*>(.*?)</div>', html, re.DOTALL)
        if not instructions_block:
            instructions_block = re.search(r'<div[^>]*class="[^"]*recipe-preparation[^"]*"[^>]*>(.*?)</div>', html, re.DOTALL)
        if instructions_block:
            steps = re.findall(r'<li[^>]*>(.*?)</li>', instructions_block.group(1), re.DOTALL)
            steps = [re.sub(r'<[^>]+>', '', step).strip() for step in steps]
            # If no li, try paragraph
            if not steps:
                steps = re.findall(r'<p[^>]*>(.*?)</p>', instructions_block.group(1), re.DOTALL)
                steps = [re.sub(r'<[^>]+>', '', step).strip() for step in steps]
            print("Steps count:", len(steps))
            print("First 3 steps:", steps[:3])
            
except Exception as e:
    print("Failed:", e)
