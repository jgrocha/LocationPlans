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
        // console.log('onUploadSuccessful');
        var view = me.getView();
        var vm = view.getViewModel();
        var olMap = view.down('mapcanvas').map;

        var printrequestdetaillayer = vm.get('printrequestdetaillayer');
        var features = (new ol.format.GeoJSON()).readFeatures(json);
        // console.log(features);
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
        // console.log('onChangeGeometry: ' + newValue);
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
        // console.log('onChangePurpose: ' + newValue);
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
        // console.log('onUpload');

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
        // console.log('onConfrontacaoPreview');
        // console.log(arguments);
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
        // console.log(purposeId, purposeName);

        var features = printrequestdetaillayer.getSource().getFeatures();
        var numOfPolygons = 0;
        for (var i = 0; i < features.length; i++) {
            var geotype = features[i].getGeometry().getType();
            if (geotype == 'Polygon') {
                numOfPolygons += 1;
            }
        }
        // console.log("#polygons: ", numOfPolygons);
        if (vm.get('modified')) {
            // console.log('Features criados/editados');
        } else {
            // console.log('Features NÃO criados/editados');
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
                // console.log('Gravou bem', result.message);
                // console.log(result.data[0].gid);
                vm.set('modified', false);

                // if (purposeId != 4) {
                //     view.fireEvent('requestprintid', result.data[0].gid, 0, username);
                // }
                // já tenho o gid
                // gravar todos os desenhos
                var features = printrequestdetaillayer.getSource().getFeatures();

                if (features.length) {
                    // console.log('Temos detalhes para gravar');

                    var details = (new ol.format.GeoJSON()).writeFeatures(features);
                    Server.Plantas.Pedidos.saveGeoJsonDetail({
                        pedido: result.data[0].gid,
                        features: details
                    }, function (resultDetail, event) {
                        if (resultDetail.success) {
                            // console.log('Gravou bem ' + resultDetail.total + ' detalhes');
                            if (purposeId == 4) {
                                Server.Plantas.Pedidos.createConfrontacao({
                                    gid: result.data[0].gid
                                }, function (resultConfrontacao, event) {
                                    if (resultConfrontacao.success) {
                                        // console.log('Confrontacao bem lançada', resultConfrontacao);

                                        // to preview or print?
                                        if (eOpts.preview) {
                                            view.fireEvent('previewconfrontacao', view, result.data[0].gid, resultConfrontacao.data[0].id, resultConfrontacao.data[0].area, username);
                                        } else {
                                            view.fireEvent('requestprintidconfrontacao', result.data[0].gid, resultConfrontacao.data[0].id, resultConfrontacao.data[0].area, username);
                                        }
                                    } else {
                                        // TODO
                                        Ext.Msg.alert("Informação Prévia", "Não foi possível fazer a confrontação do polígono desenhado." + "<br/>" + "Verifique que o polígono é válido.");
                                        // console.log('Confrontaçãoo mal lançada', resultConfrontacao);
                                    }
                                });
                            } else {
                                view.fireEvent('requestprintid', result.data[0].gid, 0, username);
                            }

                        } else {
                            console.log('Gravou mal o detalhe', resultDetail);
                        }
                    });
                } else {
                    console.log('Não tem features para gravar');
                    view.fireEvent('requestprintid', result.data[0].gid, 0, username);
                }
            } else {
                console.log('Gravou mal o pedido', result);
            }
        });

    },

    onPreviewConfrontacao: function (view, printid, pretensaoid, area, name) {
        // console.log('onPreviewConfrontacao');
        // console.log(arguments);
        var me = this;
        var view = this.getView();
        var vm = view.getViewModel();

        var windows = Ext.ComponentQuery.query('confrontacao');
        if (windows.length > 0) {
            me.confrontacao = windows[0];
            me.confrontacao.show();
        } else {
            // console.log('Vou criar uma nova janela de confrontação');
            me.confrontacao = Ext.create('Admin.view.plantas.Confrontacao', {
                printid: printid,
                pretensaoid: pretensaoid,
                area: area
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
        // console.log(purposeId);
        var store = vm.getStore('purpose');
        var purposeName = store.getById(purposeId).get('name');
        // console.log(purposeId, purposeName);

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
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
                    "customParams": {"VERSION": "1.1.1", "tiled": true},
                    "layers": ["carto2_5k"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                serializedLayers10k.push({
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
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
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
                    "customParams": {"VERSION": "1.1.1", "transparent": true, "tiled": true},
                    "layers": ["ran_etrs89"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                serializedLayers2k.push({
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
                    "customParams": {"VERSION": "1.1.1", "tiled": true},
                    "layers": ["carto2_5k"],
                    "opacity": 0.4,
                    "styles": [""],
                    "type": "WMS"
                });
                // 10k
                serializedLayers10k.push({
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
                    "customParams": {"VERSION": "1.1.1", "transparent": true, "tiled": true},
                    "layers": ["ran_etrs89"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                serializedLayers10k.push({
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
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
                    "icons": ["http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=ran_etrs89&FORMAT=image%2Fpng&SCALE=2183915&LEGEND_OPTIONS=dpi:254"],
                    "name": "Reserva Agrícola Nacional"
                });
                /*
                 legendClass.push({
                 "icons": ["http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=carto10k&FORMAT=image%2Fpng"],
                 "name": "Cartografia 10k"
                 });
                 legendClass.push({
                 "icons": ["http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=carto2_5k&FORMAT=image%2Fpng"],
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
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
                    "customParams": {"VERSION": "1.1.1", "transparent": true, "tiled": true},
                    "layers": ["ren_etrs89"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                serializedLayers2k.push({
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
                    "customParams": {"VERSION": "1.1.1", "tiled": true},
                    "layers": ["carto2_5k"],
                    "opacity": 0.4,
                    "styles": [""],
                    "type": "WMS"
                });
                // 10k
                serializedLayers10k.push({
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
                    "customParams": {"VERSION": "1.1.1", "transparent": true, "tiled": true},
                    "layers": ["ren_etrs89"],
                    "opacity": 1,
                    "styles": [""],
                    "type": "WMS"
                });
                serializedLayers10k.push({
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
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
                    "icons": ["http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=ren_etrs89&FORMAT=image%2Fpng&SCALE=2183915&LEGEND_OPTIONS=dpi:254"],
                    "name": "Reserva Ecológica Nacional"
                });
                spec.attributes['legend'] = {
                    "classes": legendClass,
                    "name": ""
                };
                break;
            case 4:
                serializedLayers2k.push({
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
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
            url: Configuration.printserver + '/print/print/plantas/report.pdf',
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

    onPrintPlantaConfrontacao: function (printid, pretensaoid, area, name) {
        //Ext.getDisplayName(temp2)
        // console.log('onPrintPlantaConfrontacao');
        // console.log(arguments);

        var me = this;
        var view = this.getView();
        var olMap = view.down('mapcanvas').map;
        var mapView = view.down('mapcanvas').getView();

        var vm = view.getViewModel();
        var extent = vm.get('extent');

        var purposeId = vm.get('selectedPurpose');
        // console.log(purposeId);
        var store = vm.getStore('purpose');
        var purposeName = store.getById(purposeId).get('name');
        // console.log(purposeId, purposeName);

        var center = olMap.getView().getCenter();
        var layoutname = vm.get('paper') + '_' + vm.get('orientation');

        var stringifyFunc = ol.coordinate.createStringXY(0);
        var out = stringifyFunc(center);

        var spec = {
            layout: layoutname,
            outputFilename: printid,
            attributes: {
                centro: out,
                areaTotal: area,
                pedido: printid,
                requerente: name,
                purpose: purposeName,
                datasource: [],
                comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas, massa eget placerat fermentum, nunc massa facilisis enim, id eleifend orci lacus sed sem."
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

        // console.log('----------------------------------');
        // console.log(serializedLayers);
        // console.log(JSON.parse(JSON.stringify(serializedLayers)));
        // console.log('----------------------------------');

        // TODO
        // Fico com uma replica; não mudo o objeto original
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
                    "baseURL": "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
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

                            item.area = features[i].get('area');
                            item.percentagem = features[i].get('percentagem');
                            item.dominio = features[i].get('dominio');
                            item.subdominio = features[i].get('subdominio');
                            item.familia = features[i].get('familia');
                            item.objecto = features[i].get('objecto');
                            item.ident_gene = features[i].get('ident_gene');
                            item.ident_part = features[i].get('ident_part');
                            item.diploma_es = features[i].get('diploma_es');
                            item.sumario = features[i].get('sumario');
                            // item.sumario = Ext.util.Format.ellipsis(features[i].get('sumario'), 100);
                            item.texto = features[i].get('texto');
                            // item.texto = Ext.util.Format.ellipsis(features[i].get('texto'), 100);
                            item.hierarquia = features[i].get('hierarquia');
                            // item.hierarquia = Ext.util.Format.ellipsis(features[i].get('hierarquia'), 100);

                            var extent = features[i].getGeometry().getExtent();
                            var featureCenter = ol.extent.getCenter(extent);

                            item["map"] = {};
                            item.map.center = featureCenter;
                            item.map.dpi = 200;
                            item.map.projection = "EPSG:3763";
                            item.map.scale = 2000;
                            var json = (new ol.format.GeoJSON()).writeFeature(features[i]);
                            item.map.layers = [];
                            // item.map.layers.push(JSON.parse(JSON.stringify(serializedLayers)));

                            item.map.layers.push({
                                geoJson: {
                                    features: [JSON.parse(json)],
                                    type: "FeatureCollection"
                                },
                                type: "geojson",
                                style: {
                                    version: 2,
                                    "[dominio = 'PLANTA ORDENAMENTO']": {
                                        symbolizers: [
                                            {
                                                type: "polygon",
                                                fillColor: "#ff9900",
                                                fillOpacity: 0.4,
                                                strokeColor: "#ff9900",
                                                strokeOpacity: 1,
                                                strokeWidth: 2 // , strokeDashstyle: "dot"
                                            }
                                        ]
                                    },
                                    "[dominio = 'PLANTA CONDICIONANTES']": {
                                        symbolizers: [
                                            {
                                                type: "polygon",
                                                fillColor: "#006600",
                                                fillOpacity: 0.4,
                                                strokeColor: "#006600",
                                                strokeOpacity: 1,
                                                strokeWidth: 2 // , strokeDashstyle: "dot"
                                            }
                                        ]
                                    },
                                    "[dominio = 'LOTEAMENTO']": {
                                        symbolizers: [
                                            {
                                                type: "polygon",
                                                fillColor: "#cc00cc",
                                                fillOpacity: 0.4,
                                                strokeColor: "#cc00cc",
                                                strokeOpacity: 1,
                                                strokeWidth: 2 // , strokeDashstyle: "dot"
                                            }
                                        ]
                                    }
                                }
                            });

                            // Object.getOwnPropertyNames(temp1[0].style);
                            // [_gx3_style_0 = 'ext-207']
                            // "_gx3_style_0": "ext-200"

                            // console.log(serializedLayers2k[0].style);

                            // criar um clone, para não alterar o objecto original
                            var layerConfrontacao = JSON.parse(JSON.stringify(serializedLayers2k[0]));
                            delete layerConfrontacao.style;
                            layerConfrontacao.style = {
                                version: "2",
                                "*": {
                                    symbolizers: [
                                        {
                                            type: "polygon",
                                            fillColor: "#ff3300",
                                            fillOpacity: 0,
                                            strokeColor: "#ff3300",
                                            strokeOpacity: 0.7,
                                            strokeWidth: 2
                                        }
                                    ]
                                }

                            };

                            // serializedLayers2k[0].style["[_gx3_style_0 = 'ext-200']"]["symbolizers"][0]["strokeWidth"] = 1;

                            item.map.layers.push(layerConfrontacao);
                            item.map.layers.push(serializedLayers2k[1]);

                            /*                            item.map.layers.push({
                             baseURL: "http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms",
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
                             });*/
                            // console.log(item.map.layers[0].geoJson.features[0]);
                            datasource.push(item);
                        }
                    }
                    spec.attributes['datasource'] = datasource;

                    Ext.Ajax.request({
                        url: Configuration.printserver + '/print/print/infprevia/report.pdf',
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
                    // http://geoserver.sig.cm-agueda.pt/print/print/status/25b98152-4851-40ee-9815-d8165618356d@52c79669-f75a-4a72-994c-be63fc547666.json?_dc=1478194584027
                    url: Configuration.printserver + data.statusURL,
                    success: function (response, opts) {
                        var statusData = Ext.decode(response.responseText);
                        console.dir(statusData);

                        if (!statusData.done) {
                            me.downloadWhenReady(me, startTime, data);
                        } else {
                            if (statusData.status == "error") {
                                Ext.Msg.alert("Erro na geração do PDF", statusData.error);
                            } else {
                                window.location = Configuration.printserver + statusData.downloadURL;
                                // window.open(Configuration.printserver + statusData.downloadURL, '_blank');
                                //console.log('Downloading: ' + data.ref);
                                // refresh grid
                                var grid = me.getView().up('plantas').lookupReference('pedidoGrid');
                                //console.log('Reler a grid');
                                grid.store.load();
                            }
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
            // console.log(arguments);
            // console.log("feature added: ", e.feature.getGeometry().getType());
            vm.set('modified', true);
        });

        // API
        printrequestdetaillayer.getSource().on('removefeature', function (e) {
            // console.log("feature removed: ", e.feature.getGeometry().getType());
            vm.set('modified', true);
        });

        // API
        printrequestdetaillayer.getSource().on('changefeature', function (e) {
            // console.log("feature changefeature: ", e.feature.getGeometry().getType());
            vm.set('modified', true);
        });

        // API
        printrequestdetaillayer.getSource().on('clear', function () {
            // console.log("clear");
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
            url: Configuration.printserver + "/print/print/plantas/capabilities.json",
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
