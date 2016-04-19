Ext.define('Admin.view.infprevia.ConfrontacaoMapPanelController', {
    extend: 'Admin.view.maps.FullMapPanelController',
    alias: 'controller.fullmap-infprevia-confrontacao',

    control: {
        '#': {  // matches the view itself
            pretensaochanged: 'onPretensaoChanged'
        }
    },

    onLoadedWFS: function(source, map) {
        console.log('WFS loaded');

        var extent = source.getExtent();
        map.getView().fit(extent, map.getSize());

    },

    onPretensaoChanged: function (pretensao) {
        var vm = this.getView().getViewModel();
        if (pretensao) {
            console.log('onPretensaoChanged → ' + pretensao);
            var vectorSource = vm.get('layer');
            vectorSource.clear(true);
        }
    },

    onAfterLayersLoaded: function (view) {
        var me = this;
        // console.log('afterlayersloaded()@fullmap-infprevia-confrontacao');

        var olMap = view.map;

        //var vm = view.getViewModel(); // 'mapcanvas-1050'.getViewModel()
        var vm = me.getViewModel(); // 'fullmap-infprevia-confrontacao-1048'.getViewModel()
        var style = vm.get('greenStyle');

        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            loader: function (extent, resolution, projection) {
                var url = 'http://geomaster.pt:8080/geoserver/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename=geomaster:confrontacao&' +
                    'outputFormat=application/json&srsname=EPSG:3763&' +
                    'EXCEPTIONS=application/json&' +
                    'CQL_FILTER=idpretensao=' + vm.get('infprevia.pretensao');
                Ext.Ajax.request({
                    url: url,
                    method: 'GET',
                    success: function (response, request) {
                        // console.log('success');
                        if (response.request.success) {
                            var features = (new ol.format.GeoJSON()).readFeatures(response.responseText);
                            vectorSource.addFeatures(features);
                        }
                        me.onLoadedWFS(vectorSource, olMap);
                    },
                    failure: function (response) {
                        console.log('failure');
                    }
                });
            }
        });

        vm.set('layer', vectorSource);

        var vectorWFS = new ol.layer.Vector({
            title: 'Confrontação',
            name: 'Confrontação',
            source: vectorSource,
            style: style
        });

        olMap.addLayer(vectorWFS);
    }


});
