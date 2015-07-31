var express = require('express');
var router = express.Router();
var diaperRepository = require('../services/diaperrepository');
var jwt = require('express-jwt');
var configOptions = require('../config/config.js');

var auth = jwt({secret: configOptions.JWT_SECRET_KEY, userProperty: 'payload'});

// GET '/diapers/all'
router.get('/all', auth, function(req, res, next) {
    diaperRepository.loadAll(req.payload._id, function(err, diapers) {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(diapers);
    });
});

// POST /diapers/deletediaper
router.post('/deletediaper', auth, function(req, res, next) {
    diaperRepository.delete(req.payload._id, req.body.diaperId, function(err) {
        if (err) {
            return res.status(500).json(err);
        }

        return res.json("Delete Successful").status(200);
    });
});

// POST /diapers/savediaper
router.post('/savediaper', auth, function(req, res, next) {
    diaperRepository.save(req.payload._id, req.body.diaper, function(err) {
        if (err) {
            return res.status(500).json(err);
        }

        return res.status(200).json("Save Successful");
    });
});

module.exports = router;