Ext.define('Admin.model.consulta.Processo', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'tipo',
        type: 'string'
    }, {
        name: 'numero',
        type: 'string'
    }, {
        name: 'abertura',
        type: 'date',
        dateWriteFormat: 'c' // ISO 8601 format
    }, {
        name: 'fecho',
        type: 'date',
        dateWriteFormat: 'c' // ISO 8601 format
    }, {
        name: 'requerente_princ',
        type: 'string'
    }, {
        name: 'local',
        type: 'string'
    }, {
        name: 'plano',
        type: 'string'
    }, {
        name: 'local_arquivo',
        type: 'string'
    }, {
        name: 'observacoes',
        type: 'string'
    }, {
        name: 'tip_proc_ant',
        type: 'string'
    }, {
        name: 'num_proc_ant',
        type: 'string'
    }, {
        name: 'razao_arquivo',
        type: 'string'
    }, {
        name: 'prazo',
        type: 'int'
    }, {
        name: 'estimativa',
        type: 'int'
    }, {
        name: 'observacoes_cir',
        type: 'string'
    }, {
        name: 'login',
        type: 'string'
    }, {
        name: 'ultimo_movimento',
        type: 'string'
    }, {
        name: 'data_movimento',
        type: 'date',
        dateWriteFormat: 'c' // ISO 8601 format
    }, {
        name: 'hora_movimento',
        type: 'float'
        // precisa de ser convertido
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
            tableName: 'dbo.processo',
            defaultOrderColumn: 'abertura',
            defaultOrderDirection: 'DESC'
        }
    }
});