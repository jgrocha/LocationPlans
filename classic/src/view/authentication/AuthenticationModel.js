Ext.define('Admin.view.authentication.AuthenticationModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.authentication',

    data: {
        userid : '',
        fullName : '',
        password : '',
        password2x : '',
        email    : '',
        persist: false,
        agrees : false
    }
    /*
    , formulas: {
        currentUser: {
            get: function(get) {
                return this.get('current.user');
            },
            set: function(user) {
                this.set('current.user', user);
            }
        }
    }
    */
});