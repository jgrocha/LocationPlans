Ext.define("Admin.view.urbanismo.GridProcesso", {
    extend: "Ext.grid.Panel",
    alias: 'widget.urbanismogridprocesso',

    cls: 'shadow-panel',

    // The store will be set later
    // store: '{featureStore}',

    title: 'Processos',

    viewConfig: {
        emptyText: 'No data available',
        deferEmptyText: false
    },

    //reference: 'edificadoGrid',

    bind: {
        store: '{processo}' // do viewModel da view acima
    },

    columns: [{
        text: 'Tipo',
        dataIndex: 'tipo',
        width: 80
    }, {
        text: 'Nº Processo',
        dataIndex: 'numero',
        width: 80
    }, {
        xtype: 'datecolumn',
        //format: 'Y-m-d H:i:s',
        format: 'Y-m-d',
        width: 150,
        text: 'Data de Abertura',
        dataIndex: 'abertura',
        filter: {
            type: 'date'
        }
    }, {
        xtype: 'datecolumn',
        //format: 'Y-m-d H:i:s',
        format: 'Y-m-d',
        width: 150,
        text: 'Data de Fecho',
        dataIndex: 'fecho',
        filter: {
            type: 'date'
        }
    }, {
        text: 'Requerente',
        dataIndex: 'requerente_princ',
        width: 80
    }, {
        text: 'Local',
        dataIndex: 'local',
        width: 80
    }, {
        text: 'Plano',
        dataIndex: 'plano',
        width: 80
    }, {
        text: 'Observações',
        dataIndex: 'observacoes',
        width: 80
    }],

    selModel: {
        allowDeselect: true
    }

});
