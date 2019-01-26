const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../database/dbConfig');

const secret = process.env.JWT_SECRET;

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 16);

  db('users').insert(user)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

// function generateToken(user) {
//   const payload = {
//     username: user.username,
//   };
//
//   const options = {
//     expiresIn: '1h',
//   };
//
//   return jwt.sign(payload, secret, options);
// }

function login(req, res) {
  // implement user login
  const creds = req.body;
  // console.log('user creds', creds);

  db('users').where('username', creds.username)
    .then(user => {
      console.log('user info', user);
      if (user.length && bcrypt.compareSync(creds.password, user[0].password)) {
        const token = jwt.sign({
          username: user[0].username
        }, secret, { expiresIn: '1h'});
        res.status(201).json({ id: user[0].id, token });
      } else {
        res.status(404).json({ err: 'invalid username or password'});
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
