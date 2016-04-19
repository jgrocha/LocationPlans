Ext.define('Admin.view.consulta.Municipe', {
    extend: 'Ext.container.Container',
    alias: 'widget.municipe',
    requires: ['Ext.grid.filters.Filters'],
    controller: 'municipe',
    viewModel: {
        type: 'municipe'
    },

    items: [{
        xtype: 'grid',
        reference: 'municipeGrid',
        cls: 'shadow-panel',
        margin: 20,
        bind: {
            store: '{municipe}'
        },
        stateId: 'municipeGrid', // not working
        plugins: 'gridfilters',
        dockedItems: [{
            xtype: 'pagingtoolbar',
            bind: {
                store: '{municipe}'
            },
            dock: 'top',
            displayInfo: true
        }],
        viewConfig: {
            emptyText: 'No data available'
        },
        columns: [{
            text: 'NIF',
            dataIndex: 'numero',
            width: 80,
            filter: {
                type: 'string'
            }
        }, {
            text: 'Nome',
            dataIndex: 'nome',
            width: 240,
            filter: {
                type: 'string'
            }
        }, {
            text: 'Morada',
            dataIndex: 'morada',
            flex: 1,
            filter: {
                type: 'string'
            }
        }, {
            text: 'Cod. Postal',
            dataIndex: 'codigo_postal',
            width: 120,
            filter: {
                type: 'string'
            }
        }, {
            text: 'Local',
            dataIndex: 'local',
            width: 150,
            filter: {
                type: 'string'
            },
            hidden: true
        }, {
            text: 'Localidade',
            dataIndex: 'localidade',
            width: 150,
            filter: {
                type: 'string'
            },
            hidden: true
        }, {
            text: 'Telefone',
            dataIndex: 'telefone',
            width: 150,
            filter: {
                type: 'string'
            },
            sortable: false,
            hidden: true
        }, {
            text: 'Telemóvel',
            dataIndex: 'telemovel',
            width: 150,
            filter: {
                type: 'string'
            },
            sortable: false,
            hidden: true
        }, {
            text: 'Pai (filiação)',
            dataIndex: 'filiacao_pai',
            width: 150,
            filter: {
                type: 'string'
            },
            sortable: false,
            hidden: true
        }, {
            text: 'Mãe (filiação)',
            dataIndex: 'filiacao_mae',
            width: 150,
            filter: {
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
            text: 'Nascimento',
            dataIndex: 'data_nasc',
            filter: {
                type: 'date'
            }
        }, {
            text: 'Email',
            dataIndex: 'email',
            width: 150,
            filter: {
                type: 'string'
            },
            hidden: false
        }],
        selType: 'rowmodel'
    }]
});
