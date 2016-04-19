Ext.define("Admin.view.plantas.FullMapPanel", {
    extend: "Admin.view.maps.FullMapPanel",
    alias: 'widget.fullmap-plantas',

    requires: [
        'Ext.button.Cycle',
        "Admin.view.plantas.FullMapPanelController",
        "Admin.view.plantas.FullMapPanelModel"
    ],

    controller: "fullmap-plantas",
    viewModel: {
        type: "fullmap-plantas"
    },

    initComponent: function () {
        var me = this;
        //console.log('Admin.view.plantas.FullMapPanel');

        var topButtons = [{
            xtype: 'buttongroup',
            //plugins: Ext.create('Ext.ux.BoxReorderer'),
            //padding: '30 0 0 0',
            columns: 1,
            title: 'Search'.translate(),
            items: [{
                xtype: 'combobox',
                //reference: 'nominatim',
                width: 400,
                //publishes: 'value',
                //fieldLabel: 'Search'.translate(),
                labelSeparator: '',
                labelWidth: 0, // 60,
                displayField: 'name',
                valueField: 'lonlat',
                //anchor: '-15',
                bind: {
                    store: '{nominatimdata}'
                },
                minChars: 4,
                queryParam: 'q',
                queryMode: 'remote',
                listeners: {
                    change: 'onSearchNominatim'
                }
            }]
        }, '->', {
            xtype: 'buttongroup',
            //padding: '30 10 10 10',
            //margin: '10 10 10 10',
            columns: 2,
            title: 'Draw'.translate(),
            //iconCls: 'x-fa fa-edit',
            frame: true,
            items: [{
                xtype: 'combobox',
                width: 200,
                colspan: 2,
                //fieldLabel: 'Draw'.translate(),
                labelSeparator: '',
                labelWidth: 0, // 60,
                displayField: 'name',
                valueField: 'value',
                value: 'None',
                iconCls: 'x-fa fa-edit',
                forceSelection: true,
                editable: false,
                bind: {
                    store: '{geometrias}'
                },
                queryMode: 'local',
                listeners: {
                    change: 'onChangeGeometry'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-undo',
                //ui: 'gray',
                //scale: 'small',
                text: 'Remove last'.translate(),
                listeners: {
                    click: 'onDeleteLast'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-trash-o',
                text: 'Remove all'.translate(),
                //ui: 'light',
                listeners: {
                    click: 'onDeleteAll'
                }
            }]
        }, {
            xtype: 'buttongroup',
            //frame: true,
            columns: 2,
            //cls: 'shadow-panel',
            title: 'Print'.translate(),
            //padding: '30 0 0 0',
            items: [{
                xtype: 'cycle',
                showText: true,
                width: 110,
                textAlign: 'right',
                listeners: {
                    change: 'onPaperClick'
                },
                menu: {
                    items: [{
                        text: 'A4 paper',
                        type: 'A4',
                        checked: true
                    }, {
                        text: 'A3 paper',
                        type: 'A3'
                    }]
                }
            }, {
                xtype: 'cycle',
                showText: true,
                width: 122,
                textAlign: 'right',
                listeners: {
                    change: 'onOrientationClick'
                },
                menu: {
                    items: [{
                        text: 'Portrait'.translate(),
                        type: 'portrait',
                        checked: true
                    }, {
                        text: 'Landscape'.translate(),
                        type: 'landscape'
                    }]
                }
            }, {
                iconCls: 'x-fa fa-print',
                text: 'PDF document'.translate(),
                colspan: 2,
                listeners: {
                    //click: 'onPrintClick'
                    click: 'onPrintCheck'
                }
            }]
        }];

        me.dockedItems = [{
            xtype: 'toolbar',
            padding: '2 2 2 2',
            dock: 'top',
            //overflowHandler: 'menu',
            items: topButtons,
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            }
        }];

        this.callParent();
    }


});
