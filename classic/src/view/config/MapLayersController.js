Ext.define('Admin.view.config.MapLayersController', {
    extend: 'Ext.app.ViewController',

    requires: ['Admin.model.geo.Applayers', 'Admin.model.geo.Layer'],

    alias: 'controller.maplayers',

    onLayersRefreshClick: function (button) {
        console.log('onLayersRefreshClick');
        var grid = this.lookupReference('layerGrid');
        grid.store.load();
    },

    onLayersEditClick: function (button) {
        console.log('onLayersEditClick');
    },

    onLayersRemoveClick: function (button) {
        console.log('onLayersRemoveClick');
    },

    onChangeView: function (combo, newValue, oldValue, eOpts) {
        console.log('onChangeView: ' + newValue);
    }


});