Ext.define('Admin.view.publicidade.FullMapPanelController', {
    extend: 'Admin.view.maps.FullMapPanelController',
    alias: 'controller.fullmap-publicidade',

    onAfterLayersLoaded: function (view) {
        var me = this;
        console.log('afterlayersloaded()@fullmap-publicidade');

        var olMap = view.map;
        // var vm = view.getViewModel();
        var vm = me.getView().getViewModel();

        //var vmurbanismo = view.up('urbanismo').getViewModel();

        console.log('Publicidade FullMapPanel Controller ViewModel onAfterLayersLoaded');
        console.log(vm);

        var vectorSource = new ol.source.Vector({
            format: new ol.format.GeoJSON({
                defaultDataProjection: 'EPSG:3763'
            }),
            url: function (extent) {
                return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename=pub:pub3763&' +
                    'outputFormat=application/json&srsname=EPSG:3763&' +
                    'EXCEPTIONS=application/json&' +
                    'bbox=' + extent.join(',') + ',EPSG:3763';
            },
            strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ())
        });

        var vectorWFS = new ol.layer.Vector({
            title: 'Publicidade WFS',
            // name: 'Publicidade WFS--',  // não mostrar na legend tree
            name: 'Publicidade WFS',  // não mostrar na legend tree
            source: vectorSource,
            // style: styleFunction,
            // style: simpleStyleFunction,
            maxResolution: 1.09956468849 // 2.199129376979828 // The maximum resolution (exclusive) below which this layer will be visible.
        });

        olMap.addLayer(vectorWFS);

        var featureStore = Ext.create('GeoExt.data.store.Features', {
            layer: vectorWFS,
            map: olMap
        });

        var grid = view.up('publicidade').down('gridpublicidadelevantada');
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

        // featureStore.on('datachanged', function () {
        featureStore.on('filterchange', function () {
            // console.log('filterchange');
            // console.log(arguments);
            var sm = grid.getSelectionModel();
            sm.deselectAll();
            sm.select(0);
        });

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
