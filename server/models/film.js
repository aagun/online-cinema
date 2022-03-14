'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      film.hasMany(models.transaction);
      film.belongsToMany(models.category, {
        as: 'categories',
        through: { model: 'categoryFilm' },
        foreignKey: 'filmId',
      });

      film.hasOne(models.categoryFilm, {
        foreignKey: 'filmId',
      });
    }
  }
  film.init(
    {
      title: DataTypes.STRING,
      price: DataTypes.INTEGER,
      url: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      banner: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'film',
    }
  );
  return film;
};
