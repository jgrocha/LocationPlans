Ext.define('Admin.view.dashboard.UrbanismoProcessoTipoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard_processo_tipo',

    onPreview: function () {
        var chart = this.lookupReference('chart');
        chart.preview();
    },

    onDataRender: function (v) {
        return v + '%';
    },

    onSeriesTooltipRender: function (tooltip, record, item) {
        tooltip.setHtml(record.get('os') + ': ' + record.get('data1') + '%');
    }

});
