Ext.define('Admin.view.config.Layers', {
    extend: 'Ext.container.Container',
    xtype: 'layers',

    controller: 'layers',
    viewModel: {
        type: 'layers'
    },

    layout: 'responsivecolumn',

    items: [{
        html: 'Layers'
    }]

});
