Ext.define('Admin.view.urbanismo.FullMapPanelModel', {
    extend: 'Admin.view.maps.FullMapPanelModel',
    alias: 'viewmodel.fullmap-urbanismo',

    data: {
        defaultStyle: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [153, 102, 0, 0.8],
                width: 2
            })
        }),
        anexoStyle: new ol.style.Style({
            fill: new ol.style.Fill({
                color: [204, 153, 0, 0.4]
            }),
            stroke: new ol.style.Stroke({
                color: [204, 153, 0, 1],
                width: 2
            })
        }),
        edificioStyle: new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 153, 0, 0.4]
            }),
            stroke: new ol.style.Stroke({
                color: [255, 153, 0, 1],
                width: 2
            })
        })

    }

});
