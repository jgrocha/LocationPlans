Ext.define('Admin.view.maps.FullMapPanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fullmap',

    control: {
        mapcanvas: {
            afterlayersloaded: 'onAfterLayersLoaded'
        }
    },

    onAfterLayersLoaded: function (view) {
        // to be overriden...
        console.log('afterlayersloaded()@fullmap');
    },

    onBeforeDeactivate: function (view) {
        //<debug>
        console.log('onBeforeDeactivate FullMapPanel');
        //</debug>
        var me = this;

        var windows = Ext.ComponentQuery.query('popup-window');
        console.log(windows);
        windows.forEach(function (element, index, array) {
            element.destroy();
        });

    }

});
