Ext.define('Admin.model.geo.Applayers', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }],
    proxy: {
        type: 'direct',
        extraParams : {
            defaultTable : 'users.application'
        },
        api: {
            read: 'Server.Util.read'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        }
    }
});
