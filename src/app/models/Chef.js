const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = { 
  all() {
    try {
      return db.query(`SELECT * FROM chefs`);

    } catch (err) {
      console.log(err);
    };
  },
  create({name, fileId}) {
    try {
      const query =`
        INSERT INTO chefs (
          name,
          file_id,
          created_at
        ) VALUES ($1, $2, $3)
        RETURNING id
      `;
        
      const values = [
        name,
        fileId,
        date(Date.now()).iso
      ];
      
      return db.query(query, values);

    } catch (err) {
      console.log(err);
    };
  },
  find(id) {
    try {
      return db.query(`SELECT * FROM chefs WHERE $1 = id`, [id]);

    } catch (err) {
      console.log(err);
    };
  },
  revenueCounter() {
    try {
      return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id`);

    } catch (err) {
      console.log(err);
    };
  },
  findRecipes() {
    try {
      return db.query(`
        SELECT recipes.title AS title, recipes.chef_id AS chef_id, recipes.id AS id
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)`);
      
    } catch (err) {
      console.log(err);
    };
  },
  update({name, id}) {
    try {
      query = `
        UPDATE chefs SET
          name=($1)
        WHERE id = $2
      `;
      
      values = [
        name,
        id
      ];
      
      return db.query(query, values);
      
    } catch (err) {
      console.log(err);
    };
  },
  delete(id) {
    try {
      return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);

    } catch (err) {
      console.log(err);
    };
  },
  verification(id) {
    try {
      return db.query(`
        SELECT count(recipes.id) AS total_recipes
        FROM recipes
        WHERE recipes.chef_id = $1`, [id]);

    } catch (err) {
      console.log(err);
    };
  },
  files(id) {
    try {
      return db.query(`SELECT * FROM files WHERE id = $1`, [id]);

    } catch (err) {
      console.log(err);
    };
  }
}