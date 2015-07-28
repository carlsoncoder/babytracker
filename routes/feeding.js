var express = require('express');
var router = express.Router();
var feedingsRepository = require('../services/feedingrepository');
var jwt = require('express-jwt');
var configOptions = require('../config/config.js');

var auth = jwt({secret: configOptions.JWT_SECRET_KEY, userProperty: 'payload'});

// GET '/feedings/all'
router.get('/all', auth, function(req, res, next) {
    feedingsRepository.loadAll(req.payload._id, function(err, feedings) {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(feedings);
    });
});

// POST '/feedings/deletefeeding'
router.post('/deletefeeding', auth, function(req, res, next) {
    feedingsRepository.delete(req.payload._id, req.body.feeding._id, function(err) {
        if (err) {
            return res.status(500).json(err);
        }

        return res.json("Delete Successful").status(200);
    });
});

// POST '/feedings/savefeeding'
router.post('/savefeeding', auth, function(req, res, next) {
    feedingsRepository.save(req.payload._id, req.body.feeding, function(err) {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json("Save Successful");
    });
});

module.exports = router;