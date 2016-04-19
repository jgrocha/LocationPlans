Ext.define('Admin.view.redeviaria.RedeViaria', {
    extend: 'Ext.container.Container',
    xtype: 'redeviaria',

    controller: 'redeviaria',
    viewModel: {
        type: 'redeviaria'
    },

    layout: 'responsivecolumn',

    items: [{
        xtype: 'fullmap-redeviaria',
        geoExtViewId: 50,
        responsiveCls: 'big-100',
        title: 'Mapa da Rede Viária'
    }]

});
