Ext.define('Admin.view.consulta.EmbargoModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.embargo',

    stores: {
        embargo: {
            model: 'consulta.Embargo',
            autoLoad: true,
            autoSync: false,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 20
        }
    }

});
