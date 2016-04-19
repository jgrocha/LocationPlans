Ext.define('Admin.model.sync.Calibration', {
    extend: 'Ext.data.Model',

    fields: [
        {
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
            name: 'cal_a_old',
            type: 'float'
        }, {
            name: 'cal_b_old',
            type: 'float'
        }, {
            name: 'cal_a_new',
            type: 'float'
        }, {
            name: 'cal_b_new',
            type: 'float'
        }, {
            name: 'ref_value_high',
            type: 'float'
        }, {
            name: 'ref_value_low',
            type: 'float'
        }, {
            name: 'read_value_high',
            type: 'float'
        }, {
            name: 'read_value_low',
            type: 'float'
        }
    ],

    proxy: {
        type: 'direct',
        api: {
            create: 'Server.ActiveEngCloud.Calibration.create',
            read: 'Server.ActiveEngCloud.Calibration.read',
            update: 'Server.ActiveEngCloud.Calibration.update',
            destroy: 'Server.ActiveEngCloud.Calibration.destroy'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message' // mandatory if you want the framework to set message property content
        }
    }
});