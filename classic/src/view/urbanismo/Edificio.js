Ext.define('Admin.view.urbanismo.Edificio', {
    extend: 'Ext.panel.Panel',
    xtype: 'edificio',
    // requires: ['Admin.view.profile.PersonalDataFormModel', 'Ext.form.RadioGroup', 'Ext.form.FieldSet'],
    requires : ['Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],
    bodyPadding: '0 10 0 10',

    // height: 680,

    //layout: 'card',

    // viewModel: {
    //     type: 'edificioform'
    // },

    controller: 'edificio',

    title: 'Building details'.translate(),

    items: [{
        xtype: 'form',
        reference: 'buidingdetail',
        api : {
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
                    name: 'id_edifica',
                    bind: '{edificadoGrid.selection.id_edifica}' // ,
                }, {
                    xtype: 'textfield',
                    padding: '0 0 10 0',
                    flex: 1,
                    labelAlign: 'right',
                    name: 'nome',
                    fieldLabel: 'Name'.translate(),
                    bind: '{edificadoGrid.selection.nome}'
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Type'.translate(),
                    bind: '{edificadoGrid.selection.tipo}',
                    name: 'tipo'
                }, {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'Use'.translate(),
                    bind: '{edificadoGrid.selection.uso}',
                    name: 'uso'
                }, {
                    xtype: 'textfield',
                    padding: '0 0 10 0',
                    flex: 1,
                    labelAlign: 'right',
                    fieldLabel: 'Current use'.translate(),
                    bind: '{edificadoGrid.selection.uso_corren}',
                    name: 'uso_corren'
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Nº Proc.'.translate(),
                    bind: '{edificadoGrid.selection.n_proc}',
                    name: 'n_proc'
                }, {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'Nº Alvará'.translate(),
                    bind: '{edificadoGrid.selection.n_alvara}',
                    name: 'n_alvara'
                }, {
                    xtype: 'textfield',
                    padding: '0 0 10 0',
                    flex: 1,
                    labelAlign: 'right',
                    fieldLabel: 'ID Lev.'.translate(),
                    bind: '{edificadoGrid.selection.id_lev}',
                    name: 'id_lev'
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
            autoWidth : true,
            // xtype : 'form',
            xtype : 'fieldset',
            // reference: 'buildingphotoform',
            // itemId : 'photos',
            layout : {
                pack : 'start',
                type : 'hbox'
            },
            // api : {
            //     // submit : 'Server.DXFormUploads.filesubmitbuilding'
            //     submit: 'Server.DXFormUploads.filesubmitinstantaneo'
            // },
            items : [{
                xtype : 'filefield',
                padding: '0 10 0 0',
                name : 'documento',
                inputAttrTpl: 'accept="application/pdf"',
                msgTarget : 'side',
                allowBlank : true,
                buttonOnly : true,
                buttonText : 'PDF...',
                buttonConfig : {
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
                listeners : {
                    change : 'onButtonUpload',
                    afterrender : function(cmp) {
                        cmp.fileInputEl.set({
                            accept : 'application/pdf'
                        });
                    }
                }
            }, {
                xtype : 'filefield',
                padding: '0 10 0 0',
                name: 'instantaneo',
                inputAttrTpl: 'accept="image/jpeg,image/png,image/tif"',
                msgTarget : 'side',
                allowBlank : true,
                buttonOnly : true,
                buttonText : 'Photo'.translate() + '...',
                buttonConfig : {
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
                listeners : {
                    change : 'onButtonUpload',
                    afterrender : function(cmp) {
                        cmp.fileInputEl.set({
                            accept : 'image/jpeg,image/png,image/tif,application/pdf'
                        });
                    }
                }
            }, {
                xtype : 'button',
                iconCls: 'x-fa fa-trash-o',
                tooltip: 'Remove selected image or document'.translate(),
                listeners : {
                    click : 'onButtonRemoverInstantaneo'
                },
                text : 'Remove'.translate()
            }]
        }, {
            xtype: 'fieldset',
            title: 'Dimensions'.translate(),
            frame: false,
            items: [{
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'refer_elev'.translate(),
                    bind: '{edificadoGrid.selection.refer_elev}',
                    name: 'refer_elev'
                }, {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'v_crsi'.translate(),
                    bind: '{edificadoGrid.selection.v_crsi}',
                    name: 'v_crsi'
                }, {
                    xtype: 'textfield',
                    padding: '0 0 10 0',
                    flex: 1,
                    labelAlign: 'right',
                    fieldLabel: 'valor_elev'.translate(),
                    bind: '{edificadoGrid.selection.valor_elev}',
                    name: 'valor_elev'
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'cota_p_a'.translate(),
                    bind: '{edificadoGrid.selection.cota_p_a}',
                    name: 'cota_p_a'
                }, {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'cota_solei'.translate(),
                    bind: '{edificadoGrid.selection.cota_solei}',
                    name: 'cota_solei'
                }, {
                    xtype: 'textfield',
                    padding: '0 0 10 0',
                    // flex: 1,
                    labelAlign: 'right',
                    fieldLabel: 'ref_altura'.translate(),
                    bind: '{edificadoGrid.selection.ref_altura}',
                    name: 'ref_altura'
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'valor_altu'.translate(),
                    bind: '{edificadoGrid.selection.valor_altu}',
                    name: 'valor_altu'
                }, {
                    xtype: 'textfield',
                    padding: '0 0 10 0',
                    flex: 1,
                    labelAlign: 'right',
                    fieldLabel: 'altura_max'.translate(),
                    bind: '{edificadoGrid.selection.altura_max}',
                    name: 'altura_max'
                }]
            }]
        }, {
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
                    fieldLabel: 'data_const'.translate(),
                    bind: '{edificadoGrid.selection.data_const}',
                    name: 'data_const'
                }, {
                    xtype: 'datefield',
                    format: 'Y-m-d', // format to show the date
                    padding: '0 0 10 0',
                    // flex: 1,
                    labelAlign: 'right',
                    fieldLabel: 'data_renov'.translate(),
                    bind: '{edificadoGrid.selection.data_renov}',
                    name: 'data_renov'
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                // anchor: '100%',
                items: [{
                    xtype: 'datefield',
                    format: 'Y-m-d', // format to show the date
                    fieldLabel: 'data_inser'.translate(),
                    bind: '{edificadoGrid.selection.data_inser}',
                    name: 'data_inser'
                }, {
                    xtype: 'datefield',
                    format: 'Y-m-d', // format to show the date
                    padding: '0 0 10 0',
                    // flex: 1,
                    labelAlign: 'right',
                    fieldLabel: 'data_sub'.translate(),
                    bind: '{edificadoGrid.selection.data_sub}',
                    name: 'data_sub'
                }]
            }]
        }]
    }],

    bbar: {
        reference: 'navigation-toolbar',
        //margin: 8,
        style: 'background-color: transparent',
        items: ['->', {
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
