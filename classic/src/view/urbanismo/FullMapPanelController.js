Ext.define('Admin.view.urbanismo.FullMapPanelController', {
    extend: 'Admin.view.maps.FullMapPanelController',
    alias: 'controller.fullmap-urbanismo',

    onAfterLayersLoaded: function (view) {
        var me = this;
        console.log('afterlayersloaded()@fullmap-urbanismo');

        var olMap = view.map;
        var vm = view.getViewModel();
        //var vmurbanismo = view.up('urbanismo').getViewModel();

        function styleFunction(feature, resolution) {
            var res = vm.get('defaultStyle');
            if (feature) {
                var funcao = feature.get('funcao_uso');
                switch (funcao) {
                    case 'Edificio':
                        res = vm.get('edificioStyle');
                        break;
                    case 'Anexo':
                        res = vm.get('anexoStyle');
                        break;
                    default:
                        res = vm.get('defaultStyle');
                        break;
                }
            }

            return [res];
        }

        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: function (extent) {
                return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename=ide_local:edificado_vt_i&' +
                    'outputFormat=application/json&srsname=EPSG:3763&' +
                    'EXCEPTIONS=application/json&' +
                    'bbox=' + extent.join(',') + ',EPSG:3763';
            },
            strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ())
        });

        var vectorWFS = new ol.layer.Vector({
            title: 'Edificado (SIG)',
            name: 'Edificado (SIG)',
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
            return Ext.Array.indexOf(selectedFeatures, record.get("inspireid")) !== -1;
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
                console.log('selected → ' + feature.get('inspireid'));
                selectedFeatures.push(feature.get('inspireid'));featureStore.filterBy
                console.log(selectedFeatures);
            }, view);

            featureStore.filterBy(function (record, id) {
                return Ext.Array.indexOf(selectedFeatures, record.get("inspireid")) !== -1;
            }, this);

            console.log(featureStore.count());
        });
    }

});
