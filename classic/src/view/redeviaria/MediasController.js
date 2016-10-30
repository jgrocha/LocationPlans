Ext.define('Admin.view.redeviaria.MediasController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.medias',

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
            Ext.util.Format.number(record.get('contador'), formatString) + ' veículos');
    },

    onSeriesMesTooltipRender: function(tooltip, record, item) {
        var formatString = '0';
        tooltip.setHtml('Mês: ' + record.get('abrmes') + ' → ' +
            Ext.util.Format.number(record.get('contador'), formatString) + ' veículos');
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
                filename: 'Tráfego'
            });
        } else {
            chart.preview();
        }
    }

});
