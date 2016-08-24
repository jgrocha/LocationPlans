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

        height: 600,
        // margin: 10,

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
        dockedItems: [{
            xtype: 'pagingtoolbar',
            bind: {
                store: '{users}'
            },
            dock: 'top',
            displayInfo: true
        }],
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
            width: 180,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            },
            filter: {
                type: 'string'
            }
        }, {
            text: 'Group',
            dataIndex: 'idgrupo',
            renderer : function (value, metaData, record) {
                return record.get('group');
            },
            width: 120,
            editor: {
                xtype: 'combobox',
                queryMode: 'local',
                valueField: 'id',
                displayField: 'nome',
                typeAhead: true,
                forceSelection: true,
                bind: {
                    store: '{group}'
                },
                allowBlank: false
            }
        }, {
            text: 'Name',
            dataIndex: 'nome',
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            },
            filter: {
                type: 'string'
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
                xtype: 'textfield'
            },
            filter: {
                type: 'string'
            },
            hidden: true
        }],
        selType: 'rowmodel',
        plugins: [{
            ptype: 'gridfilters'
        }, {
            ptype: 'rowediting',
            pluginId: 'usersGridRowEditing',
            clicksToEdit: 2
        }]
    }, /*------------------------------------------------------------------------------------------------------------*/
    {
        xtype: 'grid',
        reference: 'sessionGrid',
        //flex: 1,
        cls: 'shadow-panel',
        responsiveCls: 'big-100',

        height: 400,
        // margin: 10,

        bind: {
            store: '{session}'
        },
        dockedItems: [{
            xtype: 'pagingtoolbar',
            bind: {
                store: '{users}'
            },
            dock: 'top',
            displayInfo: true
        }],
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
            },
            // , sortable: false,
            hidden: true
        }, {
            text: 'Session ID',
            dataIndex: 'sessionid',
            width: 180,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            text: 'IP Address',
            dataIndex: 'ip',
            width: 180,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            },
            filter: {
                type: 'string'
            }
        }, {
            text: 'Hostname',
            dataIndex: 'hostname',
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            },
            filter: {
                type: 'string'
            }
        }, {
            // https://docs.sencha.com/extjs/6.0/components/grids.html
            xtype: 'datecolumn',
            format: 'Y-m-d H:i:s',
            width: 150,
            text: 'Login date',
            dataIndex: 'datalogin'
        }],
        selType: 'rowmodel',
        plugins: [{
            ptype: 'gridfilters'
        }]
    }]

});
