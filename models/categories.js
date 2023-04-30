'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Categories.hasMany(models.Transactions, {
        foreignKey: "categoryId",
        as: "transactions",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
      Categories.belongsTo(models.TransactionTypes, {
        foreignKey: "typeId"
      });
    }
  }
  Categories.init({
    name: DataTypes.STRING,
    typeId: DataTypes.INTEGER,
    iconId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Categories',
  });

  return Categories;
};