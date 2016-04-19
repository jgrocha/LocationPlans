Ext.define('Admin.model.sync.Estatisticas', {
	extend : 'Ext.data.Model',
    fields: [{
        name: 'item',
        type: 'string'
    }, {
        name: 'contador',
        type: 'int'
    }],
    proxy : {
        type : 'direct',
        api : {
            read : 'Server.ActiveEngCloud.Pedidos.estatisticas'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        }
    }
});