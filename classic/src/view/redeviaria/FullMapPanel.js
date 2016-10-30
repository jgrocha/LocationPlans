Ext.define("Admin.view.redeviaria.FullMapPanel", {
    extend: "Admin.view.maps.FullMapPanel",
    alias: 'widget.fullmap-redeviaria',

    requires: [
        "Admin.view.redeviaria.FullMapPanelController",
        "Admin.view.redeviaria.FullMapPanelModel"
    ],

    controller: "fullmap-redeviaria",
    viewModel: {
        type: "fullmap-redeviaria"
    },

    dockedItems: [{
        xtype: 'toolbar',
        padding: '2 2 2 2',
        dock: 'top',
        //overflowHandler: 'menu',
        items: [{
            xtype: 'buttongroup',
            //padding: '30 10 10 10',
            //margin: '10 10 10 10',
            columns: 24,
            title: 'Select {diadasemana} and {hora}',
            //iconCls: 'x-fa fa-edit',
            frame: true,
            items: [ {
                xtype: 'button',
                iconCls: 'x-fa fa-calendar',
                ui: 'gray',
                scale: 'small',
                colspan: 3,
                text: '0',
                listeners: {
                    click: 'onDiaDaSemana'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-calendar',
                ui: 'gray',
                scale: 'small',
                colspan: 3,
                text: '1',
                listeners: {
                    click: 'onDiaDaSemana'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-calendar',
                ui: 'gray',
                scale: 'small',
                colspan: 3,
                text: '2',
                listeners: {
                    click: 'onDiaDaSemana'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-calendar',
                ui: 'gray',
                scale: 'small',
                colspan: 3,
                text: '3',
                listeners: {
                    click: 'onDiaDaSemana'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-calendar',
                ui: 'gray',
                scale: 'small',
                colspan: 3,
                text: '4',
                listeners: {
                    click: 'onDiaDaSemana'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-calendar',
                ui: 'gray',
                scale: 'small',
                colspan: 3,
                text: '5',
                listeners: {
                    click: 'onDiaDaSemana'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-calendar',
                ui: 'gray',
                scale: 'small',
                colspan: 6,
                text: '6',
                listeners: {
                    click: 'onDiaDaSemana'
                }
            }, //---------------------------------------------------------------------------------
                {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '0',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '1',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '2',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '3',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '4',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '5',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '6',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '7',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '8',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '9',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '10',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '11',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '12',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '13',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '14',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '15',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '16',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '17',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '18',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '19',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '20',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '21',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '22',
                listeners: {
                    click: 'onHora'
                }
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-hourglass-half',
                ui: 'gray',
                scale: 'small',
                text: '23',
                listeners: {
                    click: 'onHora'
                }
            }]
        }],
        layout: {
            type: 'hbox',
            pack: 'start',
            align: 'stretch'
        }
    }]
});
