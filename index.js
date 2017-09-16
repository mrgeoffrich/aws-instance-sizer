const request = require('request');
const esprima = require('esprima');
const toValue = require('esprima-to-value');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const models = require('./models');
const winston = require('winston');
const expressWinston = require('express-winston');
const urlConfiguration = require('./urlConfiguration.js');

winston.configure({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
          }),
        new (winston.transports.File)({ filename: 'app.log' })
    ]
});

let server = {};

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            winston.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            winston.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function requestAndParsePromise(serverType, url) {
    return new Promise((resolve) => {
        request.get(url, (error, response, body) => {
            var parsedJavascript = esprima.parse(body);
            let returnData = toValue(parsedJavascript.body[0].expression.arguments)[0].config;
            let returnArray = [];
            returnData.regions.forEach((region) => {
                region.instanceTypes.forEach((instanceType) => {
                    instanceType.sizes.forEach((size) => {
                        var price = size.valueColumns[0].prices.USD;
                        returnArray.push({
                            serverType: serverType,
                            region: region.region,
                            instanceType: instanceType.type,
                            size: size.size,
                            // If this equals 0, then its a 'variable' type ECU
                            ECU: (size.ECU == 'variable') ? 0 : parseFloat(size.ECU),
                            ECUIsVariable: size.ECU == 'variable', // For variable ECU instances
                            memory: parseFloat(size.memoryGiB),
                            storage: size.storageGB,
                            vCPU: parseInt(size.vCPU),
                            price: parseFloat(price)
                        });
                    }, this);
                }, this);
            }, this);
            resolve(returnArray);
        });
    });
};

const routes = require('./routes/index');
let app = express();
app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      })
    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
    colorStatus: true // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
  }));
let port = process.env.PORT || 3000;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

models.Instance.sync({
    force: false
}).then(() => {
    let promiseArray = [];
    urlConfiguration.forEach(function (url) {
        promiseArray.push(requestAndParsePromise(url.name, url.url));
    }, this);
    return Promise.all(promiseArray);
}).then((returnResults) => {
    // Flatten the 2d array
    var allItems = [].concat.apply([], returnResults);
    if (models.Instance.count() > 0)
        return models.Instance.bulkCreate(allItems);
    else
        return Promise.resolve();
}).then(() => {
    // Start web server here
    server = http.createServer(app);
    server.on('error', onError);
    server.listen(port, function () {
        winston.debug('Express server listening on port ' + server.address().port);
    });
});