'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categoryFilm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      categoryFilm.belongsTo(models.film);
      categoryFilm.belongsTo(models.category);
    }
  }
  categoryFilm.init(
    {
      filmId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'categoryFilm',
    }
  );
  return categoryFilm;
};
