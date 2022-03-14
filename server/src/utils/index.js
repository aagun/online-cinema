const { user, sequelize } = require('../../models');
const { Op, fn, col } = require('sequelize');

const CONCAT = (col1, col2, alias = col2) => {
  return [fn('CONCAT', col1, col(col2)), alias];
};

const NUMBER_TO_CURRENCY = (colName) => {
  return fn('FORMAT', col(colName), '', 'id_ID');
};

const SUBSTRING = (colName, position, str) => {
  return fn('SUBSTRING', col(colName), position, str);
};

const LOWER_CASE = (colName) => {
  return fn('LOWER', colName);
};

const UPPER_CASE = (colName) => {
  return fn('UPPER', colName);
};

exports.CAPITALIZE = (colName, alias) => {
  return [fn('CONCAT', UPPER_CASE(SUBSTRING(colName, 1, 1)), LOWER_CASE(SUBSTRING(colName, 2, 255))), alias];
};

exports.TO_IDR = (colName, alias) => {
  return [fn('CONCAT', 'Rp. ', NUMBER_TO_CURRENCY(colName)), alias];
};

exports.getUser = async ({ email, id }) => {
  return user.findOne({
    where: {
      [Op.or]: [
        {
          email: email ? email : null,
        },
        { id: id ? id : null },
      ],
    },
  });
};

exports.CONDITION = (colName, op, data) => {
  return [sequelize.where(col(colName), op, data)];
};

exports.DATE_FORMAT = (colName, format, alias) => {
  return [fn('DATE_FORMAT', col(colName), format), alias];
};

exports.SUBSTRING = SUBSTRING;
exports.LOWER_CASE = LOWER_CASE;
exports.UPPER_CASE = UPPER_CASE;
exports.CONCAT = CONCAT;
