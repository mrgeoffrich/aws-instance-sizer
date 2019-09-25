const { pricingUrl, operatingSystems } = require('./urlConfiguration.js');
const request = require('request');

function requestAndParsePromise(url) {
    return new Promise((resolve) => {
        request.get(url, (error, response, body) => {
            var parsedJavascript = JSON.parse(body);
            let returnArray = [];
            parsedJavascript.prices.forEach((priceRecord) => {
              let price = parseFloat(priceRecord.price.USD) * 100000;
              let priceInt = Math.floor(price);
              returnArray.push({
                region: priceRecord.attributes["aws:region"],
                capacitystatus : priceRecord.attributes["aws:ec2:capacitystatus"],
                clockSpeed:  priceRecord.attributes["aws:ec2:clockSpeed"],
                currentGeneration : priceRecord.attributes["aws:ec2:currentGeneration"],
                dedicatedEbsThroughput: priceRecord.attributes["aws:ec2:dedicatedEbsThroughput"],
                ecu : priceRecord.attributes["aws:ec2:ecu"],
                enhancedNetworkingSupported: priceRecord.attributes["aws:ec2:enhancedNetworkingSupported"],
                instanceFamily : priceRecord.attributes["aws:ec2:instanceFamily"],
                instanceType: priceRecord.attributes["aws:ec2:instanceType"],
                licenseModel: priceRecord.attributes["aws:ec2:licenseModel"],
                memory: priceRecord.attributes["aws:ec2:memory"],
                networkPerformance: priceRecord.attributes["aws:ec2:networkPerformance"],
                normalizationSizeFactor: priceRecord.attributes["aws:ec2:normalizationSizeFactor"],
                operatingSystem: priceRecord.attributes["aws:ec2:operatingSystem"],
                operation: priceRecord.attributes["aws:ec2:operation"],
                physicalProcessor: priceRecord.attributes["aws:ec2:physicalProcessor"],
                preInstalledSw: priceRecord.attributes["aws:ec2:preInstalledSw"],
                processorArchitecture: priceRecord.attributes["aws:ec2:processorArchitecture"],
                processorFeatures: priceRecord.attributes["aws:ec2:processorFeatures"],
                storage: priceRecord.attributes["aws:ec2:storage"],
                tenancy: priceRecord.attributes["aws:ec2:tenancy"],
                term: priceRecord.attributes["aws:ec2:term"],
                usagetype: priceRecord.attributes["aws:ec2:usagetype"],
                vcpu: parseInt(priceRecord.attributes["aws:ec2:vcpu"]),
                price: priceInt
              });
            }, this);
            resolve(returnArray);
        });
    });
};

const initData = async (models) => {
    await models.Instance.sync({ force: false })
    const instanceCountValue = await models.Instance.count();
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