Ext.define('Admin.view.redeviaria.FullMapPanelController', {
    extend: 'Admin.view.maps.FullMapPanelController',
    alias: 'controller.fullmap-redeviaria',

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

    }

});
