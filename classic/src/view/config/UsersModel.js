Ext.define('Admin.view.config.UsersModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.users',

    stores: {
        users: {
            model: 'Utilizador',
            autoLoad: true,
            autoSync: true,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 20
        },
        group: {
            model: 'Group',
            autoLoad: true,
            autoSync: false
        },
        session: {
            model: 'Session',
            autoLoad: true,
            autoSync: true,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 20,
            filters: [{
                property: 'userid',
                type: 'number',
                value: '{usersGrid.selection.id}'
            }]
        }

    }

});
