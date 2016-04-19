Ext.define('Admin.view.pages.Error404Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.pageserror404window',

    requires: [
        'Ext.container.Container',
        'Ext.toolbar.Spacer',
        'Ext.form.Label'
    ],

    autoShow: true,
    cls: 'error-page-container',
    closable: false,
    title: Configuration.headertitle,
    titleAlign: 'center',
    maximized: true,
    modal: true,

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    items: [
        {
            xtype: 'container',
            width: 400,
            cls:'error-page-inner-container',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'label',
                    cls: 'error-page-top-text',
                    text: '404'
                },
                {
                    xtype: 'label',
                    cls: 'error-page-desc',
                    html: '<div>' + 'Page not found.'.translate() + '</div><div>' + 'Try going back to our <a href="#dashboard">Home page</a>'.translate() + '</div>'
                },
                {
                    xtype: 'tbspacer',
                    flex: 1
                }
            ]
        }
    ]
});