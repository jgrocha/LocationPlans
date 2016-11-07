Ext.define('Admin.view.plantas.Confrontacao', {
    extend: 'Ext.window.Window',
    alias: 'widget.confrontacao',

    controller: 'confrontacao',
    viewModel: {
        type: "confrontacao"
    },

    // cls: 'geoext-popup-window',
    width: 800,
    height: 600,
    closeAction: 'destroy', // 'hide',
    closable: true,
    resizable: true,
    autoShow: false,
    titleAlign: 'center',
    // headerPosition: 'bottom',
    frameHeader: true, // false,
    //frame: true,
    bind: {
        title: '{title}'
    },
    //layout: 'fit',
    layout: {
        type: 'hbox',
        pack: 'start',
        align: 'stretch'
    },
    items: [{
        xtype: 'fullmap-confrontacao',
        geoExtViewId: 45,
        region: 'center',
        collapsible: false,
        width: 400,
        height: 400
    }, {
        xtype: 'grid',
        reference: 'featureGrid',
        itemId: 'featureGrid',
        flex: 1,
        viewConfig: {
            emptyText: 'No data available',
            deferEmptyText: false
        },
        columns: [{
            xtype: 'gx_symbolizercolumn',
            width: 40
        }, {
            text: 'Feature ID',
            dataIndex: 'id',
            width: 90,
            hidden: true
        }, {
            text: 'Domínio',
            dataIndex: 'dominio',
            width: 140,
            hidden: true
        }, {
            text: 'Hierarquia',
            dataIndex: 'hierarquia',
            flex: 1
        }, {
            text: 'Diplomas',
            dataIndex: 'diploma_es',
            width: 140,
            hidden: true
        }, {
            text: 'Área/distância',
            dataIndex: 'area',
            width: 120,
            align: 'end',
            renderer  : function(value, metaData, record, rowIndex, colIndex, store, view) {
                // console.log('renderer');
                // console.log(record);
                var resultado;
                // One of 'Point', 'LineString', 'LinearRing', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection', 'Circle'.
                switch (record.get('geometry').getType()) {
                    case 'LineString':
                    case 'MultiLineString':
                        resultado = Ext.util.Format.number(value, '0,0')  + ' m';
                        break;
                    case 'Polygon':
                    case 'MultiPolygon':
                        resultado = Ext.util.Format.number(value, '0,0')  + ' m²';
                        break;
                    default:
                        resultado = Ext.util.Format.number(value, '0,0');
                        break;
                }
                return resultado;
            }
        }, {
            text: '%',
            dataIndex: 'percentagem',
            width: 60,
            align: 'end',
            renderer  : function(value, metaData, record, rowIndex, colIndex, store, view) {
                // console.log('renderer');
                // console.log(record);
                var resultado;
                // One of 'Point', 'LineString', 'LinearRing', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection', 'Circle'.
                switch (record.get('geometry').getType()) {
                    case 'LineString':
                    case 'MultiLineString':
                        resultado = '';
                        break;
                    case 'Polygon':
                    case 'MultiPolygon':
                        resultado = Ext.util.Format.number(value, '0,0')  + ' %';
                        break;
                    default:
                        resultado = '';
                        break;
                }
                return resultado;
            }

        }],
        selModel: {
            allowDeselect: true
        },

        listeners: {
            'selectionchange': 'featureGridSelectionChanged'
        }
    }],
/*    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{
            text: 'Center'.translate(),
            iconCls: 'x-fa fa-crosshairs',
            // bind: {
            //     disabled: '{!pedidoGrid.selection}'
            // },
            handler: 'onCenterClick'
        }, '->', {
            text: 'Ler a confrontação'.translate(),
            iconCls: 'x-fa fa-pencil-square-o ',
            handler: 'onLoadConfrontacaoClick'
        }, {
            text: 'Print'.translate(),
            iconCls: 'x-fa fa-print',
            handler: 'onPrintConfrontacaoClick'
        }]
    }],*/
    listeners: {
        afterRender: 'afterRenderConfrontacao'
    }
});
