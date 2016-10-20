Ext.define('Admin.view.geo.MapGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.geo-mapgrid',

    featureGridSelectionChanged: function (grid, selected) {
        //<debug>
        console.log('featureGridSelectionChanged');
        //</debug>

        var vm = this.getView().up('geo-map').getViewModel();
        var featureStore = vm.getStore('featureStore');
        var selectControl = vm.data.select;
        var map = selectControl.getMap();
        var view = map.getView();
        var mapExtent = view.calculateExtent(map.getSize());
        selectControl.getFeatures().clear();
        Ext.each(selected, function (rec) {
            var gridSelectedFeature = rec.getFeature();
            selectControl.getFeatures().push(gridSelectedFeature);
            if (!ol.extent.containsCoordinate(mapExtent, gridSelectedFeature.getGeometry().getCoordinates())) {
                var centerTo = ol.extent.getCenter(gridSelectedFeature.getGeometry().getExtent());
                // without animation
                //view.setCenter(centerTo);
                // with animation
                var pan = ol.animation.pan({
                    duration: 1000,
                    source: view.getCenter()
                });
                map.beforeRender(pan);
                view.setCenter(centerTo);
            }
        });

    }

});
