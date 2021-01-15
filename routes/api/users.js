const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');

// User Model
const User = require('../../models/User');

/*
//JUST TEST
// @Route   GET api/users
// @desc    Test route
// @access  Public
router.get('/register', (req, res) => res.send('Users route'));
*/

// @Route   POST api/users
// @desc    Register Users
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is Required').notEmpty(),
    check('email', 'Please Include a Valid Email').isEmail(),
    check(
      'password',
      'Please Enter Password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // console.log(errors.array());
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get Users gravatar
      const avatar = gravatar.url(email, {
        size: '200',
        rating: 'pg',
        default: 'mm'
      });

      //Passing data to User models
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password with Bcrypt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // Saving user object to database
      await user.save();

      // Return jsonwebtoken for user log in at front end
      const payload = {
        user: {
          id: user.id,
          name: user.name
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      // res.send('User Registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
