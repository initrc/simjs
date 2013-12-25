var express = require('express'),
  cons = require('consolidate'),
  config = require('config'),
  app = express(),
  port = process.env.PORT || 4000;

app.use(express.bodyParser());
app.engine('html', cons.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

var rootDir = require('path').dirname(module.filename);
var pubDir = rootDir + config.app.pubDir;
var srcDir = rootDir + config.app.srcDir;
app.use(express.static(pubDir));

app.listen(config.app.port);

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/compare/', function(req, res) {
  var sim = require(srcDir + 'sim');
  var result = sim.compare([req.body.doc1, req.body.doc2]);
  result = (result * 100).toFixed(2) + "%";
  res.send(result);
});
