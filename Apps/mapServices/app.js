var express = require('express'),
    cors = require('cors'),
    mongoose = require('mongoose');

var db = mongoose.connect('mongodb://nywilds:Pa55w0rd@ds035240.mongolab.com:35240/mapinfo');
var Campground = require('./models/campgroundModel');



var app = express();
var port = process.env.PORT || 4000;


var mapRouter = express.Router();

mapRouter.route('/Campgrounds')
   .get(function(req,res) {

        var query = req.query;

        Campground.find(query, function(err,campgrounds){
            if(err)
                res.status(500).send(err);
            else
                res.json(campgrounds);
        });
    });

mapRouter.route('/Campground/:id')
    .get(function(req,res) {

        Campground.findById(req.params.id, function(err,campground){
            if(err)
                res.status(500).send(err);
            else
                res.json(campground);
        });
    });

mapRouter.route('/find')
    .get(function(req,res) {

        var coord = req.query.geo.split(',');
        var maxDistance = parseFloat( req.query.maxDistance );

        console.log(coord);
        console.log(maxDistance);

        Campground.find({loc: { $near: coord, $maxDistance: maxDistance}}, function(err, campgroundList){
            if(err)
                res.status(500).send(err);
            else
                res.json(campgroundList)
        })

    });

app.use(cors());
app.use('/api', mapRouter);

app.get('/', function(req,res) {
    res.send('hello');
});

app.listen(port, function() {
    console.log('Running on port: ' + port);
});
