Ext.define('Admin.view.geo.gu.MapGridModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.geo-mapgrid-gu',

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
    }

});
