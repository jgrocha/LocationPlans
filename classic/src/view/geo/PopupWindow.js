Ext.define('Admin.view.geo.PopupWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.popup-window',

    viewModel: {
        type: "geo-popup"
    },

    cls: 'geoext-popup-window',
    width: 320,
    height: 280,
    closeAction : 'hide',
    closable: true,
    resizable: true,
    autoShow: false,
    titleAlign: 'center',
    headerPosition: 'bottom',
    frameHeader: true, // false,
    //frame: true,
    title: '{title}',
    //layout: 'fit',
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    items: [{
        xtype: 'grid',
        reference: 'featureGrid',
        itemId: 'featureGrid',
        flex: 1,
        bind: {
            store: '{gfinfo}'
        },
        viewConfig: {
            emptyText: 'No data available',
            deferEmptyText: false
        },
        columns: [{
            text: 'Feature ID',
            dataIndex: 'id',
            width: 120
        }, {
            text: 'geometry_name',
            dataIndex: 'geometry_name',
            width: 140,
            hidden: true
        }, {
            text: 'Geometry type',
            dataIndex: 'geometry_type',
            flex: 1
            //width: 140
        }]
    }, {
        xtype: 'grid',
        itemId: 'propertyGrid',
        flex: 2,
        bind: {
            title: 'Properties {featureGrid.selection.id}',
            store: '{featureGrid.selection.featureproperty}'
        },
        viewConfig: {
            emptyText: 'No data available',
            deferEmptyText: false
        },
        columns: [{
            text: 'Property',
            dataIndex: 'prop',
            width: 120
        }, {
            text: 'Value',
            dataIndex: 'value',
            // width: 140,
            flex: 1
        }]
    }]
});
