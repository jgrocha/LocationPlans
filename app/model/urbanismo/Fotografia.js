Ext.define('Admin.model.urbanismo.Fotografia', {
	extend : 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'id_edifica',
        type: 'string'
    }, {
        name: 'pasta',
        type: 'string'
    }, {
        name: 'caminho',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'datacriacao',
        type: 'date',
        dateWriteFormat: 'c'
    }],
    proxy: {
        type: 'direct',
        api: {
            read: 'Server.Urbanismo.Urbanismo.readFotografia'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        }
    }
});
