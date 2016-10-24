Ext.define('Admin.view.plantas.ConfrontacaoFullMapPanelController', {
    extend: 'Admin.view.maps.FullMapPanelController',
    alias: 'controller.fullmap-confrontacao',
    requires: ['GeoExt.data.MapfishPrintProvider',
        'GeoExt.data.serializer.ImageWMS',
        'GeoExt.data.serializer.TileWMS',
        'GeoExt.data.serializer.Vector',
        'GeoExt.data.serializer.WMTS',
        'GeoExt.data.serializer.XYZ',
        'Ext.form.action.StandardSubmit'],

    listen: {
        controller: {
            'confrontacao': {
                loadconfrontacao: 'loadConfrontacao',
                printconfrontacao: 'onPrintConfrontacao'
            }
        }
    },

    loadConfrontacao: function (pretensao) {
        console.log('loadConfrontacao');
        console.log(arguments);

        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();
        var olMap = view.down('mapcanvas').map;
        var mapView = olMap.getView();

        var confrontacaolayer = vm.get('confrontacaolayer');
        // var features = confrontacaolayer.getSource().getFeatures();
        confrontacaolayer.getSource().clear();

        Server.Plantas.Pedidos.confrontacaoAsGeoJson({
            idpretensao: pretensao
        }, function (result, event) {
            if (result.success) {
                if (result.data.features) {
                    var features = (new ol.format.GeoJSON()).readFeatures(result.data);
                    console.log(features);
                    confrontacaolayer.getSource().addFeatures(features);
                    var extent = confrontacaolayer.getSource().getExtent();
                    mapView.fit(extent, olMap.getSize());

                    var featureStore = Ext.create('GeoExt.data.store.Features', {
                        layer: confrontacaolayer,
                        map: olMap
                    });

                    vm.setStores(Ext.apply(vm.getStores(), {'featureStore': featureStore}));

                    // vm.setStores(Ext.apply(vm.getStores(), {'featureStore': featureStore}));
                    // var grid = view.up('fullmap-confrontacao').up('confrontacao').down('featureGrid');
                    var grid = view.up('confrontacao').lookupReference('featureGrid');
                    console.log(grid);
                    console.log(view);
                    grid.setStore(featureStore);
                }
            } else {
                console.log('Problema no Server.Plantas.Pedidos.confrontacaoAsGeoJson', result.message);
            }
        });
    },

    onAfterLayersLoaded: function (view) {
        var me = this;
        console.log('afterlayersloaded()@Admin.view.plantas.ConfrontacaoFullMapPanelController');
        var olMap = view.map;
        var vm = me.getView().getViewModel();
        // Each print request can have several features
        var confrontacaolayer = new ol.layer.Vector({
            title: 'Confrontação',
            name: 'Confrontação--',
            source: new ol.source.Vector()
        });
        olMap.addLayer(confrontacaolayer);
        vm.set('confrontacaolayer', confrontacaolayer);

        // enable select elements
        var selectSingleClick = new ol.interaction.Select({
            layers: [confrontacaolayer]
        });
        olMap.addInteraction(selectSingleClick);
        vm.data.select = selectSingleClick;

        selectSingleClick.on('select', function (e) {
            var features = e.target.getFeatures();
            console.log('selectSingleClick');

            var geomapv = view.up('confrontacao');
            var grid = geomapv.lookupReference('featureGrid');

            e.selected.forEach(function (feature, idx, a) {
                var store = vm.getStore('featureStore');
                var record = store.getByFeature(feature);
                grid.getSelectionModel().select(record, true, true); // keepExisting = true, suppressEvent = true
            }, view);

            e.deselected.forEach(function (feature, idx, a) {
                var store = vm.getStore('featureStore');
                var record = store.getByFeature(feature);
                grid.getSelectionModel().deselect(record, true); // suppressEvent = true
            }, view);
        });

        //
        var id = view.up('confrontacao').pretensaoid;
        console.log(id);
        me.loadConfrontacao(id);
    },

    onPrintConfrontacao: function (printid, pretensaoid, name) {

        //Ext.getDisplayName(temp2)
        console.log('printConfrontacao');

        var me = this;
        var view = this.getView();
        var olMap = view.down('mapcanvas').map;
        var mapView = view.down('mapcanvas').getView();

        // var viewFullMap = view.up('fullmap-plantas').getView();
        // var vm = viewFullMap.getViewModel();

        // var viewFullMap = view.up('fullmap-plantas').getView();
        var vm = view.getViewModel();

        var center = olMap.getView().getCenter();
        var layoutname = vm.get('paper') + '_' + vm.get('orientation');

        console.log(layoutname);


        /*
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

                switch (purposeId) {
                    case 1:
                    case 3:
                    case 4:
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
                }

                //serializedLayers.reverse();

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

                Ext.Ajax.request({
                    //url: 'http://localhost:8080/print/print/plantas/report.pdf',
                    url: 'http://geoserver.sig.cm-agueda.pt/print/print/plantas/report.pdf',
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

                        /!*
                         downloadURL: "/print/print/report/47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c"
                         ref: "47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c"
                         statusURL: "/print/print/status/47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c.json"
                         *!/

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
        */


    }

});
