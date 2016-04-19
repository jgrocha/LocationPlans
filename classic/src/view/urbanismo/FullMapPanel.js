Ext.define("Admin.view.urbanismo.FullMapPanel", {
    extend: "Admin.view.maps.FullMapPanel",
    alias: 'widget.fullmap-urbanismo',

    requires: [
        "Admin.view.urbanismo.FullMapPanelController",
        "Admin.view.urbanismo.FullMapPanelModel"
    ],

    controller: "fullmap-urbanismo",
    viewModel: {
        type: "fullmap-urbanismo"
    }

});
