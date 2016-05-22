Ext.define("Admin.view.urbanismo.Fotografia", {
    extend: "Ext.container.Container",
    alias: 'widget.fotografia',

    cls: 'shadow-panel',

    title: 'Fotografias',

    controller: "fotografia",

    items: [{
        xtype: 'dataview',
        reference: 'dvbuildingphoto',
        bind: {
            store: '{fotografia}'
        },
        tpl: [
            '<tpl for=".">',
            '<div style="margin-bottom: 10px;" class="thumb-wrap">',
            '<tpl if="this.isPDF(caminho)">',
            '<img src="{pasta}/thumb/{caminho}.png" />',
            '<tpl else>',
            '<img src="{pasta}/thumb/{caminho}" />',
            '</tpl>',
            '<br/><span>{name}</span>',
            '</div>',
            '</tpl>',
            {
                // XTemplate configuration:
                disableFormats: true,
                // member functions:
                isPDF: function(filename){
                    var patt = /pdf$/i;
                    return patt.test(filename);
                }
            }
        ],
        itemSelector: 'div.thumb-wrap',
        cls: 'x-image-view',
        emptyText: 'No images available'.translate(),
        listeners: {
            selectionchange: 'onSelectionChange',
            itemdblclick: 'onItemClick'
            // itemclick: 'onItemClick'
        }
    }]

});
