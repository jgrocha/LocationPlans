Ext.define('Admin.view.plantas.ConfrontacaoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.confrontacao',

    afterRenderConfrontacao: function () {
        // console.log('afterRenderConfrontacao');
        var view = this.getView();
        var vm = this.getView().getViewModel();
        var title = "Confrontação da pretensão " + view.pretensaoid + " com os instrumentos de gestão do território. Área: " +
            Ext.util.Format.number(view.area, '0,0') + ' m²';
        vm.set('title', title);
    },

    onCenterClick: function (button) {
        console.log('onCenterClick');
    },

    onPrintConfrontacaoClick: function (button) {
        console.log('onPrintConfrontacaoClick');
    },

    featureGridSelectionChanged: function (grid, selected) {
        // console.log('featureGridSelectionChanged');

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