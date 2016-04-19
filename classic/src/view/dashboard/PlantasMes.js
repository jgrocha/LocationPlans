Ext.define('Admin.view.dashboard.PlantasMes', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboard_plantas_mes',

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
    iconCls: 'x-fa fa-calendar',

    title: 'Location Plans by month'.translate(),

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
            store: '{plantasmes}'
        },

        axes: [{
            type: 'numeric',
            position: 'left',
            fields: 'contador',
            grid: true,
            maximum: 500,
            majorTickSteps: 8,
            title: 'Number of requests'.translate()
            //renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'abrmes',
            grid: true
        }],

        series: [{
            type: 'bar',
            xField: 'abrmes',
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
                renderer: 'onSeriesMesTooltipRender'
            }
        }]

    }]

});
