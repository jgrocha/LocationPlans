Ext.define('Admin.view.plantas.ConfrontacaoFullMapPanelController', {
    extend: 'Admin.view.maps.FullMapPanelController',
    alias: 'controller.fullmap-confrontacao',
    requires: ['GeoExt.data.MapfishPrintProvider',
        'GeoExt.data.serializer.ImageWMS',
        'GeoExt.data.serializer.TileWMS',
        'GeoExt.data.serializer.Vector',
        'GeoExt.data.serializer.WMTS',
        'GeoExt.data.serializer.XYZ',
        'Ext.form.action.StandardSubmit'],

    listen: {
        controller: {
            'confrontacao': {
                loadconfrontacao: 'loadConfrontacao'
            }
        }
    },

    loadConfrontacao: function (pretensao) {
        console.log('loadConfrontacao');
        console.log(arguments);

        var me = this;
        var view = me.getView();
        var vm = view.getViewModel();
        var olMap = view.down('mapcanvas').map;
        var mapView = olMap.getView();

        var confrontacaolayer = vm.get('confrontacaolayer');
        // var features = confrontacaolayer.getSource().getFeatures();
        confrontacaolayer.getSource().clear();

        Server.Plantas.Pedidos.confrontacaoAsGeoJson({
            idpretensao: pretensao
        }, function (result, event) {
            if (result.success) {
                if (result.data.features) {
                    var features = (new ol.format.GeoJSON()).readFeatures(result.data);
                    console.log(features);
                    confrontacaolayer.getSource().addFeatures(features);
                    var extent = confrontacaolayer.getSource().getExtent();
                    mapView.fit(extent, olMap.getSize());

                    var featureStore = Ext.create('GeoExt.data.store.Features', {
                        layer: confrontacaolayer,
                        map: olMap
                    });

                    vm.setStores(Ext.apply(vm.getStores(), {'featureStore': featureStore}));

                    // vm.setStores(Ext.apply(vm.getStores(), {'featureStore': featureStore}));
                    // var grid = view.up('fullmap-confrontacao').up('confrontacao').down('featureGrid');
                    var grid = view.up('confrontacao').lookupReference('featureGrid');
                    console.log(grid);
                    console.log(view);
                    grid.setStore(featureStore);
                }
            } else {
                console.log('Problema no Server.Plantas.Pedidos.confrontacaoAsGeoJson', result.message);
            }
        });
    },

    onAfterLayersLoaded: function (view) {
        var me = this;
        console.log('afterlayersloaded()@Admin.view.plantas.ConfrontacaoFullMapPanelController');
        var olMap = view.map;
        var vm = me.getView().getViewModel();
        // Each print request can have several features
        var confrontacaolayer = new ol.layer.Vector({
            title: 'Confrontação',
            name: 'Confrontação--',
            source: new ol.source.Vector()
        });
        olMap.addLayer(confrontacaolayer);
        vm.set('confrontacaolayer', confrontacaolayer);

        // enable select elements
        var selectSingleClick = new ol.interaction.Select({
            layers: [confrontacaolayer]
        });
        olMap.addInteraction(selectSingleClick);
        vm.data.select = selectSingleClick;

        selectSingleClick.on('select', function (e) {
            var features = e.target.getFeatures();
            console.log('selectSingleClick');

            var geomapv = view.up('confrontacao');
            var grid = geomapv.lookupReference('featureGrid');

            e.selected.forEach(function (feature, idx, a) {
                var store = vm.getStore('featureStore');
                var record = store.getByFeature(feature);
                grid.getSelectionModel().select(record, true, true); // keepExisting = true, suppressEvent = true
            }, view);

            e.deselected.forEach(function (feature, idx, a) {
                var store = vm.getStore('featureStore');
                var record = store.getByFeature(feature);
                grid.getSelectionModel().deselect(record, true); // suppressEvent = true
            }, view);
        });

    }

});
