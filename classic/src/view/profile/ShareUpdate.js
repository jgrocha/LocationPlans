Ext.define('Admin.view.profile.ShareUpdate', {
    extend: 'Ext.panel.Panel',
    xtype: 'profilesharepanel',

    bodyPadding : 10,
    layout: 'fit',
    cls:'share-panel shadow-panel',
    
    items: [
        {
            xtype: 'textareafield',
            emptyText: "Comentários ou sugestões que queira partilhar sobre esta aplicação"
        }
    ],
    
    bbar: {
        defaults : {
                margin:'0 10 5 0'
        },
        items:[
            {
                xtype: 'button',
                iconCls: 'x-fa fa-camera'
            },
            {
                xtype: 'button',
                iconCls: 'x-fa fa-file'
            },
            '->',
            {
                xtype: 'button',
                text: 'Enviar',
                ui: 'soft-blue'
            }
        ]
    }
});
