var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Diapers = mongoose.model('Diaper');

var diaperRepository = {};

diaperRepository.loadAll = function(userId, callback) {
    var query = Diapers.find({ 'userId': new ObjectId(userId) }).sort('-affectedDateTime');
    query.exec(function(err, diapers) {
        if (err) {
            return callback(err);
        }

        return callback(null, diapers);
    });
};

diaperRepository.save = function(userId, diaperRecord, callback) {
    if (diaperRecord._id) {
        // updating an existing record
        var updateData = {
            affectedDateTime: new Date(diaperRecord.affectedDateTime),
            isWet: diaperRecord.isWet,
            isDirty: diaperRecord.isDirty,
            color: diaperRecord.color,
            consistency: diaperRecord.consistency,
            comment: diaperRecord.comment
        };

        Diapers.update({_id: new ObjectId(diaperRecord._id)}, updateData, function (err, affected) {
            if (err) {
                return callback(err);
            }

            return callback(null);
        });
    }
    else {
        // saving a new record
        var newDiaper = new Diapers({
            userId: new ObjectId(userId),
            affectedDateTime: new Date(diaperRecord.affectedDateTime),
            isWet: diaperRecord.isWet,
            isDirty: diaperRecord.isDirty,
            color: diaperRecord.color,
            consistency: diaperRecord.consistency,
            comment: diaperRecord.comment
        });

        newDiaper.save(function (err, diaper) {
            if (err) {
                return callback(err);
            }

            return callback(null);
        });
    }
};

diaperRepository.delete = function(userId, diaperId, callback) {
    var query = Diapers.findOne({ 'userId' : new ObjectId(userId), "_id" : new ObjectId(diaperId)});
    query.remove(function (err) {
        if (err) {
            return callback(err);
        }

        return callback(null);
    });
};

module.exports = diaperRepository;