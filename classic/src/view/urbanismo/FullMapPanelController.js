Ext.define('Admin.view.urbanismo.FullMapPanelController', {
    extend: 'Admin.view.maps.FullMapPanelController',
    alias: 'controller.fullmap-urbanismo',

    onHelp: function (panel) {
        console.log('onHelp');
        var me = this; // ViewController

        var vm = me.getViewModel();
        var fn = vm.get('current.user.preferencias');
        var prefObj = {};
        // var fn = JSON.parse('{"urbanismo":{"hidehelp":false},"plantas":{"color":"red"},"sensor":{"unit":"metric","period":"day"}}');
        if (fn) {
            prefObj = JSON.parse(fn);
            prefObj["urbanismo"]["hidehelp"] = false;
        } else {
            prefObj["urbanismo"] = {
                "hidehelp": false
            }
        }
        vm.set('current.user.preferencias', JSON.stringify(prefObj));

    },

    onAfterLayersLoaded: function (view) {
        var me = this;
        console.log('afterlayersloaded()@fullmap-urbanismo');

        var olMap = view.map;
        // var vm = view.getViewModel();
        var vm = me.getView().getViewModel();

        //var vmurbanismo = view.up('urbanismo').getViewModel();

        console.log('Urbanismo FullMapPanle Controller ViewModel onAfterLayersLoaded');
        console.log(vm);

        var styleFunction = (function () {
            var styles = {};
            return function (feature) {
                var res;
                if (feature instanceof ol.Feature) {
                    var text = "";
                    if (feature.get('fotografias') > 0) {
                        text = feature.get('fotografias') + "";
                    }
                    styles['Edificio'] = [new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: [255, 153, 0, 0.4]
                        }),
                        stroke: new ol.style.Stroke({
                            color: [255, 153, 0, 1],
                            width: 2
                        })/*,
                         text: new ol.style.Text({
                         text: text
                         })*/
                    })];
                    styles['Anexo'] = [new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: [204, 153, 0, 0.4]
                        }),
                        stroke: new ol.style.Stroke({
                            color: [204, 153, 0, 1],
                            width: 2
                        })/*,
                         text: new ol.style.Text({
                         text: text
                         })*/
                    })];
                    styles['default'] = [new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: 'red',
                            width: 3
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 0, 0, 0.1)'
                        })/*,
                         text: new ol.style.Text({
                         text: text
                         })*/
                    })];
                    res = styles[feature.get('uso')] || styles['default'];
                    if (feature.get('fotografias') > 0) {
                        res.push(new ol.style.Style({
                            image: new ol.style.Icon({
                                src: 'resources/images/icons/applications-photography.svg'
                            }),
                            geometry: function (feature) {
                                // return the coordinates of the first ring of the polygon
                                // var coordinates = feature.getGeometry().getCoordinates()[0];
                                var center = ol.extent.getCenter(feature.getGeometry().getExtent());
                                return new ol.geom.Point(center);
                            }
                        }));
                    }
                    return res;
                }
            };
        })();

        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON({
                defaultDataProjection: 'EPSG:3763'
            }),
            url: function (extent) {
                return 'http://geoserver.sig.cm-agueda.pt:8080/geoserver/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename=marte:edificado_vti2&' +
                    'outputFormat=application/json&srsname=EPSG:3763&' +
                    'EXCEPTIONS=application/json&' +
                    'bbox=' + extent.join(',') + ',EPSG:3763';
            },
            strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ())
        });

        var vectorWFS = new ol.layer.Vector({
            title: 'Edificado WFS',
            name: 'Edificado WFS--',  // não mostrar na legend tree
            source: vectorSource,
            style: styleFunction,
            maxResolution: 1.09956468849 // 2.199129376979828 // The maximum resolution (exclusive) below which this layer will be visible.
        });

        olMap.addLayer(vectorWFS);

        var featureStore = Ext.create('GeoExt.data.store.Features', {
            layer: vectorWFS,
            map: olMap
        });

        var grid = view.up('urbanismo').down('urbanismogridedificado');
        console.log(grid);
        grid.setStore(featureStore);

        featureStore.clearFilter();
        var selectedFeatures = [];
        featureStore.filterBy(function (record, id) {
            return Ext.Array.indexOf(selectedFeatures, record.get("gid")) !== -1;
        }, this);

        //var grid = view.up('urbanismo').down('mapgridurbanismo');
        //console.log(grid);
        //grid.setStore(featureStore);

        // enable select elements
        var selectSingleClick = new ol.interaction.Select({
            layers: [vectorWFS]
        });
        olMap.addInteraction(selectSingleClick);

        selectSingleClick.on('select', function (e) {
            selectedFeatures = [];
            e.target.getFeatures().forEach(function (feature, idx, a) {
                // console.log('selected → ' + feature.get('gid'));
                selectedFeatures.push(feature.get('gid'));
                // console.log(selectedFeatures);
            }, view);

            featureStore.filterBy(function (record, id) {
                return Ext.Array.indexOf(selectedFeatures, record.get("gid")) !== -1;
            }, this);

            // console.log(featureStore.count());
        });

        var nominatimLayer = new ol.layer.Vector({
            source: new ol.source.Vector({}),
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    //anchor: [0.5, 1],
                    src: 'resources/images/location-icon-24.svg'
                })
            })
        });
        olMap.addLayer(nominatimLayer);
        vm.set('nominatimLayer', nominatimLayer);

    },

    onSearchByIDEnter: function(field, e) {
        var me = this;
        if (e.getKey() == e.ENTER) {
            console.log('Search by ID');
            var key = field.getValue();
            console.log(key);
            if (key) {
                Server.Urbanismo.Urbanismo.readEdificioByID({
                    id: key
                }, function (result, event) {
                    if (result) {
                        if (result.success) {
                            // Ext.Msg.alert('Successo', 'As alterações foram gravadas com sucesso.');
                            console.log(result);

                            if (result.total == 1) {

                                var spot = [result.data[0]["st_x"], result.data[0]["st_y"]];
                                var vm = me.getView().getViewModel();
                                var vectorLayer = vm.get('nominatimLayer');
                                var geoMarker = new ol.Feature({
                                    geometry: new ol.geom.Point(spot)
                                });
                                vectorLayer.getSource().addFeature(geoMarker);
                                //
                                var map = me.getView().down('mapcanvas').map;
                                var mapView = map.getView();

                                var pan = ol.animation.pan({
                                    duration: 2000,
                                    source: mapView.getCenter()
                                });
                                map.beforeRender(pan);
                                mapView.setCenter(spot);

                                var zoom = ol.animation.zoom({
                                    duration: 2000,
                                    resolution:  mapView.getResolution()
                                });
                                map.beforeRender(zoom);
                                mapView.setResolution(0.27999999999999997);
                            } else {
                                Ext.Msg.alert('Not found'.translate(), 'No building found'.translate());
                            }
                        } else {
                            Ext.Msg.alert('Error'.translate(), 'Error searching building by ID'.translate());
                        }
                    } else {
                        Ext.Msg.alert('Error'.translate(), 'Error searching building by ID'.translate());
                    }
                });
            }
        }
    },

    onSearchNominatim: function (combo, newValue, oldValue, eOpts) {
        var me = this;
        var vm = me.getView().getViewModel();

        console.log('Urbanismo FullMapPanle Controller ViewModel onSearchNominatim');
        console.log(vm);

        console.log('Pesquisa: ' + newValue);
        console.log(newValue);

        var vectorLayer = vm.get('nominatimLayer');
        console.log(vectorLayer);

        // vectorLayer.getSource().clear(true);
        //
        if (Array.isArray(newValue)) {
            //console.log('É um array com ' + newValue.length);

            var spot = ol.proj.transform(newValue, 'EPSG:4326', 'EPSG:3763');
            //console.log(spot);

            var geoMarker = new ol.Feature({
                geometry: new ol.geom.Point(spot)
            });

            vectorLayer.getSource().addFeature(geoMarker);

            //
            var map = me.getView().down('mapcanvas').map;
            var mapView = map.getView();

            var pan = ol.animation.pan({
                duration: 2000,
                source: mapView.getCenter()
            });
            map.beforeRender(pan);
            mapView.setCenter(spot);

            var zoom = ol.animation.zoom({
                duration: 2000,
                resolution:  mapView.getResolution()
            });
            map.beforeRender(zoom);
            mapView.setResolution(0.5599999999999999);


        } else {
            //console.log('Não é um array');
        }
    }

});
