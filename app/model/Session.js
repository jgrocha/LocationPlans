Ext.define('Admin.model.Session', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'userid',
        type: 'int'
    }, {
        name: 'sessionid',
        type: 'string'
    }, {
        name: 'ip',
        type: 'string'
    }, {
        name: 'hostname',
        type: 'string'
    }, {
        name: 'browser',
        type: 'string'
    }, {
        name: 'reaproveitada',
        type: 'int'
    }, {
        name: 'socialid',
        type: 'int'
    }, {
        name: 'datalogin',
        type: 'date'
    }, {
        name: 'datalogout',
        type: 'date'
    }, {
        name: 'dataultimaatividade',
        type: 'date'
    }, {
        name: 'ativo',
        type: 'boolean'
    }],
    proxy: {
        type: 'direct',
        extraParams : {
        	defaultTable : 'users.sessao',
            defaultSortColumn: 'datalogin',
            defaultSordDirection: 'DESC'
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
