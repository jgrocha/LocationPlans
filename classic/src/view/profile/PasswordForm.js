Ext.define('Admin.view.profile.PasswordForm', {
    extend: 'Ext.panel.Panel',
    xtype: 'passwordform',
    requires: ['Admin.view.profile.PasswordFormModel', 'Ext.form.FieldSet'],
    bodyPadding: 10,

    height: 220,

    //layout: 'card',

    viewModel: {
        type: 'passwordform'
    },

    controller: 'passwordform',

    items: [{
        xtype: 'form',
        reference: 'passworddata',
        trackResetOnLoad: true, // saber que fields estão dirty
        title: 'Change password'.translate(),
        items: [ /*{
            xtype: 'textfield',
            fieldLabel: 'Current password'.translate(),
            name: 'old',
            inputType: 'password',
            anchor: '100%'
        },*/ {
            xtype: 'textfield',
            padding: '20 0 0 0',
            fieldLabel: 'New password'.translate(),
            name: 'newpassword',
            inputType: 'password',
            anchor: '100%',

            allowBlank : false,
            //vtype : 'checkpassword',
            minLength : 4,
            // msgTarget : 'under',
            msgTarget : 'side',
            minLengthText : 'The minimum are {0} characters'.translate()
        }, {
            xtype: 'textfield',
            fieldLabel: 'New password (repeat)'.translate(),
            name: 'newpasswordrepeat',
            inputType: 'password',
            anchor: '100%',

            allowBlank : false,
            //vtype : 'checkpassword',
            minLength : 4,
            // msgTarget : 'under',
            msgTarget : 'side',
            minLengthText : 'The minimum are {0} characters'.translate()
        }]
    }],

    bbar: {
        reference: 'navigation-toolbar',
        //margin: 8,
        style: 'background-color: transparent',
        items: [ '->', {
            text: 'Save'.translate(),
                ui: 'blue',
                formBind: true,
                listeners: {
                    click: 'onSaveClick'
                }
            }
        ]
    }
});
