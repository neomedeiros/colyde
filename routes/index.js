var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Colyde -> NLP Based Deep Search for Collidences}'});
});

router.get('/dadosTeste', function(req, res, next) {
  res.render('dadosTeste', { title: 'Colyde -> NLP Based Deep Search for Collidences' });
});

router.get('/popularbase', function(req, res, next) {
  res.render('popularbase', { title: 'Colyde -> NLP Based Deep Search for Collidences' });
});

router.get('/reiniciarbase', function(req, res, next) {
  res.render('reiniciarbase', { title: 'Colyde -> NLP Based Deep Search for Collidences' });
});

router.get('/pesquisar', function(req, res, next) {
  res.render('pesquisar', { title: 'Colyde -> NLP Based Deep Search for Collidences' });
});

module.exports = router;
