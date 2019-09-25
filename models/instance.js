module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Instance', {
      capacitystatus: DataTypes.STRING,
      clockSpeed: DataTypes.STRING,
      currentGeneration: DataTypes.STRING,
      dedicatedEbsThroughput: DataTypes.STRING,
      ecu: DataTypes.STRING,
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
      vcpu : DataTypes.INTEGER,
      region : DataTypes.STRING,
      price: DataTypes.BIGINT
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