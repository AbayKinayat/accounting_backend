'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configs = {
  "development": {
    "username": "postgres",
    "password":  "root",
    "database": "accounting",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password":  "root",
    "database": "accounting",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password":  "root",
    "database": "accounting",
    "host": "127.0.0.1", 
    "dialect": "postgres"
  }
}

/**
 * @typedef AppDatabase
 * @type {object}
 * @property {Sequelize.ModelStatic<Model<any, any>>} Users
 * @property {Sequelize.ModelStatic<Model<any, any>>} Transactions
 * @property {Sequelize.ModelStatic<Model<any, any>>} Categories
 * @property {Sequelize.ModelStatic<Model<any, any>>} Tokens
 * @property {Sequelize.ModelStatic<Model<any, any>>} TransactionTypes
 */

const config = configs[env];
/**
 * @type {AppDatabase}
 */
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const test = require("./categories")(sequelize, Sequelize.DataTypes);
    test.f
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
