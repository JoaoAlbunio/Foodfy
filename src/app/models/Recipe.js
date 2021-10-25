const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  all() {
    try {
      return db.query(`SELECT * FROM recipes`);

    } catch (err) {
      console.log(err);
    };
  },
  create(data) {
    try {
      const query = `
        INSERT INTO recipes (
          chef_id,
          title,
          ingredients,
          preparation,
          information,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;
        
      const values = [
        data.chef,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
        date(Date.now()).iso
      ];
        
      return db.query(query, values);

    } catch (err) {
      console.log(err);
    };
  },
  find(id) {
    try {
      return db.query(`SELECT * FROM recipes WHERE id = $1`, [id]);

    } catch (err) {
      console.log(err);
    };
  },
  findBy(filter) { 
    try {
      return db.query(`
        SELECT 
        recipes.title, 
        recipes.chef_id, 
        recipes.id
        FROM recipes
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY title ASC`);

    } catch (err) {
      console.log(err);
    };
  },
  chefSelectOptions() {
    try {
      return db.query(`SELECT name, id FROM chefs`);

    } catch (err) {
      console.log(err);
    };
  },
  update(data) {
    try {
      query = `
        UPDATE recipes SET 
          chef_id=($1),
          title=($2),
          ingredients=($3),
          preparation=($4),
          information=($5)
        WHERE id = $6
      `;

      values = [
        data.chef,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
        data.id
      ];

      return db.query(query, values);

    } catch (err) {
      console.log(err);
    };
  },
  delete(id) {
    try {
      return db.query(`DELETE FROM recipes WHERE id = $1`, [id]);

    } catch (err) {
      console.log(err);
    };
  },
  files(id) {
    try {
      return db.query(`SELECT * FROM files LEFT JOIN recipe_files ON (files.id = recipe_files.file_id) WHERE recipe_id = $1`, [id]);
      
    } catch (err) {
      console.log(err);
    };
  }
};