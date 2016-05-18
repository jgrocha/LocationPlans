Ext.define('Admin.view.maps.MapCanvasController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mapcanvas',

    init: function () {
        var me = this;
        me.callParent(arguments);
    },

    beforeMapCanvasRender: function (view) {
        //<debug>
        console.log('beforeMapCanvasRender');
        //</debug>
        var me = this;
        var geoLayersStore = view.getViewModel().getStore('geolayers');
        var viewId = 0;
        if (view.hasOwnProperty('geoExtViewId') && (parseInt(view.geoExtViewId) > 0)) {
            viewId = parseInt(view.geoExtViewId);
        }
        geoLayersStore.load({
            params: {
                viewid: viewId
            },
            //callback: me.onLayersStoreLoaded,
            callback: function (records, operation, success) {
                // not used
                var option = {params: {viewid: viewId}};
                me.onLayersStoreLoaded(records, operation, success, option);
                me.setupLayerTreeStoreAndPanel(me.getView());
                //me.addVectorLayer(me.getView());
                // TODO
                // Not necessary for the moment, but instances should be able to use or not use popups...
                me.setupPopupWindow(me.getView());
                // console.log('Disparar o evento: afterlayersloaded');
                view.fireEvent('afterlayersloaded', view);
            },
            scope: me
        });
    },

    onLayersStoreLoaded: function (records, operation, success) {
        //<debug>
        console.log('store loaded');
        console.log(records.length + ' layers foram devolvidos');
        //</debug>

        var me = this;
        var olMap = me.getView().map;

        var projection = olMap.getView().getProjection();

        var continente = new ol.tilegrid.WMTS({
            origin: [-127104, 278544],
            resolutions: [1399.9999999999998, 699.9999999999999, 419.99999999999994, 280.0, 140.0, 55.99999999999999, 27.999999999999996, 13.999999999999998, 6.999999999999999, 2.8, 1.4, 0.5599999999999999, 0.27999999999999997, 0.13999999999999999, 0.055999999999999994],
            matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        });

        var pt_tm_06_grid_mapproxy = new ol.tilegrid.WMTS({
            origin: [-119191.407499, 276083.7674],
            resolutions: [281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306],
            matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        });

        var tileGridGWCGeomaster = new ol.tilegrid.TileGrid({
            origin: [-127096.80687006014, 346847.6135091576],
            extent: [-127096.80687006014, -301702.02931375435, 233208.55025377986, 346847.6135091576],
            resolutions: [281.488560253, 140.744280127, 70.3721400634, 35.1860700317, 17.5930350158, 8.79651750792, 4.39825875396, 2.19912937698, 1.09956468849, 0.549782344245, 0.274891172122, 0.137445586061, 0.0687227930306]
        });

        var tileGridGWCSoftwareLivre = new ol.tilegrid.TileGrid({
            origin: [-119191.4075, 416395.1959999999],
            extent: [-119191.4075, -300404.804, 597608.5924999999, 416395.1959999999],
            resolutions: [2799.9999999999995, 1399.9999999999998, 699.9999999999999, 280.0, 140.0, 70.0, 27.999999999999996, 13.999999999999998, 6.999999999999999, 2.8, 1.4, 0.27999999999999997, 0.13999999999999999, 0.06999999999999999]
        });

        var groups = [];

        function addToGroup(layer, groupid) {
            var existent = null;
            groups.forEach(function (element, index, array) {
                if (element.get('name') == groupid) {
                    //console.log('Bingo!');
                    existent = element;
                }
            });
            if (!existent) {
                //console.log('addToGroup(' + groupid + ') → Novo grupo' + groups.length);
                existent = new ol.layer.Group({
                    name: groupid
                });
                groups.push(existent);
            }
            //console.log('addToGroup(' + groupid + ') → Adicionar ao grupo' + groups.length);
            var layers = existent.getLayers();
            layers.push(layer);
            existent.setLayers(layers);
        }

        var total = records.length;
        var novolayer, legend;
        for (var i = 0; i < total; i++) {
            novolayer = null;
            switch (records[i].get('service')) {
                case 'MapProxy':
                    novolayer = new ol.layer.Tile({
                        getfeatureinfo: records[i].get('getfeatureinfo'),
                        gficolumns: records[i].get('gficolumns'),
                        title: records[i].get('title'), // layer switcher
                        name: records[i].get('title'),  // legend tree
                        type: 'base', // layer switcher
                        visible: records[i].get('visible'),
                        opacity: records[i].get('opacity'),
                        source: new ol.source.WMTS({
                            url: records[i].get('url'),
                            layer: records[i].get('layer'),
                            attributions: [new ol.Attribution({
                                html: records[i].get('attribution')
                            })],
                            projection: projection,
                            requestEncoding: 'REST',
                            matrixSet: 'continente', // mapproxy grid
                            format: 'image/png',
                            tileGrid: continente,
                            crossOrigin: 'anonymous'
                        }),
                        legendUrl: records[i].get('legendurl')
                    });
                    break;
                case 'GWC-CMA':
                    novolayer = new ol.layer.Tile({
                        getfeatureinfo: records[i].get('getfeatureinfo'),
                        gficolumns: records[i].get('gficolumns'),
                        title: records[i].get('title'),
                        name: records[i].get('title'),
                        visible: records[i].get('visible'),
                        opacity: records[i].get('opacity'),
                        source: new ol.source.TileWMS({
                            url: records[i].get('url'),
                            params: {
                                'VERSION': '1.1.1',
                                'LAYERS': records[i].get('layer'),
                                'TILED': true
                            },
                            projection: projection,
                            serverType: 'geoserver',
                            tileGrid: tileGridGWCSoftwareLivre,
                            crossOrigin: 'anonymous'
                        }),
                        legendUrl: records[i].get('legendurl')
                    });
                    break;
                case 'GWC-Geomaster':
                    novolayer = new ol.layer.Tile({
                        getfeatureinfo: records[i].get('getfeatureinfo'),
                        gficolumns: records[i].get('gficolumns'),
                        title: records[i].get('title'),
                        name: records[i].get('title'),
                        visible: records[i].get('visible'),
                        opacity: records[i].get('opacity'),
                        source: new ol.source.TileWMS({
                            url: records[i].get('url'),
                            params: {
                                'VERSION': '1.1.1',
                                'LAYERS': records[i].get('layer'),
                                'TILED': true
                            },
                            projection: projection,
                            serverType: 'geoserver',
                            tileGrid: continente,
                            crossOrigin: 'anonymous'
                        }),
                        legendUrl: records[i].get('legendurl')
                    });
                    break;
                case 'WMS':
                    if (records[i].get('legendurl')) {
                        legend = records[i].get('legendurl');
                    } else {
                        legend = records[i].get('url') + '?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + records[i].get('layer');
                    }
                    console.log("typeof records[i].get('singletile') → " + typeof records[i].get('singletile'));
                    if (records[i].get('singletile')) {
                        console.log("Layer SINGLETILE: " + records[i].get('title') + " → records[i].get('singletile') → " + records[i].get('singletile'));
                        novolayer = new ol.layer.Image({
                            getfeatureinfo: records[i].get('getfeatureinfo'),
                            gficolumns: records[i].get('gficolumns'),
                            title: records[i].get('title'),
                            name: records[i].get('title'),
                            visible: records[i].get('visible'),
                            opacity: records[i].get('opacity'),
                            source: new ol.source.ImageWMS({
                                ratio: 1,
                                url: records[i].get('url'),
                                params: {
                                    format: 'image/png',
                                    'VERSION': '1.1.1',
                                    STYLES: records[i].get('style'),
                                    LAYERS: records[i].get('layer')
                                },
                                projection: projection,
                                crossOrigin: 'anonymous',
                                attributions: [new ol.Attribution({
                                    html: records[i].get('attribution')
                                })]
                            })
                        });
                    } else {
                        console.log("Layer TILED: " + records[i].get('title') + " → records[i].get('singletile') → " + records[i].get('singletile'));
                        novolayer = new ol.layer.Tile({
                            getfeatureinfo: records[i].get('getfeatureinfo'),
                            gficolumns: records[i].get('gficolumns'),
                            title: records[i].get('title'),
                            name: records[i].get('title'),
                            visible: records[i].get('visible'),
                            opacity: records[i].get('opacity'),
                            source: new ol.source.TileWMS({
                                url: records[i].get('url'),
                                params: {
                                    VERSION: '1.1.1',
                                    tiled: true,
                                    STYLES: records[i].get('style'),
                                    LAYERS: records[i].get('layer')
                                },
                                //serverType: 'geoserver',
                                projection: projection,
                                crossOrigin: 'anonymous',
                                attributions: [new ol.Attribution({
                                    html: records[i].get('attribution')
                                })]
                            }),
                            legendUrl: legend
                        });
                    }
                    break;
                case 'OSM':
                    break;
                case 'Stamen':
                    break;
                default:
                    console.log('Tipo desconhecido: ' + records[i].data.tipo);
                    break;
            }
            if (novolayer) {
                if (records[i].get('layergroup')) {
                    //console.log('layergroup → ' + records[i].get('layergroup'));
                    addToGroup(novolayer, records[i].get('layergroup'));
                } else {
                    olMap.addLayer(novolayer);
                }
            }
        }

        groups.forEach(function (element, index, array) {
            olMap.addLayer(element);
        });

        //olMap.getView().on('change:resolution', function (e) {
        //    console.log('change:resolution → ' + e.oldValue + ' → ' + olMap.getView().getResolution());
        //    console.log('Escala 1:' + Math.round(me.getView().getCurrentScale()));
        //});

    },

    setupLayerTreeStoreAndPanel: function (view) {
        //<debug>
        console.log('setupLayerTreeStoreAndPanel');
        //</debug>
        var me = this;
        var vm = view.up('fullmap').getViewModel();
        var olMap = view.map;

        var treeStore = Ext.create('GeoExt.data.store.LayersTree', {
            layerGroup: olMap.getLayerGroup()
        });
        //vm.setStores({'treeStore': treeStore});
        vm.setStores(Ext.apply(vm.getStores(), {'treeStore': treeStore}));

        var tree = view.up('fullmap').down('maptree');
        tree.setStore(treeStore);
    },

    setupPopupWindow: function (view) {
        //<debug>
        console.log('setupPopupWindow');
        //</debug>
        var me = this;
        var vm = view.up('fullmap').getViewModel();
        var olMap = view.map;

        me.popupwindow = null;

        olMap.getViewport().addEventListener("dblclick", function (e) {
            var windows = Ext.ComponentQuery.query('popup-window');
            if (windows.length > 0) {
                me.popupwindow = windows[0];
            } else {
                console.log('Vou criar um novo popup');
                me.popupWindow = Ext.create('Admin.view.geo.PopupWindow');
            }
            var position = olMap.getEventPixel(e);
            var coordinate = olMap.getEventCoordinate(e);
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
            me.popupWindow.setPosition(position[0] + me.getView().getX(), position[1] + me.getView().getY(), {});
            //console.log(me.getView().getConstrainRegion());
            //console.log(view.getConstrainRegion());
            me.popupWindow.setTitle(hdms);
            me.popupWindow.show();
            me.popupWindow.doConstrain(me.getView().getConstrainRegion());
            me.popupWindow.constrain = true;

            // clean both grids
            var source = null;
            var v = me.popupWindow.getViewModel();
            var s = v.getStore('gfinfo');
            s.removeAll();
            // not necessary, if deferEmptyText: false
            //var propertyGrid = me.popupWindow.down('#propertyGrid');
            //propertyGrid.getStore().removeAll();

            var mapView = olMap.getView();
            var viewResolution = mapView.getResolution();

            olMap.forEachLayerAtPixel(position, function (layer) {
                //console.log('LayerAtPixel → ' + layer.get('title') + ' → ' + layer.get('getfeatureinfo'));
                //console.log(layer);
                if (layer.get('getfeatureinfo')) {
                    console.log('Request GFI from layer → ' + layer.get('title'));
                    source = layer.getSource();
                    var url = source.getGetFeatureInfoUrl(
                        coordinate, viewResolution, mapView.getProjection(),
                        {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50});
                    if (url) {
                        //console.log(url);
                        //console.log('Request GFI → ' + url);
                        s.getProxy().setUrl(url);
                        s.load({
                            addRecords: true,
                            scope: this,
                            callback: function (records, operation, success) {
                                var option = {
                                    params: {
                                        layer: layer.get('title'),
                                        columns: layer.get('gficolumns')
                                    }
                                };
                                me.onGFIStoreLoadedCallback(records, operation, success, option);

                                if (records.length > 0) {
                                    var grid = me.popupWindow.down('#featureGrid');
                                    var sm = grid.getSelectionModel();
                                    sm.select(0);
                                }

                            }
                        });
                    }
                }
            });
        });

        olMap.on('pointerdrag', function () {
            if (me.popupWindow) {
                me.popupWindow.hide();
            }
        });

        olMap.on('moveend', function () {
            if (me.popupWindow) {
                me.popupWindow.hide();
            }
        });

    },

    /**
     * Called for each GetFeatureRequest for each layer
     */
    onGFIStoreLoadedCallback: function (records, operation, success, eOpts) {
        //<debug>
        console.log('onGFIStoreLoaded store loaded');
        //</debug>
        if (success) {
            var fields2show = eOpts.params.columns;
            console.log(fields2show);
            //dtmn11, fr11, ss11 | Subseção , bgri11, lug11, lug11desig | Lugar
            //dicofre | Cód. DI-CO-FRE, freguesia | Freguesia, concelho | Concelho, distrito | Distrito, area | Área, nut1, nut2, nut3
            if (fields2show) {
                var fields = fields2show.split(/ *, */);
                var onlyfields = fields.map(function (obj) {
                    return obj.split(/ *\| */)[0];
                });
                // maybe more than one feature is returned for the same layer
                for (var i = 0; i < records.length; i++) {
                    // Ext.data.Model geo.Feature hasMany config
                    var storeproperty = records[i].featureproperty();
                    var toremove = [];
                    storeproperty.each(function (record, idx) {
                        var val = record.get('prop');
                        var idx = onlyfields.indexOf(val);
                        if (idx > -1) {
                            var a = fields[idx].split(/ *\| */);
                            if (a.length == 2) {
                                record.set('prop', a[1]);
                                record.commit();
                            }
                        } else {
                            toremove.push(record);
                        }
                    });
                    storeproperty.remove(toremove);
                }
            }
        }
    }

});
