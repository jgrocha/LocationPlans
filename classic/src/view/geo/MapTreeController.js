Ext.define('Admin.view.geo.MapTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.geo-maptree',

    mapTreeSelectionChanged: function (selmodel, selected) {
        //<debug>
        console.log('mapTreeSelectionChanged');
        //</debug>
        var vm = this.getView().up('geo-map').getViewModel();
        vm.set('selectedlayer', '');
        Ext.each(selected, function (rec) {
            console.log(rec.get('text'));
            vm.set('selectedlayer', rec.get('text'));
        });
    }

    
});
