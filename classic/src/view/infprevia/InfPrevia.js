Ext.define('Admin.view.infprevia.InfPrevia', {
    extend: 'Ext.container.Container',
    xtype: 'infprevia',

    controller: 'infprevia',
    viewModel: {
        type: 'infprevia'
    },

    layout: 'responsivecolumn',

    items: [{
        xtype: 'fullmap-infprevia',
        geoExtViewId: 60,
        responsiveCls: 'big-100',
        title: 'Informação Prévia no Minuto'
    }, {
        xtype: 'mapgrid',
        reference: 'mapgrid',
        responsiveCls: 'big-40'
    }, {
        xtype: 'fullmap-infprevia-confrontacao',
        geoExtViewId: 60,
        responsiveCls: 'big-60',
        title: 'Confrontação',
        height: 280
    }]

});
