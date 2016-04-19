Ext.define('Admin.view.sync.GraficoTemperatura', {
    extend: 'Ext.panel.Panel',
    xtype: 'grafico-temperatura',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Bar',
        'Ext.chart.interactions.ItemHighlight'
    ],

    controller: 'grafico-temperatura',

    cls: 'quick-graph-panel shadow-panel',
    //height: 320,
    layout: 'fit',
    //headerPosition: 'bottom',
    iconCls: 'x-fa fa-align-left',

    title: 'Gráfico da Temperatura',

    tools: [
        {
            xtype: 'tool',
            cls: 'quick-graph-panel-tool x-fa fa-ellipsis-v'
        }
    ],

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 400,
        insetPadding: 40,

        bind: {
            store: '{temperature}'
        },

        axes: [{
            type: 'numeric',
            position: 'left',
            fields: 'ind',
            grid: true,
            maximum: 300,
            majorTickSteps: 10,
            title: 'Temperatura',
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'created',
            grid: true
        }],
        series: [{
            //type: 'bar',
            type: 'line',
            xField: 'created',
            yField: 'value',
            style: {
                opacity: 0.80,
                minGapWidth: 10
            },
            highlightCfg: {
                strokeStyle: 'black',
                radius: 10
            },
            label: {
                field: 'value',
                display: 'insideEnd' // ,
                //renderer: 'onSeriesLabelRender'
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        }]
    }]

});
