const { Pool } = require("pg");

module.exports = new Pool({
  user: 'postgres',
  password: "SecretPassword",
  host: "localhost",
  port: 5432,
  database: "foodfy",
});
