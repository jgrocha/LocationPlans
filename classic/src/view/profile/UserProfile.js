Ext.define('Admin.view.profile.UserProfile', {
    extend: 'Ext.container.Container',
    xtype: 'userprofile',

    requires: [
        'Ext.ux.layout.ResponsiveColumn'
    ],

    controller: 'userprofile',
    viewModel: {
        type: 'userprofile'
    },
    cls: 'userProfile-container',

    layout: 'responsivecolumn',

    items: [{
        xtype: 'profilesocialpanel',
        // Use 50% of container when viewport is big enough, 100% otherwise
        responsiveCls: 'big-50 small-100'
    }, {
        xtype: 'passwordform',
        cls: 'shadow-panel',
        responsiveCls: 'big-50 small-100'
    }, {
        xtype: 'personaldataform',
        cls: 'shadow-panel',
        //colorScheme: 'soft-purple',
        responsiveCls: 'big-50 small-100'
    }]
});
