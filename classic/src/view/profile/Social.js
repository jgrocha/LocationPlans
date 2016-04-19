Ext.define('Admin.view.profile.Social', {
    extend: 'Ext.panel.Panel',
    xtype: 'profilesocialpanel',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.layout.container.VBox',
        'Ext.form.FieldSet',
        'Ext.form.action.DirectLoad',
        'Ext.form.action.DirectSubmit'
    ],

    controller: 'profilesocialpanel',

    height: 350, // 300,
    bodyPadding: 10,

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    cls: 'social-panel shadow-panel',

    items: [
        {
            xtype: 'image',
            cls: 'userProfilePic',
            height: 120,
            width: 120,
            //alt: 'profile-picture',
            //src: 'resources/images/Man-Silhouette-Clip-Art-160.jpg',
            bind: {
                src: '{current.user.fotografia160}'
            }
        },
        {
            xtype: 'component',
            cls: 'userProfileName',
            //height: '',
            bind: {
                html: '{current.user.nome}'
            }
        }, {
            xtype: 'form',
            reference: 'photoform',
            api: {
                submit: 'Server.DXFormUploads.filesubmit'
            },
            items: [{
                xtype: 'filefield',
                name: 'photo',
                itemId: 'photo',
                // fieldLabel : 'Photo',
                labelWidth: 50,
                msgTarget: 'side',
                allowBlank: true,
                anchor: '40%',
                buttonText: 'Choose photo'.translate(),
                buttonOnly: true,
                listeners: {
                    change: 'onButtonUpload'
                }
            }]
        },
        {
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls:'timeline-items-wrap user-profile-desc shadow-panel',
            items: [
                {
                    xtype: 'box',
                    componentCls: 'x-fa fa-envelope',
                    bind: {
                        html: '{current.user.email}'
                    },
                    padding: '0 0 12 0'
                }, {
                    xtype: 'box',
                    componentCls: 'x-fa fa-home',
                    bind: {
                        html: '{current.user.codpostal}' + '-' + '{current.user.despostal}'
                    },
                    padding: '0 0 12 0'
                },
                {
                    xtype: 'box',
                    componentCls: 'x-fa fa-clock-o',
                    bind: {
                        html: 'Membro desde {current.user.datacriacaoiso}'
                    },
                    padding: '0 0 12 0'
                }
            ]
        }


        /*
        {
            xtype: 'component',
            cls: 'userProfileDesc',
            html: 'CO-FOUNDER, CEO'
        },
        {
            xtype: 'container',
            layout: 'hbox',
            defaults: {
                xtype: 'button',
                margin: 5
            },
            margin: 5,
            items: [
                {
                    ui: 'blue',
                    iconCls: 'x-fa fa-facebook'
                },
                {
                    ui: 'soft-cyan',
                    iconCls: 'x-fa fa-twitter'
                },
                {
                    ui: 'soft-red',
                    iconCls: 'x-fa fa-google-plus'
                },
                {
                    ui: 'soft-purple',
                    iconCls: 'x-fa fa-envelope'
                }
            ]
        },
        {
            xtype: 'button',
            scale: 'large',
            width: 220,
            text: 'Follow'
        }
        */
    ]
});
