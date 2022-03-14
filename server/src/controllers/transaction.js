const { transaction, user, film, sequelize } = require('../../models');
const { DATE_FORMAT, CAPITALIZE, TO_IDR } = require('../utils');

exports.addTransaction = async (req, res) => {
  const data = {
    userId: req.user.id,
    filmId: req.params.id,
    accountNumber: req.body.accountNumber,
    transferProof: req.file.filename,
    status: 'pending',
  };

  try {
    const dataTransaction = await transaction.create(data);
    res.status(200).send({
      status: 'success',
      data: {
        transaction: dataTransaction,
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

exports.getTransactions = async (req, res) => {
  try {
    let { page } = req.query;
    const limit = 10;

    if (isNaN(page) && Number(page) < 0) {
      return res.status(400).send({
        message: 'Bad request',
      });
    }

    page = Number(page);
    const offset = page ? (page - 1) * limit : 0;

    const { rows, count } = await transaction.findAndCountAll({
      attributes: {
        exclude: ['userId', 'filmId', 'updatedAt', 'createdAt'],
        include: [
          CAPITALIZE('transaction.status', 'status'),
          DATE_FORMAT('transaction.createdAt', '%W, %d %b %Y', 'orderDate'),
        ],
      },
      include: [
        {
          model: user,
          attributes: ['fullName'],
        },
        {
          model: film,
          attributes: ['title', TO_IDR('film.price', 'price')],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const totalPage = Math.ceil(count / limit);

    res.status(200).send({
      status: 'success',
      data: {
        transactions: rows,
        currentPage: page,
        previousPage: page - 1,
        nextPage: totalPage - page,
        totalPage,
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

exports.updateTransaction = async (req, res) => {
  try {
    const { id, status } = req.body;
    const data = await transaction.update({ status }, { where: { id } });

    res.status(200).send({
      status: 'success',
      data: {
        transaction: data,
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
