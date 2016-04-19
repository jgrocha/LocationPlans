Ext.define('Admin.view.dashboard.PlantasController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard_plantas',

    onAxisLabelRender: function (axis, label, layoutContext) {
        return Ext.util.Format.number(label, '0,000');
    },

    onSeriesLabelRender: function (v) {
        return Ext.util.Format.number(v, '0,000');
    },

    onItemEditTooltipRender: function (tooltip, item, target, e) {
        var formatString = '0,000 (billions of USD)',
            record = item.record;

        tooltip.setHtml(record.get('created') + ': ' +
            Ext.util.Format.number(target.yValue / 1000, formatString));
    },

    onSeriesTooltipRender: function(tooltip, record, item) {
        var formatString = '0';
        tooltip.setHtml('Ano: ' + record.get('ano') + ' → ' +
            Ext.util.Format.number(record.get('contador'), formatString) + ' plantas emitidas');
    },

    onSeriesMesTooltipRender: function(tooltip, record, item) {
        var formatString = '0';
        tooltip.setHtml('Mês: ' + record.get('abrmes') + ' → ' +
            Ext.util.Format.number(record.get('contador'), formatString) + ' plantas emitidas');
    },

    onColumnRender: function (v) {
        return v + '%';
    },

    onPreview: function () {
        var chart = this.lookupReference('chart');
        chart.preview();
    },

    onDownload: function() {
        var chart = this.lookupReference('chart');
        if (Ext.os.is.Desktop) {
            chart.download({
                filename: 'Plantas de Localização Emitidas'
            });
        } else {
            chart.preview();
        }
    }

});
