Ext.define('Admin.view.config.LayersModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.layers',

    stores: {
        layers: {
            model: 'geo.Layer',
            autoLoad: true,
            autoSync: true
        }
    }

});
