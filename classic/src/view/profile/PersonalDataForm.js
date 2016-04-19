Ext.define('Admin.view.profile.PersonalDataForm', {
    extend: 'Ext.panel.Panel',
    xtype: 'personaldataform',
    requires: ['Admin.view.profile.PersonalDataFormModel', 'Ext.form.RadioGroup', 'Ext.form.FieldSet'],
    bodyPadding: 10,

    height: 680,

    //layout: 'card',

    viewModel: {
        type: 'personaldataform'
    },

    controller: 'personaldataform',

    items: [{
        xtype: 'form',
        reference: 'personaldata',
        trackResetOnLoad: true, // saber que fields estão dirty
        title: 'Personal data'.translate(),
        items: [{
            xtype: 'fieldset',
            title: 'Identification'.translate(),
            frame: false,
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Name'.translate(),
                name: 'nome',
                //bind: '{current.user.nome}',
                anchor: '100%'
            }, {
                xtype: 'textfield',
                fieldLabel: 'VAT number'.translate(),
                //bind: '{current.user.nif}',
                name: 'nif'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Civil ID'.translate(),
                //bind: '{current.user.nic}',
                name: 'nic'
            }, {
                // xtype: 'fieldcontainer',
                xtype: 'radiogroup',
                cls: 'wizard-form-break',
                fieldLabel: 'Sex'.translate(),
                defaultType: 'radiofield',
                defaults: {
                    flex: 1
                },
                //bind: {
                //    value: '{sexradiogroup}'
                //},
                layout: 'hbox',
                items: [{
                    boxLabel: 'Male'.translate(),
                    name: 'sexo',
                    inputValue: 'male'
                }, {
                    boxLabel: 'Female'.translate(),
                    name: 'sexo',
                    inputValue: 'female'
                }]
            }]
        }, {
            xtype: 'fieldset',
            title: 'Telephone numbers'.translate(),
            frame: false,
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Telephone'.translate(),
                //bind: '{current.user.telefone}',
                name: 'telefone'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Mobile'.translate(),
                //bind: '{current.user.telemovel}',
                name: 'telemovel'
            }]
        }, {
            xtype: 'fieldset',
            title: 'Postal address'.translate(),
            frame: false,
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Address'.translate(),
                name: 'morada',
                //bind: '{current.user.morada}',
                anchor: '100%'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Location'.translate(),
                name: 'localidade',
                //bind: '{current.user.localidade}',
                anchor: '100%'
            }, {
                xtype: 'container', // was panel
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Zip code'.translate(),
                    name: 'codpostal',
                    //bind: '{current.user.codpostal}',
                    width: 192,
                    maxLength: 8, // 4715-281
                    minLength: 4,
                    minLengthText: 'The zip code must have 4 digits at least'.translate()
                }, {
                    xtype: 'textfield',
                    padding: '0 0 0 10',
                    //width: 176,
                    flex: 1,
                    name: 'despostal',
                    bind: '{current.user.despostal}'
                }]
            }]
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
