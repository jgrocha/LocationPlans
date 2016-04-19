Ext.define('Admin.view.main.Viewport', {
    extend: 'Ext.container.Viewport',
    xtype: 'mainviewport',

    plugins: [
        'viewport'
    ],

    requires: [
        'Ext.plugin.Viewport',
        'Ext.list.Tree'
    ],

    controller: 'mainviewport',
    viewModel: {
        type: 'mainviewport'
    },

    cls: 'sencha-dash-viewport',
    itemId: 'mainView',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    // listeners: {
    //     render: 'onMainViewRender' // not used
    // },

    items: [
        {
            xtype: 'toolbar',
            cls: 'sencha-dash-dash-headerbar toolbar-btn-shadow',
            height: 64,
            itemId: 'headerBar',
            items: [{
                xtype: 'component',
                reference: 'senchaLogo',
                cls: 'sencha-logo',
                html: '<div class="main-logo"><img width="' + Configuration.headerlogowidth + '" height="' + Configuration.headerlogoheight + '" src="' + Configuration.headerlogo + '">' + Configuration.headertitle + '</div>',
                width: 250
            }, {
                margin: '0 0 0 8',
                cls: 'delete-focus-bg',
                iconCls: 'x-fa fa-navicon',
                id: 'main-navigation-btn',
                handler: 'onToggleNavigationSize'
            }, {
                xtype: 'tbspacer',
                flex: 1
            }, {
                xtype: 'image',
                cls: 'header-right-profile-image',
                height: 35,
                width: 35,
                //alt: 'Profile image',
                bind: {
                    src: '{current.user.fotografia32}'
                }
            }, {
                xtype: 'splitbutton',
                text: 'Login'.translate(),
                iconCls: 'header-right-profile-image',
                bind: {
                    //icon: '{current.user.fotografia}',
                    text: '{sessionLabel}'
                },
                resizable: true,
                scale: 'medium',
                handler: 'onClickLogin',
                menu: [{
                    text: 'Profile'.translate(),
                    visible: false,
                    bind: {
                        visible: '{current.user.id}'
                    },
                    iconCls: 'x-fa fa-user',
                    //itemId: 'botaoLogout',
                    handler: 'onClickUserProfile'
                }, {
                    text: 'Logout'.translate(),
                    disabled: true,
                    bind: {
                        disabled: '{!current.user.id}'
                    },
                    iconCls: 'x-fa fa-sign-out',
                    //itemId: 'botaoLogout',
                    handler: 'onLogoutClick'
                }]
            }, {
                xtype: 'button',
                iconCls: 'button-home-small',
                bind: {
                    text: '{languageName}',
                    iconCls: '{flagCls}'
                },
                text: 'Small',
                menu: [{
                    text: 'English',
                    iconCls: 'english',
                    action: 'en',
                    handler: 'onLanguageMenuClick'
                }, {
                    text: 'Português',
                    iconCls: 'portuguese',
                    action: 'pt-PT',
                    handler: 'onLanguageMenuClick'
                } /*, {
                 text:'Español',
                 iconCls: 'spanish',
                 action: 'es',
                 handler: 'onLanguageMenuClick'
                 } */]
            }]
        },
        {
            xtype: 'maincontainerwrap',
            id: 'main-view-detail-wrap',
            reference: 'mainContainerWrap',
            flex: 1,
            items: [{
                xtype: 'treelist',
                reference: 'navigationTreeList',
                itemId: 'navigationTreeList',
                ui: 'navigation',
                bind: {
                    store: '{navigationTree}'
                },
                width: 250,
                expanderFirst: false,
                expanderOnly: false,
                listeners: {
                    selectionchange: 'onNavigationTreeSelectionChange'
                }
            }, {
                xtype: 'container',
                flex: 1,
                reference: 'mainCardPanel',
                cls: 'sencha-dash-right-main-container',
                itemId: 'contentPanel',
                layout: {
                    type: 'card',
                    anchor: '100%'
                }
            }]
        }
    ]

});
