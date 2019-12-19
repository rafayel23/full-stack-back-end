const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validator = require('validator');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function (_, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/task-manager', {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const User = mongoose.model('User', {
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },

  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: value => validator.isEmail(value),
      message: 'Invalid email format'
    }
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  }
});

app.get('/users', (_, res) => {
  User.find({}).then(users => {
    res.send(users);
  })
})

app.post('/users', (req, res) => {
  const data = req.body;
  const user = new User(data);
  user.save()
  .then(result => {
    res.send(result);
  }).catch(err => {
    res.status(400).send(err.errors);
  })
})

app.listen(3000, () => {
  console.log('server is running on port ' + port)
})