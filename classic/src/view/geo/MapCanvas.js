Ext.define("Admin.view.geo.MapCanvas", {
    //extend: "Ext.panel.Panel",
    extend: "GeoExt.component.Map",
    alias: 'widget.geo-mapcanvas',

    requires: [
        "Admin.view.geo.MapCanvasController",
        "Admin.view.geo.MapCanvasModel"
    ],

    controller: "geo-mapcanvas",
    viewModel: {
        type: "geo-mapcanvas"
    },

    listeners: {
        beforerender: 'beforeMapCanvasRender'
    },

    initComponent: function () {
        var me = this;

        //<debug>
        console.log('Admin.view.geo.MapCanvas initComponent');
        console.log(me.initialConfig);
        console.log(me.geoExtViewId);
        //</debug>

        var projection = new ol.proj.Projection({
            code: 'EPSG:3763',
            units: 'm',
            axisOrientation: 'neu',
            // Gridset bounds
            // Computed from maximum extent of CRS
            // extent: [-127096.80687006014, -301702.02931375435, 173081.7938279003, 278541.6694684961]
            extent: [-119191.407499, -300404.803999, 162129.0811, 276083.7674]
        });

        var resolutions = [281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],
            matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // ['00', '01', '02', '03', '04', '05', '06', '07','08', '09', '10', '11', '12'],
            extent = [-119191.407499, -300404.803999, 162129.0811, 276083.7674],
            origin = [-119191.407499, 276083.7674];

        var pt_tm_06_grid = new ol.tilegrid.WMTS({
            origin: origin,
            resolutions: resolutions,
            matrixIds: matrixIds
        });

        var osm = new ol.layer.Tile({
            // para o layer switcher
            name: 'OpenStreetMap', // Legend Tree
            title: 'OpenStreetMap', // Layer Switcher
            type: 'base',
            visible: true,
            //
            source: new ol.source.WMTS({
                url: 'http://{a-d}.geomaster.pt/mapproxy/wmts/osm/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
                layer: 'osm', // mapproxy layer
                attributions: [new ol.Attribution({
                    html: "© contribuidores do OpenStreetMap"
                })],
                requestEncoding: 'REST',
                matrixSet: 'pt_tm_06', // mapproxy grid
                format: 'image/png',
//                    projection: projection,
                extent: extent,
                tileGrid: pt_tm_06_grid
            })
        });

        var parque = new ol.layer.Tile({
            name: 'Parque Urbano', // Legend Tree
            title: 'Parque Urbano', // Layer Switcher
            source: new ol.source.TileWMS({
                url: 'http://softwarelivre.cm-agueda.pt/geoserver/ide_local/wms',
                params: {'LAYERS': 'ppgis_pu'},
                serverType: 'geoserver',
                crossOrigin: 'anonymous',
                attributions: [new ol.Attribution({
                    html: "UT-SIG, Município de Águeda"
                })]
            })
        });

        me.map = new ol.Map({
            controls: ol.control.defaults().extend([
                new ol.control.ZoomToExtent({
                    extent: [-36000, 91900, -9000, 114000]
                })
            ]),
            //layers: [osm, parque],
            layers: [],
            view: new ol.View({
                projection: projection,
                center: [-26000, 100800],
                zoom: 10
            }),
            interactions: ol.interaction.defaults({doubleClickZoom: false})
        });
        // https://github.com/walkermatt/ol3-layerswitcher
        var layerSwitcher = new ol.control.LayerSwitcher({
            tipLabel: 'Legenda'
        });
        me.map.addControl(layerSwitcher);

        me.callParent();
    }

});
