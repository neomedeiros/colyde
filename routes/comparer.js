var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var clj_fuzzy = require('clj-fuzzy');

var wordModel = require('../domain/word');

var jsonParser = bodyParser.json();

router.post('/ingest', jsonParser, function (req, res) {    
        
    var basewords = req.body.basewords;    

    basewords.forEach(word => {
        var wordData = {
            'word':word,
            'metaphone':clj_fuzzy.phonetics.metaphone(word.toUpperCase()),
            'dmetaphone':clj_fuzzy.phonetics.double_metaphone(word.toUpperCase()),
            'soundex':clj_fuzzy.phonetics.soundex(word.toUpperCase()),
            'nysiis': clj_fuzzy.phonetics.nysiis(word.toUpperCase()),
            'caverphone': clj_fuzzy.phonetics.caverphone(word.toUpperCase()),
            'cologne': clj_fuzzy.phonetics.cologne(word.toUpperCase()),
            'mra_codex': clj_fuzzy.phonetics.mra_codex(word.toUpperCase())
        };                

        wordModel.findOne({'word' : wordData.word}, (err, item) => {
            if(err){
                res.status(500).send(err.description);
                return;
            };

            if(item == null)
                wordModel.create(wordData);
        });
        
    });
    
    res.status(200).send('ok');
});

router.get('/search', jsonParser, function (req, res) {
    
    var word = req.query.word;
    var devMode = req.query.dev;
    var threshold = req.query.threshold;

    var searchWord = {
        'word':word,
        'metaphone':clj_fuzzy.phonetics.metaphone(word.toUpperCase()),
        'dmetaphone':clj_fuzzy.phonetics.double_metaphone(word.toUpperCase()),
        'soundex':clj_fuzzy.phonetics.soundex(word).toUpperCase(),
        'nysiis': clj_fuzzy.phonetics.nysiis(word.toUpperCase()),
        'caverphone': clj_fuzzy.phonetics.caverphone(word.toUpperCase()),
        'cologne': clj_fuzzy.phonetics.cologne(word.toUpperCase()),
        'mra_codex': clj_fuzzy.phonetics.mra_codex(word.toUpperCase())
    }

    wordModel.find({$or: [
        {'word' : searchWord.word}, 
        {'metaphone' : searchWord.metaphone}, 
        {'dmetaphone' : searchWord.dmetaphone}, 
        {'soudex' : searchWord.soundex},
        {'nysiis' : searchWord.nysiis},
        {'caverphone' : searchWord.caverphone},
        {'cologne' : searchWord.cologne},
        {'mra_codex' : searchWord.mra_codex}        
    ]}, (err, items) => {
        if(err){
            res.status(500).send(err.description);
            return;
        };      

        if(items.length > 0)
        {
            var finalItems = [];

            items.forEach(element => {
                console.log(word.toUpperCase());
                console.log(element.word.toUpperCase());
                var match = clj_fuzzy.metrics.jaro_winkler(word.toUpperCase(), element.word.toUpperCase());                

                console.log('match:'+match+" - threshold:"+ threshold + " - result: " + (match >= threshold));

                if(match >= threshold)
                {
                    finalItems.push(element);
                }
            });        

            if(devMode != null)
                res.status(200).send(finalItems);
            else
                res.status(200).send(finalItems.map(a => a.word.toUpperCase()));
        }       
        else
            res.status(200).send('empty')
    });    
});

router.post('/reset', jsonParser, function (req, res) {    
    wordModel.remove({}, (err, item) => {
        if(err){
            res.status(500).send(err.description);
            return;
        };        
    }).then(function(){
        res.status(200).send('ok');
    });        
});

module.exports = router;