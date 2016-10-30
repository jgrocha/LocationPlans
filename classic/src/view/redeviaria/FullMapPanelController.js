Ext.define('Admin.view.redeviaria.FullMapPanelController', {
    extend: 'Admin.view.maps.FullMapPanelController',
    alias: 'controller.fullmap-redeviaria',

    onHora: function (item, e, eOpts) {
        console.log('onHora');
        console.log(e.target.textContent);

        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();
        vm.set('hora', parseInt(e.target.textContent));

        me.doLoadDiaHora();
    },

    onDiaDaSemana: function (item, e, eOpts) {
        console.log('onDiaDaSemana');
        console.log(e.target.textContent);

        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();
        vm.set('diadasemana', parseInt(e.target.textContent));

        me.doLoadDiaHora();
    },

    doLoadDiaHora: function () {
        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();

        if (vm) {
            console.log('vm ok');
        } else {
            console.log('vm not defined');
        }

        var olMap = view.down('mapcanvas').map;
        var mapView = olMap.getView();

        var trafegolayer = vm.get('trafegolayer');

        if (trafegolayer) {
            trafegolayer.getSource().clear();

            Server.Plantas.Pedidos.trafegoAsGeoJson({
                diadasemana: vm.get('diadasemana'),
                hora: vm.get('hora')
            }, function (result, event) {
                if (result.success) {
                    // console.log('SEM Problema no Server.Plantas.Pedidos.trafegoAsGeoJson', result.message);
                    //console.log(result);
                    if (result.data.features) {
                        var features = (new ol.format.GeoJSON()).readFeatures(result.data);
                        // console.log(features);
                        trafegolayer.getSource().addFeatures(features);
                    }
                } else {
                    console.log('Problema no Server.Plantas.Pedidos.trafegoAsGeoJson', result.message);
                }
            });
        } else {
            console.log('trafegolayer not defined');
        }

    },

    onAfterLayersLoaded: function (view) {
        var me = this;
        console.log('afterlayersloaded()@fullmap-redeviaria');

        var olMap = view.map;

        var vectorWFS = new ol.layer.Vector({
            title: 'Eixos da Rede Viária',
            name: 'Eixos da Rede Viária',
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: function (extent) {
                    return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                        'version=1.1.0&request=GetFeature&typename=ide_local:eixos_rodovia_2k&' +
                        'outputFormat=application/json&srsname=EPSG:3763&' +
                        'bbox=' + extent.join(',') + ',EPSG:3763';
                },
                strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ())
            }),
            maxResolution: 1.09956468849 // 2.199129376979828 // The maximum resolution (exclusive) below which this layer will be visible.
        });

        olMap.addLayer(vectorWFS);

        var defaultStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [0, 0, 128, 0.8],
                width: 2
            })
        });

        function styleFunction(feature, resolution) {
            var res;
            // console.log(feature);
            // console.log(feature.get('media'));
            var media = feature.get('media');
            // var geotype = feature.getGeometry().getType();

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
                }),
                text: new ol.style.Text({
                    textAlign: 'center',
                    textBaseline: 'bottom', // 'top', // 'middle',
                    font: '18px Calibri,sans-serif',
                    text: '' + media,
                    fill: new ol.style.Fill({color: 'black'}),
                    stroke: new ol.style.Stroke({color: 'white', width: 1})
                })
            });
            return [res];
        }

        var trafegolayer = new ol.layer.Vector({
            title: 'Radares',
            name: 'Radares',
            source: new ol.source.Vector(),
            style: styleFunction
        });
        olMap.addLayer(trafegolayer);

        var vm = view.up('fullmap-redeviaria').getViewModel();
        if (vm) {
            vm.set('trafegolayer', trafegolayer);
        } else {
            console.log('Error, vm not defined');
        }
    }

});
