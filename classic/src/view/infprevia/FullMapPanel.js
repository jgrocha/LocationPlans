Ext.define("Admin.view.infprevia.FullMapPanel", {
    extend: "Admin.view.maps.FullMapPanel",
    alias: 'widget.fullmap-infprevia',

    requires: [
        "Admin.view.infprevia.FullMapPanelController",
        "Admin.view.infprevia.FullMapPanelModel"
    ],

    controller: "fullmap-infprevia",
    viewModel: {
        type: "fullmap-infprevia"
    }

});
