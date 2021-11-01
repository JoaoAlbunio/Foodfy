const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

exports.index = async (req, res) => { 
  let { filter } = req.query;

  let results = await Recipe.all();
  const recipes = results.rows;

  if (!recipes) return res.send("Recipes not found!");
  
  results = await Recipe.chefSelectOptions();
  const chefs = results.rows;

  results = await Recipe.search(filter);
  const filtered = results.rows[0];

  async function getImage(recipeId) {
    let results = await Recipe.files(recipeId);
    const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`);

    return files[0];
  };

  const recipesPromise = recipes.map(async recipe => {
    recipe.src = await getImage(recipe.id);

    return recipe;
  }).filter((recipe, index) => index > 5 ? false : true);

  const recipeWhitImage = await Promise.all(recipesPromise);

  return res.render("screens/index", { recipes: recipeWhitImage, chefs, filtered });
},
exports.about = (req, res) => {
  return res.render("screens/about");
}
exports.recipes = async (req, res) => {
  let results = await Recipe.all();
  const recipes = results.rows;

  results = await Recipe.chefSelectOptions();
  const chefs = results.rows;

  async function getImage(recipeId) {
    let results = await Recipe.files(recipeId);
    const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`);

    return files[0];
  };

  const recipesPromise = recipes.map(async recipe => {
    recipe.src = await getImage(recipe.id);

    return recipe;
  })

  const recipeWithImage = await Promise.all(recipesPromise);

  return res.render("screens/recipes", { recipes: recipeWithImage, chefs });
},
exports.show = async (req, res) => {
  let results = await Recipe.find(req.params.id);
  const recipe = results.rows[0];

  results = await Recipe.files(recipe.id);
    let files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }));

  return res.render("screens/details", { recipe, files });
},
exports.chefs = async (req, res) => {
  let results = await Chef.all();
  const chefs = results.rows;
  
  results = await Chef.revenueCounter();
  const count = results.rows;

  async function getImage(fileId) {
    let results = await Chef.files(fileId);
    const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`);
    
    return files[0];
  };

  const chefsPromise = chefs.map(async chef => {
    chef.avatar_url = await getImage(chef.file_id);

    return chef;
  })

  const chefWithAvatar = await Promise.all(chefsPromise);

  return res.render("screens/chefs", { chefs: chefWithAvatar, count });
}
