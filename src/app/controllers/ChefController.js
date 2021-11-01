const Chef = require("../models/Chef");
const Recipe = require("../models/Recipe");
const File = require("../models/File");

module.exports = {
  async index(req, res) {
    let results = await Chef.all();
    const chefs = results.rows;

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

    return res.render("admin/chefs/index", { chefs: chefWithAvatar });
  },
  create(req, res){
    return res.render("admin/chefs/create-chef");
  },
  async post(req, res) {
    const keys = Object.keys(req.body);
  
    for (key of keys) {
      if (req.body[key] == "")
      return res.send("Por favor, preencha todos os campos.");
    };

    if (!req.file)
      return res.send("Por favor, envie um avatar!");
    
    let results = await File.create(req.file);
    const fileId = results.rows[0].id;

    const name = req.body.name;

    results = await Chef.create({ name, fileId });
    const chefId = results.rows[0].id;

    return res.redirect(`/admin/chefs/${chefId}`);
  },
  async show(req, res) {
    let results = await Chef.find(req.params.id);
    const chef = results.rows[0];
    
    results = await Chef.revenueCounter();
    const count = results.rows;

    results = await Chef.findRecipes();
    const recipes = results.rows;

    async function getImage(recipeId) {
      let results = await Recipe.files(recipeId);
      const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`);

      return files[0];
    };

    const recipesPromise = recipes.map(async recipe => {
      recipe.src = await getImage(recipe.id);

      return recipe;
    });

    const recipesWithImage = await Promise.all(recipesPromise);

    results = await Chef.files(chef.file_id);
    let avatar = results.rows[0];
    avatar = {
      ...avatar,
      src: `${req.protocol}://${req.headers.host}${avatar.path.replace("public", "")}`
    }
    
    return res.render("admin/chefs/show", { chef, count, recipes: recipesWithImage, avatar });
  },
  async edit(req, res) {
    let results = await Chef.find(req.params.id);
    const chef = results.rows[0];
    
    results = await Chef.files(chef.file_id);
    let avatar = results.rows[0];
    avatar = {
      ...avatar,
      src: `${req.protocol}://${req.headers.host}${avatar.path.replace("public", "")}`
    }
    
    return res.render("admin/chefs/edit", { chef, avatar });
  },
  async update(req, res) {
    const { name, id, fileId } = req.body;
    const { filename, path } = req.file;

    if (req.body.name == "") 
      return res.send("Por favor, preencha todos os campos.");
    
    if (req.file) {
      await File.update({ filename, path, fileId })
    };

    await Chef.update({ name, id });

    return res.redirect(`/admin/chefs/${req.body.id}`);
  },
  async delete(req, res) {
    await Chef.delete(req.body.id);
    await File.delete(req.body.avatarId);
    
    return res.redirect("/admin/chefs");
  }
}