Ext.define('Admin.view.authentication.Register', {
    extend: 'Admin.view.authentication.LockingWindow',
    xtype: 'authregister',

    requires: [
        'Admin.view.authentication.Dialog',
        'Ext.form.Label',
        'Ext.form.field.Text',
        'Ext.form.field.Checkbox',
        'Ext.button.Button'
    ],

    title: 'User Registration'.translate(),
    defaultFocus: 'authdialog',  // Focus the Auth Form to force field focus as well

    items: [
        {
            xtype: 'authdialog',
            bodyPadding: '20 20',
            width: 455,
            reference : 'authDialog',

            defaultButton : 'submitButton',
            autoComplete: true,
            cls: 'auth-dialog-register',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults : {
                margin: '10 0',
                selectOnFocus : true
            },
            items: [
                {
                    xtype: 'label',
                    cls: 'lock-screen-top-label',
                    text: 'Create an account'.translate()
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    hideLabel: true,
                    allowBlank : false,
                    emptyText: 'Fullname'.translate(),
                    name: 'fullName',
                    bind: '{fullName}',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-email-trigger'
                        }
                    }
                }, /*
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    hideLabel: true,
                    allowBlank : false,
                    name: 'userid',
                    bind: '{userid}',
                    emptyText: 'Username',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-email-trigger'
                        }
                    }
                }, */
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    hideLabel: true,
                    allowBlank : false,
                    name: 'email',
                    emptyText: 'user@example.com'.translate(),
                    vtype: 'email',
                    bind: '{email}',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-envelope-trigger'
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    hideLabel: true,
                    allowBlank : false,
                    emptyText: 'Password'.translate(),
                    name: 'password',
                    inputType: 'password',
                    bind: '{password}',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-password-trigger'
                        }
                    }
                }, /*
                {
                    xtype: 'checkbox',
                    flex: 1,
                    name: 'agrees',
                    cls: 'form-panel-font-color rememberMeCheckbox',
                    height: 32,
                    bind: '{agrees}',
                    allowBlank : false,
                    boxLabel: 'I agree with the Terms and Conditions',

                    // In this case, the form operation is not VALID unless Terms are agreed upon
                    isValid: function() {
                        var me = this;
                        return me.checked || me.disabled;
                    }
                }, */
                {
                    xtype: 'button',
                    scale: 'large',
                    ui: 'soft-blue',
                    formBind: true,
                    reference: 'submitButton',
                    bind: false,
                    margin: '5 0',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: 'Signup'.translate(),
                    listeners: {
                        click: 'onSignupClick'
                    }
                }, /*
                {
                    xtype: 'box',
                    html: '<div class="outer-div"><div class="seperator">' + 'OR'.translate() + '</div></div>'

                },
                {
                    xtype: 'button',
                    scale: 'large',
                    ui: 'soft-blue',
                    margin: '5 0',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-facebook',
                    text: 'Login with Facebook'.translate(),
                    listeners: {
                        click: 'onFaceBookLogin'
                    }
                }, */
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
