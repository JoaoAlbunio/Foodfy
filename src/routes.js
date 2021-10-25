const express = require("express");
const routes = express.Router();
const multer = require('./app/middlewares/multer');

const pages = require("./app/controllers/pages");
const recipes = require("./app/controllers/admin-recipes");
const chefs = require("./app/controllers/admin-chefs");

routes.get("/", (req, res) => {
  return res.redirect("/foodfy");
})

routes.get("/foodfy", pages.index);
routes.get("/search", pages.search);
routes.get("/about", pages.about);
routes.get("/recipes", pages.recipes);
routes.get("/recipes/:id", pages.show);
routes.get("/chefs", pages.chefs);

routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create);
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit);

routes.post("/admin/recipes", multer.array("images", 5), recipes.post);
routes.put("/admin/recipes", multer.array("images", 5), recipes.update);
routes.delete("/admin/recipes", recipes.delete);

routes.get("/admin/chefs", chefs.index);
routes.get("/admin/chefs/create", chefs.create);
routes.get("/admin/chefs/:id", chefs.show);
routes.get("/admin/chefs/:id/edit", chefs.edit);

routes.post("/admin/chefs", multer.single("avatar"), chefs.post);
routes.put("/admin/chefs", multer.single("avatar"), chefs.update);
routes.delete("/admin/chefs", chefs.delete);

routes.use(function (req, res) {
  res.status(404).render("not-found");
});

module.exports = routes;