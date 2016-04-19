Ext.define("Admin.view.maps.FullMapPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.fullmap',

    requires: [
        "Admin.view.maps.FullMapPanelController",
        "Admin.view.maps.FullMapPanelModel"
    ],

    controller: "fullmap",
    viewModel: {
        type: "fullmap"
    },

    listeners: {
        beforedeactivate: 'onBeforeDeactivate'
    },

    layout: 'fit',

    initComponent: function () {
        var me = this;
        console.log('Admin.view.maps.FullMapPanel');
        console.log(me.geoExtViewId);

        me.items = [{
            xtype: 'container',
            layout: 'border',
            height: 600,
            items: [{
                xtype: 'mapcanvas',
                // xtype: 'panel',
                //title: 'Mapa',
                //html: 'Aqui vai aparecer o mapa',
                geoExtViewId: me.geoExtViewId,
                region: 'center',
                collapsible: false
            }, {
                xtype: 'maptree',
                //xtype: 'panel',
                //title: 'Mapa',
                //html: 'Aqui vai aparecer o mapa',
                region: 'east',
                width: 150,
                collapsible: true,
                collapsed: false, // true,
                minWidth: 100,
                maxWidth: 200
            }]
        }];

        me.callParent();
    }
});
