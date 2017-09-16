var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  models.Instance.findAll({ where: {
    region: 'ap-southeast-2'
  }}).then(function(instances) {
    res.render('index', {
      title: 'Sequelize: Express Example',
      instances: instances
    });
  });
});

module.exports = router;