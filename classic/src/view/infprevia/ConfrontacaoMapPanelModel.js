Ext.define('Admin.view.infprevia.ConfrontacaoMapPanelModel', {
    extend: 'Admin.view.maps.FullMapPanelModel',
    alias: 'viewmodel.fullmap-infprevia-confrontacao',

    data: {
        greenStyle: new ol.style.Style({
            fill: new ol.style.Fill({
                color: [0, 255, 0, 0.3]
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 255, 0, 0.8)',
                width: 2
            })
        })
    }

});
