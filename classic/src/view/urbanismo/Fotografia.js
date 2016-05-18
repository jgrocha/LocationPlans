Ext.define("Admin.view.urbanismo.Fotografia", {
    extend: "Ext.container.Container",
    alias: 'widget.fotografia',

    cls: 'shadow-panel',

    title: 'Fotografias',

    controller: "fotografia",

    items: [{
        xtype: 'dataview',
        bind: {
            store: '{fotografia}'
        },
        tpl: [
            '<tpl for=".">',
            '<div style="margin-bottom: 10px;" class="thumb-wrap">',
            '<img src="uploaded_images/edificado/{pasta}/thumb.{caminho}" />',
            '<br/><span>{name}</span>',
            '</div>',
            '</tpl>'
        ],
        itemSelector: 'div.thumb-wrap',
        emptyText: 'No images available'.translate(),
        listeners: {
            selectionchange: 'onSelectionChange',
            itemclick: 'onItemClick'
        }
    }]

});
