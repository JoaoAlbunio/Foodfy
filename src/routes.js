const express = require("express");
const routes = express.Router();
const multer = require('./app/middlewares/multer');

const HomeController = require("./app/controllers/HomeController");
const RecipeController = require("./app/controllers/RecipeController");
const ChefController = require("./app/controllers/ChefController");
const SearchController = require("./app/controllers/SearchController");

// HOME

routes.get("/", HomeController.index);

// SEARCH 

routes.get("/search", SearchController.index);

// PAGES 

routes.get("/about", HomeController.about);
routes.get("/recipes", HomeController.recipes);
routes.get("/recipes/:id", HomeController.show);
routes.get("/chefs", HomeController.chefs);

// RECIPES 

routes.get("/admin/recipes", RecipeController.index);
routes.get("/admin/recipes/create", RecipeController.create);
routes.get("/admin/recipes/:id", RecipeController.show);
routes.get("/admin/recipes/:id/edit", RecipeController.edit);

routes.post("/admin/recipes", multer.array("images", 5), RecipeController.post);
routes.put("/admin/recipes", multer.array("images", 5), RecipeController.update);
routes.delete("/admin/recipes", RecipeController.delete);

// CHEFS 

routes.get("/admin/chefs", ChefController.index);
routes.get("/admin/chefs/create", ChefController.create);
routes.get("/admin/chefs/:id", ChefController.show);
routes.get("/admin/chefs/:id/edit", ChefController.edit);

routes.post("/admin/chefs", multer.single("avatar"), ChefController.post);
routes.put("/admin/chefs", multer.single("avatar"), ChefController.update);
routes.delete("/admin/chefs", ChefController.delete);

// ERROR 404 

routes.use(function (req, res) {
  res.status(404).render("not-found");
});

module.exports = routes;