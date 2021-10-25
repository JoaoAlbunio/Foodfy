const db = require('../../config/db');
const fs = require('fs');

module.exports = { 
  create({filename, path}) {
    try {
      const query = `
        INSERT INTO files (
          name,
          path
        ) VALUES ($1, $2)
        RETURNING id
      `
        
      const values = [
        filename,
        path
      ];
        
      return db.query(query, values);

    } catch (err) {
      console.log(err);
    };
  },
  createReference({recipeId, fileId}) {
    try {
      const query = `
        INSERT INTO recipe_files (
          recipe_id,
          file_id
        ) VALUES ($1, $2)
        RETURNING id
      `
      const values = [
        recipeId,
        fileId.id
      ];

      return db.query(query, values);

    } catch (err) {
      console.log(err);
    };
  },
  async update({filename, path, fileId}) {
    try {
      const results = await db.query(`SELECT * FROM files WHERE id = $1`, [fileId]);
      const file = results.rows[0];
      
      fs.unlinkSync(file.path);
      
      query = `
        UPDATE files SET 
          name=($1),
          path=($2)
        WHERE id = $3 
      `;
      
      values = [
        filename,
        path,
        fileId
      ];
      
      return db.query(query, values);

    } catch (err) {
      console.log(err);
    };
  },
  async delete(id) {
    try {
      const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      const file = results.rows[0];
      
      fs.unlinkSync(file.path);

      return db.query(`DELETE FROM files WHERE id = $1`, [id]);

    } catch (err) {
      console.error(err);
    };
  },
  deleteReferences(id) {
    try {
      return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id]);

    } catch (err) {
      console.error(err);
    };
  }
}