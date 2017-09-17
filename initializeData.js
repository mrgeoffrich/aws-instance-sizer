const urlConfiguration = require('./urlConfiguration.js');
const request = require('request');
const esprima = require('esprima');
const toValue = require('esprima-to-value');

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

function initData (models) {
    return new Promise((resolve) => {
        models.Instance.sync({
            force: false
        }).then(() => {
            return models.Instance.count();
        }).then((instanceCountValue) => {
            let promiseArray = [];
            if (instanceCountValue > 0) {
                return resolve();
            }
            else {
                urlConfiguration.forEach(function (url) {
                    promiseArray.push(requestAndParsePromise(url.name, url.url));
                }, this);
                return Promise.all(promiseArray);
            }
        }).then((returnResults) => {
            // Flatten the 2d array
            if (returnResults) {
                var allItems = [].concat.apply([], returnResults);
                return models.Instance.bulkCreate(allItems);
            }
        }).then(() => {
            resolve();
        });
    });
};

module.exports = initData;