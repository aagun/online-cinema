'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transaction.belongsTo(models.film);
      transaction.belongsTo(models.user);
    }
  }
  transaction.init(
    {
      accountNumber: DataTypes.STRING,
      transferProof: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'transaction',
    }
  );
  return transaction;
};
