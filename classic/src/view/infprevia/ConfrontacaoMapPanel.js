Ext.define("Admin.view.infprevia.ConfrontacaoMapPanel", {
    extend: "Admin.view.maps.FullMapPanel",
    alias: 'widget.fullmap-infprevia-confrontacao',

    requires: [
        "Admin.view.infprevia.ConfrontacaoMapPanelController",
        "Admin.view.infprevia.ConfrontacaoMapPanelModel"
    ],

    controller: "fullmap-infprevia-confrontacao",
    viewModel: {
        type: "fullmap-infprevia-confrontacao"
    },

    pretensao: null,

    bind: {
        pretensao: '{infprevia.pretensao}'
    },

    getPretensao: function() {
        console.log('getPretensao');
        return this.pretensao;
    },

    setPretensao: function(value) {
        if (value) {
            this.fireEvent('pretensaochanged', value);
            this.pretensao = value;
        }
    }

});
