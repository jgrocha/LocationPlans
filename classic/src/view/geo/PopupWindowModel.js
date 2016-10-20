Ext.define('Admin.view.geo.PopupWindowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.geo-popup',
    //http://localhost:8080/geoserver/geomaster/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=geomaster%3Aagueda,geomaster%3Abgri2011_0101&STYLES&LAYERS=geomaster%3Aagueda,geomaster%3Abgri2011_0101&info_format=application/json&FEATURE_COUNT=50&X=50&Y=50&SRS=EPSG%3A3763&WIDTH=101&HEIGHT=101&BBOX=-29957.80798244231%2C102114.7105175374%2C-29837.31583317896%2C102235.20266680076
    stores: {
        gfinfo: {
            autoLoad: false,
            model: 'geo.Feature',
            proxy: {
                type: 'ajax',
                url: 'http://localhost:8080/geoserver/geomaster/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=geomaster%3Aagueda,geomaster%3Abgri2011_0101&STYLES&LAYERS=geomaster%3Aagueda,geomaster%3Abgri2011_0101&info_format=application/json&FEATURE_COUNT=50&X=50&Y=50&SRS=EPSG%3A3763&WIDTH=101&HEIGHT=101&BBOX=-29957.80798244231%2C102114.7105175374%2C-29837.31583317896%2C102235.20266680076',
                //url: 'getfeaturerequest_response.json',
                reader: {
                    type: 'json',
                    rootProperty: 'features',
                    transform: function(o) {
                        var outjson = this.traverse(o);
                        return outjson;
                    },
                    traverse: function(o) {
                        var outjson = {};
                        for (var i in o) {
                            outjson[i] = o[i];
                            if (o[i] !== null && typeof(o[i]) == "object") {
                                if (i == 'properties') {
                                    var prop = o[i];
                                    o[i] = Object.keys(prop).map(function(k) {
                                        return {
                                            'prop': k,
                                            'value': prop[k]
                                        }
                                    });
                                } else {
                                    this.traverse(o[i]);
                                }
                            }
                        }
                        return outjson;
                    }
                }
            }
        }
    }

});
