const { pricingUrl, operatingSystems } = require('./urlConfiguration.js');
const request = require('request');

function requestAndParsePromise(url) {
    return new Promise((resolve) => {
        request.get(url, (error, response, body) => {
            var parsedJavascript = JSON.parse(body);
            let returnArray = [];
            parsedJavascript.prices.forEach((priceRecord) => {
                returnArray.push({
                  region: priceRecord.attributes["aws:region"],
                  operatingSystem: priceRecord.attributes["aws:ec2:operatingSystem"],
                  instanceType: priceRecord.attributes["aws:ec2:instanceType"]
                });
            }, this);
            resolve(returnArray);
        });
    });
};

const initData = async (models) => {
    await models.Instance.sync({ force: true })
    const instanceCountValue = models.Instance.count();
    if (instanceCountValue > 0) {
        return;
    }
    else {
      for (let i = 0; i < operatingSystems.length; i++) {        
        const downloadUrl = pricingUrl + operatingSystems[i] + '/index.json';
        const insertResults = await requestAndParsePromise(downloadUrl);
        await models.Instance.bulkCreate(insertResults);
      }
    }
};

module.exports = initData;