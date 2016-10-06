var express = require('express');
var app = express();

app.use(express.static('../frontend/build'));

app.get('/api/models/:id', function (req, res) {
  res.json({});
});


app.put('/api/models/:id', function (req, res) {
  res.json({});
});

app.post('/api/models', function (req, res) {
  res.json({});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});