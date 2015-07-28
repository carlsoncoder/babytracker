var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var FeedingSchema = new mongoose.Schema({
    userId: {type: ObjectId, required: true},
    startDateLeft: {type: Date, required: false},
    lengthInMinutesLeft: {type: Number, required: false},
    startDateRight: {type: Date, required: false},
    lengthInMinutesRight: {type: Number, required: false},
    comment: {type: String, required: false }
});

FeedingSchema.pre('validate', function(next) {
    var leftUndefined = typeof(this.startDateLeft) === 'undefined' || this.startDateLeft === null;
    var rightUndefined = typeof(this.startDateRight) === 'undefined' || this.startDateRight === null;

    var leftLengthUndefined = typeof(this.lengthInMinutesLeft) === 'undefined' || this.lengthInMinutesLeft === null || this.lengthInMinutesLeft <= -1;
    var rightLengthUndefined = typeof(this.lengthInMinutesRight) === 'undefined' || this.lengthInMinutesRight === null || this.lengthInMinutesRight <= -1;

    if (leftUndefined && rightUndefined) {
        var errorOne = new Error('The left OR right side start times must be defined');
        next(errorOne);
    }
    else if (leftLengthUndefined && rightLengthUndefined) {
        var errorTwo = new Error('The left OR right side lengths must be defined');
        next(errorTwo);
    }
    else {
        // everything is set properly
        next();
    }
});

mongoose.model('Feeding', FeedingSchema);