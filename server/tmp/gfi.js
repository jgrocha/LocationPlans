/**
 * Created by jgr on 07-02-2016.
 */

var result = require('./gfioriginal.json');

function traverse(o) {
    var outjson = {};
    for (var i in o) {
        outjson[i] = o[i];
        if (o[i] !== null && typeof(o[i])=="object") {
            if (i == 'properties') {
                var prop = o[i];
                o[i] = Object.keys(prop).map(function(k) {
                    return {
                        'prop': k,
                        'value': prop[k]
                    }
                });
            } else {
                traverse(o[i]);
            }
        }
    }
    return outjson;
}

var output = traverse(result);

console.log(JSON.stringify(output));
