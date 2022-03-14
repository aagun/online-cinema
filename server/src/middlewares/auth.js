const JWT = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  const header = req.header('Authorization'); // assign request jwt token from request header
  const token = header && header.split(' ')[1]; // get the token

  if (!token) {
    return res.status(401).send({
      status: 'failed',
      message: 'Access denied',
    });
  }

  try {
    const verified = JWT.verify(token, process.env.TOKEN_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({
      status: 'failed',
      message: 'Invalid Token',
    });
  }
};
