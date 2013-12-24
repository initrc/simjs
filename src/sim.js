module.exports = {
  compare: compare
};

var stemmer = require('./stemmer');

function compare(doc1, doc2) {
  return stemmer.stem(doc1 + doc2);
}
