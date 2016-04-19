Ext.define('Admin.view.plantas.FullMapPanelModel', {
    extend: 'Admin.view.maps.FullMapPanelModel',
    alias: 'viewmodel.fullmap-plantas',
    requires: ['Admin.model.geo.Nominatim'],

    data: {
        paper: 'A4',
        orientation: 'portrait',
        draw: {},
        modify: {}
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
        }
    }

});
