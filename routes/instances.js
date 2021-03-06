var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/:region/:ostype', function(req, res) {
  models.Instance.findAll({ where: {
    region: req.params.region,
    operatingSystem: req.params.ostype
  }}).then(function(instances) {
    res.render('instances', {
      title: `${req.params.ostype} instances in ${req.params.region}`,
      instances: instances
    });
  });
});

module.exports = router;