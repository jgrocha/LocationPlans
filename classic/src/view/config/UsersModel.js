Ext.define('Admin.view.config.UsersModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.users',

    stores: {
        users: {
            model: 'Utilizador',
            autoLoad: true,
            autoSync: true
        }
    }

});
