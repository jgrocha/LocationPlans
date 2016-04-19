Ext.define("Admin.view.geo.gu.MapGrid", {
    extend: "Ext.container.Container",
    alias: 'widget.geo-mapgrid-gu',

    controller: "geo-mapgrid-gu",
    viewModel: {
        type: "geo-mapgrid-gu"
    },

    //title: 'Edificado',
    //plugins: 'gridfilters',

    items: [{
        xtype: 'grid',
        reference: 'edificadoGrid',
        cls: 'shadow-panel',
        responsiveCls: 'big-100',
        height: 200,

        title: 'Edificado',

        columns: [{
            xtype: 'gx_symbolizercolumn',
            width: 40
        }, {
            text: 'Internal ID',
            dataIndex: 'gid',
            width: 80,
            hidden: true,
            filter: {
                type: 'number'
            }
        }, {
            text: 'Inspire ID',
            dataIndex: 'inspireid',
            width: 80,
            filter: {
                type: 'number'
            }
        }, {
            text: 'Data (inser.)',
            dataIndex: 'data_inser',
            xtype: 'datecolumn',
            format: 'Y-m-d H:i:s',
            width: 150,
            filter: {
                type: 'date'
            }
        }, {
            text: 'Data (sub.)',
            dataIndex: 'data_sub',
            xtype: 'datecolumn',
            format: 'Y-m-d H:i:s',
            width: 150,
            hidden: true,
            filter: {
                type: 'date'
            }
        }, {
            text: 'Estado',
            dataIndex: 'estado',
            width: 120,
            filter: {
                type: 'string',
                value: 'funcional' // active with tis initial value
            }
        }, {
            text: 'Valor Elev.',
            dataIndex: 'valor_elev',
            xtype: 'numbercolumn',
            //format: '0,000',
            width: 80,
            filter: {
                type: 'number'
            }
        }, {
            text: 'Função (Uso)',
            dataIndex: 'funcao_uso',
            flex: 1,
            filter: {
                type: 'string'
            }
        }, {
            text: 'Nº Proc.',
            dataIndex: 'n_proc',
            width: 80,
            filter: {
                type: 'string'
            }
        }, {
            text: 'Observações',
            dataIndex: 'obs',
            flex: 2,
            hidden: true,
            filter: {
                type: 'string'
            }
        }]
    }, {
        xtype: 'grid',
        reference: 'processoGrid',
        cls: 'shadow-panel',
        responsiveCls: 'big-100',
        height: 400,

        bind: {
            store: '{processo}'
        },

        title: 'Processos',

        columns: [{
            text: 'Tipo',
            dataIndex: 'tipo',
            width: 80
        }, {
            text: 'Nº Processo',
            dataIndex: 'numero',
            width: 80
        }, {
            xtype: 'datecolumn',
            //format: 'Y-m-d H:i:s',
            format: 'Y-m-d',
            width: 150,
            text: 'Data de Abertura',
            dataIndex: 'abertura',
            filter: {
                type: 'date'
            }
        }, {
            xtype: 'datecolumn',
            //format: 'Y-m-d H:i:s',
            format: 'Y-m-d',
            width: 150,
            text: 'Data de Fecho',
            dataIndex: 'fecho',
            filter: {
                type: 'date'
            }
        }, {
            text: 'Requerente',
            dataIndex: 'requerente_princ',
            width: 80
        }, {
            text: 'Local',
            dataIndex: 'local',
            width: 80
        }, {
            text: 'Plano',
            dataIndex: 'plano',
            width: 80
        }, {
            text: 'Observações',
            dataIndex: 'observacoes',
            width: 80
        }]

    }, {
        xtype: 'grid',
        reference: 'embargoGrid',
        cls: 'shadow-panel',
        responsiveCls: 'big-50',
        height: 400,

        bind: {
            store: '{embargos}'
        },

        title: 'Embargos',
        columns: [{
            text: 'Auto',
            dataIndex: 'n_auto_embargo',
            width: 80,
            filter: {
                // required configs
                type: 'string'
            }
        }, {
            text: 'Nome',
            dataIndex: 'nome_notificado',
            width: 240,
            filter: {
                // required configs
                type: 'string'
            }
        }, {
            text: 'Morada',
            dataIndex: 'morada',
            width: 240,
            filter: {
                // required configs
                type: 'string'
            }
        }, {
            text: 'Local do embargo',
            dataIndex: 'local_embargo',
            width: 240,
            filter: {
                // required configs
                type: 'string'
            }
        }, {
            text: 'Estado das obras',
            dataIndex: 'estado_obras',
            flex: 1,
            filter: {
                // required configs
                type: 'string'
            },
            sortable: false,
            hidden: true
        }, {
            // https://docs.sencha.com/extjs/6.0/components/grids.html
            xtype: 'datecolumn',
            //format: 'Y-m-d H:i:s',
            format: 'Y-m-d',
            width: 150,
            text: 'Data do auto',
            dataIndex: 'data_auto',
            filter: {
                type: 'date'
            }
        }, {
            // https://docs.sencha.com/extjs/6.0/components/grids.html
            xtype: 'datecolumn',
            //format: 'Y-m-d H:i:s',
            format: 'Y-m-d',
            width: 150,
            text: 'Fim do embargo',
            dataIndex: 'data_fim',
            filter: {
                type: 'date'
            }
        }, {
            text: 'Transgressor',
            dataIndex: 'transgressor',
            width: 150,
            filter: {
                // required configs
                type: 'string'
            },
            hidden: true
        }]
    }, {
        xtype: 'grid',
        reference: 'fiscalizacaoGrid',
        cls: 'shadow-panel',
        responsiveCls: 'big-50',
        height: 400,

        bind: {
            store: '{fiscaliz}'
        },

        title: 'Fiscalização',
        columns: [{
            text: 'Chave',
            dataIndex: 'chave_tp_proc',
            width: 80
        }, {
            text: 'Nº Processo',
            dataIndex: 'numero_processo',
            width: 80
        }, {
            text: 'Transgressor',
            dataIndex: 'string',
            width: 80
        }, {
            text: 'Data (Transgressão)',
            dataIndex: 'dt_transgressao',
            xtype: 'datecolumn',
            format: 'Y-m-d H:i:s',
            width: 150,
            filter: {
                type: 'date'
            }
        }, {
            text: 'Descrição',
            dataIndex: 'descricao',
            width: 80
        }]
    }]

});

