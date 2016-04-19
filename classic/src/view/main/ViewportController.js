Ext.define('Admin.view.main.ViewportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainviewport',

    listen: {
        global: {
            loginComSucesso: 'onLoginComSucesso',
            logoutComSucesso: 'onLogoutComSucesso'
        },
        controller: {
            '#': {
                unmatchedroute: 'onRouteChange'
            },
            'authentication': {
                loginComSucesso: 'onLoginComSucesso'
            },
            '*': {
                logoutComSucesso: 'onLogoutComSucesso'
            }
        }
    },

    // http://extjs.eu/ext-examples/#route-mvvm
    routes: {
        ':node': {
            before: 'onBeforeRouteChange',
            action: 'onRouteChange'
        },
        'token/:token': {
            before: 'onBeforePasswordChange',
            action: 'onPasswordChange'
        },
        'registration/:token': {
            before: 'onBeforeConfirmRegistration',
            action: 'onConfirmRegistration'
        }
    },

    navigationTreeStoreLoaded: false,
    actionPending: null,

    init: function () {
        var me = this;
        // console.log('Admin.view.main.ViewportController.init()');

        me.getViewModel().set('flagCls', 'app-language-cls'.translate());
        me.getViewModel().set('language', 'app-language'.translate());
        me.getViewModel().set('languageName', 'app-language-name'.translate());

        //var navigationTreeStore = Ext.getStore('NavigationTree');
        var navigationTreeStore = me.getViewModel().getStore('navigationTree');

        navigationTreeStore.on('load', function (store) {
            // console.log('navigationTreeStore loaded');
            me.navigationTreeStoreLoaded = true;
            if (!window.location.hash) {
                // Nunca acontece por causa do Application.defaultToken
                // console.log('Nunca acontece!');
            } else {
                if (me.actionPending) {
                    // console.log('actionPending.resume()');
                    me.actionPending.resume();
                    me.actionPending = null;
                } else {
                    // por exemplo, no login e logout vem para aqui...
                    // console.log('Sem actionPending. Se leu a tree, volta ao dashboard');
                    me.setCurrentView("dashboard");
                }
            }
        });
        me.callParent(arguments);

    },

    onLoginComSucesso: function (user) {
        var me = this;
        var viewModel = me.getViewModel();
        viewModel.set('current.user', Ext.create('Admin.model.Utilizador', user));
        viewModel.set('current.user.login', "local");

        var treelist = this.getReferences().navigationTreeList;
        var estore = viewModel.getStore('navigationTree');

        me.navigationTreeStoreLoaded = false;
        estore.reload({
            params: {
                userid: viewModel.get('current.user.id')
            }
        });
        treelist.onRootChange(estore.getRoot());

        // me.redirectTo("dashboard");
    },

    onLogoutComSucesso: function () {
        var me = this;
        // console.log('logoutComSucesso()');
        //console.log(arguments);
        var refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            viewModel = me.getViewModel();

        mainCard.removeAll(true);
        viewModel.set('current.user.id', null);
        viewModel.set('current.user', null);

        var treelist = this.getReferences().navigationTreeList;
        var estore = viewModel.getStore('navigationTree');

        me.navigationTreeStoreLoaded = false;
        estore.reload({
            params: {
                userid: null
            }
        });
        treelist.onRootChange(estore.getRoot());

        // me.redirectTo("dashboard");
    },

    onLogoutClick: function (button) {
        // console.log('onLogoutClick');
        var me = this,
            viewModel = me.getViewModel();
        var id = viewModel.get('current.user.id');
        if (id) {
            Server.DXLogin.deauthenticate({}, function (result, event) {
                if (result.success) {
                    //Ext.Msg.alert(result.message);
                    //viewModel.set('current.user', null);

                    //me.application.fireEvent('logoutComSucesso');
                    me.fireEvent('logoutComSucesso');
                } else {
                    Ext.Msg.alert('Erro ao terminar a sessão.', Ext.encode(result));
                }
            });
        } else {
            // console.log('Não faz nada...');
        }
    },

    setCurrentView: function (hashTag) {
        hashTag = (hashTag || '').toLowerCase();

        var me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            navigationList = refs.navigationTreeList,
            viewModel = me.getViewModel(),
            vmData = viewModel.getData(),
        //store = navigationList.getStore(),
            store = viewModel.getStore('navigationTree'),
            node = store.findNode('routeId', hashTag),
            view = node ? node.get('extjsview') : null,
            lastView = vmData.currentView,
            existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
            newView;

            var rec, storeStatic = viewModel.getStore('navigationTreeStatic');
            if (!view) {
                // console.log(hashTag + ' available → navigationTreeStatic');
                rec = storeStatic.findRecord('routeId', hashTag);
                view = rec ? rec.get('extjsview') : null;
            }

        // Kill any previously routed window
        if (lastView && lastView.isWindow) {
            lastView.destroy();
        }

        lastView = mainLayout.getActiveItem();

        if (!existingItem) {
            newView = Ext.create('Admin.view.' + (view || 'pages.Error404Window'), {
                hideMode: 'offsets',
                routeId: hashTag
            });
        }

        //console.log('setCurrentView → mainCard');
        //console.log(mainCard);

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView isWindow
            // we don't add it to the card layout.
            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            }
            else {
                // newView is set (did not exist already), so add it and make it the
                // activeItem.
                Ext.suspendLayouts();
                mainLayout.setActiveItem(mainCard.add(newView));
                Ext.resumeLayouts(true);
            }
        }

        navigationList.setSelection(node);

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        vmData.currentView = newView;
    },

    onNavigationTreeSelectionChange: function (tree, node) {
        //console.log('onNavigationTreeSelectionChange');
        if (node && node.get('extjsview')) {
            //console.log(node);
            //console.log('redirect to: ' + node.get("text") + ' routeId: ' + node.get("routeId"));
            this.redirectTo(node.get("routeId"));
        }
    },

    onClickUserProfile: function (button) {
        this.redirectTo('profile'); // authentication.register
    },

    onClickNewUser: function (button) {
        // console.log('onNewUser');
        //console.log(node);
        this.redirectTo('authentication.register'); // authentication.register
    },

    onClickLogin: function (splitbutton) {
        // console.log('onClickLogin');
        var me = this;
        var viewModel = me.getViewModel();
        var id = viewModel.get('current.user.id');
        // console.log(id);
        if (!id) {
            this.redirectTo('authentication.login'); // authentication.register
        } else {
            // console.log('Não faz nada...');
        }
    },

    // ok
    onLanguageMenuClick: function (item, ev) {
        var me = this;
        // console.log('onLanguageMenuClick: → ' + item.text + ' → ' + item.action);

        Server.DXLogin.changeLanguage({
            lang: item.action
        }, function (result, event) {
            if (result.success) {
                window.location.reload();
            } else {
                Ext.Msg.alert('Error'.translate(), Ext.encode(result));
            }
        });
    },

    onBellClick: function (button) {
        var me = this;
        console.log('flag     → ' + me.getViewModel().get('flagCls'));
        console.log('language → ' + me.getViewModel().get('language'));
        console.log('language → ' + 'app-language'.translate());

        console.log('Server.DXLogin.ping');
        Server.DXLogin.ping({}, function (result, event) {
            if (result.success) {
                Ext.Msg.alert(result.message);
            } else {
                Ext.Msg.alert('Error'.translate(), Ext.encode(result));
            }
        });
    },

    onRemoveItemClick: function (button) {
        // https://fiddle.sencha.com/#fiddle/uoc
        // console.log('onRemoveItemClick');

        var treelist = this.getReferences().navigationTreeList;
        var estore = treelist.getStore();

        estore.reload({
            params: {userid: 25}
        });
        treelist.onRootChange(estore.getRoot());
    },

    onAddItemClick: function (button) {
        // console.log('onAddItemClick');

        var treelist = this.getReferences().navigationTreeList;
        var estore = treelist.getStore();

        estore.load({
            params: {userid: 25, from: 'test2'}
        });

        /*
         var treelist = this.getReferences().navigationTreeList;
         treelist.getStore().getRoot().cascadeBy(function (node) {
         var item, toolElement;
         item = treelist.getItem(node);
         if (item && item.isTreeListItem) {
         if (item.element.isVisible(true)) {
         console.log('Visible: ' + item.getText()); // .getNode()
         } else {
         console.log('Invisible: ' + item.getText());
         }
         }
         });
         */

    },

    // https://docs.sencha.com/extjs/6.0/components/trees.html
    // https://www.sencha.com/forum/showthread.php?304624-Ext.list.Tree-item-renderer-and-update
    //
    visitiList: function (treelist) {
        treelist.getStore().getRoot().cascadeBy(function (node) {
            var item, toolElement;
            item = treelist.getItem(node);
            if (item && item.isTreeListItem) {
                if (item.element.isVisible(true)) {
                    console.log('Visible: ' + item.getText()); // .getNode()
                } else {
                    console.log('Invisible: ' + item.getText());
                }
            }
        });
    },

    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navigationList = refs.navigationTreeList,
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 64 : 250;

        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();

            refs.senchaLogo.setWidth(new_width);

            navigationList.setWidth(new_width);
            navigationList.setMicro(collapsing);

            Ext.resumeLayouts(); // do not flush the layout here...

            // No animation for IE9 or lower...
            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout();  // ... since this will flush them
        }
        else {
            if (!collapsing) {
                // If we are leaving micro mode (expanding), we do that first so that the
                // text of the items in the navlist will be revealed by the animation.
                navigationList.setMicro(false);
            }

            // Start this layout first since it does not require a layout
            refs.senchaLogo.animate({dynamic: true, to: {width: new_width}});

            // Directly adjust the width config and then run the main wrap container layout
            // as the root layout (it and its chidren). This will cause the adjusted size to
            // be flushed to the element and animate to that new size.
            navigationList.width = new_width;
            wrapContainer.updateLayout({isRoot: true});

            // We need to switch to micro mode on the navlist *after* the animation (this
            // allows the "sweep" to leave the item text in place until it is no longer
            // visible.
            if (collapsing) {
                navigationList.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                    },
                    single: true
                });
            }
        }
    },

    onMainViewRender: function () {
        if (!window.location.hash) {
            // console.log('!window.location.hash → // this.redirectTo("dashboard");');
            // this.redirectTo("dashboard");
        } else {
            // console.log('window.location.hash = ' + window.location.hash);
        }
    },

    onRouteChange: function (id) {
        // console.log('onRouteChange(' + id + ')');
        if (this.navigationTreeStoreLoaded) {
            // console.log('navigationTreeStoreLoaded already loaded: setCurrentView to ' + id);
            this.setCurrentView(id);
        } else {
            // console.log('navigationTreeStoreLoaded NOT loaded: can not change to ' + id);
        }
    },

    onBeforeRouteChange: function (id, action) {
        // console.log('this.onBeforeRouteChange(' + id + ', ' + action + ')');
        var me = this;

        if (!this.navigationTreeStoreLoaded) {
            me.actionPending = action;
        } else {
            action.resume();
        }
    },

    onBeforePasswordChange: function (id, action) {
        // console.log('this.onBeforePasswordChange(' + id + ', ' + action + ')');
        var me = this;
        Server.DXLogin.beforeReset({token: id}, function (result, event) {
            if (result.success) {
                var viewModel = me.getViewModel();
                // viewModel.set('current.user', Ext.create('Admin.model.Utilizador', result.data[0]));
                // viewModel.set('current.user.login', "local");
                viewModel.set('current.passwordChangeEmail', result.data[0].email);
                viewModel.set('current.token', result.data[0].token);
                // console.log('current.passwordChangeEmail = ' + result.data[0].email);
                // console.log('current.token = ' + result.data[0].token);

                if (!me.navigationTreeStoreLoaded) {
                    me.actionPending = action;
                } else {
                    action.resume();
                }
            } else {
                action.stop();
                Ext.Msg.alert('Invalid password reset request'.translate(), 'This reset password request is not valid anymore.'.translate() + '<br/>'
                    + 'You should make another password reset request if to change your password.'.translate(), function () {
                    me.setCurrentView("dashboard");
                });
            }
        });
    },

    onBeforeConfirmRegistration: function (id, action) {
        // console.log('this.onBeforeConfirmRegistration(' + id + ', ' + action + ')');
        var me = this;
        Server.DXLogin.confirmEmail({token: id}, function (result, event) {
            if (result.success) {
                var viewModel = me.getViewModel();
                // viewModel.set('current.user', Ext.create('Admin.model.Utilizador', result.data[0]));
                // viewModel.set('current.user.login', "local");
                viewModel.set('current.passwordChangeEmail', result.data[0].email);
                viewModel.set('current.token', result.data[0].token);
                // console.log('current.passwordChangeEmail = ' + result.data[0].email);
                // console.log('current.token = ' + result.data[0].token);

                if (!me.navigationTreeStoreLoaded) {
                    me.actionPending = action;
                } else {
                    action.resume();
                }
            } else {
                action.stop();
                Ext.Msg.alert('Invalid email confirmation request'.translate(), 'This email confirmation is not valid anymore.'.translate() + '<br/>'
                    + 'Either you have to register again or reset your password to login.'.translate(), function () {
                    me.setCurrentView("dashboard");
                });
            }
        });
    },

    onConfirmRegistration: function (id) {
        var me = this;
        // console.log('this.setCurrentView(' + id + ')');
        Ext.Msg.alert('Email confirmed'.translate(), 'Your email is considered valid.'.translate() + '<br/>'
            + 'You can now login.'.translate(), function () {
            if (me.navigationTreeStoreLoaded) {
                me.setCurrentView('authentication.login');
            }
        });
    },

    onPasswordChange: function (id) {
        // console.log('this.setCurrentView(' + id + ')');
        if (this.navigationTreeStoreLoaded) {
            this.setCurrentView('authentication.passwordchange');
        }
    },

    onSearchRouteChange: function () {
        this.setCurrentView('search');
    },

    onEmailRouteChange: function () {
        this.setCurrentView('email');
    }

});
