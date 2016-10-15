Ext.define("Admin.view.publicidade.GridPublicidadeLevantada", {
    extend: "Ext.grid.Panel",
    alias: 'widget.gridpublicidadelevantada',

    cls: 'shadow-panel',

    // The store will be set later
    // store: '{featureStore}',

    title: 'Pulicidade selecionada'.translate(),
    
    reference: 'publicidadeLevantadaGrid',
    
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
        text: 'gid',
        dataIndex: 'gid',
        width: 80,
        hidden: true,
        filter: {
            type: 'number'
        }
    }, {
        text: 'id_pub',
        dataIndex: 'id_pub',
        width: 80,
        hidden: false,
        filter: {
            type: 'number'
        }
    }, {
        text: 'Data de fim',
        dataIndex: 'data_fim',
        xtype: 'datecolumn',
        format: 'Y-m-d H:i:s',
        width: 150,
        hidden: true,
        filter: {
            type: 'date'
        }
    }, {
        text: 'imagem',
        dataIndex: 'imagem',
        width: 80,
        filter: {
            type: 'string'
        }
    }, {
        text: 'num_proces',
        dataIndex: 'num_proces',
        width: 80,
        filter: {
            type: 'string'
        }
    }, {
        text: 'ordem',
        dataIndex: 'ordem',
        flex: 1,
        filter: {
            type: 'string'
        }
    }, {
        text: 'tipo',
        dataIndex: 'tipo',
        width: 120,
        filter: {
            type: 'string' // , value: 'funcional' // active with this initial value
        }
    }/*, {
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
     }*/],

    selModel: {
        allowDeselect: true
    }

});
