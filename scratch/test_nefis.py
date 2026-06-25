import urllib.request
import json
import re

url = "https://www.nefisyemektarifleri.com/kiymali-kabak-spagetti-tarifi/"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print("Fetching URL...")
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        print("Fetched! Searching for JSON-LD...")
        
        # Regex to find ld+json script tags
        scripts = re.findall(r'<script\b[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.DOTALL)
        
        recipe_found = False
        for script in scripts:
            try:
                data = json.loads(script.strip())
                
                # Check if it is a list, graph or single object
                def check_recipe(obj):
                    if isinstance(obj, list):
                        for item in obj:
                            res = check_recipe(item)
                            if res: return res
                    elif isinstance(obj, dict):
                        if obj.get('@type') == 'Recipe' or obj.get('type') == 'Recipe':
                            return obj
                        if '@graph' in obj:
                            return check_recipe(obj['@graph'])
                        for k, v in obj.items():
                            if isinstance(v, (dict, list)):
                                res = check_recipe(v)
                                if res: return res
                    return None
                
                recipe = check_recipe(data)
                if recipe:
                    recipe_found = True
                    print("\n--- RECIPE FOUND IN SCHEMA ---")
                    print("Title:", recipe.get("name"))
                    print("Description:", recipe.get("description"))
                    print("PrepTime:", recipe.get("prepTime"))
                    print("CookTime:", recipe.get("cookTime"))
                    print("Yield (Servings):", recipe.get("recipeYield"))
                    print("Ingredients Count:", len(recipe.get("recipeIngredient", [])))
                    print("Instructions Count:", len(recipe.get("recipeInstructions", [])))
                    if recipe.get("recipeInstructions"):
                        print("Sample Step 1:", recipe.get("recipeInstructions")[0])
                    break
            except Exception as e:
                pass
                
        if not recipe_found:
            print("Recipe schema not found in JSON-LD scripts.")
            
except Exception as e:
    print("Failed to fetch:", e)
