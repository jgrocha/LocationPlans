Ext.define('Admin.view.publicidade.Mupi', {
    extend: 'Ext.panel.Panel',
    xtype: 'mupi',
    // requires: ['Admin.view.profile.PersonalDataFormModel', 'Ext.form.RadioGroup', 'Ext.form.FieldSet'],
    requires: ['Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],
    bodyPadding: '0 10 0 10',

    // height: 680,

    //layout: 'card',

    // viewModel: {
    //     type: 'edificioform'
    // },

    controller: 'mupi',

    title: 'Details'.translate(),

    items: [{
        xtype: 'form',
        reference: 'mupidetail',
        api: {
            submit: 'Server.DXFormUploads.filesubmitinstantaneo'
        },
        trackResetOnLoad: true, // saber que fields estão dirty
        items: [{
            xtype: 'fieldset',
            title: 'Identification'.translate(),
            frame: false,
            items: [{
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'ID'.translate(),
                    readOnly: true,
                    tooltip: 'Identificador único atribuído pela UT-SIG',
                    name: 'id_pub',
                    bind: '{publicidadeLevantadaGrid.selection.id_pub}',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'combobox',
                    fieldLabel: 'Type'.translate(),
                    flex: 1,
                    padding: '0 0 10 0',
                    name: 'tipo',
                    bind: {
                        store: '{tipoPublicidade}',
                        value: '{publicidadeLevantadaGrid.selection.tipo}'
                    },
                    valueField: 'codigo',
                    displayField: 'descricao',
                    typeAhead: true,
                    queryMode: 'local',
                    emptyText: 'Select the type...'.translate(),
                    tooltip: 'Advertising type'.translate(),
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'Use'.translate(),
                    tooltip: 'Uso do edifício de acordo com a licença de utilização emitida pelo Município',
                    bind: '{publicidadeLevantadaGrid.selection.uso}',
                    name: 'uso',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'textfield',
                    padding: '0 0 10 0',
                    // flex: 1,
                    labelAlign: 'right',
                    fieldLabel: 'Current use'.translate(),
                    tooltip: 'Uso corrente do edifício, independentemente do considerado na licença emitida pelo Município',
                    bind: '{publicidadeLevantadaGrid.selection.uso_corren}',
                    name: 'uso_corren',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Nº Proc.'.translate(),
                    bind: '{publicidadeLevantadaGrid.selection.num_proces}',
                    name: 'num_proces',
                    tooltip: 'Número do processo de obras',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'button',
                    margin: '0 0 10 105',
                    iconCls: 'x-fa fa-folder-open',
                    tooltip: 'Abrir requerimento'.translate(),
                    listeners: {
                        click: 'onButtonOpenProcess'
                    },
                    text: 'Abrir requerimento'.translate()
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'State'.translate(),
                    tooltip: 'Valores que indicam o estado da construção (devoluto, degradadao, ruínas, etc)',
                    bind: '{publicidadeLevantadaGrid.selection.estado}',
                    name: 'estado',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, /*{
                 xtype: 'checkboxfield',
                 name: 'siou',
                 labelAlign: 'right',
                 fieldLabel: 'SIOU',
                 boxLabel: '(registado no INE)',
                 tooltip: 'Registo de dados no Sistema de Indicadores de Operações Urbanísticas (SIOU) do INE',
                 bind: '{publicidadeLevantadaGrid.selection.siou}',
                 name: 'siou',
                 listeners: {
                 render: function (p) {
                 p.getEl().down('input').set({'data-qtip': p.tooltip});
                 }
                 }
                 },*/ {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'SIOU-INE'.translate(),
                    tooltip: 'Registo de dados no Sistema de Indicadores de Operações Urbanísticas (SIOU) do INE',
                    bind: '{publicidadeLevantadaGrid.selection.siou}',
                    name: 'siou',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'textfield',
                    padding: '0 0 10 0',
                    labelAlign: 'right',
                    fieldLabel: 'Nº Alvará'.translate(),
                    bind: '{publicidadeLevantadaGrid.selection.n_alvara}',
                    name: 'n_alvara',
                    tooltip: 'Número de alvará de utilização. Oficializa o edificado e o seu uso',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }]
            }]
        }, {
            xtype: 'fieldset',
            title: 'Notes'.translate(),
            frame: false,
            items: [{
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [/*{
                 xtype: 'htmleditor', // Está a dar erro após impressão, ao refazer o layout
                 grow: true,
                 // fieldLabel: 'obs'.translate(),
                 bind: {
                 value: '{publicidadeLevantadaGrid.selection.obs}'
                 },
                 // padding: '0 0 10 0',
                 flex: 1,
                 name: 'obs'
                 }*/ {
                    xtype: 'textareafield',
                    grow: true,
                    // fieldLabel: 'obs'.translate(),
                    bind: '{publicidadeLevantadaGrid.selection.obs}',
                    // padding: '0 0 10 0',
                    flex: 1,
                    name: 'obs'
                }]
            }]
        }, {
            xtype: 'fieldset',
            title: 'Photographs'.translate(),
            frame: false,
            items: [{
                xtype: 'fotografia',
                height: 132 // 140
            }]
        }, {
            autoWidth: true,
            // xtype : 'form',
            xtype: 'fieldset',
            // reference: 'buildingphotoform',
            // itemId : 'photos',
            layout: {
                pack: 'start',
                type: 'hbox'
            },
            // api : {
            //     // submit : 'Server.DXFormUploads.filesubmitbuilding'
            //     submit: 'Server.DXFormUploads.filesubmitinstantaneo'
            // },
            items: [ //{
                //     xtype: 'label',
                //     text: 'Associated media'
                // },
                {
                    xtype: 'filefield',
                    // padding: '0 10 0 0',
                    name: 'documento',
                    inputAttrTpl: 'accept="application/pdf"',
                    msgTarget: 'side',
                    allowBlank: true,
                    buttonOnly: true,
                    buttonText: 'PDF...',
                    buttonConfig: {
                        glyph: 0xf1c1 // fa-file-pdf-o [&#xf1c1;]
                    },
                    reset: function () {
                        /*
                         Não está a fazer nenhuma validação. Só serve para o file browser!
                         http://stackoverflow.com/questions/22554621/accept-image-in-filefield-extjs/26017499
                         */
                        var me = this,
                            clear = me.clearOnSubmit;
                        if (me.rendered) {
                            me.button.reset(clear);
                            me.fileInputEl = me.button.fileInputEl;
                            me.fileInputEl.set({
                                accept: 'application/pdf'
                            });
                            if (clear) {
                                me.inputEl.dom.value = '';
                            }
                            me.callParent();
                        }
                    },
                    listeners: {
                        change: 'onButtonUpload',
                        afterrender: function (cmp) {
                            cmp.fileInputEl.set({
                                accept: 'application/pdf'
                            });
                        }
                    }
                }, {
                    xtype: 'filefield',
                    // padding: '0 10 0 0',
                    name: 'instantaneo',
                    inputAttrTpl: 'accept="image/jpeg,image/png,image/tif"',
                    msgTarget: 'side',
                    allowBlank: true,
                    buttonOnly: true,
                    buttonText: 'Photo'.translate() + '...',
                    buttonConfig: {
                        glyph: 0xf030 // fa-camera [&#xf030;] // não está a funcionar...
                    },

                    reset: function () {
                        /*
                         Não está a fazer nenhuma validação. Só serve para o file browser!
                         http://stackoverflow.com/questions/22554621/accept-image-in-filefield-extjs/26017499
                         */
                        var me = this,
                            clear = me.clearOnSubmit;
                        if (me.rendered) {
                            me.button.reset(clear);
                            me.fileInputEl = me.button.fileInputEl;
                            me.fileInputEl.set({
                                accept: 'image/jpeg,image/png,image/tif,application/pdf'
                            });
                            if (clear) {
                                me.inputEl.dom.value = '';
                            }
                            me.callParent();
                        }
                    },
                    listeners: {
                        change: 'onButtonUpload',
                        afterrender: function (cmp) {
                            cmp.fileInputEl.set({
                                accept: 'image/jpeg,image/png,image/tif,application/pdf'
                            });
                        }
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-trash-o',
                    tooltip: 'Remove selected image or document'.translate(),
                    listeners: {
                        click: 'onButtonRemoverInstantaneo'
                    },
                    text: 'Remove'.translate()
                }]
        }/*, {
            xtype: 'fieldset',
            title: 'Dates'.translate(),
            frame: false,
            items: [{
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'datefield',
                    format: 'Y-m-d', // format to show the date
                    fieldLabel: 'Construction'.translate(),
                    bind: '{publicidadeLevantadaGrid.selection.data_const}',
                    name: 'data_const',
                    tooltip: 'Data de construção do edificio',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'datefield',
                    format: 'Y-m-d', // format to show the date
                    padding: '0 0 10 0',
                    // flex: 1,
                    labelAlign: 'right',
                    fieldLabel: 'Renovation'.translate(),
                    bind: '{publicidadeLevantadaGrid.selection.data_renov}',
                    name: 'data_renov',
                    tooltip: 'Data de renovação do edificio. Corresponde à data do último alvará',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }]
            }]
        }*/]
    }],

    bbar: {
        reference: 'navigation-toolbar',
        //margin: 8,
        style: 'background-color: transparent',
        items: [{
            text: 'Print'.translate(),
            ui: 'blue',
            // formBind: true,
            listeners: {
                click: 'onPrintClick'
            }
        }, '->', {
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
