module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Instance', {
      capacitystatus: DataTypes.STRING,
      clockSpeed: DataTypes.STRING,
      currentGeneration: DataTypes.STRING,
      dedicatedEbsThroughput: DataTypes.STRING,
      ecu: DataTypes.INTEGER,
      enhancedNetworkingSupported: DataTypes.STRING,
      instanceFamily: DataTypes.STRING,
      instanceType: DataTypes.STRING,
      licenseModel: DataTypes.STRING,
      memory: DataTypes.STRING,
      networkPerformance: DataTypes.STRING,
      normalizationSizeFactor: DataTypes.STRING,
      operatingSystem: DataTypes.STRING,
      operation: DataTypes.STRING,
      physicalProcessor: DataTypes.STRING,
      preInstalledSw: DataTypes.STRING,
      processorArchitecture: DataTypes.STRING,
      processorFeatures: DataTypes.STRING,
      storage: DataTypes.STRING,
      tenancy: DataTypes.STRING,
      term: DataTypes.STRING,
      usagetype: DataTypes.STRING,
      vcpu : DataTypes.STRING,
      region : DataTypes.STRING,
    },
    {
        // Index by region
        indexes: [{
            unique: false,
            fields: ['region']
          },
        {
            unique: true,
            fields: ['operatingSystem', 'region','instanceType']
        }]
    });
};

/*
        "aws:ec2:capacitystatus": "Used",
        "aws:ec2:clockSpeed": "2.9 GHz",
        "aws:ec2:currentGeneration": "Yes",
        "aws:ec2:dedicatedEbsThroughput": "2000 Mbps",
        "aws:ec2:ecu": "62",
        "aws:ec2:enhancedNetworkingSupported": "Yes",
        "aws:ec2:instanceFamily": "Compute optimized",
        "aws:ec2:instanceType": "c4.4xlarge",
        "aws:ec2:licenseModel": "No License required",
        "aws:ec2:memory": "30 GiB",
        "aws:ec2:networkPerformance": "High",
        "aws:ec2:normalizationSizeFactor": "32",
        "aws:ec2:operatingSystem": "Linux",
        "aws:ec2:operation": "RunInstances",
        "aws:ec2:physicalProcessor": "Intel Xeon E5-2666 v3 (Haswell)",
        "aws:ec2:preInstalledSw": "NA",
        "aws:ec2:processorArchitecture": "64-bit",
        "aws:ec2:processorFeatures": "Intel AVX; Intel AVX2; Intel Turbo",
        "aws:ec2:storage": "EBS only",
        "aws:ec2:tenancy": "Shared",
        "aws:ec2:term": "on-demand",
        "aws:ec2:usagetype": "APS2-BoxUsage:c4.4xlarge",
        "aws:ec2:vcpu"
*/