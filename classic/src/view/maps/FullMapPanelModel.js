Ext.define('Admin.view.maps.FullMapPanelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fullmap',
    /*
     The store 'featureStore' will be added added to this viewModel
     The store 'treeStore' will be added added to this viewModel
     */
    /*
     stores: {
     featureStore: {}
     treeStore: {}
     }
     */

    getStores: function () {
        return this.storeInfo || {};
    }

});
