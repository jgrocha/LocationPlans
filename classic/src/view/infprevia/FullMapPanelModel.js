Ext.define('Admin.view.infprevia.FullMapPanelModel', {
    extend: 'Admin.view.maps.FullMapPanelModel',
    alias: 'viewmodel.fullmap-infprevia',

    data: {
        redStyle: new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 0, 0, 0.3]
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 0, 0, 0.8)',
                width: 2
            })
        })
    }

});
