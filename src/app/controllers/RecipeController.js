const Recipe = require('../models/Recipe');
const File = require('../models/File');

module.exports = {
  async index(req, res) {
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

    return res.render("admin/index", { recipes: recipeWithImage , chefs });
  },
  async create(req, res) {
    let results = await Recipe.chefSelectOptions();
    const options = results.rows;

    return res.render("admin/recipes/create", { options });
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "")
        return res.send("Por favor, preencha todos os campos.");
    };

    if (req.files.length == 0)
      return res.send('Por favor, envie no mínimo uma imagem!');
  
    let results = await Recipe.create(req.body);
    const recipeId = results.rows[0].id;

    const filesPromise = req.files.map(file => File.create({ ...file }));
    const resultsFile = await Promise.all(filesPromise);
    resultsFile.map(item => item.rows.map(fileId => {File.createReference({recipeId, fileId})}));

    return res.redirect(`/admin/recipes/${recipeId}`);
  },
  async show(req, res) {
    let results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    results = await Recipe.chefSelectOptions();
    const chefs = results.rows;

    results = await Recipe.files(recipe.id);
    let files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }));

    return res.render("admin/recipes/show", { recipe, chefs, files });
  },
  async edit(req, res) {
    let results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    results = await Recipe.chefSelectOptions();
    const options = results.rows;

    results = await Recipe.files(recipe.id);
    let files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }));

    return res.render("admin/recipes/edit", { recipe, options, files });
  },
  async update(req, res) {  
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files")
        return res.send("Por favor, preencha todos os campos.");
    };

    if (req.files.length != 0) {
      const newFilesPromise = req.files.map(file => File.create({ ...file }));
      const resultsNewFiles = await Promise.all(newFilesPromise);
      resultsNewFiles.map(item => item.rows.map(fileId => File.createReference({fileId, recipeId: req.body.id})));
    };

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",");
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);
      
      const removedReferencesPromise = removedFiles.map(id => File.deleteReferences(id));
      const removedFilesPromise = removedFiles.map(id => File.delete(id));

      await Promise.all(removedReferencesPromise);
      await Promise.all(removedFilesPromise);
    };

    await Recipe.update(req.body);

    return res.redirect(`/admin/recipes/${req.body.id}`);
  },
  async delete(req, res) { 
    let results = await Recipe.files(req.body.id);
    const files = results.rows;

    const deleteFilesReferencesPromises = files.map(file => File.deleteReferences(file.file_id));
    const deleteFilesPromises = files.map(file => File.delete(file.file_id));
    
    await Promise.all(deleteFilesReferencesPromises);
    await Promise.all(deleteFilesPromises);
    await Recipe.delete(req.body.id);

    return res.redirect("/admin/recipes");
  }
}

