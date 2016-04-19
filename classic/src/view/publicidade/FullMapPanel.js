Ext.define("Admin.view.publicidade.FullMapPanel", {
    extend: "Admin.view.maps.FullMapPanel",
    alias: 'widget.fullmap-publicidade',

    requires: [
        "Admin.view.publicidade.FullMapPanelController",
        "Admin.view.publicidade.FullMapPanelModel"
    ],

    controller: "fullmap-publicidade",
    viewModel: {
        type: "fullmap-publicidade"
    }

});
