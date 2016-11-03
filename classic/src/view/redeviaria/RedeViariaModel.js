Ext.define('Admin.view.redeviaria.RedeViariaModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.redeviaria',

    data: {
        diadasemana: 0,
        gid: 10
    },

    stores: {
        trafego: {
            model: 'plantas.Trafego',
            autoLoad: true, // important to set autoLoad to false. If there is an error on the backend, Ext will still try to resolve Direct method names and crash the app.
            autoSync: true, // true,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 10,
            filters: [{
                property: 'gid',
                type: 'number',
                value: '{gid}'
            }, {
                property: 'diadasemana',
                type: 'number',
                value: '{diadasemana}'
            }],
            sorters: [{
                property: 'datahora',
                direction: 'DESC'
            }]
        }
    }

});
