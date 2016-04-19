Ext.define('Admin.view.main.ViewportModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.mainviewport',

    requires: [
        'Ext.data.TreeStore'
    ],

    init: function () {
        var me = this;
        console.log('Admin.view.main.ViewportModel.init()');
        me.callParent(arguments);
    },

    data: {
        currentView: null,
        current: {
            user: null
        },
        flagCls: 'english', // 'app-language-cls'.translate()
        language: 'en', // 'app-language'.translate() // 'pt-PT', 'es', etc
        languageName: 'English'
    },

    formulas: {
        sessionLabel: {
            get: function (get) {
                var n = get('current.user.nome');
                return n ? n : 'Login'.translate();
            },
            set: function (value) {
                this.set('current.user.nome', value);
            }
        }
    },

    stores: {
        //https://www.sencha.com/forum/showthread.php?293227-Binding-external-stores-using-a-viewmodel-Type-is-alias-and-alias-is-type
        navigationTree: {
            type: 'tree',
            root: {
                // expanded: true    // the same as autoLoad: true
                expanded: false    // the same as autoLoad: false
            },
            fields: [{
                name: 'text',
                    convert: function (v, rec) {
                        return rec.get('text').translate();
                    }
            }],
            proxy: {
                type: 'direct',
                directFn: 'Server.Users.User.readNavTree',
                extraParams: {
                    userid: null
                }
            }
        },
        // these views are always necessary. They are not loaded in the tree list
        navigationTreeStatic: {
            autoLoad: true,
            fields: ['text', 'routeId', 'extjsview'],
            data: [{
                "text": "Password Reset",
                    "routeId": "authentication.passwordreset",
                    "extjsview": "authentication.PasswordReset"
                }, {
                    "text": "Password Change",
                    "routeId": "authentication.passwordchange",
                    "extjsview": "authentication.PasswordChange"
                }, {
                    "text": "Register",
                    "routeId": "authentication.register",
                    "extjsview": "authentication.Register"
                }, {
                    "text": "Login",
                    "routeId": "authentication.login",
                    "extjsview": "authentication.Login"
                }, {
                    "text": "Profile",
                    "routeId": "profile",
                    "extjsview": "profile.UserProfile"
                }]
        },
        // not used!
        idioms: {
            fields: ['language', 'name', 'icon'],
            data: [
                {"language": "pt-PT", "name": "Português", "icon": "portuguese"},
                {"language": "en", "name": "English", "icon": "english"},
                {"language": "es", "name": "Español", "icon": "spanish"}
            ]
        }
    }

});
