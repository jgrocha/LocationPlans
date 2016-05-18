Ext.define('Admin.view.urbanismo.UrbanismoModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.urbanismo',

    data: {
        urbanismo: {
            pretensao: null,
            edificio: null
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
        },
        fotografia: {
            model: 'urbanismo.Fotografia',
            autoLoad: true, // important to set autoLoad to false. If there is an error on the backend, Ext will still try to resolve Direct method names and crash the app.
            autoSync: true, // true,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 10,
            filters: [{
                property: 'id_edifica',
                type: 'string',
                value: '{edificadoGrid.selection.id_edifica}'
            }]
        }
    },

    getStores: function () {
        return this.storeInfo || {};
    }

});
