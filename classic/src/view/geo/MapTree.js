Ext.define("Admin.view.geo.MapTree",{
    extend: "Ext.tree.Panel",
    alias: 'widget.geo-tree',

    requires: [
        "Admin.view.geo.BasicTreeColumnLegends",
        "Admin.view.geo.MapTreeController",
        "Admin.view.geo.MapTreeModel"
    ],

    controller: "geo-maptree",
    viewModel: {
        type: "geo-maptree"
    },

    viewConfig: {
        plugins: { ptype: 'treeviewdragdrop' }
    },

    // The store will be set later
    // store: '{treeStore}',

    //title: 'Legend tree {mapTree.selection.text}', // not working
    bind: {
        title: 'Legend tree {selectedlayer}'
    },

    rootVisible: false,
    hideHeaders: true,
    flex: 1,
    border: false,

    reference: 'mapTree', // not working...

    columns: {
        header: false,
        items: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                plugins: [
                    {
                        ptype: 'basic_tree_column_legend'
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
