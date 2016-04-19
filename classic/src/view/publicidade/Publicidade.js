Ext.define('Admin.view.publicidade.Publicidade', {
    extend: 'Ext.container.Container',
    xtype: 'publicidade',

    controller: 'publicidade',
    viewModel: {
        type: 'publicidade'
    },

    layout: 'responsivecolumn',

    /*
    As tabelas da publicidade estão no esquema public, da BD sig@dolly

    Tem que ser passar estas tabelas para um esquema de uma nova BD no servidor...
    E passar de 27492 → para 3763

     */
    items: [{
        xtype: 'fullmap-publicidade',
        geoExtViewId: 30,
        responsiveCls: 'big-100',
        title: 'Publicidade'
    }]

});
