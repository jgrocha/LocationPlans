Ext.define("Admin.view.redeviaria.FullMapPanel", {
    extend: "Admin.view.maps.FullMapPanel",
    alias: 'widget.fullmap-redeviaria',

    requires: [
        "Admin.view.redeviaria.FullMapPanelController",
        "Admin.view.redeviaria.FullMapPanelModel"
    ],

    controller: "fullmap-redeviaria",
    viewModel: {
        type: "fullmap-redeviaria"
    }

});
