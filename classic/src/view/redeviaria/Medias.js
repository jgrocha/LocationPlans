Ext.define('Admin.view.redeviaria.Medias', {
    extend: 'Ext.panel.Panel',
    xtype: 'medias',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Bar',
        'Ext.chart.interactions.ItemHighlight'
    ],

    controller: 'medias',
/*    viewModel: {
        type: 'medias'
    },*/

    cls: 'quick-graph-panel shadow-panel',
    //height: 320,
    layout: 'fit',
    headerPosition: 'bottom',
    iconCls: 'x-fa fa-bar-chart',

    title: 'Contagem',

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
            store: '{trafego}'
        },

        axes: [{
            type: 'numeric',
            position: 'left',
            fields: 'media',
            grid: true,
            maximum: 4000,
            majorTickSteps: 8,
            title: 'Passagens'
            //renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            position: 'bottom',
            fields: 'hora',
            grid: true
        }],

        series: [{
            type: 'bar',
            xField: 'hora',
            yField: 'media',
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
                field: 'media',
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
