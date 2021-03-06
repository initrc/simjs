module.exports = {
  compare: compare
};

var fs = require('fs'),
  stemmer = require('./stemmer');

/*
 * Return a dict that maps filtered and stemmed word to id
 */
function buildWordDict(docs, wordSets) {
  var wordDict = {},
    splitter = /[a-zA-Z-']+/g,
    id = 0,
    stopWords = fileToString('english.stop').split('\n');
  for (var i in docs) {
    var words = docs[i].match(splitter);
    for (var wi in words) {
      w = words[wi].toLowerCase();
      if (!(w in stopWords)) {
        w = stemmer.stem(w);
        if (!(w in wordDict)) {
          wordDict[w] = id;
          id++;
        }
        if (!(w in wordSets[i])) {
          wordSets[i][w] = true;
        }
      }
    }
  }
  return wordDict;
}

/*
 * Return a word vector of the doc
 */
function buildVector(doc, wordDict, wordSet) {
  var v = [];
  for (var i = 0; i < Object.keys(wordDict).length; i++) {
    v[i] = 0;
  }
  for (var w in wordSet) {
    v[wordDict[w]] = 1;
  }
  return v;
}


/*
 * Return doc similarity in float or -1 if N/A
 */
function compare(docs) {
  // support only 2 docs
  if (docs.length !== 2) {
    return -1;
  }
  // build wordDict: word => id
  wordSets = [{}, {}];
  wordDict = buildWordDict(docs, wordSets);
  // build and normalize word vectors
  var vecs = [],
    norms = [];
  for (var i in docs) {
    vecs[i] = buildVector(docs[i], wordDict, wordSets[i]);
    norms[i] = norm(vecs[i]);
  }
  if (norms[0] === 0 || norms[1] === 0) {
    return -1;
  } else {
    return dot(vecs[0], vecs[1]) / (norms[0] * norms[1]);
  }
}

/*
 * vector dot product
 */
function dot(vec0, vec1) {
  var sum = 0;
  for (var i in vec0) {
    sum += vec0[i] * vec1[i];
  }
  return sum;
}

/*
 * norm of a vector
 */
function norm(vec) {
  var sum = 0;
  for (var i in vec) {
    sum += Math.pow(vec[i], 2);
  }
  return Math.sqrt(sum);
}

/*
 * read file and return string
 */
function fileToString(filename) {
  var file = require('path').dirname(module.filename) + '/' + filename;
  return fs.readFileSync(file).toString().trim();
}

/*
 * local test
 */
function test() {
  // accept 2 args as input files: node sim.js doc1 doc2
  if (process.argv.length != 4) {
    return;
  }
  console.log("Calculating similarity...");
  var start = new Date().getTime();
  var docs = [fileToString(process.argv[2]), fileToString(process.argv[3])];
  var similarity = compare(docs);
  var end = new Date().getTime();
  console.log("Similarity = " + similarity + "\n" + (end - start) / 1000 + "s");
}
//test();
