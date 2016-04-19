Ext.define("Admin.view.maps.MapTree",{
    extend: "Ext.tree.Panel",
    alias: 'widget.maptree',

    requires: [
        "Admin.view.maps.BasicTreeColumnLegends",
        "Admin.view.maps.MapTreeController",
        "Admin.view.maps.MapTreeModel"
    ],

    controller: "maptree",
    viewModel: {
        type: "maptree"
    },

    viewConfig: {
        plugins: { ptype: 'treeviewdragdrop' }
    },

    // The store will be set later
    // store: '{treeStore}',

    title: 'Layers'.translate(),

    /*
    bind: {
        title: 'Legend tree {selectedlayer}'
    },
    */

    rootVisible: false,
    hideHeaders: true,
    flex: 1,
    border: false,

    columns: {
        header: false,
        items: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                plugins: [
                    {
                        ptype: 'basic_maptree_column_legend'
                    }
                ]
            }]
    },

    selModel: {
        allowDeselect: true
    },

    listeners: {
        'selectionchange': 'mapTreeSelectionChanged'
    }


});
