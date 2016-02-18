// Campground Model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var campgroundModel = new Schema({
    Long: { type: String },
    Lat: { type: String },
    Details: { type: String },
    ShortName: { type: String },
    Name: { type: String },
    ParkType: { type: String },
    Phone: { type: String },
    OpenDate: { type: String },
    Instructions: { type: String },
    Elevation: { type: String },
    Amendities: { type: String },
    State: { type: String },
    Distance: { type: String },
    DistanceDir: { type: String },
    NearestCity: { type: String },
    Loc: {type: [Number],index: '2d' }
});

module.exports=mongoose.model('Campground', campgroundModel);

campgroundModel.methods.findNear = function(cb) {
    return this.model('Campground').find(
        {loc:
            {$near: this.geo, $maxDistance: this.distance}
        }, cb);
}

