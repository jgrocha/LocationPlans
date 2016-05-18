Ext.define('Admin.view.urbanismo.FullMapPanelController', {
    extend: 'Admin.view.maps.FullMapPanelController',
    alias: 'controller.fullmap-urbanismo',

    onAfterLayersLoaded: function (view) {
        var me = this;
        console.log('afterlayersloaded()@fullmap-urbanismo');

        var olMap = view.map;
        var vm = view.getViewModel();
        //var vmurbanismo = view.up('urbanismo').getViewModel();

        var styleFunction = (function () {
            var styles = {};
            return function (feature) {
                var res;
                if (feature instanceof ol.Feature) {
                    var text = "";
                    if (feature.get('fotografias') > 0) {
                        text = feature.get('fotografias') + "";
                    }
                    styles['Edificio'] = [new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: [255, 153, 0, 0.4]
                        }),
                        stroke: new ol.style.Stroke({
                            color: [255, 153, 0, 1],
                            width: 2
                        })/*,
                        text: new ol.style.Text({
                            text: text
                        })*/
                    })];
                    styles['Anexo'] = [new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: [204, 153, 0, 0.4]
                        }),
                        stroke: new ol.style.Stroke({
                            color: [204, 153, 0, 1],
                            width: 2
                        })/*,
                        text: new ol.style.Text({
                            text: text
                        })*/
                    })];
                    styles['default'] = [new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: 'red',
                            width: 3
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 0, 0, 0.1)'
                        })/*,
                        text: new ol.style.Text({
                            text: text
                        })*/
                    })];
                    res = styles[feature.get('uso')] || styles['default'];
                    if (feature.get('fotografias') > 0) {
                        res.push(new ol.style.Style({
                            image: new ol.style.Icon({
                                src: 'resources/images/icons/applications-photography.svg'
                            }),
                            geometry: function (feature) {
                                // return the coordinates of the first ring of the polygon
                                // var coordinates = feature.getGeometry().getCoordinates()[0];
                                var center = ol.extent.getCenter(feature.getGeometry().getExtent());
                                return new ol.geom.Point(center);
                            }
                        }));
                    }
                    return res;
                }
            };
        })();

        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON({
                defaultDataProjection: 'EPSG:3763'
            }),
            url: function (extent) {
                return 'http://geoserver.sig.cm-agueda.pt:8080/geoserver/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename=marte:edificado_vti2&' +
                    'outputFormat=application/json&srsname=EPSG:3763&' +
                    'EXCEPTIONS=application/json&' +
                    'bbox=' + extent.join(',') + ',EPSG:3763';
            },
            strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ())
        });

        var vectorWFS = new ol.layer.Vector({
            title: 'Edificado WFS',
            name: 'Edificado WFS',
            source: vectorSource,
            style: styleFunction,
            maxResolution: 1.09956468849 // 2.199129376979828 // The maximum resolution (exclusive) below which this layer will be visible.
        });

        olMap.addLayer(vectorWFS);

        var featureStore = Ext.create('GeoExt.data.store.Features', {
            layer: vectorWFS,
            map: olMap
        });

        var grid = view.up('urbanismo').down('urbanismogridedificado');
        console.log(grid);
        grid.setStore(featureStore);

        featureStore.clearFilter();
        var selectedFeatures = [];
        featureStore.filterBy(function (record, id) {
            return Ext.Array.indexOf(selectedFeatures, record.get("gid")) !== -1;
        }, this);

        //var grid = view.up('urbanismo').down('mapgridurbanismo');
        //console.log(grid);
        //grid.setStore(featureStore);

        // enable select elements
        var selectSingleClick = new ol.interaction.Select({
            layers: [vectorWFS]
        });
        olMap.addInteraction(selectSingleClick);

        selectSingleClick.on('select', function (e) {
            selectedFeatures = [];
            e.target.getFeatures().forEach(function (feature, idx, a) {
                // console.log('selected → ' + feature.get('gid'));
                selectedFeatures.push(feature.get('gid'));
                // console.log(selectedFeatures);
            }, view);

            featureStore.filterBy(function (record, id) {
                return Ext.Array.indexOf(selectedFeatures, record.get("gid")) !== -1;
            }, this);

            // console.log(featureStore.count());
        });
    }

});
