const { user, transaction, film, profile, category, categoryFilm, sequelize } = require('../../models');
const { Op, fn, col } = require('sequelize');
const { CONCAT, DATE_FORMAT, TO_IDR, CAPITALIZE, CONDITION } = require('../utils');

exports.getUserAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    const avatar = await profile.findOne({
      where: { userId },
      attributes: [CONCAT(process.env.BASE_URL, 'avatar')],
    });

    res.status(200).send({
      status: 'success',
      data: avatar,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server error',
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    const data = await user.findOne({
      where: userId,
      attributes: ['id', 'fullName', 'email', 'status'],
      include: {
        model: profile,
        as: 'profile',
        attributes: [CONCAT(process.env.BASE_URL, 'avatar'), 'phone'],
      },
    });

    res.status(200).send({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server error',
    });
  }
};

exports.getPurchasedFilm = async (req, res) => {
  try {
    const { page } = req.query;
    const { id } = req.user;
    const limit = 12;
    const offset = limit * (page - 1);

    const { rows, count } = await transaction.findAndCountAll({
      where: {
        [Op.and]: [CONDITION('userId', '=', id), CONDITION('status', '=', 'approved')],
      },
      attributes: [],
      include: {
        model: film,
        attributes: ['id', 'title', CONCAT(process.env.BASE_URL, 'film.thumbnail', 'thumbnail')],
      },
      limit,
      offset,
    });

    const data = await rows.map((item) => ({ ...item.film.toJSON() }));

    res.status(200).send({
      status: 'success',
      data: {
        films: data,
        totalPage: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server error',
    });
  }
};

exports.getUserOrderHistory = async (req, res) => {
  try {
    const { id } = req.user;
    const { page } = req.query;
    const limit = 4;
    const offset = limit * page;

    const { rows, count } = await transaction.findAndCountAll({
      where: { userId: id },
      model: transaction,
      attributes: {
        exclude: ['id', 'userId', 'filmId', 'updatedAt', 'createdAt'],
        include: [
          CAPITALIZE('transaction.status', 'status'),
          CONCAT(process.env.BASE_URL, 'transaction.transferProof', 'transferProof'),
          DATE_FORMAT('transaction.createdAt', '%W', 'orderDay'),
          DATE_FORMAT('transaction.createdAt', '%d %b %Y', 'orderDate'),
        ],
      },
      include: [
        {
          model: film,
          attributes: ['title', TO_IDR('film.price', 'price')],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).send({
      status: 'success',
      data: {
        transactions: rows,
        totalPage: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server error',
    });
  }
};
