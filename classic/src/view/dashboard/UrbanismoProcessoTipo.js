Ext.define('Admin.view.dashboard.UrbanismoProcessoTipo', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboard_processo_tipo_panel',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Bar',
        'Ext.chart.interactions.ItemHighlight'
    ],

    controller: 'dashboard_processo_tipo',

    cls: 'quick-graph-panel shadow-panel',
    //height: 320,
    layout: 'fit',
    //headerPosition: 'bottom',
    iconCls: 'x-fa fa-pie-chart',

    title: 'Urbanismo - Processos',

    tools: [
        {
            xtype: 'tool',
            cls: 'quick-graph-panel-tool x-fa fa-ellipsis-v'
        }
    ],

    items: [{
        xtype: 'polar',
        reference: 'chart',
        width: '100%',
        height: 500,
        bind: {
            store: '{urbanismo_processo_tipo}'
        },
        insetPadding: 30,
        innerPadding: 20,
        legend: {
            docked: 'bottom'
        },
        interactions: ['rotate', 'itemhighlight'],
        sprites: [{
            type: 'text',
            text: 'Dados: Medidata (dbo.processo)',
            x: 12,
            y: 425
        }],
        series: [{
            type: 'pie',
            animation: {
                easing: 'easeOut',
                duration: 500
            },
            angleField: 'data1',  // bind pie slice angular span to market share
            radiusField: 'data2', // bind pie slice radius to growth rate
            clockwise: false,
            highlight: {
                margin: 20
            },
            label: {
                field: 'os',      // bind label text to name
                display: 'outside',
                fontSize: 14
            },
            style: {
                strokeStyle: 'white',
                lineWidth: 1
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        }]
    }]


});
