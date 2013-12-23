var express = require('express'),
  cons = require('consolidate'),
  config = require('config'),
  app = express(),
  port = process.env.PORT || 4000;

app.use(express.bodyParser());
app.engine('html', cons.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/compare/', function(req, res) {
  res.send(req.body.doc1);
});

var pub_dir = config.app.pub_dir;
if (pub_dir[0] != '/') {pub_dir = '/' + pub_dir;}
var root_dir = require('path').dirname(module.filename);
pub_dir = root_dir + pub_dir;
app.use(express.static(pub_dir));

app.listen(config.app.port);
