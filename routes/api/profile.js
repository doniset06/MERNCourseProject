const { json } = require('express');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth-middleware');
const config = require('config');

const { check, validationResult } = require('express-validator');

//Models
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { default: axios } = require('axios');

// @Route   GET api/Profile/me
// @desc    Get Current User profile
// @access  Public
router.get('/me', auth, async (req, res) => {
  try {
    // res.send('Profile route');
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    //Check if no profile from database
    if (!profile) {
      return res.status(400).json({ msg: 'Profile Not Found' });
    }

    res.send(profile);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @Route   POST api/profile
// @desc    Create / update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').notEmpty(),
      check('skills', 'Skills is required').notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    console.log(profileFields.skills);
    //Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update Data
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create Data
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profileFields);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @Route   GET api/profile/
// @desc    Get All Profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @Route   GET api/profile/user/:user_id
// @desc    Get Profiles by user id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile Not Found' });

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile Not Found' });
    }
    res.status(500).send('Server Error');
  }
});

// @Route   DELETE api/profile/
// @desc    Delete Profile User & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    //Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove Profile
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User Deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @Route   PUT api/profile/experience
// @desc    Add Profile Experience
// @access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('tittle', 'Tittle is required').notEmpty(),
      check('company', 'Company is required').notEmpty(),
      check('from', 'From Date is required').notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      tittle,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      tittle,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      // Add Experience
      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @Route   DELETE api/profile/experience/:exp_id
// @desc    DELETE Profile Experience
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get Remove Index
    const removeIndex = profile.experience
      .map((item) => {
        item.id;
      })
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);

    res.json({ msg: 'User Deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @Route   PUT api/profile/education
// @desc    Add Profile Education
// @access  Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').notEmpty(),
      check('fieldofstudy', 'Field of Study is required').notEmpty(),
      check('degree', 'Degree is required').notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      // Add Education
      profile.education.unshift(newEdu);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @Route   DELETE api/profile/education/:edu_id
// @desc    DELETE Profile Education
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get Remove Index
    const removeIndex = profile.education
      .map((item) => {
        item.id;
      })
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @Route   GET api/profile/github/:username
// @desc    GET User repos from github
// @access  Public
router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );

    const headers = {
      'user-agent': 'node.js',
      Authorization: `token${config.get('githubToken')}`
    };

    const githubResponse = await axios.get(uri, { headers });
    return res.json(githubResponse.data);
  } catch (error) {
    console.error(error.message);
    return res.status(404).send('No github profile found');
  }
});

module.exports = router;
