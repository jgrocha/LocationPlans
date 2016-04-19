Ext.define('Admin.view.consulta.Embargo', {
    extend: 'Ext.container.Container',
    alias: 'widget.embargo',
    requires: ['Ext.grid.filters.Filters'],
    controller: 'embargo',
    viewModel: {
        type: 'embargo'
    },

    items: [{
        xtype: 'grid',
        reference: 'embargoGrid',
        cls: 'shadow-panel',
        margin: 20,
        bind: {
            store: '{embargo}'
        },
        stateId: 'embargoGrid', // not working
        plugins: 'gridfilters',
        dockedItems: [{
            xtype: 'pagingtoolbar',
            bind: {
                store: '{embargos}'
            },
            dock: 'top',
            displayInfo: true
        }],
        viewConfig: {
            emptyText: 'No data available'
        },
        columns: [{
            text: 'Auto',
            dataIndex: 'n_auto_embargo',
            width: 80,
            filter: {
                // required configs
                type: 'string'
            }
        }, {
            text: 'Nome',
            dataIndex: 'nome_notificado',
            width: 240,
            filter: {
                // required configs
                type: 'string'
            }
        }, {
            text: 'Morada',
            dataIndex: 'morada',
            width: 240,
            filter: {
                // required configs
                type: 'string'
            }
        }, {
            text: 'Local do embargo',
            dataIndex: 'local_embargo',
            width: 240,
            filter: {
                // required configs
                type: 'string'
            }
        }, {
            text: 'Estado das obras',
            dataIndex: 'estado_obras',
            flex: 1,
            filter: {
                // required configs
                type: 'string'
            },
            sortable: false,
            hidden: true
        }, {
            // https://docs.sencha.com/extjs/6.0/components/grids.html
            xtype: 'datecolumn',
            //format: 'Y-m-d H:i:s',
            format: 'Y-m-d',
            width: 150,
            text: 'Data do auto',
            dataIndex: 'data_auto',
            filter: {
                type: 'date'
            }
        }, {
            // https://docs.sencha.com/extjs/6.0/components/grids.html
            xtype: 'datecolumn',
            //format: 'Y-m-d H:i:s',
            format: 'Y-m-d',
            width: 150,
            text: 'Fim do embargo',
            dataIndex: 'data_fim',
            filter: {
                type: 'date'
            }
        }, {
            text: 'Transgressor',
            dataIndex: 'transgressor',
            width: 150,
            filter: {
                // required configs
                type: 'string'
            },
            hidden: true
        }],
        selType: 'rowmodel'
    }]
});
