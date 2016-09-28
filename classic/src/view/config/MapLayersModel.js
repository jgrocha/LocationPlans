Ext.define('Admin.view.config.MapLayersModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.maplayers',

    data: {
        app: 40
    },

    stores: {
        maplayers: {
            model: 'geo.Layer',
            autoLoad: true,
            autoSync: true,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 20,
            filters: [{
                property: 'viewid',
                type: 'number',
                value: '{app}'
            }]
        },
        applications: {
            model: 'geo.Applayers',
            autoLoad: true,
            autoSync: true,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 20
        }
    }

});
