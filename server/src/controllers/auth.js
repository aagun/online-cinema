const { user, profile } = require('../../models');
const { getUser } = require('../utils');
const Bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // generate salt (random value) with 10 rounds
    const salt = await Bcrypt.genSalt(10);

    const hashedPassword = await Bcrypt.hash(password, salt);

    // store data to database
    const response = await user.create(
      {
        fullName,
        email,
        password: hashedPassword,
        status: 'user',
        profile: {}, // auto create data profile when user register
      },
      {
        include: {
          model: profile,
          as: 'profile',
        },
      }
    );

    const DATA_TOKEN = {
      fullName: response?.fullName,
      email: response?.email,
    };

    // create token
    const token = JWT.sign(DATA_TOKEN, process.env.TOKEN_KEY);

    // send response
    res.status(200).send({
      status: 'success',
      data: {
        ...DATA_TOKEN,
        token,
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

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await getUser({ email });

    const DATA_TOKEN = {
      id: response.id,
      fullName: response.fullName,
      email: response.email,
      status: response.status,
    };

    const token = JWT.sign(DATA_TOKEN, process.env.TOKEN_KEY);

    res.status(200).send({
      data: {
        user: {
          fullName: response.fullName,
          email: response.email,
          status: response.status,
          token,
        },
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

exports.checkAuth = async (req, res) => {
  const { id } = req.user;
  try {
    const response = await getUser({ id });

    if (!response) {
      return res.status(404).send({
        status: 'failed',
      });
    }

    const data = {
      id: response.id,
      fullName: response.fullName,
      email: response.email,
      status: response.status,
    };

    res.status(200).send({
      status: 'success',
      data: {
        user: data,
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
