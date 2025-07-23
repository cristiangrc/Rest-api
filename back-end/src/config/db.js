const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('tasks_db', 'root', '12345', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;