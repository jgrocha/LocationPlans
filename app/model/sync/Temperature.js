Ext.define('Admin.model.sync.Temperature', {
    extend: 'Ext.data.Model',

    fields: [{
            name: 'id',
            type: 'int'
        },{
            name: 'sensorid',
            type: 'int'
        }, {
            name: 'address',
            type: 'string'
        }, {
            name: 'created',
            type: 'date'
        }, {
            name: 'value',
            type: 'float'
        }, {
            name: 'metric',
            type: 'boolean'
        }, {
            name: 'calibrated',
            type: 'boolean'
        }],

    proxy: {
        type: 'direct',
        api: {
            create: 'Server.ActiveEngCloud.Temperature.create',
            read: 'Server.ActiveEngCloud.Temperature.read',
            update: 'Server.ActiveEngCloud.Temperature.update',
            destroy: 'Server.ActiveEngCloud.Temperature.destroy'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message' // mandatory if you want the framework to set message property content
        }
    }
});