module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Instance', {
        serverType: DataTypes.STRING,
        region: DataTypes.STRING,
        instanceType: DataTypes.STRING,
        size: DataTypes.STRING,
        ECU: DataTypes.DOUBLE, // If this equals 0, then its probably variable
        ECUIsVariable: DataTypes.BOOLEAN, // For variable ECU instances
        memory: DataTypes.DOUBLE,
        storage: DataTypes.STRING,
        vCPU: DataTypes.INTEGER,
        price: DataTypes.DOUBLE
    },
    {
        // Index by region
        indexes: [{
            unique: false,
            fields: ['region']
          },
        {
            unique: true,
            fields: ['serverType', 'region','instanceType','size']
        }]
    });
};