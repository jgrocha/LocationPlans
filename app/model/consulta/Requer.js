Ext.define('Admin.model.consulta.Requer', {
    extend: 'Ext.data.Model',

    fields: [

        // na Grid
        {name:'numero',type:'string'},
        {name:'tipo_publicidade',type:'string'},
        {name:'ordem',type:'int'},
        {name:'data_entrada',type:'date',dateWriteFormat:'c'},
        {name:'requerente',type:'string'},
        {name:'qualidade',type:'string'},
        {name:'data_fecho',type:'date',dateWriteFormat:'c'},
        {name:'estado',type:'string'},
        {name:'isento',type:'string'},

        // por acrescentar na grid....

        {name:'anular',type:'string'},
        {name:'local',type:'string'},
        {name:'concelho',type:'string'},
        {name:'distrito',type:'string'},
        {name:'freguesia',type:'int'},
        {name:'n_suporte',type:'string'},
        {name:'valor_total',type:'float'},
        {name:'renovacao',type:'string'},
        {name:'descricao1',type:'string'},
        {name:'descricao2',type:'string'},
        {name:'descricao3',type:'string'},
        {name:'data_historico',type:'date',dateWriteFormat:'c'},
        {name:'observacoes',type:'string'},
        {name:'login',type:'string'},
        {name:'colocada',type:'string'},
        {name:'numero_requerii',type:'string'},
        {name:'substituivel',type:'string'},
        {name:'data_requerimento',type:'date',dateWriteFormat:'c'},
        {name:'requerimento',type:'string'},
        {name:'data_aviso2',type:'date',dateWriteFormat:'c'},
        {name:'nalvara',type:'string'},
        {name:'validadelic',type:'date',dateWriteFormat:'c'},
        {name:'data_colocacao',type:'date',dateWriteFormat:'c'},
        {name:'ins_log_word',type:'string'},
        {name:'ins_dat_word',type:'date',dateWriteFormat:'c'},
        {name:'mod_log_word',type:'string'},
        {name:'mod_dat_word',type:'date',dateWriteFormat:'c'},
        {name:'cod_morada',type:'string'},
        {name:'data_fim',type:'date',dateWriteFormat:'c'},
        {name:'arq',type:'string'},
        {name:'arquivado',type:'date',dateWriteFormat:'c'},
        {name:'arquivado_login',type:'string'},
        {name:'ficheiro',type:'string'},
        {name:'modelo',type:'string'},
        {name:'pub_id',type:'string'},
        {name:'estabel',type:'string'},
        {name:'proc_adm',type:'string'}
    ],
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
            tableName: 'dbo.requer',
            defaultOrderColumn: 'data_entrada',
            defaultOrderDirection: 'DESC'
        }
    }
});