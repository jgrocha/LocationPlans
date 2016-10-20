Ext.define('Admin.view.plantas.ConfrontacaoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.confrontacao',

    onLoadConfrontacaoClick: function (button) {
        console.log('onLoadConfrontacaoClick');
        var me = this;
        var view = me.getView();
        console.log('onLoadConfrontacaoClick: ' + view.pretensaoid);
        me.fireEvent('loadconfrontacao', view.pretensaoid);
    },

    featureGridSelectionChanged: function (grid, selected) {
        console.log('featureGridSelectionChanged');

        var vm = this.getView().down('fullmap-confrontacao').getViewModel();
        var selectControl = vm.data.select;
        var map = selectControl.getMap();
        var view = map.getView();
        var mapExtent = view.calculateExtent(map.getSize());
        selectControl.getFeatures().clear();
        Ext.each(selected, function (rec) {
            var gridSelectedFeature = rec.getFeature();
            selectControl.getFeatures().push(gridSelectedFeature);
            if (!ol.extent.containsCoordinate(mapExtent, gridSelectedFeature.getGeometry().getCoordinates())) {
                view.setCenter(ol.extent.getCenter(gridSelectedFeature.getGeometry().getExtent()));
            }
        });
    }

});