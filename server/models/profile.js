'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      profile.belongsTo(models.user, {
        as: 'user',
        foreignKey: {
          name: 'userId',
        },
      });
    }
  }
  profile.init(
    {
      avatar: DataTypes.STRING,
      phone: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'profile',
    }
  );
  return profile;
};
