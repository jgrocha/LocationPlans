Ext.define('Admin.view.consulta.Requer', {
    extend: 'Ext.container.Container',
    alias: 'widget.requer',
    requires: ['Ext.grid.filters.Filters'],
    controller: 'requer',
    viewModel: {
        type: 'requer'
    },

    title: 'Requerimentos (Medidata)',

    items: [{
        xtype: 'grid',
        reference: 'requerGrid',
        cls: 'shadow-panel',
        // margin: 20,
        bind: {
            store: '{requer}'
        },
        stateId: 'requerGrid', // not working
        plugins: 'gridfilters',
        dockedItems: [{
            xtype: 'pagingtoolbar',
            bind: {
                store: '{requer}'
            },
            dock: 'top',
            displayInfo: true
        }],
        viewConfig: {
            emptyText: 'No data available'
        },
        columns: [{
            text: 'Nº',
            dataIndex: 'numero',
            width: 80,
            filter: {
                type: 'string'
            }
        }, {
            text: 'Tipo',
            dataIndex: 'tipo_publicidade',
            width: 60,
            filter: {
                type: 'string'
            }
        }, {
            text: 'Ordem',
            dataIndex: 'ordem',
            width: 72,
            filter: {
                type: 'string'
            }
        }, {
            // https://docs.sencha.com/extjs/6.0/components/grids.html
            xtype: 'datecolumn',
            //format: 'Y-m-d H:i:s',
            format: 'Y-m-d',
            width: 112,
            text: 'Data do auto',
            dataIndex: 'data_entrada',
            filter: {
                type: 'date'
            }
        }, {
            text: 'NIF Requerente',
            dataIndex: 'requerente',
            flex: 1,
            filter: {
                // required configs
                type: 'string'
            }
        }, {
            text: 'qualidade',
            dataIndex: 'qualidade',
            width: 112,
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
            width: 112,
            text: 'Data do fecho',
            dataIndex: 'data_fecho',
            filter: {
                type: 'date'
            }
        }, {
            text: 'estado',
            dataIndex: 'estado',
            width: 60,
            filter: {
                // required configs
                type: 'string'
            },
            hidden: false
        }, {
            text: 'isento',
            dataIndex: 'isento',
            width: 60,
            filter: {
                // required configs
                type: 'string'
            },
            hidden: true
        }],
        selType: 'rowmodel'
    }]
});
