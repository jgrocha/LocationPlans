Ext.define('Admin.model.consulta.Municipe', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'numero',
        type: 'string'
    }, {
        name: 'nome',
        type: 'string'
    }, {
        name: 'morada',
        type: 'string'
    }, {
        name: 'codigo_postal',
        type: 'string'
    }, {
        name: 'local',
        type: 'string'
    }, {
        name: 'localidade',
        type: 'string'
    }, {
        name: 'telefone',
        type: 'string'
    }, {
        name: 'telemovel',
        type: 'string'
    }, {
        name: 'filiacao_pai',
        type: 'string'
    }, {
        name: 'filiacao_mae',
        type: 'string'
    }, {
        name: 'data_nasc',
        type: 'date',
        dateWriteFormat: 'c' // ISO 8601 format
    }, {
        name: 'email',
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
            tableName: 'dbo.contrib',
            defaultOrderColumn: 'rowid',
            defaultOrderDirection: 'ASC'
        }
    }
});