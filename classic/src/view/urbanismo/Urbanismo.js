Ext.define('Admin.view.urbanismo.Urbanismo', {
    extend: 'Ext.container.Container',
    xtype: 'urbanismo',

    controller: 'urbanismo',
    viewModel: {
        type: 'urbanismo'
    },

    layout: 'responsivecolumn',

    items: [{
        xtype: 'fullmap-urbanismo',
        geoExtViewId: 20,
        responsiveCls: 'big-100',
        title: 'Urbanismo'
    }, {
        xtype: 'urbanismogridedificado',
        responsiveCls: 'big-40'
    }, /*{
        xtype: 'urbanismogridprocesso',
        responsiveCls: 'big-60'
    }, */ {
        xtype: 'edificio', // 'fotografia',
        responsiveCls: 'big-60'
    }]

});
