Ext.define('Admin.view.plantas.Ogre', {
    extend: 'Ext.window.Window',
    requires: ['Ext.form.FieldSet'],
    // xtype: 'ogre',
    alias : 'widget.ogre',
    // height : 160,

    width: 500,
    layout: {
        type: 'fit'
    },

    controller: "ogre",

    title: 'Carregar pretensão a partir de uma geometria em arquivo',
    // http://ogre.adc4gis.com/
    items: [{
        xtype: 'form',
        reference: 'ogreform',
        // api: {
        //     submit: 'http://localhost:3333/convert'
        // },
        // url: 'http://localhost:3333/convert',
        url: '/convert',
        method: 'POST',
        // standardSubmit : true,
        bodyPadding: 5,
        layout: {
            type: 'hbox', // #1
            align: 'stretch'
        },
        items: [{
            xtype: 'fieldset',
            flex: 2,
            title: 'Escolha o arquivo', //  *.kml, *.dxf, *.dgn, *.kml, *.kmz. ou *.zip (caso seja uma shapefile, envie o conteúdo num *.zip)',
            defaults: {
                anchor: '100%',
                // allowBlank : false,
                labelWidth: 60
            },
            items: [{
                xtype: 'label',
                text: 'Escolha um arquivo *.kml, *.dxf, *.dgn, *.kml, *.kmz. ou *.zip.',
                style: 'display:block; padding:10px 0px 5px 0px' // top right bottom left
            }, {
                xtype: 'label',
                text: 'Para carregar uma shapefile, envie o conteúdo num único *.zip que inclua os arquivos .shp, .dbf e .shx (.prj é opcional).',
                style: 'display:block; padding: 0px 0px 5px 0px' // top right bottom left
            }, {
                padding: '20 0 0 0',
                xtype: 'filefield',
                // emptyText : '*.shp',
                fieldLabel: 'Arquivo',
                name: 'upload',
                buttonText: 'Escolha o arquivo...',
                allowBlank: false
            }, {
                xtype: 'fieldset',
                title: 'Sistemas de Coordenadas',
                collapsible: true,
                collapsed: true,
                items: [{
                    xtype: 'label',
                    // text: 'Os mais usados são (nacionais): EPSG:3763 (recomendado), EPSG:27493 ou ainda EPSG:20790' + '<br/>' + 'Os mais usados (globais): EPSG:4326 ou EPSG:3857.',
                    html: 'Os mais usados são (nacionais): EPSG:3763 (recomendado), EPSG:27493 ou ainda EPSG:20790.' + '<br/>' + 'Os mais usados (globais): EPSG:4326 ou EPSG:3857.',
                    style: 'display:block; padding:10px 0px 10px 0px' // top right bottom left
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Coordinate system'.translate(),
                    name: 'sourceSrs',
                    value : 'EPSG:3763'
                    // emptyText: 'Por ex. EPSG:4326'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Destino',
                    name: 'targetSrs',
                    value: 'EPSG:3763',
                    hidden: true
                }, {
                    // sem isto, vem como application/json
                    // com isto, vem como text/plain
                    // vou tentar que saia text/html
                    xtype: 'textfield',
                    fieldLabel: 'Force PlainText',
                    name: 'forcePlainText',
                    value: 'true',
                    hidden: true
                }/*, {
                    xtype: 'textfield',
                    fieldLabel: 'callback',
                    name: 'callback',
                    value: 'gustavo',
                    hidden: true
                }*/
                //
                ]
            }]
        }]
    }],
    dockedItems: [{
        xtype: 'toolbar',
        flex: 1,
        dock: 'bottom',
        layout: {
            pack: 'end',
            type: 'hbox'
        },
        items: [{
            xtype: 'button',
            text: 'Cancelar',
            itemId: 'cancela',
            listeners: {
                click: 'onCancelar'
            }
        }, {
            xtype: 'button',
            text: 'Enviar',
            itemId: 'adiciona',
            listeners: {
                click: 'onEnviar'
            }
        }]
    }]
});
