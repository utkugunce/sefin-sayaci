// Using global fetch directly

async function test() {
  const url = "https://www.nefisyemektarifleri.com/kiymali-kabak-spagetti-tarifi/";
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  
  console.log("Fetching...");
  try {
    const res = await fetch(proxyUrl);
    const data = await res.json();
    const html = data.contents;
    
    // Simple regex to extract JSON-LD script tags instead of full DOM parsing in Node environment
    const regex = /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let recipeObj = null;

    while ((match = regex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(match[1].trim());
        // Find recipe
        recipeObj = findRecipeInJson(parsed);
        if (recipeObj) break;
      } catch (e) {
        // Skip
      }
    }

    if (recipeObj) {
      console.log("Recipe Found!");
      console.log("Title:", recipeObj.name);
      console.log("Description:", recipeObj.description);
      console.log("PrepTime:", recipeObj.prepTime);
      console.log("CookTime:", recipeObj.cookTime);
      console.log("Ingredients Count:", recipeObj.recipeIngredient?.length);
      console.log("Instructions Count:", recipeObj.recipeInstructions?.length);
      console.log("First Instruction:", recipeObj.recipeInstructions?.[0]);
    } else {
      console.log("Recipe NOT found in JSON-LD!");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

function findRecipeInJson(obj) {
  if (!obj || typeof obj !== 'object') return null;

  if (Array.isArray(obj)) {
    for (let item of obj) {
      const found = findRecipeInJson(item);
      if (found) return found;
    }
  }

  if (obj['@type'] === 'Recipe' || obj['type'] === 'Recipe') {
    return obj;
  }

  if (obj['@graph']) {
    return findRecipeInJson(obj['@graph']);
  }

  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      const found = findRecipeInJson(obj[key]);
      if (found) return found;
    }
  }

  return null;
}

test();
