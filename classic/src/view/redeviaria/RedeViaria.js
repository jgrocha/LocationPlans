Ext.define('Admin.view.redeviaria.RedeViaria', {
    extend: 'Ext.container.Container',
    xtype: 'redeviaria',

    controller: 'redeviaria',
    viewModel: {
        type: 'redeviaria'
    },

    listeners: {
        show: 'onShowView'
    },

    layout: 'responsivecolumn',

    items: [{
        xtype: 'fullmap-redeviaria',
        geoExtViewId: 50,
        responsiveCls: 'big-100',
        title: 'Mapa da Rede Viária',
        height: 400
    }, {
        xtype: 'medias',
        // 60% width when viewport is big enough,
        // 100% when viewport is small
        responsiveCls: 'big-60 small-100',
        height: 400
    }]

});
