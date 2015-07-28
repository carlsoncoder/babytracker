var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Feedings = mongoose.model('Feeding');

var feedingsRepository = {};

feedingsRepository.loadAll = function(userId, callback) {
    var query = Feedings.find({ 'userId': new ObjectId(userId) });
    query.exec(function(err, feedings) {
        if (err) {
            return callback(err);
        }

        return callback(null, feedings);
    });
};

feedingsRepository.save = function(userId, feedingsRecord, callback) {
    var isLeftDefined = feedingsRecord.startDateLeft !== null && feedingsRecord.startDateLeft !== '';
    var isRightDefined = feedingsRecord.startDateRight !== null && feedingsRecord.startDateRight !== '';

    var startDateLeftBoob = isLeftDefined ? new Date(feedingsRecord.startDateLeft) : null;
    var startDateRightBoob = isRightDefined ? new Date(feedingsRecord.startDateRight) : null;

    if (feedingsRecord._id) {
        // updating an existing record
        var updateData = {
            startDateLeft: startDateLeftBoob,
            lengthInMinutesLeft: feedingsRecord.lengthInMinutesLeft,
            startDateRight: startDateRightBoob,
            lengthInMinutesRight: feedingsRecord.lengthInMinutesRight,
            comment: feedingsRecord.comment
        };

        Feedings.update({_id: new ObjectId(feedingsRecord._id)}, updateData, function (err, affected) {
            if (err) {
                return callback(err);
            }

            return callback(null);
        });
    }
    else {
        // saving a new record
        var newFeeding = new Feedings({
            userId: new ObjectId(userId),
            startDateLeft: startDateLeftBoob,
            lengthInMinutesLeft: feedingsRecord.lengthInMinutesLeft,
            startDateRight: startDateRightBoob,
            lengthInMinutesRight: feedingsRecord.lengthInMinutesRight,
            comment: feedingsRecord.comment
        });

        newFeeding.save(function (err, feeding) {
            if (err) {
                return callback(err);
            }

            return callback(null);
        });
    }
};

feedingsRepository.delete = function(userId, feedingId, callback) {
    var query = Feedings.findOne({ 'userId' : new ObjectId(userId), "_id" : new ObjectId(feedingId)});
    query.remove(function (err) {
        if (err) {
            return callback(err);
        }

        return callback(null);
    });
};

module.exports = feedingsRepository;