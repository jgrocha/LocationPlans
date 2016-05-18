Ext.define("Admin.view.urbanismo.GridEdificado", {
    extend: "Ext.grid.Panel",
    alias: 'widget.urbanismogridedificado',

    cls: 'shadow-panel',

    // The store will be set later
    // store: '{featureStore}',

    title: 'Edificado',
    reference: 'edificadoGrid',
    
    // listeners: {
    //     'selectionchange': 'edificadoGridSelectionChanged'
    // },

    viewConfig: {
        emptyText: 'No data available',
        deferEmptyText: false
    },

    columns: [ /* {
        xtype: 'gx_symbolizercolumn',
        width: 40
    },*/ {
        text: 'Internal ID',
        dataIndex: 'gid',
        width: 80,
        hidden: true,
        filter: {
            type: 'number'
        }
    }, {
        text: 'ID',
        // dataIndex: 'inspireid',
        dataIndex: 'id_edifica',
        width: 80,
        filter: {
            type: 'number'
        }
    }, {
        text: 'Função (Uso)',
        dataIndex: 'uso',
        flex: 1,
        filter: {
            type: 'string'
        }
    }, {
        text: 'Data (sub.)',
        dataIndex: 'data_sub',
        xtype: 'datecolumn',
        format: 'Y-m-d H:i:s',
        width: 150,
        hidden: true,
        filter: {
            type: 'date'
        }
    }, {
        text: 'Estado',
        dataIndex: 'estado',
        width: 120,
        filter: {
            type: 'string' // , value: 'funcional' // active with this initial value
        }
    }, {
        text: 'Valor Elev.',
        dataIndex: 'valor_elev',
        hidden: true,
        xtype: 'numbercolumn',
        //format: '0,000',
        width: 80,
        filter: {
            type: 'number'
        }
    }, {
        text: 'Nº Proc.',
        dataIndex: 'n_proc',
        width: 80,
        filter: {
            type: 'string'
        }
    }, {
        text: 'Observações',
        dataIndex: 'obs',
        flex: 2,
        hidden: true,
        filter: {
            type: 'string'
        }
    }, {
        text: 'Atualizado em',
        dataIndex: 'd_actualiz',
        xtype: 'datecolumn',
        format: 'Y-m-d H:i:s',
        width: 150,
        filter: {
            type: 'date'
        }
    }],

    selModel: {
        allowDeselect: true
    }

});
