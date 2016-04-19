Ext.define('Admin.model.geo.Feature', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'string'
    }, {
        name: 'geometry_name',
        type: 'string'
    }, {
        name: 'geometry_type',
        mapping: 'geometry.type',
        type: 'string'
    }],
    hasMany: {
        name: 'featureproperty', // '{featureGrid.selection.featureproperty}'
        model: 'geo.FeatureProperty',
        associationKey: 'properties'
    }
});
