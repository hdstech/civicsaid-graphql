const Sequelize = require('sequelize');
const { DB_NAME, DB_USER, DB_PASSWORD, DB_URL } = require('dotenv/config');

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    url: process.env.DB_URL,
    dialect: 'mysql',
  },
);

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.log(`Unable to establish connection: ${err}`);
  });

module.exports = db;
