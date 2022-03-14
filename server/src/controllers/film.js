const { film, category, categoryFilm, transaction, sequelize } = require('../../models');
const Joi = require('joi');
const { Op, fn, col } = require('sequelize');
const { CONCAT, TO_IDR, CONDITION } = require('../utils');

const checkStatusOrder = async ({ status, film: dataFilm }) => {
  const data = {
    ...dataFilm.toJSON(),
    category: dataFilm.categories[0].name,
    status,
  };

  delete data.categories;

  if (status !== 'approved') {
    delete data.url;
    return data;
  }

  return data;
};

const checkOrderHistoy = async (data, userId) => {
  const banner = {
    id: data.id,
    title: data.title,
    price: data.price,
    description: data.description,
    banner: data.banner,
    category: data['categories.name'],
    userId: data['transactions.userId'],
    status: data['transactions.status'],
  };

  if (banner.status !== 'cancel' && banner.userId === userId) {
    delete banner.userId;
    return banner;
  }

  banner.status = '';
  delete banner.userId;
  return banner;
};

const genTransactionId = () => {
  return Math.floor(Math.random() * 10e9);
};

exports.addFilm = async (req, res) => {
  let data = {
    ...req.body,
    category: parseInt(req.body.category),
  };

  const schema = Joi.object({
    title: Joi.string().required(),
    category: Joi.number().required(),
    price: Joi.number().required(),
    linkFilm: Joi.string().uri().required(),
    description: Joi.string().required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).send({
      status: 'failed',
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    data = {
      ...data,
      url: req.body.linkFilm,
      thumbnail: req.files['thumbnail'][0].filename,
      banner: req.files['banner'][0].filename,
      categoryFilm: {
        categoryId: parseInt(req.body.category),
      },
    };

    // Insert data multiple table based on relation key
    await film.create(data, {
      include: { model: categoryFilm },
    });

    res.status(200).send({
      status: 'success',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.getFilm = async (req, res) => {
  try {
    const filmId = req.params.id;
    const userId = req.user?.id || '';

    // check has user bought the film
    const isOrdered = await transaction.findOne({
      where: {
        userId,
        filmId,
        status: { [Op.not]: 'cancel' },
      },
      attributes: ['status'],
      include: {
        model: film,
        attributes: [
          'id',
          'title',
          'description',
          'url',
          TO_IDR('film.price', 'price'),
          CONCAT(process.env.BASE_URL, 'thumbnail'),
          CONCAT(process.env.BASE_URL, 'banner'),
        ],
        include: {
          model: category,
          as: 'categories',
          attributes: ['name'],
          through: {
            model: categoryFilm,
            attributes: [],
          },
        },
      },
    });

    if (isOrdered) {
      const dataOrder = await checkStatusOrder(isOrdered);

      return res.send({
        data: {
          film: dataOrder,
        },
      });
    }

    // get film by filmId if user does't buy film yet
    const response = await film.findOne({
      attributes: [
        'id',
        'title',
        'description',
        TO_IDR('price', 'price'),
        CONCAT(process.env.BASE_URL, 'thumbnail'),
        CONCAT(process.env.BASE_URL, 'banner'),
      ],
      include: [
        {
          model: category,
          as: 'categories',
          attributes: ['name'],
          through: {
            model: categoryFilm,
            attributes: [],
          },
        },
      ],
      where: { id: filmId },
      raw: true,
    });

    // Manipulation data
    const data = {
      ...response,
      category: response['categories.name'],
    };

    delete data['categories.name'];

    // Send response
    res.status(200).send({
      status: 'success',
      data: {
        film: {
          ...data,
          transactionId: genTransactionId(),
        },
      },
    });
  } catch (err) {
    console.log(err);
    req.status(500).send({
      status: 'failed',
      message: 'Server error',
    });
  }
};

exports.getFilmBanner = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    const banner = await film.findOne({
      attributes: ['id', 'title', TO_IDR('film.price', 'price'), 'description', CONCAT(process.env.BASE_URL, 'banner')],
      include: [
        {
          model: category,
          as: 'categories',
          attributes: ['name'],
          through: {
            model: categoryFilm,
            attributes: [],
          },
        },
        {
          model: transaction,
          required: false,
          attributes: ['userId', 'status'],
        },
      ],
      raw: true,
      order: sequelize.random(),
    });

    const data = await checkOrderHistoy(banner, userId);

    res.status(200).send({
      status: 'success',
      data: {
        banner: { ...data },
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

exports.getFilms = async (req, res) => {
  const { page } = req.query;
  const limit = 6;
  const offset = limit * page;

  try {
    const { rows, count } = await film.findAndCountAll({
      attributes: ['id', 'title', CONCAT(process.env.BASE_URL, 'thumbnail')],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.status(200).send({
      status: 'success',
      data: {
        films: rows,
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
