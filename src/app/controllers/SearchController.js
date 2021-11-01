const Recipe = require("../models/Recipe");

exports.index= async (req, res) => {
  try {
    const { filter } = req.query;
    
    if (!filter) return res.redirect("/");
    
    let results = await Recipe.search(filter);
    const filtered = results.rows;
    
    results = await Recipe.chefSelectOptions();
    const chefs = results.rows;
    
    async function getImage(recipeId) {
      results = await Recipe.files(recipeId);
      const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`);
      
      return files[0];
    };
    
    const recipesPromise = filtered.map(async recipe => {
      recipe.src = await getImage(recipe.id);

      return recipe;
    });

    const recipeFilteredWithImage = await Promise.all(recipesPromise);
    
    return res.render("search/index", { recipes: recipeFilteredWithImage, chefs, filter });
    
  } catch (err) {
    console.log(err);
  };
}