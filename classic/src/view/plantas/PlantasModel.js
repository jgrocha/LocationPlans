Ext.define('Admin.view.plantas.PlantasModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.plantas',

    stores: {
        pedido: {
            model: 'plantas.Pedido',
            autoLoad: true, // important to set autoLoad to false. If there is an error on the backend, Ext will still try to resolve Direct method names and crash the app.
            autoSync: true, // true,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 10,
            filters: [{
                property: 'userid',
                type: 'number',
                value: '{current.user.id}'
            }],
            sorters: [{
                property: 'datahora',
                direction: 'DESC'
            }]
        }
    }

});
