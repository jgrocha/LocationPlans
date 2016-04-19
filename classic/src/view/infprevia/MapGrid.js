Ext.define("Admin.view.infprevia.MapGrid",{
    extend: "Ext.grid.Panel",
    alias: 'widget.mapgrid',

    controller: "mapgrid",
    viewModel: {
        type: "mapgrid"
    },

    cls: 'shadow-panel',

    // The store will be set later
    // store: '{featureStore}',

    title: 'Confrontração',

    viewConfig: {
        emptyText: 'No data available',
        deferEmptyText: false
    },

    columns: [{
        xtype: 'gx_symbolizercolumn',
        width: 40
    }, {
        text: 'Name',
        dataIndex: 'city',
        flex: 1
    }, {
        text: 'Population',
        dataIndex: 'pop',
        xtype: 'numbercolumn',
        format: '0,000',
        flex: 1
    }],

    selModel: {
        allowDeselect: true
    },

    listeners: {
        'selectionchange': 'featureGridSelectionChanged'
    }

});
