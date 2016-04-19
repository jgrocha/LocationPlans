Ext.define('Admin.model.sync.Sensor', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'sensorid',
        type: 'int'
    }, {
        name: 'address',
        type: 'string',
        defaultValue: '00:00:00:00:00:00'
    }, {
        name: 'location',
        type: 'string'
    }, {
        name: 'installdate',
        type: 'date',
        dateWriteFormat: 'c', // ISO 8601 format
        defaultValue: new Date()
    }, {
        name: 'sensortype',
        type: 'string',
        defaultValue: 'PT100'
    }, {
        name: 'metric',
        type: 'boolean',
        defaultValue: 1
    }, {
        name: 'calibrated',
        type: 'boolean',
        defaultValue: 0
    }, {
        name: 'quantity',
        type: 'string',
        defaultValue: 'T'
    }, {
        name: 'decimalplaces',
        type: 'int',
        defaultValue: 3
    }, {
        name: 'cal_a',
        type: 'float',
        defaultValue: 0.0
    }, {
        name: 'cal_b',
        type: 'float',
        defaultValue: 1.0
    }, {
        name: 'read_interval',
        type: 'int',
        defaultValue: 5
    }, {
        name: 'record_sample',
        type: 'int',
        defaultValue: 1
    }],
    proxy: {
        type: 'direct',
        api: {
            create: 'Server.ActiveEngCloud.Sensor.create',
            read: 'Server.ActiveEngCloud.Sensor.read',
            update: 'Server.ActiveEngCloud.Sensor.update',
            destroy: 'Server.ActiveEngCloud.Sensor.destroy'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        }
    }
});