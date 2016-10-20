Ext.define("Admin.view.plantas.ConfrontacaoFullMapPanel", {
    extend: "Admin.view.maps.FullMapPanel",
    alias: 'widget.fullmap-confrontacao',

    requires: [
        'Ext.button.Cycle',
        "Admin.view.plantas.ConfrontacaoFullMapPanelController",
        "Admin.view.plantas.ConfrontacaoFullMapPanelModel"
    ],

    controller: "fullmap-confrontacao",
    viewModel: {
        type: "fullmap-confrontacao"
    }

});
