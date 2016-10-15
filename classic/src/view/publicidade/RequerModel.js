Ext.define('Admin.view.consulta.RequerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.requer',

    stores: {
        requer: {
            model: 'consulta.Requer',
            autoLoad: true,
            autoSync: false,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 20
        }
    }

});
