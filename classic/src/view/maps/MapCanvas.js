Ext.define("Admin.view.maps.MapCanvas", {
    //extend: "Ext.panel.Panel",
    extend: "GeoExt.component.Map",
    alias: 'widget.mapcanvas',

    requires: [
        "Admin.view.maps.MapCanvasController",
        "Admin.view.maps.MapCanvasModel"
    ],

    controller: "mapcanvas",
    viewModel: {
        type: "mapcanvas"
    },

    listeners: {
        beforerender: 'beforeMapCanvasRender'
    },

    initComponent: function () {
        var me = this;

        //<debug>
        console.log('Admin.view.maps.MapCanvas initComponent');
        console.log(me.initialConfig);
        console.log(me.geoExtViewId);
        //</debug>

        var projection = new ol.proj.Projection({
            code: 'EPSG:3763',
            extent: [-127104, -301712, 173088, 278544],
            units: 'm'
        });

        me.map = new ol.Map({
            controls: ol.control.defaults().extend([
                new ol.control.ZoomToExtent({
                    extent: [-36000, 91900, -9000, 114000]
                }),
                //new ol.control.ZoomSlider(),
                //new ol.control.ScaleLine(),
                new ol.control.MapScale(),
                new ol.control.MousePosition({
                    coordinateFormat: ol.coordinate.createStringXY(0)
                })
            ]),
            layers: [],
            view: new ol.View({
                projection: projection,
                resolutions: [1399.9999999999998, 699.9999999999999, 419.99999999999994, 280.0, 140.0, 55.99999999999999, 27.999999999999996, 13.999999999999998, 6.999999999999999, 2.8, 1.4, 0.5599999999999999, 0.27999999999999997, 0.13999999999999999, 0.055999999999999994],
                center: [-26557, 100812],
                resolution: 13.999999999999998
            }),
            interactions: ol.interaction.defaults({doubleClickZoom: false})
        });

        //// https://github.com/walkermatt/ol3-layerswitcher
        //var layerSwitcher = new ol.control.LayerSwitcher({
        //    tipLabel: 'Legenda'
        //});
        //me.map.addControl(layerSwitcher);

        me.callParent();
    },

    getCurrentScale: function () {
        var map = this.getMap();
        var view = map.getView();
        var resolution = view.getResolution();
        var units = map.getView().getProjection().getUnits();
        var dpi = 25.4 / 0.28;
        var mpu = ol.proj.METERS_PER_UNIT[units];
        var scale = resolution * mpu * 39.37 * dpi;
        return scale;
    }

});
