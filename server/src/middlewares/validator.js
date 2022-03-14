const { getUser } = require('../utils');
const Joi = require('joi');
const Bcrypt = require('bcrypt');

let errorMessage = null;

const sendResponse = (res, message) => {
  res.status(400).send({
    status: 'failed',
    error: {
      message,
    },
  });
};

exports.registerValidation = async (req, res, next) => {
  // valdiate schema
  const schema = Joi.object({
    fullName: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  // validate the request body
  const { error } = schema.validate(req.body);

  // send request if any error when validated
  if (error) {
    errorMessage = error.details[0].message;
    return sendResponse(res, errorMessage);
  }

  const { email } = req.body;
  const isEmailRegistered = await getUser({ email });

  if (isEmailRegistered) {
    errorMessage = 'Email already registered';
    return sendResponse(res, errorMessage);
  }

  next();
};

exports.loginValidation = async (req, res, next) => {
  // valdiate schema
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  // validate the request body
  const { error } = schema.validate(req.body);

  // send request if any error when validate
  if (error) {
    errorMessage = error.details[0].message;
    return sendResponse(res, errorMessage);
  }

  // verify email
  const { email, password } = req.body;
  const isEmailValid = await getUser({ email });

  if (!isEmailValid) {
    errorMessage = "Email or password don't match";
    return sendResponse(res, errorMessage);
  }

  // verify password
  const isPasswordValid = await Bcrypt.compare(password, isEmailValid.password);

  if (!isPasswordValid) {
    errorMessage = "Email or password don't match";
    return sendResponse(res, errorMessage);
  }

  next();
};

exports.transactionValidation = async (req, res, next) => {
  const data = {
    filmId: req.params.id,
    accountNumber: req.body.accountNumber,
  };

  // valdiate schema
  const schema = Joi.object({
    filmId: Joi.string().email().required(),
    accountNumber: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    errorMessage = error.details[0].message;
    return sendResponse(res, errorMessage);
  }

  next();
};

exports.isAdmin = async (req, res, next) => {
  const { status } = req.user;

  if (status !== 'admin') {
    return res.status(401).send({
      status: 'failed',
      message: 'Access denied',
    });
  }

  next();
};
