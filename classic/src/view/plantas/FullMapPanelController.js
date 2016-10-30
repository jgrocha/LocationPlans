Ext.define('Admin.view.plantas.FullMapPanelController', {
    extend: 'Admin.view.maps.FullMapPanelController',
    alias: 'controller.fullmap-plantas',
    requires: ['GeoExt.data.MapfishPrintProvider',
        'GeoExt.data.serializer.ImageWMS',
        'GeoExt.data.serializer.TileWMS',
        'GeoExt.data.serializer.Vector',
        'GeoExt.data.serializer.WMTS',
        'GeoExt.data.serializer.XYZ',
        'Ext.form.action.StandardSubmit'],

    listen: {
        controller: {
            'plantas': {
                loaddraw: 'onLoadDrawClick'
                //redownload: 'onReDownloadClick'
            },
            // 'confrontacao': {
            //     printconfrontacao: 'onPedidoId'
            // },
            'ogre': {
                uploadSuccessful: 'onUploadSuccessful'
            }
        }
    },

    control: {
        '#': {  // matches the view itself
            requestprintid: 'onPrintPlanta',
            requestprintidconfrontacao: 'onPrintPlantaConfrontacao',
            previewconfrontacao: 'onPreviewConfrontacao'
        }
    },

    onUploadSuccessful: function (json) {
        var me = this;
        console.log('onUploadSuccessful');
        var view = me.getView();
        var vm = view.getViewModel();
        var olMap = view.down('mapcanvas').map;

        var printrequestdetaillayer = vm.get('printrequestdetaillayer');
        var features = (new ol.format.GeoJSON()).readFeatures(json);
        console.log(features);
        printrequestdetaillayer.getSource().addFeatures(features);

        var pan = ol.animation.pan({
            duration: 1000,
            source: olMap.getView().getCenter()
        });
        var zoom = ol.animation.zoom({duration: 1000, resolution: olMap.getView().getResolution()});
        olMap.beforeRender(pan, zoom);
        // olMap.beforeRender(pan);
        var extent = printrequestdetaillayer.getSource().getExtent();
        olMap.getView().fit(extent, olMap.getSize());


    },

    doLoadDraw: function (gid, pretensao) {
        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();
        var olMap = view.down('mapcanvas').map;
        var geo = (new ol.format.GeoJSON()).readGeometry(pretensao);
        //console.log(geo.getCoordinates());
        var mapView = olMap.getView();
        var printrequestdetaillayer = vm.get('printrequestdetaillayer');
        var features = printrequestdetaillayer.getSource().getFeatures();
        //console.log(features.length);
        printrequestdetaillayer.getSource().clear();
        var pan = ol.animation.pan({
            duration: 1000,
            source: mapView.getCenter()
        });
        olMap.beforeRender(pan);
        mapView.setCenter(geo.getCoordinates());
        Server.Plantas.Pedidos.asGeoJsonDetail({
            gid: gid
        }, function (result, event) {
            if (result.success) {
                //console.log('SEM Problema no Server.Plantas.Pedidos.asGeoJsonDetail', result.message);
                //console.log(result);
                if (result.data.features) {
                    var features = (new ol.format.GeoJSON()).readFeatures(result.data);
                    //console.log(features);
                    printrequestdetaillayer.getSource().addFeatures(features);
                }
            } else {
                console.log('Problema no Server.Plantas.Pedidos.asGeoJsonDetail', result.message);
            }
        });
    },

    onLoadDrawClick: function (gid, pretensao) {
        //console.log('onLoadDrawClick');
        //console.log(arguments);
        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();
        var olMap = view.down('mapcanvas').map;
        var geo = (new ol.format.GeoJSON()).readGeometry(pretensao);
        //console.log(geo.getCoordinates());
        var mapView = olMap.getView();
        var printrequestdetaillayer = vm.get('printrequestdetaillayer');
        var features = printrequestdetaillayer.getSource().getFeatures();
        //console.log(features.length);
        if (features.length > 0) {
            Ext.Msg.confirm('Recuperar edições anteriores', 'Já existem elementos desenhados.<br/>Quer perder os elementos desenhados e recuperar o pedido?', function (action, value) {
                //console.log(arguments);
                if (action === 'yes') {
                    me.doLoadDraw(gid, pretensao);
                }
            });
        } else {
            me.doLoadDraw(gid, pretensao);
        }
    },

    onChangeGeometry: function (combo, newValue, oldValue, eOpts) {
        console.log('onChangeGeometry: ' + newValue);
        var me = this;

        var view = this.getView();
        var vm = view.getViewModel();
        var olMap = view.down('mapcanvas').map;
        var center = olMap.getView().getCenter();
        var printrequestdetaillayer = vm.get('printrequestdetaillayer');

        var draw = vm.get('draw');
        var selectInteraction = vm.get('selectInteraction');
        var modify = vm.get('modify');

        //function addInteraction() {
        //    var value = newValue;
        //    if (value !== 'None') {
        //        var geometryFunction, maxPoints;
        //        if (value === 'Square') {
        //            value = 'Circle';
        //            geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
        //        } else if (value === 'Box') {
        //            value = 'LineString';
        //            maxPoints = 2;
        //            geometryFunction = function(coordinates, geometry) {
        //                if (!geometry) {
        //                    geometry = new ol.geom.Polygon(null);
        //                }
        //                var start = coordinates[0];
        //                var end = coordinates[1];
        //                geometry.setCoordinates([
        //                    [start, [start[0], end[1]], end, [end[0], start[1]], start]
        //                ]);
        //                return geometry;
        //            };
        //        }
        //        draw = new ol.interaction.Draw({
        //            source: printrequestdetaillayer.getSource(),
        //            type: /** @type {ol.geom.GeometryType} */ (value),
        //            geometryFunction: geometryFunction,
        //            maxPoints: maxPoints
        //        });
        //        olMap.addInteraction(draw);
        //        vm.set('draw', draw);
        //    }
        //}

        function addInteraction() {
            if (newValue != 'None') {
                draw = new ol.interaction.Draw({
                    //features: features,
                    source: printrequestdetaillayer.getSource(),
                    type: /** @type {ol.geom.GeometryType} */ (newValue)
                });
                olMap.addInteraction(draw);
                vm.set('draw', draw);
            } else {
                olMap.addInteraction(selectInteraction);
                olMap.addInteraction(modify);
            }
        }

        olMap.removeInteraction(draw);
        olMap.removeInteraction(modify);
        olMap.removeInteraction(selectInteraction);

        addInteraction();

    },

    onChangePurpose: function (combo, newValue, oldValue, eOpts) {
        console.log('onChangePurpose: ' + newValue);
        var me = this;
        var view = this.getView();
        var vm = view.getViewModel();
        vm.set('selectedPurpose', newValue);
        if (newValue == 4) {
            vm.set('enablePreview', 1);
            // vm.set('printlabel', 'Preview'.translate());
        } else {
            vm.set('enablePreview', 0);
            // vm.set('printlabel', 'PDF document'.translate());
        }
    },

    onUpload: function (item, e, eOpts) {
        console.log('onUpload');

        var view = Ext.widget('ogre');
        view.show();

    },

    onImportProcess: function (item, e, eOpts) {
        console.log('onImportProcess');
    },

    onDeleteLast: function (item, e, eOpts) {
        //console.log('Apaga tudo');
        var me = this;
        var view = this.getView();
        var vm = view.getViewModel();
        var olMap = view.down('mapcanvas').map;
        var center = olMap.getView().getCenter();
        var printrequestdetaillayer = vm.get('printrequestdetaillayer');
        var features = printrequestdetaillayer.getSource().getFeatures();
        //console.log(features.length);
        //console.log(features);
        if (features.length) {
            var last = features[features.length - 1];
            printrequestdetaillayer.getSource().removeFeature(last);
            printrequestdetaillayer.getSource().changed();
        }
    },

    onDeleteAll: function (item, e, eOpts) {
        //console.log('Apaga tudo');
        var me = this;
        var view = this.getView();
        var vm = view.getViewModel();
        var olMap = view.down('mapcanvas').map;
        var center = olMap.getView().getCenter();
        var printrequestdetaillayer = vm.get('printrequestdetaillayer');
        printrequestdetaillayer.getSource().clear();
        printrequestdetaillayer.getSource().changed();
    },

    onSearchNominatim: function (combo, newValue, oldValue, eOpts) {
        var me = this;
        var vm = me.getView().getViewModel();

        //console.log('Pesquisa: ' + newValue);
        //console.log(newValue);

        var vectorLayer = vm.get('nominatimLayer');
        vectorLayer.getSource().clear(true);

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
                duration: 1000,
                source: mapView.getCenter()
            });
            map.beforeRender(pan);
            mapView.setCenter(spot);


        } else {
            //console.log('Não é um array');
        }
    },

    onConfrontacaoPreview: function (item, e, eOpts) {
        console.log('onConfrontacaoPreview');
        console.log(arguments);
        var me = this;

        Ext.apply(eOpts, {
            preview: true
        });

        me.onPrintCheck(item, e, eOpts);
    },

    onPrintCheck: function (item, e, eOpts) {
        var me = this;
        var view = this.getView();
        var vm = view.getViewModel();
        var user = vm.get('current.user');
        //console.log(user);
        var userid = vm.get('current.user.id');
        //console.log(userid);

        var olMap = view.down('mapcanvas').map;
        var center = olMap.getView().getCenter();
        var pedidoLayer = vm.get('pedidoLayer');
        var printrequestdetaillayer = vm.get('printrequestdetaillayer');

        var purposeId = vm.get('selectedPurpose');
        var store = vm.getStore('purpose');
        var purposeName = store.getById(purposeId).get('name');
        console.log(purposeId, purposeName);

        var features = printrequestdetaillayer.getSource().getFeatures();
        var numOfPolygons = 0;
        for (var i = 0; i < features.length; i++) {
            var geotype = features[i].getGeometry().getType();
            if (geotype == 'Polygon') {
                numOfPolygons += 1;
            }
        }
        console.log("#polygons: ", numOfPolygons);
        if (vm.get('modified')) {
            console.log('Features criados/editados');
        } else {
            console.log('Features NÃO criados/editados');
        }
        switch (purposeId) {
            case 1:
            case 2:
            case 3:
                me.getPrintRequestId(item, e, eOpts);
                break;
            case 4:
                if (numOfPolygons > 0) {
                    me.getPrintRequestId(item, e, eOpts);
                } else {
                    Ext.Msg.alert('No polygon added/designed'.translate(), 'You must import or draw a polygon'.translate());
                }
                break;
        }
    },

    getPrintRequestId: function (item, e, eOpts) {
        var me = this;
        var view = this.getView();
        var vm = view.getViewModel();
        var user = vm.get('current.user');
        //console.log(user);
        var userid = vm.get('current.user.id');
        //console.log(userid);

        var olMap = view.down('mapcanvas').map;
        var center = olMap.getView().getCenter();
        var pedidoLayer = vm.get('pedidoLayer');
        var printrequestdetaillayer = vm.get('printrequestdetaillayer');

        var purposeId = vm.get('selectedPurpose');
        var store = vm.getStore('purpose');
        var purposeName = store.getById(purposeId).get('name');
        // console.log(purposeId, purposeName);

        var newfeature = {};
        var username;

        if (userid) {
            username = vm.get('current.user.nome');
            newfeature = {
                geometry: new ol.geom.Point(center),
                nome: username,
                nif: vm.get('current.user.nif'),
                utilizador: vm.get('current.user.email'),
                userid: userid,
                coord_x: center[0],
                coord_y: center[1],
                tipo: purposeId,
                obs: 'Pedido via internet'
            };
        } else {
            username = '-';
            newfeature = {
                geometry: new ol.geom.Point(center),
                nome: username,
                utilizador: 'Anonymous', // required
                coord_x: center[0],
                coord_y: center[1],
                tipo: purposeId,
                obs: 'Pedido via internet'
            };
        }

        var thecenterfeature = new ol.Feature(newfeature);
        pedidoLayer.getSource().addFeature(thecenterfeature);

        var dados = (new ol.format.GeoJSON()).writeFeature(thecenterfeature);
        //console.log(dados);
        //console.log(JSON.stringify(dados));

        Server.Plantas.Pedidos.saveGeoJson({
            feature: dados
        }, function (result, event) {
            if (result.success) {
                //console.log('Gravou bem', result.message);
                //console.log(result.data[0].gid);
                vm.set('modified', false);

                // if (purposeId != 4) {
                //     view.fireEvent('requestprintid', result.data[0].gid, 0, username);
                // }
                // já tenho o gid
                // gravar todos os desenhos
                var features = printrequestdetaillayer.getSource().getFeatures();

                if (features.length) {
                    var details = (new ol.format.GeoJSON()).writeFeatures(features);
                    Server.Plantas.Pedidos.saveGeoJsonDetail({
                        pedido: result.data[0].gid,
                        features: details
                    }, function (resultDetail, event) {
                        if (resultDetail.success) {
                            console.log('Gravou bem ' + resultDetail.total + ' detalhes');

                            if (purposeId == 4) {
                                Server.Plantas.Pedidos.createConfrontacao({
                                    gid: result.data[0].gid
                                }, function (resultConfrontacao, event) {
                                    if (resultConfrontacao.success) {
                                        console.log('Confrontacao bem lançada', resultConfrontacao);

                                        // to preview or print?
                                        if (eOpts.preview) {
                                            view.fireEvent('previewconfrontacao', view, result.data[0].gid, resultConfrontacao.data[0].id, username);
                                        } else {
                                            view.fireEvent('requestprintidconfrontacao', result.data[0].gid, resultConfrontacao.data[0].id, username);
                                        }
                                    } else {
                                        console.log('Confrontacao mal lançada', resultConfrontacao);
                                    }
                                });
                            } else {
                                view.fireEvent('requestprintid', result.data[0].gid, 0, username);
                            }

                        } else {
                            console.log('Gravou mal', resultDetail);
                        }
                    });
                }
            } else {
                console.log('Não tem features para gravar');
                view.fireEvent('requestprintid', result.data[0].gid, 0, username);
            }
        });

    },

    onPreviewConfrontacao: function (view, printid, pretensaoid, name) {
        console.log('onPreviewConfrontacao');
        console.log(arguments);
        var me = this;
        var view = this.getView();
        var vm = view.getViewModel();

        var windows = Ext.ComponentQuery.query('confrontacao');
        if (windows.length > 0) {
            me.confrontacao = windows[0];
            me.confrontacao.show();
        } else {
            console.log('Vou criar uma nova janela de confrontação');
            me.confrontacao = Ext.create('Admin.view.plantas.Confrontacao', {
                printid: printid,
                pretensaoid: pretensaoid
                // , viewModel: vm // problems when destroy/recreate the window
            });
            me.confrontacao.show();
        }

    },

    onPrintPlanta: function (printid, pretensaoid, name) {
        //Ext.getDisplayName(temp2)
        //console.log(arguments);

        var me = this;
        var view = this.getView();
        var olMap = view.down('mapcanvas').map;
        var mapView = view.down('mapcanvas').getView();

        var vm = view.getViewModel();
        var extent = vm.get('extent');

        var purposeId = vm.get('selectedPurpose');
        console.log(purposeId);
        var store = vm.getStore('purpose');
        var purposeName = store.getById(purposeId).get('name');
        console.log(purposeId, purposeName);

        var center = olMap.getView().getCenter();
        var layoutname = vm.get('paper') + '_' + vm.get('orientation');

        var stringifyFunc = ol.coordinate.createStringXY(0);
        var out = stringifyFunc(center);

        var spec = {
            layout: layoutname,
            outputFilename: printid,
            attributes: {
                centro: out,
                pedido: printid,
                requerente: name,
                purpose: purposeName
            }
        };

        var util = GeoExt.data.MapfishPrintProvider;
        var serializedLayers = util.getSerializedLayers(
            olMap,
            function (layer) {
                //console.log(layer);
                // do not print the extent layer
                //var isExtentLayer = (extent === layer);
                //console.log('Layer ' + layer.get('title') + ' → ' + (!isExtentLayer && layer.getVisible()));
                //console.log('Layer ' + layer.get('title') + ' → ' + (layer.get('layer') == 'carto2_5k' || layer.get('layer') == 'carto10k') );
                return (layer.get('title') == 'Detail');
                //return !isExtentLayer && layer.getVisible();
            }
        );

        //console.log('----------------------------------');
        //console.log(serializedLayers);
        //console.log('----------------------------------');

        var serializedLayers2k = JSON.parse(JSON.stringify(serializedLayers));
        var serializedLayers10k = JSON.parse(JSON.stringify(serializedLayers));

        // Preencher com camadas que vêem de uma tabela de base de dados, consoante o propósito da impressão.
        // Começar com um store na ViewModel...
        //

        // Atenção: Nos reports está uma condição. Sò imprime a band summary com a legenda se o purpose (nome da planta) for diferente de "Plantas de Localização".
        var legendClass = JSON.parse('[]');

        switch (purposeId) {
            case 1:
                serializedLayers2k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "tiled": true},
                    "layers": ["carto2_5k"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                serializedLayers10k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "transparent": true, "tiled": true},
                    "layers": ["carto10k"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                spec.attributes['map2k'] = {
                    center: center,
                    dpi: 200, // clientInfo.dpiSuggestions[0],
                    layers: serializedLayers2k,
                    projection: mapView.getProjection().getCode(),
                    rotation: mapView.getRotation(),
                    scale: 2000
                };
                spec.attributes['map10k'] = {
                    center: center,
                    dpi: 200, // clientInfo.dpiSuggestions[0],
                    layers: serializedLayers10k,
                    projection: mapView.getProjection().getCode(),
                    rotation: mapView.getRotation(),
                    scale: 10000
                };
                break;
            case 2:
                // 2k
                serializedLayers2k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "transparent": true, "tiled": true},
                    "layers": ["ran_etrs89"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                serializedLayers2k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "tiled": true},
                    "layers": ["carto2_5k"],
                    "opacity": 0.4,
                    "styles": [""],
                    "type": "WMS"
                });
                // 10k
                serializedLayers10k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "transparent": true, "tiled": true},
                    "layers": ["ran_etrs89"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                serializedLayers10k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "transparent": true, "tiled": true},
                    "layers": ["carto10k"],
                    "opacity": 0.4,
                    "styles": [""],
                    "type": "WMS"
                });
                spec.attributes['map2k'] = {
                    center: center,
                    dpi: 200, // clientInfo.dpiSuggestions[0],
                    layers: serializedLayers2k,
                    projection: mapView.getProjection().getCode(),
                    rotation: mapView.getRotation(),
                    scale: 2000
                };
                spec.attributes['map10k'] = {
                    center: center,
                    dpi: 200, // clientInfo.dpiSuggestions[0],
                    layers: serializedLayers10k,
                    projection: mapView.getProjection().getCode(),
                    rotation: mapView.getRotation(),
                    scale: 10000
                };
                legendClass.push({
                    "icons": ["http://softwarelivre.cm-agueda.pt/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=ran_etrs89&FORMAT=image%2Fpng&SCALE=2183915&LEGEND_OPTIONS=dpi:254"],
                    "name": "Reserva Agrícola Nacional"
                });
                /*
                 legendClass.push({
                 "icons": ["http://softwarelivre.cm-agueda.pt/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=carto10k&FORMAT=image%2Fpng"],
                 "name": "Cartografia 10k"
                 });
                 legendClass.push({
                 "icons": ["http://softwarelivre.cm-agueda.pt/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=carto2_5k&FORMAT=image%2Fpng"],
                 "name": "Cartografia 2k e 5k"
                 });
                 */
                spec.attributes['legend'] = {
                    "classes": legendClass,
                    "name": ""
                };
                break;
            case 3:
                // 2k
                serializedLayers2k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "transparent": true, "tiled": true},
                    "layers": ["ren_etrs89"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                serializedLayers2k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "tiled": true},
                    "layers": ["carto2_5k"],
                    "opacity": 0.4,
                    "styles": [""],
                    "type": "WMS"
                });
                // 10k
                serializedLayers10k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "transparent": true, "tiled": true},
                    "layers": ["ren_etrs89"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                serializedLayers10k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "transparent": true, "tiled": true},
                    "layers": ["carto10k"],
                    "opacity": 0.4,
                    "styles": [""],
                    "type": "WMS"
                });
                spec.attributes['map2k'] = {
                    center: center,
                    dpi: 200, // clientInfo.dpiSuggestions[0],
                    layers: serializedLayers2k,
                    projection: mapView.getProjection().getCode(),
                    rotation: mapView.getRotation(),
                    scale: 2000
                };
                spec.attributes['map10k'] = {
                    center: center,
                    dpi: 200, // clientInfo.dpiSuggestions[0],
                    layers: serializedLayers10k,
                    projection: mapView.getProjection().getCode(),
                    rotation: mapView.getRotation(),
                    scale: 10000
                };
                legendClass.push({
                    "icons": ["http://softwarelivre.cm-agueda.pt/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=ren_etrs89&FORMAT=image%2Fpng&SCALE=2183915&LEGEND_OPTIONS=dpi:254"],
                    "name": "Reserva Ecológica Nacional"
                });
                spec.attributes['legend'] = {
                    "classes": legendClass,
                    "name": ""
                };
                break;
            case 4:
                serializedLayers2k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "tiled": true},
                    "layers": ["carto2_5k"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                spec.attributes['map2k'] = {
                    center: center,
                    dpi: 200, // clientInfo.dpiSuggestions[0],
                    layers: serializedLayers2k,
                    projection: mapView.getProjection().getCode(),
                    rotation: mapView.getRotation(),
                    scale: 2000
                };
                break;
        }
        //serializedLayers.reverse();

        Ext.Ajax.request({
            url: 'http://localhost:8080/print/print/plantas/report.pdf',
            // url: 'http://geoserver.sig.cm-agueda.pt/print/print/plantas/report.pdf',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            jsonData: spec,
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                console.dir(obj);

                var startTime = new Date().getTime();
                me.downloadWhenReady(me, startTime, obj);

                Ext.Msg.alert(Ext.String.format("Print request {0}".translate(), printid),
                    'Your Location Plan can take up to 30 seconds to be ready.'.translate() + '<br/>' +
                    'It will be downloaded automatically.'.translate() + '<br/>' +
                    'Please wait.'.translate());

                /*
                 downloadURL: "/print/print/report/47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c"
                 ref: "47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c"
                 statusURL: "/print/print/status/47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c.json"
                 */

                var folderpdf = 'print-requests/' + Math.floor(printid / 1000);
                var pathpdf = folderpdf + '/' + printid + '.pdf';

                Server.Plantas.Pedidos.update({
                    gid: printid,
                    pdf: pathpdf,
                    download_cod: obj.downloadURL,
                    //ref: obj.ref,
                    statusURL: obj.statusURL
                }, function (result, event) {
                    if (result) {
                        if (result.success) {
                            console.log('Correu bem o update', result.message);
                        } else {
                            console.log('Correu mal o update', result.message);
                        }
                    } else {
                        console.log('Correu mal o update', result.message);
                    }
                });
            },

            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });


    },

    onPrintPlantaConfrontacao: function (printid, pretensaoid, name) {
        //Ext.getDisplayName(temp2)
        console.log('onPrintPlantaConfrontacao');
        console.log(arguments);

        var me = this;
        var view = this.getView();
        var olMap = view.down('mapcanvas').map;
        var mapView = view.down('mapcanvas').getView();

        var vm = view.getViewModel();
        var extent = vm.get('extent');

        var purposeId = vm.get('selectedPurpose');
        console.log(purposeId);
        var store = vm.getStore('purpose');
        var purposeName = store.getById(purposeId).get('name');
        console.log(purposeId, purposeName);

        var center = olMap.getView().getCenter();
        var layoutname = vm.get('paper') + '_' + vm.get('orientation');

        var stringifyFunc = ol.coordinate.createStringXY(0);
        var out = stringifyFunc(center);

        var spec = {
            layout: layoutname,
            outputFilename: printid,
            attributes: {
                centro: out,
                pedido: printid,
                requerente: name,
                purpose: purposeName,
                datasource: [],
                comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas, massa eget placerat fermentum, nunc massa facilisis enim, id eleifend orci lacus sed sem."
            }
        };

        var specstr = {
            "layout": "A4 portrait",
            "attributes": {
                "centro": "-26177, 101169",
                "comments": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas, massa eget placerat fermentum, nunc massa facilisis enim, id eleifend orci lacus sed sem.",
                "datasource": [
                    {
                        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas, massa eget placerat fermentum, nunc massa facilisis enim, id eleifend orci lacus sed sem. Donec ultricies rhoncus sem vel suscipit. Nullam fermentum mollis orci, volutpat tristique leo vulputate ut. Sed nisl dolor, auctor quis facilisis in, interdum et leo.",
                        "map": {
                            "center": [
                                -27643.56,
                                97261.92
                            ],
                            "dpi": 72,
                            "layers": [
                                {
                                    "geoJson": {
                                        "features": [{
                                            "geometry": {
                                                "coordinates": [[
                                                    [
                                                        -27643.56,
                                                        97261.92
                                                    ],
                                                    [
                                                        -27638.0006921366,
                                                        97266.0894808975
                                                    ],
                                                    [
                                                        -27626.2864674716,
                                                        97265.7319508165
                                                    ],
                                                    [
                                                        -27626.239418087,
                                                        97265.7284521158
                                                    ],
                                                    [
                                                        -27628.3150830265,
                                                        97258.3329607121
                                                    ],
                                                    [
                                                        -27643.56,
                                                        97261.92
                                                    ]
                                                ]],
                                                "type": "Polygon"
                                            },
                                            "properties": {
                                                "area": 85.6293923675498,
                                                "buffer": null,
                                                "camada": "ip_ordenamento.espacos_florestais_producao_tipo2",
                                                "dataregisto": "2016-10-20T09:35:13.840786+01:00",
                                                "diploma_es": "Art. 13.� a 32.� ; 37.� a 42.�",
                                                "dominio": "PLANTA ORDENAMENTO",
                                                "entidade": "CM Águeda",
                                                "familia": "SOLO_RURAL",
                                                "id": 1058,
                                                "ident_gene": "ESPACO_FLORESTAL_PRODUCAO_TIPO_2",
                                                "ident_part": null,
                                                "idpretensao": 506,
                                                "idutilizador": 31,
                                                "objecto": "ESPACO_FLORESTAL_PRODUCAO",
                                                "parecer": "0",
                                                "subdominio": "CLASSIFICACAO_QUALIFICACAO_SOLOS",
                                                "sumario": "Para o local assinalado o instrumento de gestão territorial é o Plano Diretor Municipal, publicado no \nDiário da República, 2.ª série \u2013 N.º44 de 1 de março, através do Aviso n.º3341/2012.\nO terreno insere-se em solo rural, na categoria de Espaço Florestal de Produção \u2013 Espaço Florestal de Produção Tipo 2.",
                                                "texto": "São espaços destinados à produção florestal nas principais fileiras produtivas nacionais, nomeadamente Eucalyptus globulus e Pinus pinaster, considerando a Quercus robur para produção, incrementando os povoamentos puros, embora se privilegie uma maior florestação com Quercus robur. Apresenta uma maior aptidão para funções complementares à pratica florestal, ao nível do agropecuário, industrial e turístico.\n\nPoderão ser utilizadas as seguintes espécies: Acer (Acer pseudoplatanus), carvalho-alvarinho (quercus robur), carvalho-americano (quercus rubra), castanheiro (castanea sativa), cerejeira (prunus avium), choupo (populus alba, nigra e hybrida), cipreste-do-buçaco (cupressus lusitanica), eucalipto (eucalyptus globulus e nitens), freixo (fraxinus angustifolia), nogueira (juglans spp), pinheiro-bravo (pinus pinaster), pinheiro-manso (pinus pinea), plátano (platanus hispanica) e sobreiro (quercus suber).\n\nUsos compatíveis, em termos urbanísticos:\nHabitação Unifamiliar\nInstalações Pecuárias\nParques de Recreio e Lazer\nIndústrias e ou Armazéns pertencentes a um dos seguintes grupos\nExploração de recursos hidro-fluviais e hidrominerais\nprodução e transformação de madeiras e produtos derivados\nAgroalimentares relacionadas com produtos florestais\nExploração de recursos geológicos\nSetor das energias renováveis\nCompostagem\nEmpreendimentos turísticos das seguintes tipologias: estabelecimentos hoteleiros nas tipologias de Hotéis, desde que associados a temáticas específicas que contribuam para a valorização económica e ambiental do espaço rural, e Pousadas; Empreendimentos de Turismo no Espaço Rural; Empreendimentos de Turismo de Habitação, Parques de Campismo e de Caravanismo\nEquipamentos de Utilização Coletiva pertencentes a um dos seguintes grupos\nSolidariedade e Segurança Social\nDesporto\nRecreio e lazer\nSegurança publica e Proteção Civil\nCentros de interpretação da paisagem/natureza ou outros de caráter lúdico-educacional similar\n\nNão são permitidas edificações industriais e armazéns que se desenvolvam sobre encostas expostas visualmente a partir das vias municipais classificadas, com exceção das ocupações industriais para aproveitamento dos recursos hidro-fluviais e hidrominerais que assim o exijam.\n\nRegime de edificabilidade:\n\nHabitação (inclui anexos) \u2013 Ter uma área mínima da parcela de 20 000 m2 e cumprir os afastamentos às estremas de acordo com o previsto no PMDFCI1, um índice máximo de utilização de 0,02 e o número máximo de pisos acima da cota de soleira de 2\nIndústria e Armazéns - Ter uma área mínima da parcela de 30 000 m2 e cumprir os afastamentos às estremas de acordo com o previsto no PMDFCI1, um índice máximo de utilização de 0,1 e altura máxima da fachada de 9m\nEmpreendimentos Turísticos - Ter uma área mínima da parcela de 30 000 m2 e cumprir os afastamentos às estremas de acordo com o previsto no PMDFCI1, um índice máximo de utilização de 0,1 e o número máximo de pisos acima da cota de soleira de 2\nEquipamentos de Utilização Coletiva - Ter uma área mínima da parcela de 30 000 m2 e cumprir os afastamentos às estremas de acordo com o previsto no PMDFCI1, um índice máximo de utilização de 0,01 e o número máximo de pisos acima da cota de soleira de 2\nInstalações Pecuárias - Ter uma área mínima da parcela de 30 000 m2 e cumprir os afastamentos às estremas de acordo com o previsto no PMDFCI1, um índice máximo de utilização de 0,1 e altura máxima da fachada de 7m\nCentros de interpretação da paisagem/natureza ou outros de caráter lúdico-educacional similar - Cumprir os afastamentos às estremas de acordo com o previsto no PMDFCI1 e um índice máximo de utilização de 0,2\nOs hotéis, pousadas e hotéis rurais construidos de raiz devem ainda obedecer aos seguintes parâmetros:\nMínimo de 3 estrelas\nDensidade máxima: 40 camas/hectare\nN.º máximo de camas: 200 camas\nAssociar equipamentos de recreio e lazer ao ar livre, tais como campos de jogos, piscinas, percursos pedonais, ciclovias, entre outros"
                                            },
                                            "type": "Feature"
                                        }],
                                        "type": "FeatureCollection"
                                    },
                                    "type": "geojson"
                                },
                                {
                                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                                    "customParams": {
                                        "LAYERS": "carto2_5k",
                                        "STYLES": "",
                                        "VERSION": "1.1.1",
                                        "tiled": true
                                    },
                                    "layers": ["carto2_5k"],
                                    "opacity": 1,
                                    "styles": [""],
                                    "type": "WMS"
                                }
                            ],
                            "projection": "EPSG:3763",
                            "scale": 2000
                        },
                        "title": "ESPACO_FLORESTAL_PRODUCAO"
                    },
                    {
                        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas, massa eget placerat fermentum, nunc massa facilisis enim, id eleifend orci lacus sed sem. Donec ultricies rhoncus sem vel suscipit. Nullam fermentum mollis orci, volutpat tristique leo vulputate ut. Sed nisl dolor, auctor quis facilisis in, interdum et leo.",
                        "map": {
                            "center": [
                                -27643.56,
                                97261.92
                            ],
                            "dpi": 72,
                            "layers": [
                                {
                                    "geoJson": {
                                        "features": [{
                                            "geometry": {
                                                "coordinates": [[
                                                    [
                                                        -27617.2098009073,
                                                        97281.6826493195
                                                    ],
                                                    [
                                                        -27587.56,
                                                        97303.92
                                                    ],
                                                    [
                                                        -27492.36,
                                                        97283.2
                                                    ],
                                                    [
                                                        -27507.48,
                                                        97222.16
                                                    ],
                                                    [
                                                        -27567.96,
                                                        97233.36
                                                    ],
                                                    [
                                                        -27567.4,
                                                        97244
                                                    ],
                                                    [
                                                        -27628.3150830265,
                                                        97258.3329607121
                                                    ],
                                                    [
                                                        -27626.239418087,
                                                        97265.7284521158
                                                    ],
                                                    [
                                                        -27609.4548872523,
                                                        97264.477965917
                                                    ],
                                                    [
                                                        -27617.2098009073,
                                                        97281.6826493195
                                                    ]
                                                ]],
                                                "type": "Polygon"
                                            },
                                            "properties": {
                                                "area": 6742.60710722156,
                                                "buffer": null,
                                                "camada": "ip_ordenamento.espaco_urbanizavel_atividades_economicas",
                                                "dataregisto": "2016-10-20T09:35:13.840786+01:00",
                                                "diploma_es": "Art 13 a 25 ; 61 a 72 ; 107 e 108; 125 a 127",
                                                "dominio": "PLANTA ORDENAMENTO",
                                                "entidade": "CM Águeda",
                                                "familia": "SOLO_URBANO_URBANIZAVEL",
                                                "id": 1059,
                                                "ident_gene": null,
                                                "ident_part": "E.N. 1 - Sul",
                                                "idpretensao": 506,
                                                "idutilizador": 31,
                                                "objecto": "ESPACO_ACTIVIDADES_ECONOMICAS_URBANIZAVEL",
                                                "parecer": "0",
                                                "subdominio": "CLASSIFICACAO_QUALIFICACAO_SOLOS",
                                                "sumario": "Para o local assinalado o instrumento de gestão territorial é o Plano Diretor Municipal, publicado no \nDiário da República, 2.ª série \u2013 N.º44 de 1 de março, através do Aviso n.º3341/2012.\nO terreno insere-se em solo urbano, na categoria de solo urbanizável \u2013 Espaços de Atividades Económicas Urbanizáveis.\nSolo Urbanizável, são áreas com potencial de transformação em solo urbanizado mediante a elaboração de Planos de \nUrbanização, Planos de Pormenor ou Unidades de Execução.",
                                                "texto": "O instrumento de planeamento e gestão territorial para o local é o\nplano diretor municipal (PDM), publicado no Diário da República,\n2.ª série \u2013 N.º44 de 1 de março, através do Aviso\nn.º3341/2012, encontrando-se o terreno inserido em solo urbano, na\ncategoria de solo urbanizável \u2013 Espaços de Atividades Económicas\nUrbanizáveis, sendo aplicáveis à operação urbanística\npretendida os seguintes artigos: 13.º a 25.º, 61.º a 72.º ,\n107.º a 108.º, 125.º a 127.º da 1.ª Revisão do PDM.\n\nSolo Urbanizável são áreas com potencial de transformação em solo\nurbanizado mediante a elaboração de Planos de Urbanização, Planos\nde Pormenor ou Unidades de Execução.\n\nI. Disposições Gerais\n\nA ocupação em solo urbanizável apenas pode ocorrer mediante a\nelaboração e aprovação de Planos de Urbanização, Planos de\nPormenor ou Unidades de Execução, as quais definirão a rede viária\ne as respectivas condições de edificação.\n\nExcecionalmente, nos casos em que já existam infraestruturas básicas (nomeadamente\nrede eléctrica, rede de abastecimento de água e sistema de drenagem\nde águas residuais individuais ou colectivos) e a rede viária já\nse encontrar definida, é permitido o licenciamento individual de edificações.\n\n1. Alinhamento\n\nNas vias cujo perfil atual já se encontre comprometido por construções existentes,\naplica-se o alinhamento dominante, sendo que na falta de definição\ndo mesmo, aplica-se o estabelecido no artigo 20.º/A1 do Código\nRegulamentar do Município publicado através do Aviso n.º9745/2012\nna 2.ª série do DR, N.º137, de 17 de julho, alterado pelos Avisos\nn.º13547/2012 na 2.ª série do DR, N.º197, de 11 de outubro,\nn.º860/2013 na 2.ª série do DR, N.º13, de 18 de janeiro,\nn.º7044/2013 na 2.ª série do DR, N.º103, de 29 de maio e\nn.º8779/2013 na 2.ª série do DR, N.º131, de 10 de julho\nrelativamente às zonas de construção interdita, nomeadamente:\na) Sistema secundário \u2013 5m;\nb) Sistema terciário \u2013 4 m.\n\n2. Recuo\n\nA fachada principal dos novos edifícios deve cumprir o recuo dominante existente.\n\nExcecionalmente é permitido um recuo superior ao dominante, desde que verificadas as seguintes condições:\na) Desde que seja para cumprir questões de salubridade e habitabilidade, face à reduzida\ndimensão da parcela;\nb) Desde que se trate de edificações isoladas e a frente da parcela seja significativamente\nsuperior às parcelas envolventes.\n\nNos casos constantes da alínea a) anterior, terá que ser criada uma falsa fachada ou\nqualquer outro elementos arquitetónico, de forma a garantir que seja\ncumprido o recuo dominante das fachadas da envolvente.\n\nNa falta de definição do recuo dominante, o recuo mínimo aplicar é de 5 metros, conforme\ndefinido no artigo 21.º/A1 do Código Regulamentar do Município\npublicado através do Aviso n.º9745/2012 na 2.ª série do DR,\nN.º137, de 17 de julho, alterado pelos Avisos n.º13547/2012 na 2.ª\nsérie do DR, N.º197, de 11 de outubro, n.º860/2013 na 2.ª série\ndo DR, N.º13, de 18 de janeiro, n.º7044/2013 na 2.ª série do DR,\nN.º103, de 29 de maio e n.º8779/2013 na 2.ª série do DR, N.º131, de 10 de julho \n\n3. Aterros, escavações e muros de suporte\n\nAs obras de construção onde se proceda a aterro ou escavação deverá assegurar, sempre que tecnicamente possível, entre a nova plataforma\nresultante da construção e o terreno natural, uma pendente igual ou inferior a 60%.\n\nSó é permitida a construção de muros de suporte de terras que\nestabeleçam diferença de cotas entre plataformas contiguas ou entre\nplataformas e o terreno natural inferiores a 3 metros, com exceção\ndos muros de suporte de vias ou em situações que seja tecnicamente\ninviável a conjugação da altura máxima estabelecida com outras\ntécnicas de suporte de terras.\n\n4. Afastamentos\n\nOs afastamentos mínimos, medidos entre as fachadas da edificação e os\nlimites laterais da parcela, contanto para o efeito qualquer\nsaliência relativamente ao plano das fachadas, são os seguintes:\na) Edificações até dois pisos acima da cota de soleira \u2013 3m;\nb) Edificações com mais de dois pisos acima da cota de soleira ou de 6m de altura de fachada \u2013 4m;\nc) Edificações com uso industrial ou de armazenagem \u2013 5m;\n\nPoderão ser admitidos afastamentos inferiores ao definido na alínea c),\ndesde que sejam cumpridas cumulativamente as seguintes condições:\n\n1. tenham sido iniciadas antes de 1995, servindo de comprovativo os\nortofotomapas do CNIG de 1995 ou as cópias de documentos entregues\nno Ministério da Economia até à referida data, para a regularização da atividade industrial;\n2. Desde que a ampliação resulte da necessidade de alterar o layout, não sendo possível cumprir o afastamento de 5 metros;\n3. Não colidam com a área \u201cnon aedificandi\u201d das vias do sistema\nprimário e secundário com as quais os terrenos confinem diretamente.\n\nÉ admitida a construção em banda ou geminada, devendo o afastamento\nàs estremas livres ser o definido nos parágrafos anteriores.\n\n5. Pisos\n\nOs edifícios em banda ou geminados não podem ter uma diferença do\nnúmero de pisos superior a dois acima da cota de soleira.\n\nAs construções que confinem com dois arruamentos desnivelados e que\npossuam duas frentes, não poderão ultrapassar os dois pisos acima\nda cota de soleira do arruamento situado à maior cota.\n\nNo caso em que a diferença de pisos resultar na criação de uma empena\ncega, esta deverá ser alvo de tratamento arquitetónico que passará\npelo seu revestimento com materiais utilizados na fachada principal.\n\nO número máximo de pisos abaixo da cota de soleira é de 3, contando\npara o efeito, o arruamento situado à menor cota.\n\nOs pisos situados abaixo da cota de soleira que seja possível observar\na fachada posterior, terão que obedecer às seguintes regras:\na) Ser integradas visualmente na parcela onde se desenvolvem, devendo\nprivilegiar-se as situações de socalco;\nb) O talude entre o limite do último piso da cave e o limite do terreno não pode ser superior a 30%;\nc) As fachadas abaixo da cota de soleira deverão apresentar um tratamento\narquitetónico semelhante ao da fachada principal do edifício.\n\n6. Logradouros\n\nSó poderá ser impermeabilizada, no máximo, 50% da área não\nconstruída da parcela ou lote numa profundidade de 50 metros a\npartir do limite do espaço publico, admitindo-se nas parcelas ou\nlotes de reduzida dimensão que este valor seja ultrapassado, desde\nque se destine a pavimentação do acesso à garagem.\n\nPara além dos 50 metros a partir da via geradora de perímetro, não são\npermitidas quaisquer impermeabilizações que não as que resultem\ndas condições a edificar e dos seus acessos.\n\n7. Estacionamento\n\nAs novas construções, bem como as que venham a ser alvo de ampliação\nigual ou superior a 50% da área de construção licenciada, devem\nser garantidos os seguintes parâmetros quantitativos mínimos de\nestacionamento privativo:\na) 1 lugar de estacionamento de veículos ligeiros por fogo de tipologia\nT0, T1 e T2 para edifícios plurifamiliares;\nb) 2 lugares de estacionamento de veículos ligeiros por fogo de\ntipologia T3 e T4 para edifícios plurifamiliares;\nc) 3 lugares de estacionamento de veículos ligeiros por fogo de\ntipologias superior a T4 para edifícios plurifamiliares;\nd) 3 lugares de estacionamento de veículos por edifício unifamiliar;\ne) 1 lugar de estacionamento de veículos ligeiros por cada 50 m2\nde área total de construção para comércio e ou serviços com\nárea total de construção igual ou inferior a 1000 m2,\ndevendo ser assegurados locais adequados para cargas e descargas;\nf) 1 lugar de estacionamento de veículos ligeiros por cada 25 m2\nde área total de construção para comércio e ou serviços com\nárea total de construção superior a 1000 m2, devendo\nser assegurados locais adequados para cargas e descargas;\ng) 1 lugar de estacionamento de veículos ligeiros por cada 200 m2\nde área total de construção para indústria e ou armazéns,\ndevendo ser assegurados locais adequados para cargas e descargas;\nh) 1 lugar de estacionamento de veículos pesados por cada 1000 m2\nde área total de construção para indústria e ou armazéns,\ndevendo ser assegurados locais adequados para cargas e descargas;\ni) 1 lugar de estacionamento de veículos ligeiros por cada 5 quartos\npara os estabelecimentos hoteleiros, acrescido de 1 lugar de veículo\npesado de passageiros por cada 50 quartos, com o mínimo de 1 lugar;\nj) 1 lugar de estacionamento de veículos ligeiros por cada 75 m2\nde área total de construção para equipamentos, acrescido de 1\nlugar para veículo pesado de passageiros por cada 500 m2 de área\ntotal de construção, quando o uso em causa o justificar;\nk) 1lugar de estacionamento de veículos ligeiros por cada 50 m2\nde área total de construção para oficinas automóveis.\n\nDeverá ser previsto estacionamento público correspondente, no mínimo, às\npercentagens a seguir indicadas, aplicadas aos valores de\nestacionamento obtidos para cada uma das alíneas referidas\nanteriormente:\na) 20% para os usos constantes da alínea a), b), c), e), f), j) e k),\npodendo no caso do uso ser oficina, o mesmo situar-se no interior do lote;\nb) 10% para os usos constantes na alínea g).\n\nA Câmara Municipal pode deliberar a dispensa total ou parcial do\ncumprimento da dotação de estacionamento estabelecido\nanteriormente, desde que se verifique uma das seguintes situações:\na) O seu cumprimento implicar a modificação da arquitetura original de\nedifícios ou na continuidade do conjunto edificado, que pelo seu\nvalor arquitetónico intrínseco, pela sua integração em conjuntos\ncaraterísticos ou em áreas de reconhecido valor paisagístico,\ndevem ser preservados;\nb) A impossibilidade ou a inconveniência de natureza técnica,\nnomeadamente em função das caraterísticas geológicas do terreno,\ndos níveis freáticos, do condicionamento da segurança das\nedificações envolventes, da interferência com equipamentos e\ninfraestruturas ou da funcionalidade dos sistemas públicos de\ncirculação de pessoas e veículos;\nc) As dimensões da parcela ou a sua situação urbana tornarem\ntecnicamente desaconselhável a construção do estacionamento com a\ndotação exigida, por razões de economia e funcionalidade interna.\n\nA não dotação dos lugares de estacionamento pelas razões referidas\nanteriormente, dá lugar ao pagamento de uma compensação ao\nMunicípio definida nos termos e condições estipuladas no artigo\n17.º/A1 do Código Regulamentar do Município publicado através do\nAviso n.º9745/2012 na 2.ª série do DR, N.º137, de 17 de julho,\nalterado pelos Avisos n.º13547/2012 na 2.ª série do DR, N.º197,\nde 11 de outubro, n.º860/2013 na 2.ª série do DR, N.º13, de 18 de\njaneiro, n.º7044/2013 na 2.ª série do DR, N.º103, de 29 de maio e\nn.º8779/2013 na 2.ª série do DR, N.º131, de 10 de julho.\n\n8. Cedências de áreas para espaços verdes e de utilização coletiva e de áreas\npara equipamentos de utilização coletiva\n\nOs parâmetros para o dimensionamento das áreas destinadas a espaços\nverdes e de utilização coletiva e de equipamentos de utilização\ncoletiva, em operações de loteamento ou operações urbanísticas\nde impacte semelhante a um loteamento, são os seguintes:\na) Para espaços verdes e de utilização coletiva:\na.1. 28m2/fogo, no caso de habitação unifamiliar;\na.2. 0,23m2/m2 de área total de construção, no caso de habitação coletiva;\na.3. 0,28 m2/m2 de área total de construção, no caso de comércio ou serviços; \na.4. 0,23 m2/m2 de área de construção, no caso de indústria ou armazéns; \nb) Para equipamentos de utilização coletiva:\nb.1. 35 m2/fogo, no caso de habitação unifamiliar;\nb.2. 0,29m2/m2 de área total de construção, no caso de habitação coletiva;\nb.3. 0,25m2/m2 de área total de construção, no caso de comércio ou serviços;\nb.4. 0,10m2/m2 de área de construção, no caso de indústria ou armazéns;\n\nAs parcelas de terreno resultante da aplicação do disposto\nanteriormente, passarão a integrar o domínio municipal através de\ncedência gratuita ao município.\n\nO Município pode prescindir da integração do domínio municipal da\ntotalidade ou parte das parcelas referidas anteriormente, de acordo\ncom o estabelecido nos artigos 15.º/A1 e 16.º/A1 Código\nRegulamentar do Município publicado através do Aviso n.º9745/2012\nna 2.ª série do DR, N.º137, de 17 de julho, alterado pelos Avisos\nn.º13547/2012 na 2.ª série do DR, N.º197, de 11 de outubro,\nn.º860/2013 na 2.ª série do DR, N.º13, de 18 de janeiro,\nn.º7044/2013 na 2.ª série do DR, N.º103, de 29 de maio e\nn.º8779/2013 na 2.ª série do DR, N.º131, de 10 de julho.\n\n9. Anexos\n\nOs anexos terão de cumprir as seguintes condições:\na) Número máximo de pisos acima da cota de soleira, admitindo-se 1 destes em cave;\nb) A altura máxima da fachada é de 6 m, exceto nos casos em que os\nanexos se encontrem implantados à estrema, não podendo nestes\ncasos possuir uma empena superior a 3,5 metros de altura\nrelativamente às parcelas vizinhas;\nc) Caso não sejam implantados às estremas, deverão cumprir os\nafastamentos mínimos impostos para a edificação principal.\n\nPara além das condições referidas anteriormente, os anexos terão\nsempre que ter em consideração a envolvente urbana e não\ncontribuir para a descaraterização urbanística e arquitetónica da\nedificação principal aos quais se encontram associados, assim como\ndo aglomerado urbano em que se inserem.\n\n10. Florestação\n\nÉ proibida a plantação de espécies de crescimento rápido,\nclassificadas de acordo com a legislação em vigor.\n\n\n11. Áreas Abrangidas por cheias\n\nNas áreas abrangidas pelas cheias, as cotas dos pisos inferiores das\nedificações deverão ser superiores à cota local da máxima cheia, que é de 12,00 m.\n\nNestas áreas é interdita a construção de novas estruturas de saúde,\nestabelecimentos que utilizem substâncias perigosas e centrais\nelétricas.\n\n\nII. Disposições Específicas\n\nSão espaços que correspondem a áreas urbanízáveis a ocupar por\natividades económicas predominantemente industriais e de\narmazenagem.\n\n1. Usos e condições de ocupação\na) Indústrias e Armazéns;\nb) Comércio, a retalho e por grosso;\nc) Instalações destinadas a operações de gestão de resíduos e parques de\narmazenagem de materiais;\nd) Instalações de apoio ao pessoal de segurança e vigilância.\n\nSão Usos compatíveis\na) Serviços;\nb) Grandes superfícies comerciais;\nc) Estabelecimentos hoteleiros;\nd) Equipamentos de utilização coletiva.\n\nOs estabelecimentos hoteleiros apenas poderão ser instalados nesta\nclasse de espaço desde que garantam os níveis de ruído interior\nque não ultrapasse os 65 dB(A) durante o período diurno e de\nentardecer e os 55 dB(A) durante o período noturno, com os períodos\nde referencia do Regulamento Geral do Ruído.\n\nAs instalações de operações de gestão de resíduos, para além do\ncumprimento das normas legais em vigor, devem observar os seguintes\nrequisitos:\na) Drenagem pluvial de áreas impermeáveis;\nb) Drenagem interna de zonas permeáveis de depósito;\nc) Tratamento adequado dos efluentes referidos nas alíneas anteriores;\nd) Plantação de uma cortina arbórea periférica contínua, que envolva a\ntotalidade da área do parque, com uma faixa de 10 metros de largura\ne, no mínimo, 2 fiadas intercaladas de árvores (preferencialmente\ndo género Cupressus, e ou Thuya);\ne) Plantação na envolvência de áreas cobertas.\n\nAs instalações destinadas a parques de armazenamento ao ar livre, para\nalém do cumprimento das normas legais em vigor, devem também conter\numa cortina arbórea periférica contínua, que envolva a totalidade\nda área do parque, com uma faixa de 10 metros de largura e, no\nmínimo, 2 fiadas intercaladas de árvores (preferencialmente do\ngénero Cupressus, e ou Thuya).\n\n2. Regime de edificabilidade\na) As edificações terão que cumprir o afastamento mínimo de 5 metros a\ntodas as estremas, devendo, desses, 3 metros serem livres para\ncirculação automóvel, com exceção das coberturas referidas no\nponto n.º3;\nb) As instalações de apoio a pessoal de segurança e vigilância, não\npodem ultrapassar os 120 m2 de área total de construção;\nc) As edificações em banda ou geminadas não poderão ultrapassar os 250\nmetros de frente.\nd) Nos casos de bandas construídas ou de edificações geminadas,\nexistentes á data da entrada em vigor do PDM, que excedam a\ndimensão referida anteriormente, admite-se o licenciamento das\nconstruções nela inseridas desde que:\n1. As instalações de apoio a pessoal de segurança e vigilância, não\npodem ultrapassar os 120 m2 de área total de construção;\n2. As fachadas anteriores e posteriores sejam acessíveis a veículos de\nemergência através de arruamento ou caminho público.\ne) Para além do referido aplica-se supletivamente as seguintes regras:\n1. Altura máxima da fachada \u2013 25 m;\n2. Índice de Ocupação máximo \u2013 0,9.\n\n3. Coberturas\n\nÉ admitida a execução de coberturas sobre os cais de carga e descarga até ás estremas\nlaterais ou posteriores dos terrenos, desde que estas sejam\namovíveis, totalmente vazadas e permitam a circulação de veículos\nde emergência sob as mesmas.\n\nPermite-se o licenciamento de coberturas fixas existentes à data da entrada em\nvigor do PDM, desde que sejam cumpridas cumulativamente\nas seguintes condições:\na) Tenham sido iniciadas antes de 1995, servindo de comprovativo os\nortofotomapas do CNIG de 1995 ou as cópias de documentos entregues\nno Ministério da Economia até à referida data, para a\nregularização da atividade industrial;\nb) Desde que a ampliação resulte da necessidade de alterar o layout, não\nsendo possível cumprir o afastamento de 5 metros;\nc) Não colidam com a área \u201cnon aedificandi\u201d das vias do sistema primário e secundário\ncom as quais os terrenos confinem diretamente."
                                            },
                                            "type": "Feature"
                                        }],
                                        "type": "FeatureCollection"
                                    },
                                    "type": "geojson"
                                },
                                {
                                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                                    "customParams": {
                                        "LAYERS": "carto2_5k",
                                        "STYLES": "",
                                        "VERSION": "1.1.1",
                                        "tiled": true
                                    },
                                    "layers": ["carto2_5k"],
                                    "opacity": 1,
                                    "styles": [""],
                                    "type": "WMS"
                                }
                            ],
                            "projection": "EPSG:3763",
                            "scale": 2000
                        },
                        "title": "ESPACO_ACTIVIDADES_ECONOMICAS_URBANIZAVEL"
                    },
                    {
                        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas, massa eget placerat fermentum, nunc massa facilisis enim, id eleifend orci lacus sed sem. Donec ultricies rhoncus sem vel suscipit. Nullam fermentum mollis orci, volutpat tristique leo vulputate ut. Sed nisl dolor, auctor quis facilisis in, interdum et leo.",
                        "map": {
                            "center": [
                                -27643.56,
                                97261.92
                            ],
                            "dpi": 72,
                            "layers": [
                                {
                                    "geoJson": {
                                        "features": [{
                                            "geometry": {
                                                "coordinates": [
                                                    [[
                                                        [
                                                            -27638.0006921366,
                                                            97266.0894808975
                                                        ],
                                                        [
                                                            -27617.2098009073,
                                                            97281.6826493195
                                                        ],
                                                        [
                                                            -27609.4548872523,
                                                            97264.477965917
                                                        ],
                                                        [
                                                            -27626.239418087,
                                                            97265.7284521158
                                                        ],
                                                        [
                                                            -27626.2864674716,
                                                            97265.7319508165
                                                        ],
                                                        [
                                                            -27638.0006921366,
                                                            97266.0894808975
                                                        ]
                                                    ]],
                                                    [[
                                                        [
                                                            -27665.4,
                                                            97280.96
                                                        ],
                                                        [
                                                            -27659.24,
                                                            97357.68
                                                        ],
                                                        [
                                                            -27621.72,
                                                            97361.6
                                                        ],
                                                        [
                                                            -27633.48,
                                                            97279.84
                                                        ],
                                                        [
                                                            -27665.4,
                                                            97280.96
                                                        ]
                                                    ]]
                                                ],
                                                "type": "MultiPolygon"
                                            },
                                            "properties": {
                                                "area": 2973.64510041108,
                                                "buffer": null,
                                                "camada": "ip_ordenamento.espaco_residencial_urbanizavel_tipo1",
                                                "dataregisto": "2016-10-20T09:35:13.840786+01:00",
                                                "diploma_es": "Art 13 a 25 ; 61 a 72 ; 107 e 108 ; 112 a 115",
                                                "dominio": "PLANTA ORDENAMENTO",
                                                "entidade": "CM Águeda",
                                                "familia": "SOLO_URBANO_URBANIZAVEL",
                                                "id": 1060,
                                                "ident_gene": null,
                                                "ident_part": null,
                                                "idpretensao": 506,
                                                "idutilizador": 31,
                                                "objecto": "ESPACO_RESIDENCIAL_URBANIZAVEL_TIPO_1",
                                                "parecer": "0",
                                                "subdominio": "CLASSIFICACAO_QUALIFICACAO_SOLO",
                                                "sumario": "Para o local assinalado o instrumento de gestão territorial é o Plano Diretor Municipal, publicado no \nDiário da República, 2.ª série \u2013 N.º44 de 1 de março, através do Aviso n.º3341/2012.\nO terreno insere-se em solo urbano, na categoria de solo urbanizável \u2013 Espaços Residenciais Urbanizáveis Tipo 1.\nSolo Urbanizável, são áreas com potencial de transformação em solo urbanizado mediante a elaboração de Planos de Urbanização,\n Planos de Pormenor ou Unidades de Execução.",
                                                "texto": "O instrumento de planeamento e gestão territorial para o local é o\nplano diretor municipal (PDM), publicado no Diário da República,\n2.ª série \u2013 N.º44 de 1 de março, através do Aviso\nn.º3341/2012, encontrando-se o terreno inserido em solo urbano, na\ncategoria de solo urbanizável \u2013 Espaços Resicenciais Urbanizáveis\nTipo 1, sendo aplicáveis à operação urbanística pretendida os\nseguintes artigos: 13.º a 25.º, 61.º a 72.º , 107.º a 108.º,\n112.º a 115.º da 1.ª Revisão do PDM.\n\nSolo Urbanizável, são áreas com potencial de transformação em solo\nurbanizado mediante a elaboração de Planos de Urbanização, Planos\nde Pormenor ou Unidades de Execução.\n\nI. Disposições Gerais\n\nA ocupação em solo urbanizável apenas pode ocorrer mediante a\nelaboração e aprovação de Planos de Urbanização, Planos de\nPormenor ou Unidades de Execução, as quais definirão a rede viária\ne as respectivas condições de edificação.\n\nExcecionalmente, nos casos em que já existam infraestruturas básicas (nomeadamente\nrede eléctrica, rede de abastecimento de água e sistema de drenagem\nde águas residuais individuais ou colectivos) e a rede viária já\nse encontrar definida, é permitido o licenciamento individual de edificações.\n\n1. Alinhamento\n\nNas vias cujo perfil atual já se encontre comprometido por construções existentes,\naplica-se o alinhamento dominante, sendo que na falta de definição\ndo mesmo, aplica-se o estabelecido no artigo 20.º/A1 do Código\nRegulamentar do Município publicado através do Aviso n.º9745/2012\nna 2.ª série do DR, N.º137, de 17 de julho, alterado pelos Avisos\nn.º13547/2012 na 2.ª série do DR, N.º197, de 11 de outubro,\nn.º860/2013 na 2.ª série do DR, N.º13, de 18 de janeiro,\nn.º7044/2013 na 2.ª série do DR, N.º103, de 29 de maio e\nn.º8779/2013 na 2.ª série do DR, N.º131, de 10 de julho\nrelativamente às zonas de construção interdita, nomeadamente:\nSistema secundário \u2013 5m;\nSistema terciário \u2013 4 m.\n\n2. Recuo\n\nA fachada principal dos novos edifícios deve cumprir o recuo dominante existente.\n\nExcecionalmente é permitido um recuo superior ao dominante, desde que verificadas as\nseguintes condições:\na) Desde que seja para cumprir questões de salubridade e habitabilidade, face à reduzida\ndimensão da parcela;\nb) Desde que se trate de edificações isoladas e a frente da parcela seja significativamente\nsuperior às parcelas envolventes.\n\nNos casos constantes da\nalínea a) anterior, terá que ser criada uma falsa fachada ou\nqualquer outro elementos arquitetónico, de forma a garantir que seja\ncumprido o recuo dominante das fachadas da envolvente.\n\n\nNa falta de definição do recuo dominante, o recuo mínimo aplicar é de 5 metros, conforme\ndefinido no artigo 21.º/A1 do Código Regulamentar do Município\npublicado através do Aviso n.º9745/2012 na 2.ª série do DR,\nN.º137, de 17 de julho, alterado pelos Avisos n.º13547/2012 na 2.ª\nsérie do DR, N.º197, de 11 de outubro, n.º860/2013 na 2.ª série\ndo DR, N.º13, de 18 de janeiro, n.º7044/2013 na 2.ª série do DR,\nN.º103, de 29 de maio e n.º8779/2013 na 2.ª série do DR, N.º131,\nde 10 de julho \n\n3. Aterros, escavações e muros de suporte\n\nAs obras de construção onde se proceda a aterro ou escavação deverá\nassegurar, sempre que tecnicamente possível, entre a nova plataforma\nresultante da construção e o terreno natural, uma pendente igual ou\ninferior a 60%.\n\nSó é permitida a construção de muros de suporte de terras que\nestabeleçam diferença de cotas entre plataformas contiguas ou entre\nplataformas e o terreno natural inferiores a 3 metros, com exceção\ndos muros de suporte de vias ou em situações que seja tecnicamente\ninviável a conjugação da altura máxima estabelecida com outras\ntécnicas de suporte de terras.\n\n4. Afastamentos\n\nOs afastamentos mínimos, medidos entre as fachadas da edificação e os\nlimites laterais da parcela, contanto para o efeito qualquer\nsaliência relativamente ao plano das fachadas, são os seguintes:\na) Edificaçõesaté dois pisos acima da cota de soleira \u2013 3m;\nb) Edificações com mais de dois pisos acima da cota de soleira ou de 6m de altura de fachada \u2013 4m;\nc) Edificações com uso industrial ou de armazenagem \u2013 5m;\n\nPoderão ser admitidos afastamentos inferiores ao definido na alínea c),\ndesde que sejam cumpridas cumulativamente as seguintes condições:\n1. tenham sido iniciadas antes de 1995, servindo de comprovativo os\nortofotomapas do CNIG de 1995 ou as cópias de documentos entregues\nno Ministério da Economia até à referida data, para a\nregularização da atividade industrial;\n2. Desde que a ampliação resulte da necessidade de alterar o layout, não\nsendo possível cumprir o afastamento de 5 metros;\n3. Não colidam com a área \u201cnon aedificandi\u201d das vias do sistema\nprimário e secundário com as quais os terrenos confinem diretamente.\n\nÉ admitida a construção em banda ou geminada, devendo o afastamento\nàs estremas livres ser o definido nos parágrafos anteriores.\n\n5. Pisos\n\nOs edifícios em banda ou geminados não podem ter uma diferença do\nnúmero de pisos superior a dois acima da cota de soleira.\n\nAs construções que confinem com dois arruamentos desnivelados e que\npossuam duas frentes, não poderão ultrapassar os dois pisos acima\nda cota de soleira do arruamento situado à maior cota.\n\nNo caso em que a diferença de pisos resultar na criação de uma empena\ncega, esta deverá ser alvo de tratamento arquitetónico que passará\npelo seu revestimento com materiais utilizados na fachada principal.\n\nO número máximo de pisos abaixo da cota de soleira é de 3, contando\npara o efeito, o arruamento situado à menor cota.\n\nOs pisos situados abaixo da cota de soleira que seja possível observar a fachada posterior, terão que obedecer às seguintes regras:\na) Ser integradas visualmente na parcela onde se desenvolvem, devendo\nprivilegiar-se as situações de socalco;\nb) O talude entre o limite do último piso da cave e o limite do terreno não pode ser superior a 30%;\nc) As fachadas abaixo da cota de soleira deverão apresentar um tratamento\narquitetónico semelhante ao da fachada principal do edifício.\n\n6. Logradouros\n\nSó poderá ser impermeabilizada, no máximo, 50% da área não\nconstruída da parcela ou lote numa profundidade de 50 metros a\npartir do limite do espaço publico, admitindo-se nas parcelas ou\nlotes de reduzida dimensão que este valor seja ultrapassado, desde\nque se destine a pavimentação do acesso à garagem.\n\nPara além dos 50 metros a partir da via geradora de perímetro, não são\npermitidas quaisquer impermeabilizações que não as que resultem\ndas condições a edificar e dos seus acessos.\n\n7. Estacionamento\n\nAs novas construções, bem como as que venham a ser alvo de ampliação\nigual ou superior a 50% da área de construção licenciada, devem\nser garantidos os seguintes parâmetros quantitativos mínimos de\nestacionamento privativo:\nl) 1 lugar de estacionamento de veículos ligeiros por fogo de tipologia\nT0, T1 e T2 para edifícios plurifamiliares;\nm) 2 lugares de estacionamento de veículos ligeiros por fogo de\ntipologia T3 e T4 para edifícios plurifamiliares; n) 3 lugares de estacionamento de veículos ligeiros por fogo de\ntipologias superior a T4 para edifícios plurifamiliares;\no) 2 lugares de estacionamento de veículos por edifício unifamiliar;\np) 1 lugar de estacionamento de veículos ligeiros por cada 50 m2\nde área total de construção para comércio e ou serviços com\nárea total de construção igual ou inferior a 1000 m2,\ndevendo ser assegurados locais adequados para cargas e descargas;\nq) 1 lugar de estacionamento de veículos ligeiros por cada 25 m2\nde área total de construção para comércio e ou serviços com\nárea total de construção superior a 1000 m2, devendo\nser assegurados locais adequados para cargas e descargas;\nr) 1 lugar de estacionamento de veículos ligeiros por cada 200 m2\nde área total de construção para indústria e ou armazéns,\ndevendo ser assegurados locais adequados para cargas e descargas;\ns) 1 lugar de estacionamento de veículos pesados por cada 1000 m2\nde área total de construção para indústria e ou armazéns,\ndevendo ser assegurados locais adequados para cargas e descargas;\nt) 1 lugar de estacionamento de veículos ligeiros por cada 5 quartos\npara os estabelecimentos hoteleiros, acrescido de 1 lugar de veículo\npesado de passageiros por cada 50 quartos, com o mínimo de 1 lugar;\nu) 1 lugar de estacionamento de veículos ligeiros por cada 75 m2\nde área total de construção para equipamentos, acrescido de 1\nlugar para veículo pesado de passageiros por cada 500 m2\nde área total de construção, quando o uso em causa o justificar;\nv) 1 lugar de estacionamento de veículos ligeiros por cada 50 m2\nde área total de construção para oficinas automóveis.\n\nDeverá ser previsto estacionamento público correspondente, no mínimo, às\npercentagens a seguir indicadas, aplicadas aos valores de\nestacionamento obtidos para cada uma das alíneas referidas anteriormente:\na) 20% para os usos constantes da alínea a), b), c), e), f), j) e k),\npodendo no caso do uso ser oficina, o mesmo situar-se no interior do lote;\nb) 10% para os usos constantes na alínea g).\n\nA Câmara Municipal pode deliberar a dispensa total ou parcial do\ncumprimento da dotação de estacionamento estabelecido\nanteriormente, desde que se verifique uma das seguintes situações:\na) O seu cumprimento implicar a modificação da arquitetura original de\nedifícios ou na continuidade do conjunto edificado, que pelo seu\nvalor arquitetónico intrínseco, pela sua integração em conjuntos\ncaraterísticos ou em áreas de reconhecido valor paisagístico,\ndevem ser preservados;\nb) A impossibilidade ou a inconveniência de natureza técnica,\nnomeadamente em função das caraterísticas geológicas do terreno,\ndos níveis freáticos, do condicionamento da segurança das\nedificações envolventes, da interferência com equipamentos e\ninfraestruturas ou da funcionalidade dos sistemas públicos de\ncirculação de pessoas e veículos;\nc) As dimensões da parcela ou a sua situação urbana tornarem\ntecnicamente desaconselhável a construção do estacionamento com a\ndotação exigida, por razões de economia e funcionalidade interna.\n\nA não dotação dos lugares de estacionamento pelas razões referidas\nanteriormente, dá lugar ao pagamento de uma compensação ao\nMunicípio definida nos termos e condições estipuladas no artigo\n17.º/A1 do Código Regulamentar do Município publicado através do\nAviso n.º9745/2012 na 2.ª série do DR, N.º137, de 17 de julho,\nalterado pelos Avisos n.º13547/2012 na 2.ª série do DR, N.º197,\nde 11 de outubro, n.º860/2013 na 2.ª série do DR, N.º13, de 18 de\njaneiro, n.º7044/2013 na 2.ª série do DR, N.º103, de 29 de maio e\nn.º8779/2013 na 2.ª série do DR, N.º131, de 10 de julho.\n\n8. Cedências de áreas para espaços verdes e de utilização coletiva e de áreas para equipamentos de utilização coletiva\n\nOs parâmetros para o dimensionamento das áreas destinadas a espaços\nverdes e de utilização coletiva e de equipamentos de utilização\ncoletiva, em operações de loteamento ou operações urbanísticas\nde impacte semelhante a um loteamento, são os seguintes: \na) Para espaços verdes e de utilização coletiva:\na.1. 28 m2/fogo, no caso de habitação unifamiliar;\na.2. 0,23 m2/m2 de área total de construção, no caso de habitação coletiva;\na.3. 0,28 m2/m2 de área total de construção, no caso de comércio ou serviços;\na.4. 0,23 m2/m2 de área de construção, no caso de indústria ou armazéns;\nb) Para equipamentos de utilização coletiva:\nb.1. 35 m2/fogo, no caso de habitação unifamiliar;\nb.2. 0,29 m2/m2 de área total de construção, no caso de habitação coletiva;\nb.3. 0,25 m2/m2 de área total de construção, no caso de comércio ou serviços;\nb.4. 0,10 m2/m2 de área de construção, no caso de indústria ou armazéns;\n\nAs parcelas de terreno resultante da aplicação do disposto\nanteriormente, passarão a integrar o domínio municipal através de\ncedência gratuita ao município.\n\nO Município pode prescindir da integração do domínio municipal da\ntotalidade ou parte das parcelas referidas anteriormente, de acordo\ncom o estabelecido nos artigos 15.º/A1 e 16.º/A1 Código\nRegulamentar do Município publicado através do Aviso n.º9745/2012\nna 2.ª série do DR, N.º137, de 17 de julho, alterado pelos Avisos\nn.º13547/2012 na 2.ª série do DR, N.º197, de 11 de outubro,\nn.º860/2013 na 2.ª série do DR, N.º13, de 18 de janeiro,\nn.º7044/2013 na 2.ª série do DR, N.º103, de 29 de maio e\nn.º8779/2013 na 2.ª série do DR, N.º131, de 10 de julho.\n\n9. Anexos\n\nOs anexos terão de cumprir as seguintes condições:\na) Número máximo de pisos acima da cota de soleira, admitindo-se 1 destes em cave;\nb) A altura máxima da fachada é de 6 m, exceto nos casos em que os\nanexos se encontrem implantados à estrema, não podendo nestes\ncasos possuir uma empena superior a 3,5 metros de altura relativamente às parcelas vizinhas;\nc) Caso não sejam implantados às estremas, deverão cumprir os\nafastamentos mínimos impostos para a edificação principal.\n\nPara além das condições referidas anteriormente, os anexos terão\nsempre que ter em consideração a envolvente urbana e não\ncontribuir para a descaraterização urbanística e arquitetónica da\nedificação principal aos quais se encontram associados, assim como\ndo aglomerado urbano em que se inserem.\n\n10. Florestação\n\nÉ proibida a plantação de espécies de crescimento rápido, classificadas de acordo com a legislação em vigor.\n\n11. Áreas Abrangidas por cheias\n\nNas áreas abrangidas pelas cheias, as cotas dos pisos inferiores das\nedificações deverão ser superiores à cota local da máxima cheia,\nque é de 12,00 m.\n\nnestas áreas é interdita a construção de novas estruturas de saúde,\nestabelecimentos que utilizem substâncias perigosas e centrais\nelétricas.\n\nDisposições Específicas\n\nCorrespondem a áreas que se destinam preferencialmente a funções residenciais,\na ocupar predominantemente por edifícios unifamiliares,\ncomplementados por edifícios plurifamiliares, agregados ou isolados,\ne associados a funções comerciais e de serviços.\n\n1. Usos e condições de ocupação\na) Habitação;\nb) Comercio;\nc) Equipamentos de Utilização Coletiva.\n\nSão usos compatíveis \na) Indústrias do tipo 3, de acordo com a legislação em vigor de panificação\nou associadas a tecnologia de ponta;\nb) Grandes superfícies comerciais;\nc) Serviços;\nd) Empreendimentos turísticos.\n\n2. Regime de Edificabilidade\n\nAs regras a aplicar são as seguintes:\na) Número de pisos acima da cota de soleira com a exceção de moradias unifamiliares,\nindústrias, armazéns e oficinas \u2013 3;\nb) Número máximo de pisos acima da cota de soleira para moradias unifamiliares \u2013 2;\nc) Número máximo de pisos acima da cota de soleira para indústrias, armazéns e oficinas \u2013 2;\nd) Altura máxima da fachada para indústrias, armazéns e oficinas \u2013 9 m;\ne) Área total de anexos \u201315% da área da parcela ou lote;\nf) Índice máximo de ocupação do solo \u2013 0,75.\n\nExcecionalmente permite-se um número de pisos superior ao constante na anterior\nalínea a), até um máximo de 4 pisos, desde que se cumpra pelo menos uma das seguintes condições:\na) Os edifícios se localizem em encostas com inclinação significativa, devendo ter-se em atenção que:\n1. É proibida a execução de anexos ou garagens fora da área de implantação do edifício;\n2. Quando possível, a área da cobertura resultante do desenvolvimento do edifício em\nsocalcos, poderá apresentar um tratamento de espaço público e de circulação pedonal.\nb) Os edifícios apresentem uma componente de espaço público envolvente de dimensão significativa, nomeadamente:\n1. Praças;\n2. Largos;\n3. Alamedas.\nc) A largura do espaço publico com o qual o edifício irá confinar seja igual ou superior, em termos de dimensão, à altura de edificação."
                                            },
                                            "type": "Feature"
                                        }],
                                        "type": "FeatureCollection"
                                    },
                                    "type": "geojson"
                                },
                                {
                                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                                    "customParams": {
                                        "LAYERS": "carto2_5k",
                                        "STYLES": "",
                                        "VERSION": "1.1.1",
                                        "tiled": true
                                    },
                                    "layers": ["carto2_5k"],
                                    "opacity": 1,
                                    "styles": [""],
                                    "type": "WMS"
                                }
                            ],
                            "projection": "EPSG:3763",
                            "scale": 2000
                        },
                        "title": "ESPACO_RESIDENCIAL_URBANIZAVEL_TIPO_1"
                    }
                ],
                "map10k": {
                    "center": [
                        -26177,
                        101169
                    ],
                    "dpi": 200,
                    "layers": [{
                        "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                        "customParams": {
                            "LAYERS": "carto10k",
                            "STYLES": "",
                            "VERSION": "1.1.1",
                            "tiled": true
                        },
                        "layers": ["carto10k"],
                        "opacity": 1,
                        "styles": [""],
                        "type": "WMS"
                    }],
                    "projection": "EPSG:3763",
                    "rotation": 0,
                    "scale": 10000
                },
                "map2k": {
                    "center": [
                        -26177,
                        101169
                    ],
                    "dpi": 200,
                    "layers": [{
                        "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                        "customParams": {
                            "LAYERS": "carto2_5k",
                            "STYLES": "",
                            "VERSION": "1.1.1",
                            "tiled": true
                        },
                        "layers": ["carto2_5k"],
                        "opacity": 1,
                        "styles": [""],
                        "type": "WMS"
                    }],
                    "projection": "EPSG:3763",
                    "rotation": 0,
                    "scale": 2000
                },
                "pedido": "1999/2016",
                "purpose": "Planta de Condicionantes (REN)",
                "requerente": "Matilde Forjaz Rocha",
                "title": "Restaurants"
            }
        };


        var util = GeoExt.data.MapfishPrintProvider;
        var serializedLayers = util.getSerializedLayers(
            olMap,
            function (layer) {
                //console.log(layer);
                // do not print the extent layer
                //var isExtentLayer = (extent === layer);
                //console.log('Layer ' + layer.get('title') + ' → ' + (!isExtentLayer && layer.getVisible()));
                //console.log('Layer ' + layer.get('title') + ' → ' + (layer.get('layer') == 'carto2_5k' || layer.get('layer') == 'carto10k') );
                return (layer.get('title') == 'Detail');
                //return !isExtentLayer && layer.getVisible();
            }
        );

        //console.log('----------------------------------');
        //console.log(serializedLayers);
        //console.log('----------------------------------');

        var serializedLayers2k = JSON.parse(JSON.stringify(serializedLayers));
        var serializedLayers10k = JSON.parse(JSON.stringify(serializedLayers));

        // Preencher com camadas que vêem de uma tabela de base de dados, consoante o propósito da impressão.
        // Começar com um store na ViewModel...
        //

        // Atenção: Nos reports está uma condição. Só imprime a band summary com a legenda se o purpose (nome da planta) for diferente de "Plantas de Localização".
        var legendClass = JSON.parse('[]');

        switch (purposeId) {
            case 1:
            case 2:
            case 3:
                break;
            case 4:
                serializedLayers2k.push({
                    "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                    "customParams": {"VERSION": "1.1.1", "tiled": true},
                    "layers": ["carto2_5k"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                spec.attributes['map2k'] = {
                    center: center,
                    dpi: 200, // clientInfo.dpiSuggestions[0],
                    layers: serializedLayers2k,
                    projection: mapView.getProjection().getCode(),
                    rotation: mapView.getRotation(),
                    scale: 2000
                };
                break;
        }

        Server.Plantas.Pedidos.confrontacaoAsGeoJson({
            idpretensao: pretensaoid
        }, function (result, event) {
            if (result.success) {
                if (result.data.features) {
                    var features = (new ol.format.GeoJSON()).readFeatures(result.data);
                    // console.log(features);
                    var datasource = JSON.parse('[]');
                    var numOfPolygons = 0;
                    for (var i = 0; i < features.length; i++) {
                        var geotype = features[i].getGeometry().getType();
                        if (geotype == 'Polygon') {
                            numOfPolygons += 1;
                            var item = {};
                            item.title = features[i].get('dominio');
                            item.description = features[i].get('sumario');

                            var extent = features[i].getGeometry().getExtent();
                            var featureCenter = ol.extent.getCenter(extent);

                            item["map"] = {};
                            item.map.center = featureCenter;
                            item.map.dpi = 72;
                            item.map.projection = "EPSG:3763";
                            item.map.scale = 2000;
                            var json = (new ol.format.GeoJSON()).writeFeature(features[i]);
                            item.map.layers = [];
                            item.map.layers.push({
                                geoJson: {
                                    features: [ JSON.parse(json) ],
                                    type: "FeatureCollection"
                                },
                                type: "geojson"
                            });
                            item.map.layers.push({
                                baseURL: "http://softwarelivre.cm-agueda.pt/geoserver/wms",
                                customParams: {
                                    LAYERS: "carto2_5k",
                                    STYLES: "",
                                    VERSION: "1.1.1",
                                    tiled: true
                                },
                                layers: ["carto2_5k"],
                                opacity: 1,
                                styles: [""],
                                type: "WMS"
                            });
                            // console.log(item.map.layers[0].geoJson.features[0]);
                            datasource.push(item);
                        }
                    }
                    spec.attributes['datasource'] = datasource;

                    Ext.Ajax.request({
                        url: 'http://localhost:8080/print/print/infprevia/report.pdf',
                        // url: 'http://geoserver.sig.cm-agueda.pt/print/print/plantas/report.pdf',
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        jsonData: spec,
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            console.dir(obj);

                            var startTime = new Date().getTime();
                            me.downloadWhenReady(me, startTime, obj);

                            Ext.Msg.alert(Ext.String.format("Print request {0}".translate(), printid),
                                'Your Location Plan can take up to 30 seconds to be ready.'.translate() + '<br/>' +
                                'It will be downloaded automatically.'.translate() + '<br/>' +
                                'Please wait.'.translate());

                            /*
                             downloadURL: "/print/print/report/47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c"
                             ref: "47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c"
                             statusURL: "/print/print/status/47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c.json"
                             */

                            var folderpdf = 'print-requests/' + Math.floor(printid / 1000);
                            var pathpdf = folderpdf + '/' + printid + '.pdf';

                            Server.Plantas.Pedidos.update({
                                gid: printid,
                                pdf: pathpdf,
                                download_cod: obj.downloadURL,
                                //ref: obj.ref,
                                statusURL: obj.statusURL
                            }, function (result, event) {
                                if (result) {
                                    if (result.success) {
                                        console.log('Correu bem o update', result.message);
                                    } else {
                                        console.log('Correu mal o update', result.message);
                                    }
                                } else {
                                    console.log('Correu mal o update', result.message);
                                }
                            });
                        },

                        failure: function (response, opts) {
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });

                }
            } else {
                console.log('Não resultou nenhum polígono da confrontação', result.message);
            }
        });


    },

    downloadWhenReady: function (me, startTime, data) {
        if ((new Date().getTime() - startTime) > 50000) {
            console.log('Gave up waiting after 50 seconds');
        } else {
            //updateWaitingMsg(startTime, data);
            setTimeout(function () {
                Ext.Ajax.request({

                    url: 'http://localhost:8080' + data.statusURL,
                    // url: 'http://geoserver.sig.cm-agueda.pt' + data.statusURL,
                    success: function (response, opts) {
                        var statusData = Ext.decode(response.responseText);
                        //console.dir(statusData);

                        if (!statusData.done) {
                            me.downloadWhenReady(me, startTime, data);
                        } else {
                            window.location = 'http://localhost:8080' + statusData.downloadURL;
                            // window.location = 'http://geoserver.sig.cm-agueda.pt' + statusData.downloadURL;

                            //console.log('Downloading: ' + data.ref);
                            // refresh grid

                            var grid = me.getView().up('plantas').lookupReference('pedidoGrid');
                            //console.log('Reler a grid');
                            grid.store.load();
                        }
                    },
                    failure: function (response, opts) {
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }, 1000);
        }
    },

    onPaperClick: function (btn, menuitem) {
        var me = this;
        var view = this.getView();
        var canvas = view.down('mapcanvas');
        var olMap = canvas.map;

        var vm = view.getViewModel();
        vm.set('paper', menuitem.type);
        //console.log(menuitem.type);

        me.addPreviewPolygon(vm, olMap);
    },

    onOrientationClick: function (btn, menuitem) {
        var me = this;
        var view = this.getView();
        var canvas = view.down('mapcanvas');
        var olMap = canvas.map;

        var vm = view.getViewModel();
        vm.set('orientation', menuitem.type);
        //console.log(menuitem.type);

        me.addPreviewPolygon(vm, olMap);
    },

//    plantas = Ext.ComponentQuery.query('fullmap-plantas')[0];
//    map = plantas.down('mapcanvas').map;
//    layers = map.getLayers();
//    l6 = layers.getArray()[6];
//l6s = l6.getSource()


    //addPreviewPolygon: function (provider, view, vm, map, extent) {
    addPreviewPolygon: function (vm, map) {
        var center = map.getView().getCenter();
        //console.log(center);
        var layoutname = vm.get('paper') + '_' + vm.get('orientation');
        //console.log(vm.get(layoutname));

        var extentLayer = vm.get('extent');
        extentLayer.getSource().clear();

        var layout = vm.get(layoutname);
        var attr = layout.attributes(); // attr is "Ext.data.Store"
        // console.log(attr);
        // debug
        // Ext.getDisplayName(temp1)
        // "Ext.data.Store"

        attr.each(function (record) {
            //console.log(record.get('name') + ' → ' + record.get('type'));
            if (record.get('type') == 'MapAttributeValues') {
                var clientInfo = record.get('clientInfo');

                // saber a área de impressão
                // clientInfo is layout size in pixels
                var width_mm = clientInfo.width * 0.3527778;
                var height_mm = clientInfo.height * 0.3527778;

                // map2k → scale 2 (from mm → meters)
                // map10k → scale 10 (from mm → meters)
                var escala = record.get('name').match(/\d+/);
                if (escala.length > 0 && parseInt(escala[0]) > 0) {
                    var printWidthMeters = width_mm * parseInt(escala[0]);
                    var printHeightMeters = height_mm * parseInt(escala[0]);
                    var polinates = [];
                    polinates.push([center[0] - printWidthMeters / 2, center[1] - printHeightMeters / 2]);
                    polinates.push([center[0] - printWidthMeters / 2, center[1] + printHeightMeters / 2]);
                    polinates.push([center[0] + printWidthMeters / 2, center[1] + printHeightMeters / 2]);
                    polinates.push([center[0] + printWidthMeters / 2, center[1] - printHeightMeters / 2]);
                    polinates.push([center[0] - printWidthMeters / 2, center[1] - printHeightMeters / 2]);
                    //console.log(polinates);
                    var featureName = (parseInt(escala[0]) * 1000).toString();
                    var featureDescription = '1:' + featureName + ' print area';
                    var feature = new ol.Feature({
                        geometry: new ol.geom.Polygon([polinates]),
                        name: featureName,
                        description: featureDescription
                    });
                    var fakefeature = new ol.Feature({
                        geometry: new ol.geom.Point([center[0] + printWidthMeters / 2, center[1] - printHeightMeters / 2]),
                        name: featureName,
                        description: featureDescription
                    });
                    extentLayer.getSource().addFeature(feature);
                    extentLayer.getSource().addFeature(fakefeature);
                }

            }
        });

    },

    onPrintProviderReady: function (provider, view, vm, map, extent) {
        var me = this;
        //console.log('onPrintProviderReady');

        var capabilities = provider.capabilityRec;
        var layouts = capabilities.layouts();
        //console.log('Layouts disponíveis: ' + layouts.getCount());

        // all possible layouts
        vm.set('layouts', layouts);
        // current layout
        var layout = layouts.getAt(0); // portrait → A4 portrait, config.yaml

        for (var i = 0; i < layouts.getCount(); i++) {
            var name = layouts.getAt(i).get('name');
            //console.log('Layout ' + i + ' → ' + name);
            vm.set(name, layouts.getAt(i));
        }

        //me.addPreviewPolygon(provider, view, vm, map, extent);
        me.addPreviewPolygon(vm, map);

        map.getView().on('propertychange', function () {
            me.addPreviewPolygon(vm, map);
        });

        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            loader: function (extent, resolution, projection) {
                Server.Plantas.Pedidos.asGeoJson({
                    gid: 0
                }, function (result, event) {
                    // result == event.result
                    // console.debug(result);
                    // console.debug(event);
                    if (result.success) {
                        // console.log('SEM Problema no Server.Plantas.Pedidos.asGeoJson', result.message);
                        // console.log(result);
                        if (result.data.features) {
                            var features = (new ol.format.GeoJSON()).readFeatures(result.data);
                            // console.log(features);
                            vectorSource.addFeatures(features);
                        }
                        //processo_layer.addFeatures(geojson_format.read(result.data));
                    } else {
                        console.log('Problema no Server.Plantas.Pedidos.asGeoJson', result.message);
                    }
                });
            }
        });

        // Each feature represents a print request
        // The geometry of the print request is the center point
        var vectorJSON = new ol.layer.Vector({
            title: 'Pedidos',
            name: 'Pedidos--',
            source: vectorSource /*,
             style: new ol.style.Style({
             fill: new ol.style.Fill({
             color: [0, 255, 0, 0.3]
             }),
             stroke: new ol.style.Stroke({
             color: 'rgba(0, 255, 0, 0.8)',
             width: 2
             })
             })
             */
        });
        map.addLayer(vectorJSON);
        vm.set('pedidoLayer', vectorJSON);

        function styleFunction(feature, resolution) {
            var res;
            //console.log(feature);
            var geotype = feature.getGeometry().getType();

            res = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 51, 0, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ff3300',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ff3300'
                    })
                })
            });
            return [res];
        }

        // Each print request can have several features
        var printrequestdetaillayer = new ol.layer.Vector({
            title: 'Detail',
            name: 'Detail--',
            source: new ol.source.Vector(),
            style: styleFunction // must be a style function for the Vector serializer
        });
        map.addLayer(printrequestdetaillayer);
        vm.set('printrequestdetaillayer', printrequestdetaillayer);

        // API
        printrequestdetaillayer.getSource().on('addfeature', function (e) {
            console.log(arguments);
            console.log("feature added: ", e.feature.getGeometry().getType());
            vm.set('modified', true);
        });

        // API
        printrequestdetaillayer.getSource().on('removefeature', function (e) {
            console.log("feature removed: ", e.feature.getGeometry().getType());
            vm.set('modified', true);
        });

        // API
        printrequestdetaillayer.getSource().on('changefeature', function (e) {
            console.log("feature changefeature: ", e.feature.getGeometry().getType());
            vm.set('modified', true);
        });

        // API
        printrequestdetaillayer.getSource().on('clear', function () {
            console.log("clear");
            vm.set('modified', true);
        });

        var selectInteraction = new ol.interaction.Select({
            condition: ol.events.condition.singleClick,
            toggleCondition: ol.events.condition.shiftKeyOnly,
            layers: [printrequestdetaillayer],
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 3
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });

        //map.addInteraction(selectInteraction);
        vm.set('selectInteraction', selectInteraction);

        var modify = new ol.interaction.Modify({
            features: selectInteraction.getFeatures(),
            deleteCondition: function (event) {
                return ol.events.condition.shiftKeyOnly(event) &&
                    ol.events.condition.singleClick(event);
            }
        });
        // modify.on('modifyend',function(e) {
        //     var features = e.features.getArray();
        //     for (var i=0;i<features.length;i++){
        //         console.log("feature modify id is",features[i].getId());
        //         console.log("feature modify id is",features[i].getGeometry().getType());
        //     }
        //     vm.set('modified', true);
        // });

        //map.addInteraction(modify);
        vm.set('modify', modify);

    },

    onAfterLayersLoaded: function (view) {
        var me = this;
        //console.log('afterlayersloaded()@fullmap-plantas');

        var olMap = view.map;
        var mapView = olMap.getView();

        //mapView.setResolution(13.999999999999998);

        var vm = me.getView().getViewModel();

        // a default style is good practice!
        var defaultStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [0, 0, 128, 0.8],
                width: 2
            })
        });

        function styleFunction(feature, resolution) {
            var res;
            //console.log(feature);
            var geotype = feature.getGeometry().getType();
            var funcao = feature.get('name');
            switch (funcao) {
                case '2000': // color: [153, 0, 204, 1],
                    if (geotype == 'Polygon') {
                        res = new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: [153, 0, 204, 1],
                                lineDash: [4],
                                width: 2
                            })
                        });
                    } else { // (geotype == 'Point')
                        res = new ol.style.Style({
                            text: new ol.style.Text({
                                textAlign: 'right',
                                textBaseline: 'bottom',
                                font: '10px Verdana',
                                text: feature.get('description'),
                                //fill: new ol.style.Fill({color: [255, 153, 0, 0.4]}),
                                stroke: new ol.style.Stroke({color: [153, 0, 204, 1], width: 1}),
                                offsetX: 0,
                                offsetY: 0,
                                rotation: 0
                            })
                        });
                    }
                    break;
                case '10000': // color: [255, 102, 204, 1],
                    if (geotype == 'Polygon') {
                        res = new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: [255, 102, 204, 1],
                                lineDash: [4],
                                width: 2
                            })
                        });
                    } else { // (geotype == 'Point')
                        res = new ol.style.Style({
                            text: new ol.style.Text({
                                textAlign: 'right',
                                textBaseline: 'bottom',
                                font: '10px Verdana',
                                text: feature.get('description'),
                                //fill: new ol.style.Fill({color: [255, 153, 0, 0.4]}),
                                stroke: new ol.style.Stroke({color: [255, 102, 204, 1], width: 1}),
                                offsetX: 0,
                                offsetY: 0,
                                rotation: 0
                            })
                        });
                    }
                    break;
                default:
                    res = defaultStyle;
                    break;
            }
            return [res];
        }

        var extentLayer = new ol.layer.Vector({
            name: 'Área de Impressão--', // 'Área de Impressão--',  // legend tree
            source: new ol.source.Vector(),
            style: styleFunction
        });

        olMap.addLayer(extentLayer);
        vm.set('extent', extentLayer);

        Ext.create('GeoExt.data.MapfishPrintProvider', {
            url: "http://localhost:8080/print/print/plantas/capabilities.json",
            // url: "http://geoserver.sig.cm-agueda.pt/print/print/plantas/capabilities.json",
            listeners: {
                ready: function (provider) {
                    me.onPrintProviderReady(provider, view, vm, olMap, extentLayer);
                }
            }
        });

        var nominatimLayer = new ol.layer.Vector({
            name: 'nominatim--',  // legend tree
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

    }

});
