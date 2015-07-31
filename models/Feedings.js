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

FeedingSchema.post('init', function(feeding) {
    feeding.lengthInMinutesLeft = Math.round(feeding.lengthInMinutesLeft);
    feeding.lengthInMinutesRight = Math.round(feeding.lengthInMinutesRight);

    if (feeding.lengthInMinutesLeft === 0) {
        feeding.lengthInMinutesLeft = null;
    }

    if (feeding.lengthInMinutesRight === 0) {
        feeding.lengthInMinutesRight = null;
    }
});

FeedingSchema.virtual('overallStartDate').get(function() {
    return getComparedDate(this.startDateLeft, this.startDateRight, true, -1, -1);
});

FeedingSchema.virtual('overallEndDate').get(function() {
    return getComparedDate(this.startDateLeft, this.startDateRight, false, this.lengthInMinutesLeft, this.lengthInMinutesRight);
});

FeedingSchema.virtual('overallLength').get(function() {
    var leftLength = this.lengthInMinutesLeft === null ? 0 : this.lengthInMinutesLeft;
    var rightLength = this.lengthInMinutesRight === null ? 0 : this.lengthInMinutesRight;
    return Math.round(leftLength + rightLength);
});

function getComparedDate(dateOne, dateTwo, isEarliest, dateOneMinutes, dateTwoMinutes) {
    var dateOneUndefined = typeof(dateOne) === null || typeof(dateOne) === undefined || dateOne === '' || dateOne === null;
    var dateTwoUndefined = typeof(dateTwo) === null || typeof(dateTwo) === undefined || dateTwo === '' || dateTwo === null;

    if (dateOneUndefined && dateTwoUndefined) {
        return null;
    }

    dateOne = new Date(dateOne);
    dateTwo = new Date(dateTwo);

    if (isEarliest) {
        if (dateOneUndefined && !dateTwoUndefined) {
            return dateTwo;
        }
        else if (dateTwoUndefined && !dateOneUndefined) {
            return dateOne;
        }
        else if (dateOne > dateTwo) {
            return dateTwo;
        }
        else {
            return dateOne;
        }
    }
    else {
        var newDate;
        if (dateOneUndefined && !dateTwoUndefined) {
            newDate = new Date(dateTwo.getTime() + (dateTwoMinutes * 60000));
            return newDate;
        }
        else if (dateTwoUndefined && !dateOneUndefined) {
            newDate = new Date(dateOne.getTime() + (dateOneMinutes * 60000));
            return newDate;
        }
        else if (dateOne > dateTwo) {
            newDate = new Date(dateOne.getTime() + (dateOneMinutes * 60000));
            return newDate;
        }
        else {
            newDate = new Date(dateTwo.getTime() + (dateTwoMinutes * 60000));
            return newDate;
        }
    }
}

FeedingSchema.set('toJSON', { getters: true, virtuals: true });
FeedingSchema.set('toObject', { getters: true, virtuals: true });

mongoose.model('Feeding', FeedingSchema);