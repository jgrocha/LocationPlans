Ext.define("Admin.view.geo.MapPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.geo-map',

    requires: [
        "Admin.view.geo.MapPanelController",
        "Admin.view.geo.MapPanelModel"
    ],

    layout: 'responsivecolumn',

    controller: "geo-map",
    viewModel: {
        type: "geo-map"
    },

    listeners: {
        beforedeactivate: 'onBeforeDeactivate'
    },

    //title: 'Gestão Urbanística',

    initComponent: function () {
        var me = this;
        console.log('Admin.view.geo.MapPanel initComponent');
        console.log(me.initialConfig);
        console.log(me.initialConfig.routeId);

        var res = me.initialConfig.routeId.match(/\d+$/);
        if (res && res[0] && parseInt(res[0]) > 0) {
            me.geoExtViewId = parseInt(res[0]);
            console.log(me.geoExtViewId);
        } else {
            me.geoExtViewId = null;
        }

        var canvas;
        var mapgrid;
        if (me.geoExtViewId == 20) {
            canvas = {
                xtype: 'geo-mapcanvas-gu',
                geoExtViewId: me.geoExtViewId,
                region: 'center',
                collapsible: false
            };
            mapgrid = {
                xtype: 'geo-mapgrid-gu'
                //reference: 'geo-mapgrid',
                //responsiveCls: 'big-100'
            };
        } else {
            canvas = {
                xtype: 'geo-mapcanvas',
                geoExtViewId: me.geoExtViewId,
                region: 'center',
                collapsible: false
            };
            mapgrid = {
                xtype: 'geo-mapgrid',
                reference: 'geo-mapgrid',
                responsiveCls: 'big-60'
            };
        }

        me.items = [{
            title: 'Mapa',
            layout: 'fit',
            border: false,
            responsiveCls: 'big-100',
            items: [{
                xtype: 'container',
                layout: 'border',
                height: 600,
                items: [ canvas, {
                    xtype: 'geo-tree',
                    region: 'east',
                    width: 150,
                    collapsible: true,
                    collapsed: true,
                    minWidth: 100,
                    maxWidth: 200
                    //html: 'Legend',
                    //responsiveCls: 'big-40'
                }]
            }],
            tools: [{
                xtype: 'tool',
                toggleValue: false,
                cls: 'x-fa fa-info-circle dashboard-tools',
                listeners: {
                    click: 'onGetFeatureInfo'
                },
                width: 20,
                height: 20
            }, {
                xtype: 'tool',
                toggleValue: false,
                cls: 'x-fa fa-refresh dashboard-tools',
                width: 20,
                height: 20
            }, {
                xtype: 'tool',
                cls: 'x-fa fa-wrench dashboard-tools',
                width: 20,
                height: 20
            }]
        },
            mapgrid
        ];

        /*
         me.items = [{
         title: 'GeoExt.component.OverviewMap Example',
         layout: 'fit',
         border: false,
         responsiveCls: 'big-100',
         items: [{
         xtype: 'geo-mapcanvas',
         geoExtViewId: me.geoExtViewId,
         //responsiveCls: 'big-100',
         height: 600 // good to know
         }],
         tools: [{
         xtype: 'tool',
         toggleValue: false,
         cls: 'x-fa fa-info-circle dashboard-tools',
         listeners: {
         click: 'onGetFeatureInfo'
         },
         width: 20,
         height: 20
         }, {
         xtype: 'tool',
         toggleValue: false,
         cls: 'x-fa fa-refresh dashboard-tools',
         width: 20,
         height: 20
         }, {
         xtype: 'tool',
         cls: 'x-fa fa-wrench dashboard-tools',
         width: 20,
         height: 20
         }]
         }, {
         xtype: 'geo-mapgrid',
         reference: 'geo-mapgrid',
         responsiveCls: 'big-60'
         }, {
         xtype: 'geo-tree',
         //html: 'Legend',
         responsiveCls: 'big-40'
         }];
         */

        me.callParent();
    }
});
