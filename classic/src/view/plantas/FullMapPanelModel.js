Ext.define('Admin.view.plantas.FullMapPanelModel', {
    extend: 'Admin.view.maps.FullMapPanelModel',
    alias: 'viewmodel.fullmap-plantas',
    requires: ['Admin.model.geo.Nominatim'],

    data: {
        paper: 'A4',
        orientation: 'portrait',
        selectedPurpose: 1,
        enablePreview: 0,
        printlabel: 'PDF document'.translate(),
        draw: {},
        modify: {},
        modified: false // if the current draw was modified after the print request
        // is it another request or can we print the previous request?
    },

    stores: {
        nominatimdata: {
            model: 'geo.Nominatim'
        },
        geometrias: {
            fields: ['value', 'name'],
            data: [
                {value: "Point", name: "Point".translate()},
                {value: "LineString", name: "Line".translate()},
                {value: "Polygon", name: "Polygon".translate()},
                //{value: "Circle", name: "Circle".translate()},
                //{value: "Square", name: "Square".translate()},
                //{value: "Box", name: "Box".translate()},
                {value: "None", name: "Select/Modify".translate()}
            ]
        },
        purpose: {
            fields: ['id', 'name'],
            data: [
                {id: 1, name: "Location Plan".translate()},
                {id: 2, name: "Condicionantes (RAN)"},
                {id: 3, name: "Condicionantes (REN)"},
                {id: 4, name: "Informação Prévia"}
            ]
        }
    }

});
