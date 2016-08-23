Ext.define('Admin.view.config.Users', {
    extend: 'Ext.container.Container',
    xtype: 'users',

    controller: 'users',
    viewModel: {
        type: 'users'
    },

    layout: 'responsivecolumn',

    items: [{
        xtype: 'grid',
        reference: 'usersGrid',
        //flex: 1,
        cls: 'shadow-panel',
        responsiveCls: 'big-100',

        height: 400,
        //margin: 10,

        tbar: [{
            text: 'Edit',
            iconCls: 'x-fa fa-pencil',
            handler: 'onUsersEditClick'
        }, {
            text: 'Delete',
            iconCls: 'x-fa fa-remove',
            handler: 'onUsersRemoveClick'
        }, '->', {
            text: 'Refresh',
            handler: 'onUsersRefreshClick',
            iconCls: 'x-fa fa-refresh'
        }],

        bind: {
            store: '{users}'
        },
        viewConfig: {
            emptyText: 'No data available'
        },
        columns: [{
            text: 'Id',
            dataIndex: 'id',
            width: 40,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
            // , sortable: false,
            // hidden: true
        }, {
            text: 'Email',
            dataIndex: 'email',
            width: 120,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            text: 'Name',
            dataIndex: 'nome',
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            // https://docs.sencha.com/extjs/6.0/components/grids.html
            xtype: 'datecolumn',
            format: 'Y-m-d H:i:s',
            width: 150,
            text: 'Date',
            dataIndex: 'datacriacao',
            editor: {
                xtype: 'datefield',
                format: 'Y-m-d H:i:s' // format to show the date
                // defined in the model: dateWriteFormat: 'c'
            }
        }, {
            text: 'VAT',
            dataIndex: 'nif',
            width: 160,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }],
        selType: 'rowmodel',
        plugins: [{
            ptype: 'rowediting',
            pluginId: 'usersGridRowEditing',
            clicksToEdit: 2
        }]
    }]

});
