const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 8);

  Users.add({ username, password: hash })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "You were not able to add the user." })
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "You do not have permission to continue." })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "There was an error logging this user in." })
    });
});

router.get('/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({ message: "We were not able to log you out." })
      } else {
        res.status(200).json({ message: "Come back again soon!" })
      }
    });
  } else {
    res.status(200).json({ message: "You are already logged out." })
  }
});

module.exports = router;
