Ext.define('Admin.view.dashboard.PlantasTodas', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboard_plantas_todas',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Bar',
        'Ext.chart.interactions.ItemHighlight'
    ],

    controller: 'dashboard_plantas',

    cls: 'quick-graph-panel shadow-panel',
    //height: 320,
    layout: 'fit',
    headerPosition: 'bottom',
    iconCls: 'x-fa fa-bar-chart',

    title: 'Location Plans by year'.translate(),

    tbar: [ '->', {
        text: 'Download'.translate(),
        iconCls: 'x-fa fa-download',
        handler: 'onDownload'
    }],

    items: [{
        xtype: 'cartesian',
        reference: 'chart',
        width: '100%',
        height: 500,
        insetPadding: 20,
        animation: {
            easing: 'easeOut',
            duration: 500
        },
        bind: {
            store: '{plantastodas}'
        },

        axes: [{
            type: 'numeric',
            position: 'left',
            fields: 'contador',
            grid: true,
            maximum: 4000,
            majorTickSteps: 8,
            title: 'Number of requests'.translate()
            //renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'ano',
            grid: true
        }],

        series: [{
            type: 'bar',
            xField: 'ano',
            yField: 'contador',
            style: {
                opacity: 0.80,
                minGapWidth: 10
            },
            highlightCfg: {
                strokeStyle: 'black',
                radius: 10,
                fillStyle: 'gold'
            },
            label: {
                field: 'contador',
                display: 'insideEnd'
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            },
            colors: [
                '#35baf6'
            ]
        }]

    }]

});
