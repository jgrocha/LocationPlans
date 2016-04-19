Ext.define('Admin.view.authentication.PasswordReset', {
    extend: 'Admin.view.authentication.LockingWindow',
    xtype: 'passwordreset',

    requires: [
        'Admin.view.authentication.Dialog',
        'Ext.container.Container',
        'Ext.form.Label',
        'Ext.form.field.Text',
        'Ext.button.Button'
    ],

    title: 'Reset Password'.translate(),

    defaultFocus : 'authdialog',  // Focus the Auth Form to force field focus as well

    items: [
        {
            xtype: 'authdialog',
            width: 455,
            defaultButton: 'resetPassword',
            autoComplete: true,
            bodyPadding: '20 20',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults : {
                margin: '10 0'
            },

            cls: 'auth-dialog-login',
            items: [
                {
                    xtype: 'label',
                    cls: 'lock-screen-top-label',
                    text: 'Enter your email address for further reset instructions'.translate()
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    name: 'email',
                    hideLabel: true,
                    allowBlank: false,
                    emptyText: 'user@example.com'.translate(),
                    vtype: 'email',
                    bind: '{email}',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-email-trigger'
                        }
                    }
                },
                {
                    xtype: 'button',
                    reference: 'resetPassword',
                    scale: 'large',
                    ui: 'soft-blue',
                    formBind: true,
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: 'Request password'.translate(),
                    listeners: {
                        click: 'onResetClick'
                    }
                },
                {
                    xtype: 'component',
                    html: '<div style="text-align:right">' +
                    '<a href="#dashboard">'+
                    'Close'.translate() + '</a>' +
                    '</div>'
                }
            ]
        }
    ]
});
