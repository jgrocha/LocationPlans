Ext.define('Admin.view.infprevia.FullMapPanelController', {
    extend: 'Admin.view.maps.FullMapPanelController',
    alias: 'controller.fullmap-infprevia',

    onAfterLayersLoaded: function (view) {
        var me = this;
        console.log('afterlayersloaded()@fullmap-infprevia');

        var olMap = view.map;

        // TODO: filtrar por utilizador
        // TODO: tratar erros: Se o urh estiver mal, o ol3 não se queixa com EXCEPTIONS=application/json, mas não reporta nada à aplicação
        /*
         Para tratar erros, em vez de se usar um 'url' deveria-se usar um 'loader' e tratar aí os erros.
         Cf. http://gis.stackexchange.com/questions/123149/layer-loadstart-loadend-events-in-openlayers-3
         Cf. http://openlayers.org/en/v3.13.1/apidoc/ol.source.Vector.html
         */

        var vm = view.getViewModel();
        var style = vm.get('redStyle');

        //var vminfprevia = view.up('infprevia').getViewModel();

        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: function (extent) {
                return 'http://geomaster.pt:8080/geoserver/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename=geomaster:pretensao&' +
                    'outputFormat=application/json&srsname=EPSG:3763&' +
                    'EXCEPTIONS=application/json&' +
                    'bbox=' + extent.join(',') + ',EPSG:3763';
            },
            strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ())
        });

        var vectorWFS = new ol.layer.Vector({
            title: 'Pretensões',
            name: 'Pretensões',
            source: vectorSource,
            style: style,
            maxResolution: 2.199129376979828 // The maximum resolution (exclusive) below which this layer will be visible.
        });

        //vectorSource.once('change', function(e) {
        vectorSource.on('change', function (e) {
            console.log(' → change event → ' + e.target.getState());
        }, me);

        ////vectorSource.once('change', function(e) {
        //vectorSource.on(['tileloadend', 'tileloaderror', 'tileloadstart'], function(e) {
        //    console.log('→→→ tile event: ' +  e.target.getState());
        //}, me);

        olMap.addLayer(vectorWFS);

        // select interaction working on "click"
        var selectClick = new ol.interaction.Select({
            condition: ol.events.condition.click,
            layers: [vectorWFS]
        });

        olMap.addInteraction(selectClick);

        vm.set('infprevia.pretensao', '');

        selectClick.on('select', function (e) {
            selectedFeatures = [];
            e.target.getFeatures().forEach(function (feature, idx, a) {
                selectedFeatures.push(feature.get('id'));
            }, view);

            if (selectedFeatures.length > 0) {
                vm.set('infprevia.pretensao', selectedFeatures[0]);
            } else {
                vm.set('infprevia.pretensao', '');
            }
            console.log("vminfprevia.get('infprevia.pretensao') → " + vm.get('infprevia.pretensao') );
        });

    }

});
