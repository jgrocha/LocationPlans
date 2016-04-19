Ext.define('Admin.view.sync.SyncModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.sync',

    // TODO - Add view data as needed or remove if not needed

    data: {
        title: {
            sensor: 'Sensor',
            calibration: 'Calibration',
            temperature: 'Temperature'
        }
    },

    formulas: {
        calibrationTitle: function (get) {
            var fn = get('title.calibration'), ln = get('sensorGrid.selection.sensorid');
            return (fn && ln) ? (fn + ' ' + ln) : (fn || ln || '');
        }
    },


    stores: {
        sensor: {
            model: 'sync.Sensor',
            autoLoad: true,
            autoSync: true
        },
        calibration: {
            model: 'sync.Calibration',
            autoLoad: true,
            autoSync: true,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 20,
            filters: [{
                property: 'sensorid',
                type: 'number',
                value: '{sensorGrid.selection.sensorid}'
            }, {
                property: 'address',
                type: 'string',
                value: '{sensorGrid.selection.address}'
            }]
        },
        temperature: {
            model: 'sync.Temperature',
            autoLoad: true, // important to set autoLoad to false. If there is an error on the backend, Ext will still try to resolve Direct method names and crash the app.
            autoSync: true, // true,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 100,
            filters: [{
                property: 'sensorid',
                type: 'number',
                value: '{sensorGrid.selection.sensorid}'
            }, {
                property: 'address',
                type: 'string',
                value: '{sensorGrid.selection.address}'
            }]
        },
        temperaturechart: {
            fields: ['indicador', 'ind'],
            data: [
                {indicador: 'Industria', ind: 29},
                {indicador: 'Varanda', ind: 37},
                {indicador: 'Posto transformacao', ind: 50},
                {indicador: 'Alpendre', ind: 54},
                {indicador: 'Equipamentos', ind: 121},
                {indicador: '', ind: 126},
                {indicador: 'Escolar', ind: 168},
                {indicador: 'Notavel', ind: 207},
                {indicador: 'Religioso', ind: 219},
                {indicador: 'Residencia_individual', ind: 294},
                {indicador: 'Industrial', ind: 2881},
                {indicador: 'Barraco', ind: 7532},
                {indicador: 'Telheiro', ind: 8721},
                {indicador: 'Anexo', ind: 33139},
                {indicador: 'Edificio', ind: 36127}
            ]
        }
    }
});
