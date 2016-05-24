Ext.define('Admin.view.urbanismo.Edificio', {
    extend: 'Ext.panel.Panel',
    xtype: 'edificio',
    // requires: ['Admin.view.profile.PersonalDataFormModel', 'Ext.form.RadioGroup', 'Ext.form.FieldSet'],
    requires: ['Ext.form.action.DirectLoad', 'Ext.form.action.DirectSubmit'],
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
                    tooltip: 'Identificador único do edificado atribuído pela UT-SIG',
                    name: 'id_edifica',
                    bind: '{edificadoGrid.selection.id_edifica}',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'textfield',
                    padding: '0 0 10 0',
                    flex: 1,
                    labelAlign: 'right',
                    name: 'nome',
                    fieldLabel: 'Name'.translate(),
                    tooltip: 'Nome do edifício. Ex: Escola Secundária Marques Castilho'.translate(),
                    bind: '{edificadoGrid.selection.nome}',
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
                    fieldLabel: 'Type'.translate(),
                    tooltip: 'Tipo de edifício, de acordo com: Residencial; Agrícola; Industrial; Comércio e Serviços; Auxiliares'.translate(),
                    bind: '{edificadoGrid.selection.tipo}',
                    name: 'tipo',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'Use'.translate(),
                    tooltip: 'Uso do edifício de acordo com a licença de utilização emitida pelo Município',
                    bind: '{edificadoGrid.selection.uso}',
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
                    bind: '{edificadoGrid.selection.uso_corren}',
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
                    bind: '{edificadoGrid.selection.n_proc}',
                    name: 'n_proc',
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
                    tooltip: 'Open building permit process'.translate(),
                    listeners: {
                        click: 'onButtonOpenProcess'
                    },
                    text: 'Building permit process'.translate()
                }]
            }, {
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'State'.translate(),
                    tooltip: 'Valores que indicam o estado da construção (devoluto, degradadao, ruínas, etc)',
                    bind: '{edificadoGrid.selection.estado}',
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
                    bind: '{edificadoGrid.selection.siou}',
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
                    bind: '{edificadoGrid.selection.siou}',
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
                    bind: '{edificadoGrid.selection.n_alvara}',
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
                    fieldLabel: 'Construction'.translate(),
                    bind: '{edificadoGrid.selection.data_const}',
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
                    bind: '{edificadoGrid.selection.data_renov}',
                    name: 'data_renov',
                    tooltip: 'Data de renovação do edificio. Corresponde à data do último alvará',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }]
            } /*, {
             xtype: 'container',
             layout: 'hbox',
             // anchor: '100%',
             items: [{
             xtype: 'datefield',
             format: 'Y-m-d', // format to show the date
             fieldLabel: 'data_inser'.translate(),
             bind: '{edificadoGrid.selection.data_inser}',
             name: 'data_inser',
             tooltip: 'data de inserção do edifício no conjunto de dados geográficos',
             listeners : {
             render: function(p) {
             p.getEl().down('input').set({'data-qtip': p.tooltip});
             }
             }
             }, {
             xtype: 'datefield',
             format: 'Y-m-d', // format to show the date
             padding: '0 0 10 0',
             // flex: 1,
             labelAlign: 'right',
             fieldLabel: 'data_sub'.translate(),
             bind: '{edificadoGrid.selection.data_sub}',
             name: 'data_sub',
             tooltip: 'data de substituição ou remoção do edifício do conjunto de dados geográficos',
             listeners : {
             render: function(p) {
             p.getEl().down('input').set({'data-qtip': p.tooltip});
             }
             }
             }]
             } */]
        }, {
            xtype: 'fieldset',
            title: 'Usage'.translate(),
            frame: false,
            items: [{
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Percentage'.translate(),
                    bind: '{edificadoGrid.selection.percent}',
                    name: 'percent',
                    tooltip: 'Percentagem do edificio que é utilizado para o seu uso',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'No. flats'.translate(),
                    bind: '{edificadoGrid.selection.num_fogos}',
                    name: 'num_fogos',
                    tooltip: 'Número de fogos do edifício',
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
                    fieldLabel: 'No. inhabitants'.translate(),
                    bind: '{edificadoGrid.selection.habitantes}',
                    name: 'habitantes',
                    tooltip: 'Número de habitantes do edifício',
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
                    fieldLabel: 'No. services'.translate(),
                    bind: '{edificadoGrid.selection.n_servicos}',
                    name: 'n_servicos',
                    tooltip: 'Número de frações afetas a serviços',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'No. commerce'.translate(),
                    bind: '{edificadoGrid.selection.n_comercio}',
                    name: 'n_comercio',
                    tooltip: 'Número de fracções afetas a comércio',
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
                    fieldLabel: 'No. doors'.translate(),
                    bind: '{edificadoGrid.selection.n_entradas}',
                    name: 'n_entradas',
                    tooltip: 'Número de entradas de um edifício. Cada entrada corresponde ao acesso de uma ou mais habitações',
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
                    fieldLabel: 'No. parts'.translate(),
                    bind: '{edificadoGrid.selection.n_fracoes}',
                    name: 'n_fracoes',
                    tooltip: 'Número total de fracções, de acordo com o descrito na propriedade horizontal do edificio',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'No. floors above'.translate(),
                    bind: '{edificadoGrid.selection.n_pisos_ac}',
                    name: 'n_pisos_ac',
                    tooltip: 'Número de pisos acima da cota de soleira',
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
                    fieldLabel: 'No. floors below'.translate(),
                    bind: '{edificadoGrid.selection.n_pisos_ab}',
                    name: 'n_pisos_ab',
                    tooltip: 'Número de pisos abaixo da cota de soleira',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }]
            }]
        }, {
            xtype: 'fieldset',
            title: 'Size and height'.translate(),
            frame: false,
            items: [{
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Height'.translate(),
                    bind: '{edificadoGrid.selection.valor_altu}',
                    name: 'valor_altu',
                    tooltip: 'Valor medido ou estimado da altura do edifício (diferença entre ref_altura_max e ref_altura_min)',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'textfield',
                    // padding: '0 0 10 0',
                    // flex: 1,
                    labelAlign: 'right',
                    fieldLabel: 'Max. height'.translate(),
                    bind: '{edificadoGrid.selection.altura_max}',
                    name: 'altura_max',
                    tooltip: 'valor medido ou estimado da altura do edifício (diferença entre ref_altura_max e ref_altura_min)',
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
                    fieldLabel: 'Height reference'.translate(),
                    bind: '{edificadoGrid.selection.ref_altura}',
                    name: 'ref_altura',
                    tooltip: 'Referência para o cálculo da altura do edifício',
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
                    fieldLabel: 'Perimeter'.translate(),
                    bind: '{edificadoGrid.selection.perimetro}',
                    name: 'perimetro',
                    tooltip: 'Perímetro da edificação',
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
                    fieldLabel: 'Area'.translate(),
                    bind: '{edificadoGrid.selection.area}',
                    name: 'area',
                    tooltip: 'Área da edificação',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }]
            }]
        }, {
            xtype: 'fieldset',
            title: 'Elevation'.translate(),
            frame: false,
            items: [{
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'textfield',
                    // flex: 1,
                    labelAlign: 'right',
                    fieldLabel: 'Elevation'.translate(),
                    bind: '{edificadoGrid.selection.valor_elev}',
                    name: 'valor_elev',
                    tooltip: 'Valor calculado da elevação',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'Highest point elevation'.translate(),
                    bind: '{edificadoGrid.selection.cota_p_a}',
                    name: 'cota_p_a',
                    tooltip: 'Cota do ponto mais alto',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'textfield',
                    padding: '0 0 10 0',
                    labelAlign: 'right',
                    fieldLabel: 'Threshold elevation'.translate(),
                    bind: '{edificadoGrid.selection.cota_solei}',
                    name: 'cota_solei',
                    tooltip: 'Cota da soleira',
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
                    fieldLabel: 'Elevation ref.'.translate(),
                    bind: '{edificadoGrid.selection.refer_elev}',
                    name: 'refer_elev',
                    tooltip: 'Elevação de referência (cércea, cume)',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }, {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    fieldLabel: 'Vertical CRS'.translate(),
                    bind: '{edificadoGrid.selection.v_crsi}',
                    name: 'v_crsi',
                    tooltip: 'Sistema de referência vertical de medição da elevação. Ex. PT_CASC/OH',
                    listeners: {
                        render: function (p) {
                            p.getEl().down('input').set({'data-qtip': p.tooltip});
                        }
                    }
                }]
            }]
        }, /*{
         xtype: 'fieldset',
         title: 'Data collection'.translate(),
         frame: false,
         items: [{
         xtype: 'container',
         layout: 'hbox',
         anchor: '100%',
         items: [{
         xtype: 'textfield',
         fieldLabel: 'fonte_vect'.translate(),
         bind: '{edificadoGrid.selection.fonte_vect}',
         name: 'fonte_vect'
         }, {
         xtype: 'textfield',
         labelAlign: 'right',
         fieldLabel: 'fonte_alfa'.translate(),
         bind: '{edificadoGrid.selection.fonte_alfa}',
         name: 'fonte_alfa'
         }, {
         xtype: 'textfield',
         padding: '0 0 10 0',
         flex: 1,
         labelAlign: 'right',
         fieldLabel: 'fonte_var'.translate(),
         bind: '{edificadoGrid.selection.fonte_var}',
         name: 'fonte_var'
         }]
         }, {
         xtype: 'container',
         layout: 'hbox',
         anchor: '100%',
         items: [{
         xtype: 'textfield',
         fieldLabel: 'id_lev'.translate(),
         bind: '{edificadoGrid.selection.id_lev}',
         name: 'id_lev'
         }, {
         xtype: 'textfield',
         labelAlign: 'right',
         fieldLabel: 'ref_extern'.translate(),
         bind: '{edificadoGrid.selection.ref_extern}',
         name: 'ref_extern'
         }, {
         xtype: 'textfield',
         padding: '0 0 10 0',
         // flex: 1,
         labelAlign: 'right',
         fieldLabel: 'r_ext'.translate(),
         bind: '{edificadoGrid.selection.r_ext}',
         name: 'r_ext'
         }]
         }]
         }*/ {
            xtype: 'fieldset',
            title: 'Notes'.translate(),
            frame: false,
            items: [{
                xtype: 'container',
                layout: 'hbox',
                anchor: '100%',
                items: [{
                    xtype: 'htmleditor',
                    grow: true,
                    // fieldLabel: 'obs'.translate(),
                    bind: {
                        value: '{edificadoGrid.selection.obs}'
                    },
                    // padding: '0 0 10 0',
                    flex: 1,
                    name: 'obs'
                } /*{
                 xtype: 'textareafield',
                 grow: true,
                 // fieldLabel: 'obs'.translate(),
                 bind: '{edificadoGrid.selection.obs}',
                 // padding: '0 0 10 0',
                 flex: 1,
                 name: 'obs'
                 }*/]
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
