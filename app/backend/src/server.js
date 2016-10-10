var express = require('express');
var app = express();
var PGQ = require('./pgq');
var R = require('ramda');
var bodyParser = require('body-parser')

var pgq = new PGQ();

app.use(express.static('../frontend/build'));
app.use(bodyParser.json());

app.get('/api/models/:id', function (req, res) {
  pgq.query('SELECT * FROM models WHERE id = $1::int', [req.params.id])
  .then(R.path(['rows']))
  .then(R.head)
  .then(result => res.json(result))
  .catch(err => res.status(500).json({error: err.message }))
});


app.put('/api/models/:id', function (req, res) {
  pgq.query('UPDATE models SET name=$1, description=$2, body=$3, updated_at=NOW() WHERE id = $4::int', 
    [req.body.model.name, req.body.model.description, req.body.model.body, req.params.id])
  .then(result => res.json(result))
  .catch(err => res.status(500).json({error: err.message}));
});

app.post('/api/models', function (req, res) {
  pgq.query('INSERT INTO models (name, description, body, inserted_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id', 
    [req.body.model.name, req.body.model.description, req.body.model.body])
  .then(R.path(['rows']))
  .then(R.head)
  .then(result => res.json({id: R.path(['id'], result)}))
  .catch(err => res.status(500).json({error: err.message}));
});

pgq.connect()
.then(() => {
  app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
  });
})
.catch(err => {
  console.log('error', err);
});