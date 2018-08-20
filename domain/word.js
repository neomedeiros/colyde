var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WordSchema = Schema({
  word: String,
  metaphone: String,
  dmetaphone: String,
  soundex:String,
  nysiis: String,
  caverphone : String,
  cologne: String,
  mra_codex: String
});

var WordModel = mongoose.model('Word', WordSchema, 'colydewords');

module.exports = mongoose.model('Word');