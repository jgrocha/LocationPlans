Ext.define('Admin.model.publicidade.Fotografia', {
	extend : 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'id_pub',
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
            read: 'Server.Publicidade.Publicidade.readFotografia',
            destroy: 'Server.Publicidade.Publicidade.destroyFotografia'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        }
    }
});
