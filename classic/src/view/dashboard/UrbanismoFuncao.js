Ext.define('Admin.view.dashboard.UrbanismoFuncao', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboard_funcao_panel',

    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Bar',
        'Ext.chart.interactions.ItemHighlight'
    ],

    controller: 'dashboard_funcao',

    cls: 'quick-graph-panel shadow-panel',
    //height: 320,
    layout: 'fit',
    //headerPosition: 'bottom',
    iconCls: 'x-fa fa-align-left',

    title: 'Urbanismo - Uso da construção',

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
        height: 500,
        insetPadding: 40,
        flipXY: true,
        /*
        interactions: {
            type: 'itemedit',
            style: {
                lineWidth: 2
            },
            tooltip: {
                renderer: 'onItemEditTooltipRender'
            }
        },
        */
        animation: {
            easing: 'easeOut',
            duration: 500
        },
        /*
        store: {
            type: 'economy-sectors'
        },
        */
        bind: {
            store: '{urbanismo_funcao}'
        },
        axes: [{
            type: 'numeric',
            position: 'bottom',
            fields: 'ind',
            grid: true,
            maximum: 40000,
            majorTickSteps: 10,
            title: 'Nº de construções',
            renderer: 'onAxisLabelRender'
        }, {
            type: 'category',
            position: 'left',
            fields: 'indicador',
            grid: true
        }],
        series: [{
            type: 'bar',
            xField: 'indicador',
            yField: 'ind',
            style: {
                opacity: 0.80,
                minGapWidth: 10
            },
            highlightCfg: {
                strokeStyle: 'black',
                radius: 10
            },
            label: {
                field: 'ind',
                display: 'insideEnd' // ,
                //renderer: 'onSeriesLabelRender'
            },
            tooltip: {
                trackMouse: true,
                renderer: 'onSeriesTooltipRender'
            }
        }] /* ,
        sprites: [{
            type: 'text',
            text: 'Industry size in major economies (2011)',
            fontSize: 22,
            width: 100,
            height: 30,
            x: 40, // the sprite x position
            y: 20  // the sprite y position
        }, {
            type: 'text',
            text: 'Source: http://en.wikipedia.org/wiki/List_of_countries_by_GDP_sector_composition',
            fontSize: 10,
            x: 12,
            y: 490
        }]
        */
    }]

});
