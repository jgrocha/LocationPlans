Ext.define('Admin.view.maps.MapTreeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.maptree',

    mapTreeSelectionChanged: function (selmodel, selected) {
        //<debug>
        console.log('mapTreeSelectionChanged');
        //</debug>
        var vm = this.getView().up('fullmap').getViewModel();
        vm.set('selectedlayer', '');
        Ext.each(selected, function (rec) {
            console.log(rec.get('text'));
            vm.set('selectedlayer', rec.get('text'));
        });
    }

    
});
