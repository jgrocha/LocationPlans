Ext.define('Admin.view.urbanismo.Urbanismo', {
    extend: 'Ext.container.Container',
    xtype: 'urbanismo',

    controller: 'urbanismo',
    viewModel: {
        type: 'urbanismo'
    },

    layout: 'responsivecolumn',

    items: [{
        xtype: 'panel',
        bodyPadding: 10,
        ui: 'light',
        cls: 'shadow-panel pages-faq-container',
        responsiveCls: 'big-100',
        iconCls: 'x-fa fa-question',
        title: 'Help'.translate(),
        layout: {
            type: 'vbox' , align: 'right'
        },
        items: [{
            xtype: 'box',
            width: '100%',
            loader: {
                url: Configuration.helpbasefolder + 'en/urbanismo.html'.translate(),
                autoLoad: true
            }
        }, {
            xtype: 'button',
            ui: 'soft-blue',
            width: 200,
            // margin: '20 20 20 20',
            text: 'Sim, já percebi',
            listeners: {
                click: 'onDismissClick'
            }
        }],
        bind: {
            visible: '{!hidehelp}'
        }
    }, {
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
    }]/*,

    listeners : {
        scope       : 'controller',
        afterrender : 'onAfterRender'
    }
*/
});
