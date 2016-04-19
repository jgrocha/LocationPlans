Ext.define('Admin.model.geo.Nominatim', {
	extend : 'Ext.data.Model',
    fields: [{
        name: "name",
        mapping: "display_name"
    }, {
        name: "bounds",
        convert: function(v, rec) {
            var bbox = rec.get('boundingbox');
            return [bbox[2], bbox[0], bbox[3], bbox[1]];
        }
    }, {
        name: "lonlat",
        convert: function(v, rec) {
            return [rec.get('lon'), rec.get('lat')];
        }
    }],
    proxy: {
        type: 'ajax',
        url: "https://nominatim.openstreetmap.org/search?format=json&bounded=1&viewboxlbrt=-8.559,40.495,-8.245,40.695",
        reader: {
            type: 'json'
        }
    }
});
