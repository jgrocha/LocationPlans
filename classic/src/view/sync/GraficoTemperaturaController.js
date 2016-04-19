Ext.define('Admin.view.sync.GraficoTemperaturaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.grafico-temperatura',

    onAxisLabelRender: function (axis, label, layoutContext) {
        return Ext.util.Format.number(layoutContext.renderer(label) / 1000, '0,000');
    },

    onSeriesLabelRender: function (v) {
        return Ext.util.Format.number(v / 1000, '0,000');
    },

    onItemEditTooltipRender: function (tooltip, item, target, e) {
        var formatString = '0,000 (billions of USD)',
            record = item.record;

        tooltip.setHtml(record.get('indicador') + ': ' +
            Ext.util.Format.number(target.yValue / 1000, formatString));
    },

    onSeriesTooltipRender: function(tooltip, record, item) {
        var formatString = '0';

        tooltip.setHtml('Função: ' + record.get('indicador') + ' → ' +
            Ext.util.Format.number(record.get('ind'), formatString) + ' ocorrências');
    },

    onColumnRender: function (v) {
        return v + '%';
    },

    onPreview: function () {
        var chart = this.lookupReference('chart');
        chart.preview();
    }

});
