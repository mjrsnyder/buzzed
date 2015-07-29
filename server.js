// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Word       = require('./app/models/word');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port
var ip = process.env.IP || '0.0.0.0';       // set the ip as well
var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://192.168.59.103:27017/buzzed'

mongoose.connect(mongoUrl); // connect to our database

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'prepare to be buzzed!' });   
});

// more routes for our API will happen here
// on routes that end in /words
// ----------------------------------------------------
router.route('/words')

    // create a word (accessed at POST http://localhost:8080/api/words)
    .post(function(req, res) {
        
        var word = new Word();      // create a new instance of the Word model
        word.name = req.body.name;  // set the words name (comes from the request)
        word.partOfSpeech = req.body.partOfSpeech;

        // save the word and check for errors
        word.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Word created!' });
        });
    })
    
    // get all the words (accessed at GET http://localhost:8080/api/words)
    .get(function(req, res) {
        Word.find(function(err, words) {
            if (err)
                res.send(err);

            res.json(words);
        });    

    });

// on routes that end in /words/:word_id
// ----------------------------------------------------
router.route('/words/:word_id')

    // get the word with that id (accessed at GET http://localhost:8080/api/words/:word_id)
    .get(function(req, res) {
        Word.findById(req.params.word_id, function(err, word) {
            if (err)
                res.send(err);
            res.json(word);

        });
    })

    .put(function(req, res) {

        // use our word model to find the word we want
        Word.findById(req.params.word_id, function(err, word) {

            if (err)
                res.send(err);

            word.name = req.body.name;  // update the words info
            word.partOfSpeech = req.body.partOfSpeech;
            
            // save the word
            word.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Word updated!' });
            });

        });
    })

    // delete the word with this id (accessed at DELETE http://localhost:8080/api/words/:word_id)
    .delete(function(req, res) {
        Word.remove({
            _id: req.params.word_id
        }, function(err, word) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port, ip);
console.log('get your fill from ' + ip + ':' + port);