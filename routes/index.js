var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  models.Instance.findAll({ where: {
    region: 'ap-southeast-2',
    serverType: 'linux'
  }}).then(function(instances) {
    res.render('index', {
      title: 'Linux instances in ap-southeast-2',
      instances: instances
    });
  });
});

module.exports = router;