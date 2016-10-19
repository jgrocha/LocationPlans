Ext.define('Admin.view.publicidade.PublicidadeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.publicidade',

    stores: {
        tipoPublicidade: {
            model: 'publicidade.TipoPublicidade',
            autoLoad: true,
            autoSync: false
        }

    }


});
