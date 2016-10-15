Ext.define('Admin.view.config.MapLayers', {
    extend: 'Ext.container.Container',
    xtype: 'maplayers',

    controller: 'maplayers',
    viewModel: {
        type: 'maplayers'
    },

    layout: 'responsivecolumn',

    items: [{
        xtype: 'grid',
        reference: 'layerGrid',
        //flex: 1,
        cls: 'shadow-panel',
        responsiveCls: 'big-100',

        height: 600,
        // margin: 20,

        tbar: [{
            xtype: 'combobox',
            width: 180,
            colspan: 2,
            //fieldLabel: 'Draw'.translate(),
            labelSeparator: '',
            labelWidth: 0, // 60,
            displayField: 'name',
            valueField: 'id',
            value: 1,
            iconCls: 'x-fa fa-edit',
            forceSelection: true,
            editable: false,
            bind: {
                store: '{applications}',
                value: '{app}'
            },
            queryMode: 'local',
            listeners: {
                change: 'onChangeView'
            }
        }, /*{
            text: 'Edit',
            iconCls: 'x-fa fa-pencil',
            handler: 'onLayersEditClick'
        }, */{
            text: 'Delete',
            iconCls: 'x-fa fa-remove',
            handler: 'onLayersRemoveClick'
        }, '->', {
            text: 'Refresh',
            handler: 'onLayersRefreshClick',
            iconCls: 'x-fa fa-refresh'
        }],

        bind: {
            store: '{maplayers}'
        },

        dockedItems: [{
            xtype: 'pagingtoolbar',
            bind: {
                store: '{maplayers}'
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
            width: 40
        }, {
            text: 'title',
            dataIndex: 'title',
            width: 180,
            editor: {
                xtype: 'textfield'
            },
            filter: {
                type: 'string'
            }
        }, {
            text: 'Layer'.translate(),
            dataIndex: 'layer',
            flex: 1,
            editor: {
                xtype: 'textfield'
            },
            filter: {
                type: 'string'
            }
        }, {
            text: 'Group'.translate(),
            dataIndex: 'layergroup',
            flex: 2,
            editor: {
                xtype: 'textfield'
            },
            filter: {
                type: 'string'
            }
        }, {
            text: 'url',
            dataIndex: 'url',
            width: 160,
            editor: {
                xtype: 'textfield'
            },
            filter: {
                type: 'string'
            }
        }],
        selType: 'rowmodel',
        plugins: [{
            ptype: 'gridfilters'
        }, {
            ptype: 'rowediting',
            pluginId: 'layersGridRowEditing',
            clicksToEdit: 2
        }]
    }]

});