/*

 * gid	Integer	false	1/1
 * inspireid	Long	true	0/1
 * data_inser	String	true	0/1
 * data_sub	String	true	0/1
 * estado	String	true	0/1
 data_const	String	true	0/1
 data_renov	String	true	0/1
 refer_elev	String	true	0/1
 v_crsi	String	true	0/1
 * valor_elev	BigDecimal	true	0/1
 cota_p_a	BigDecimal	true	0/1
 cota_solei	BigDecimal	true	0/1
 ref_altura	String	true	0/1
 valor_altu	BigDecimal	true	0/1
 altura_max	BigDecimal	true	0/1
 nome	String	true	0/1
 tipo	String	true	0/1
 * funcao_uso	String	true	0/1
 percent	BigDecimal	true	0/1
 num_fogos	Long	true	0/1
 habitantes	Long	true	0/1
 n_servicos	Long	true	0/1
 n_comercio	Long	true	0/1
 n_entradas	Long	true	0/1
 n_fracoes	Long	true	0/1
 n_pisos_ac	Long	true	0/1
 n_pisos_ab	Long	true	0/1
 * n_proc	String	true	0/1
 n_alvara	String	true	0/1
 id_lev	BigDecimal	true	0/1
 siou	String	true	0/1
 fonte_vect	String	true	0/1
 fonte_alfa	String	true	0/1
 fonte_var	String	true	0/1
 ref_extern	String	true	0/1
 r_ext_nome	String	true	0/1
 perimetro	BigDecimal	true	0/1
 area	BigDecimal	true	0/1
 * obs	String	true	0/1
 the_geom	MultiPolygon	true	0/1
 u_insere	String	true	0/1
 d_insere	String	true	0/1
 u_actualiz	String	true	0/1
 d_actualiz	String	true	0/1

 */