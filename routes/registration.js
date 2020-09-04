const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Users = require('../modals/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//Route to Register

router.post(
  '/',
  [
    check('mobile', 'Please include number in the range 10 to 15').isLength({
      min: 10,
      max: 15,
    }),
    check('name', 'Please include a valid name').not().isEmpty(),
    check(
      'password',
      'Please include password with 8 or more Characters'
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, mobile, password } = req.body;
    try {
      //See if user exists
      let user = await Users.findOne({ mobile });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'User already exists' }] });
      }
      //if not then register
      user = new Users({
        name,
        mobile,
        password,
      });

      //encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      //return JWT

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ token });
          }
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
