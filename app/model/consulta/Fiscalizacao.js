Ext.define('Admin.model.consulta.Fiscalizacao', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'chave_tp_proc',
        type: 'string'
    }, {
        name: 'numero_processo',
        type: 'string'
    }, {
        name: 'transgressor',
        type: 'string'
    }, {
        name: 'dt_transgressao',
        type: 'date',
        dateWriteFormat: 'c' // ISO 8601 format
    }, {
        name: 'lc_transgressao',
        type: 'string'
    }, {
        name: 'ds_transgressao',
        type: 'string'
    }, {
        name: 'descricao',
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
            tableName: 'dbo.fiscaliz',
            defaultOrderColumn: 'dt_transgressao',
            defaultOrderDirection: 'DESC'
        }
    }
});