Ext.define("Admin.view.urbanismo.FullMapPanel", {
    extend: "Admin.view.maps.FullMapPanel",
    alias: 'widget.fullmap-urbanismo',

    requires: [
        "Admin.view.urbanismo.FullMapPanelController",
        "Admin.view.urbanismo.FullMapPanelModel"
    ],

    controller: "fullmap-urbanismo",
    viewModel: {
        type: "fullmap-urbanismo"
    },

    defaults: {
        defaultFocus: 'combobox',
        defaultButton: 'searchbyidbutton'
    },

    tools: [{
        type: 'help',
        callback: 'onHelp',
        tooltip: 'Show this application help panel',
        bind: {
            hidden: '{!hidehelp}'
        }
    }],

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
                reference: 'nominatimcombo',
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
        }, {
            xtype: 'buttongroup',
            //plugins: Ext.create('Ext.ux.BoxReorderer'),
            //padding: '30 0 0 0',
            columns: 1,
            title: 'Search by ID'.translate(),
            items: [{
                xtype: 'textfield',
                listeners: {
                    specialkey: 'onSearchByIDEnter'
                }
            } /*, {
             xtype: 'button',
             reference : 'searchbyidbutton',
             text: 'Search by ID'.translate(),
             ui: 'blue',
             listeners: {
             click: 'onSearchByIDClick'
             }
             }*/]
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
