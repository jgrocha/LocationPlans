Ext.define('Admin.model.consulta.Embargo', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'n_auto_embargo',
        type: 'string'
    }, {
        name: 'nome_notificado',
        type: 'string'
    }, {
        name: 'morada',
        type: 'string'
    }, {
        name: 'local_embargo',
        type: 'string'
    }, {
        name: 'transgressor',
        type: 'string'
    }, {
        name: 'data_auto',
        type: 'date',
        dateWriteFormat: 'c' // ISO 8601 format
    }, {
        name: 'data_fim',
        type: 'date',
        dateWriteFormat: 'c' // ISO 8601 format
    }, {
        name: 'estado_obras',
        type: 'string'
    }],
    proxy: {
        type: 'direct',
        api: {
            read: 'Server.Urbanismo.SQLServer.readEmbargos'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        },
        extraParams: {
            tableName: 'dbo.embargos',
            defaultOrderColumn: 'data_auto',
            defaultOrderDirection: 'DESC'
        }
    }
});