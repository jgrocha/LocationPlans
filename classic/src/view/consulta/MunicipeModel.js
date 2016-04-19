Ext.define('Admin.view.consulta.MunicipeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.municipe',

    stores: {
        municipe: {
            model: 'consulta.Municipe',
            autoLoad: true,
            autoSync: true,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 20
        }
    }

});
