const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = function (req, res, next) {
  //Get Token
  const token = req.header('x-auth-token');
  //By use 'x-auth-token' named header to get our token
  console.log(req.user);

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'no token , Authorization denied' });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
