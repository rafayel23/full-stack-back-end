const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
  name: {
    type: String
  },
  age: {
    type: Number
  },
});

app.get('/users', (_, res) => {
  User.find({}).then(users => {
    res.send(users);
  })
})

app.post('/users', (req, res) => {
  const data = req.body;
  const user = new User(data);
  user.save().then(_user => {
    res.send(_user);
  })
})

app.listen(3000, () => {
  console.log('server is running on port ' + port)
})