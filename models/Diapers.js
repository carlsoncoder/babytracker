var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var DiaperSchema = new mongoose.Schema({
    userId: {type: ObjectId, required: true},
    affectedDateTime: {type: Date, required: true},
    isWet: { type: Boolean, required: true },
    isDirty: { type: Boolean, required: true },
    color: { type: String, required: false },
    consistency: { type: String, required: false },
    comment: {type: String, required: false }
});

mongoose.model('Diaper', DiaperSchema);