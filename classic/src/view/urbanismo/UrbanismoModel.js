Ext.define('Admin.view.urbanismo.UrbanismoModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.urbanismo',

    data: {
        urbanismo: {
            pretensao: null
        }
    },

    stores: {
        processo: {
            model: 'consulta.Processo',
            autoLoad: true,
            autoSync: false,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 20
        },
        embargos: {
            model: 'consulta.Embargo',
            autoLoad: true,
            autoSync: false,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 20
        },
        fiscaliz: {
            model: 'consulta.Fiscalizacao',
            autoLoad: true,
            autoSync: false,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 20
        }
    },

    getStores: function () {
        return this.storeInfo || {};
    }

});
