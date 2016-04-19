Ext.define('Admin.view.maps.MapCanvasModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.mapcanvas',
    requires: ['Admin.model.geo.Layer'],

    data: {
        name: 'MapCanvasModel',
        view: 1
    },

    stores: {
        geolayers: {
            model: 'Admin.model.geo.Layer',
            autoLoad: false,
            autoSync: false,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 99
        }
    }

});
