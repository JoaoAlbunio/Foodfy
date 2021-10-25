const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

exports.index = async (req, res) => { 
  let { filter } = req.query;

  let results = await Recipe.all();
  const recipes = results.rows;

  results = await Recipe.chefSelectOptions();
  const chefs = results.rows;

  results = await Recipe.findBy(filter);
  const filtered = results.rows[0];

  const recipesPromises = (recipes) => {
    return Promise.all(
      recipes.map(async (recipe) => {
        const pathImage = await Recipe.files(recipe.id)
        if (pathImage.rows != 0) {
          return {
            ...recipe,
            src: `${req.protocol}://${req.headers.host}${pathImage.rows[0].path.replace("public", "")}`
          }
        } else {
          return recipe;
        }
      })
    )
  };

  const recipeWithImage = await recipesPromises(recipes);

  return res.render("screens/foodfy", { recipes: recipeWithImage, chefs, filtered });
},
exports.search= async (req, res) => {
  let { filter } = req.query;

  if ( filter ) {
    let results = await Recipe.findBy(filter);
    const filtered = results.rows;
    console.log(filtered)
    results = await Recipe.chefSelectOptions();
    const chefs = results.rows;

    const recipesPromises = (recipes) => {
      return Promise.all(
        recipes.map(async (recipe) => {
          const pathImage = await Recipe.files(recipe.id)
          if (pathImage.rows != 0) {
            return {
              ...recipe,
              src: `${req.protocol}://${req.headers.host}${pathImage.rows[0].path.replace("public", "")}`
            }
          } else {
            return recipe;
          }
        })
      )
    };
  
    const recipeFilteredWithImage = await recipesPromises(filtered);

    return res.render("screens/search", { recipes: recipeFilteredWithImage, chefs, filter });

  } else {
    return res.redirect("/foodfy");
  };
},
exports.about = (req, res) => {
  return res.render("screens/about");
}
exports.recipes = async (req, res) => {
  let results = await Recipe.all();
  const recipes = results.rows;

  results = await Recipe.chefSelectOptions();
  const chefs = results.rows;

  const recipesPromises = (recipes) => {
    return Promise.all(
      recipes.map(async (recipe) => {
        const pathImage = await Recipe.files(recipe.id)
        if (pathImage.rows != 0) {
          return {
            ...recipe,
            src: `${req.protocol}://${req.headers.host}${pathImage.rows[0].path.replace("public", "")}`
          }
        } else {
          return recipe;
        }
      })
    )
  };

  const recipeWithImage = await recipesPromises(recipes);

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

  const chefsPromises = (chefs) => {
    return Promise.all(
      chefs.map(async (chef) => {
        const pathAvatar = await Chef.files(chef.file_id)
        if (pathAvatar.rows != 0) {
          return {
            ...chef,
            avatar_url: `${req.protocol}://${req.headers.host}${pathAvatar.rows[0].path.replace("public", "")}`
          }
        } else {
          return chef;
        }
      })
    )
  };

  const chefWithAvatar = await chefsPromises(chefs);

  return res.render("screens/chefs", { chefs: chefWithAvatar, count });
}
