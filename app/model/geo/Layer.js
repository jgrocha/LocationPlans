Ext.define('Admin.model.geo.Layer', {
	extend : 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'title',
        type: 'string'
    }, {
        name: 'layer',
        type: 'string'
    }, {
        name: 'layergroup',
        type: 'string'
    }, {
        name: 'url',
        type: 'string'
    }, {
        name: 'legendurl',
        type: 'string'
    }, {
        name: 'service',
        type: 'string'
    }, {
        name: 'srid',
        type: 'int'
    }, {
        name: 'style',
        type: 'string'
    }, {
        name: 'baselayer',
        type: 'bool'
    }, {
        name: 'singletile',
        type: 'bool'
    }, {
        name: 'active',
        type: 'bool'
    }, {
        name: 'visible',
        type: 'bool'
    }, {
        name: 'opacity',
        type: 'float'
    }, {
        name: 'attribution',
        type: 'string'
    }, {
        name: 'viewid',
        type: 'int'
    }, {
        name : 'getfeatureinfo',
        type : 'bool'
    }, {
        name : 'gficolumns',
        type : 'string'
    }],
    proxy : {
        type : 'direct',
        api : {
            read : 'Server.DXSessao.readLayer'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        }
    }
});
