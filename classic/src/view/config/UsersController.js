Ext.define('Admin.view.config.UsersController', {
    extend: 'Ext.app.ViewController',

    requires: ['Admin.model.Utilizador'],

    alias: 'controller.users',

    onUsersRefreshClick: function (button) {
        var grid = this.lookupReference('usersGrid');
        grid.store.load();
    },

    onUsersRemoveClick: function (button) {
        var grid = this.lookupReference('usersGrid');
        var sm = grid.getSelectionModel();

        // console.log('Selected users:' +  sm.getSelection().length );

        if (sm.getSelection().length == 1) {
            Ext.Msg.confirm('Attention'.translate(), 'Are you sure you want to delete this user?'.translate(), function (buttonId, text, opt) {
                if (buttonId == 'yes') {
                    grid.store.remove(sm.getSelection());
                    if (grid.store.getCount() > 0) {
                        sm.select(0);
                    }
                }
            });
        }

    }

});