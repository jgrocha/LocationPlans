Ext.define('Admin.view.plantas.PlantasController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.plantas',

    init: function() {
        var me = this;
        me.callParent(arguments);
    },

    onLoadDrawClick: function (button) {
        //console.log('onLoadDrawClick');
        var me = this;
        var grid = me.lookupReference('pedidoGrid');
        var sm = grid.getSelectionModel();
        var record = sm.getSelection()[0];
        //console.log(record);
        //console.log(record.get('gid'));
        //console.log(record.get('pdf'));
        me.fireEvent('loaddraw', record.get('gid'), record.get('geojson'));
    },

    onReDownloadClick: function (button) {
        //console.log('onReDownoadClick');
        var me = this;
        var grid = me.lookupReference('pedidoGrid');
        var sm = grid.getSelectionModel();
        var record = sm.getSelection()[0];
        //me.fireEvent('redownload', record.get('gid'), record.get('pdf'));
        window.location = '/download/' + record.get('gid') + '.pdf';
    }

});