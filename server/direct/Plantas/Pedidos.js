var table = 'plantas.pedido';
var pg = global.App.postgres;
var fs = global.App.fs;
var mkdirp = require('mkdirp');

var request = require('request');

var dberror = function (text, log, err, callback) {
    console.error(text + ' ' + err.toString() + ' ' + log);
    callback({
        message: {
            text: text,
            detail: err.toString()
        }
    });
    return false;
};

var Pedidos = {

    // curl -v -H "Content-type: application/json" -d '{"action":"Plantas.Pedidos","method":"asGeoJson","data":[{}],"type":"rpc","tid":5}' http://localhost:3000/direct

    asGeoJson: function (params, callback) {
        console.log('Plantas.Pedidos.asGeoJson');
        console.log(params);

        var gid = 0;
        if (params.gid && parseInt(params.gid) > 0) {
            gid = params.gid;
        }

        /*
         SELECT row_to_json(fc) as geojson
         FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
         FROM (
         -- query
         SELECT 'Feature' As type, ST_AsGeoJSON(lgeom.pretensao)::json As geometry, row_to_json(lprop) As properties
         FROM plantas.pedido As lgeom
         INNER JOIN (
         SELECT gid, nome, pdf, tipo, obs, datahora, utilizador, coord_x, coord_y, nif, fs, download_cod, userid FROM plantas.pedido
         where gid >= 19335
         ) As lprop
         ON lgeom.gid = lprop.gid
         -- fim de query
         ) As f )  As fc
         */

        var sql = '';
        sql += 'SELECT row_to_json(fc) as geojson ';
        sql += "FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features ";
        sql += 'FROM ( ';
        //-- query
        sql += "SELECT 'Feature' As type, ST_AsGeoJSON(lgeom.pretensao)::json As geometry, row_to_json(lprop) As properties ";
        sql += 'FROM plantas.pedido As lgeom ';
        sql += 'INNER JOIN ( ';
        sql += 'SELECT gid, nome, pdf, tipo, obs, datahora, utilizador, coord_x, coord_y, nif, fs, download_cod, userid FROM plantas.pedido ';
        sql += 'where gid = ' + gid;
        sql += ' ) As lprop ';
        sql += 'ON lgeom.gid = lprop.gid ';
        //-- fim de query
        sql += ') As f )  As fc';
        console.log(sql);
        var detail = global.App.connection.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'asGeoJson'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            console.log(sql);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                console.log(result.rows[0].geojson);
                callback(null, {
                    //data: result.rows,
                    data: result.rows[0].geojson,
                    total: 1
                });
                // free this client, from the client pool
                done();
            });
        });
    },

    asGeoJsonDetail: function (params, callback) {
        console.log('Plantas.Pedidos.asGeoJsonDetail');
        console.log(params);

        var gid = 0;
        if (params.gid && parseInt(params.gid) > 0) {
            gid = params.gid;
        }

        /*
         SELECT row_to_json(fc) as geojson
         FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
         FROM (
         -- query
         SELECT 'Feature' As type, ST_AsGeoJSON(lgeom.pretensao)::json As geometry, row_to_json(lprop) As properties
         FROM plantas.pedidodetail As lgeom
         INNER JOIN (
         SELECT id, gid FROM plantas.pedidodetail
         where gid = 19424
         ) As lprop
         ON lgeom.gid = lprop.gid
         -- fim de query
         ) As f )  As fc
         */

        var sql = '';
        sql += 'SELECT row_to_json(fc) as geojson ';
        sql += "FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features ";
        sql += 'FROM ( ';
        //-- query
        sql += "SELECT 'Feature' As type, ST_AsGeoJSON(lgeom.pretensao)::json As geometry, row_to_json(lprop) As properties ";
        sql += 'FROM plantas.pedidodetail As lgeom ';
        sql += 'INNER JOIN ( ';
        sql += 'SELECT id, gid FROM plantas.pedidodetail ';
        sql += 'where gid = ' + gid;
        sql += ' ) As lprop ';
        sql += 'ON lgeom.gid = lprop.gid ';
        //-- fim de query
        sql += ') As f )  As fc';
        console.log(sql);
        var detail = global.App.connection.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'asGeoJsonDetail'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            console.log(sql);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                console.log(result.rows[0].geojson);
                callback(null, {
                    //data: result.rows,
                    data: result.rows[0].geojson,
                    total: 1
                });
                // free this client, from the client pool
                done();
            });
        });
    },

    saveGeoJson: function (params, callback, sessionID, request, res) {
        console.log('saveGeoJson');
        console.log(params);
        if (params.feature) {
            var f = JSON.parse(params.feature);
            f.geometry["crs"] = {"type": "name", "properties": {"name": "EPSG:3763"}};
            console.log(f.geometry);
            console.log(f.properties);
            var fields = [], values = [];
            for (var key in f.properties) {
                fields.push(key);
                values.push(f.properties[key]);
            }
            var i = 0, buracos = [];
            for (i = 1; i <= fields.length; i++) {
                buracos.push('$' + i);
            }
            fields.push('pretensao');
            values.push(JSON.stringify(f.geometry));
            buracos.push("ST_GeomFromGeoJSON($" + i + ")");
            i++;
            fields.push('fs');
            values.push(sessionID);
            buracos.push('$' + i);

            var sql = `INSERT INTO ${table} (${fields.join()}) VALUES (${buracos.join()}) RETURNING gid`;
            console.log(sql);
            var detail = global.App.connection.split('/');
            pg.connect({
                user: detail[2].split('@')[0].split(':')[0],
                password: detail[2].split('@')[0].split(':')[1], // 'geobox',
                database: detail[3], // 'geotuga',
                host: detail[2].split('@')[1].split(':')[0], // 'localhost',
                port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
                application_name: 'Pedidos.saveGeoJson'
            }, function (err, client, done) {
                if (err)
                    return dberror('Database connection error', '', err, callback);
                client.query(sql, values, function (err, result) {
                    done();
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql} Values: ${values.toString()}`, err, callback);
                    callback(null, {
                        data: result.rows,
                        total: result.rows.length
                    });
                });
            });
        } else {
            callback({
                message: {
                    text: 'Parameter feature is required'
                }
            });
        }
    },

    saveGeoJsonDetail: function (params, callback, sessionID, request, res) {
        console.log('saveGeoJsonDetail');
        console.log(params);
        var all = JSON.parse(params.features);

        var insertsToDo = all["features"].length;
        var insertsDone = [];
        var pgclient = null;
        var pgdone = null;

        function insertRow(element, index, array) {
            console.log(element["geometry"]["type"]);

            var fields = [], values = [];
            fields.push('gid');
            values.push(params.pedido);

            fields.push('sessionid');
            values.push(sessionID);

            if (request.session.userid) {
                fields.push('userid');
                values.push(request.session.userid);
            }

            var i, buracos = [];
            for (i = 1; i <= fields.length; i++) {
                buracos.push('$' + i);
            }

            element.geometry["crs"] = {"type": "name", "properties": {"name": "EPSG:3763"}};

            fields.push('pretensao');
            values.push(JSON.stringify(element["geometry"]));
            buracos.push("ST_GeomFromGeoJSON($" + i + ")");

            var sql = `INSERT INTO plantas.pedidodetail (${fields.join()}) VALUES (${buracos.join()}) RETURNING id`;
            console.log(sql);

            pgclient.query(sql, values, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql} Values: ${values.toString()}`, err, callback);
                var id = result.rows[0].id;
                insertsDone.push(id);
                finish();
            });

        }

        function finish() {
            if (insertsToDo == insertsDone.length) {
                console.log('Done!');
                sql = `SELECT * FROM plantas.pedidodetail where id IN (${insertsDone.toString()})`;
                console.log(sql);
                pgclient.query(sql, function (err, result) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                    console.log(result.rows);
                    callback(null, {
                        data: result.rows,
                        total: result.rows.length
                    });
                    pgdone();
                });
            } else {
                console.log('Not yet... ' + insertsDone.length + ' de ' + insertsToDo);
            }
        }

        // pg.connect(global.App.connection, function (err, client, done) {
        var detail = global.App.connection.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'saveGeoJsonDetail'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            pgclient = client;
            pgdone = done;
            all["features"].forEach(insertRow);
        });

    },

    // curl -v -H "Content-type: application/json" -d '{"action":"Plantas.Pedidos","method":"createConfrontacao","data":[{ "gid": "19468"}],"type":"rpc","tid":5}' http://localhost:3000/direct

    createConfrontacao: function (params, callback, sessionID, request, response) {
        console.log('Plantas.Pedidos.createConfrontacao');
        console.log(params);

        // designacao, idutilizador
        var gid = params.gid;
        var userid = 31;
        if (request.session.userid) {
            userid = request.session.userid;
        }

        pg.connect(global.App.connection, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);

            var sql = `INSERT INTO infprevia.pretensao (designacao, idutilizador, the_geom)
            SELECT 'Plantas de localização: ' || gid, ${userid}, ST_Multi(ST_Union(pretensao))
            FROM plantas.pedidodetail
            WHERE gid = ${gid} and (st_geometrytype(pretensao) = 'ST_Polygon' OR st_geometrytype(pretensao) = 'ST_MultiPolygon')
            GROUP BY gid RETURNING id`;
            console.log(sql);

            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                var id = result.rows[0].id;
                sql = `SELECT * FROM infprevia.pretensao where id = ${id}`;
                console.log(sql);
                client.query(sql, function (err, pretensao) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                    console.log(pretensao.rows);
                    callback(null, {
                        data: pretensao.rows,
                        total: pretensao.rows.length
                    });
                    done();
                });
            });
        });
    },

    downloadWhenReady: function (gid, pathpdf, startTime, data) {
        var me = this;
        console.log('downloadWhenReady()');
        console.log(arguments);

        if (global.App.env === 'development') {
            var url = 'http://geoserver.sig.cm-agueda.pt' + data.statusURL;
        } else {
            // same server
            var url = 'http://localhost:8080' + data.statusURL;
        }

        console.log(url);

        if ((new Date().getTime() - startTime) > 60000) {
            console.log('Gave up waiting after 60 seconds');
        } else {
            //updateWaitingMsg(startTime, data);
            setTimeout(function () {

                request(url, function (error, response, body) {
                    console.log('request');
                    if (!error && response.statusCode == 200) {
                        console.log('request ok');
                        console.log(body); // Show the response
                        var status = JSON.parse(body);
                        console.log(status); // Show the response

                        if (!status.done) {
                            console.log('continuar a ver o status...');
                            module.exports.downloadWhenReady(gid, pathpdf, startTime, data);
                        } else {
                            console.log('Descarregar o pedido ' + status.downloadURL);
                            if (global.App.env === 'development') {
                                var urlpdf = 'http://geoserver.sig.cm-agueda.pt' + status.downloadURL;
                            } else {
                                // same server
                                var urlpdf = 'http://localhost:8080' + status.downloadURL;
                            }
                            var folderpdf = 'print-requests/' + Math.floor(gid / 1000);
                            //var pathpdf = folderpdf + '/' + gid + '.pdf';
                            mkdirp(folderpdf, function (err) {
                                if (err)
                                    console.error(err);
                                else
                                    request(urlpdf).pipe(fs.createWriteStream(pathpdf));
                            });
                        }
                        // {"done":false,"status":"running","elapsedTime":183,"waitingTime":0,"downloadURL":"/print/print/report/0bdf0f7d-8258-429e-89ee-e31878291cb0@0f24d222-4565-4b03-b371-54bf12268d6f"}
                    } else {
                        console.log('Error requesting');
                    }
                });

            }, 5000);
        }


    },

    update: function (params, callback, sessionID, request, res) {
        console.log('update');
        console.log(params);

        /*
         { email: 'adele_singer@gmail.com', id: 7 }
         * it can have more than one record to update:
         * [ { name: 'Ana', id: 7 },
         { email: 'adele_singer@gmail.com', id: 8 } ]
         */

        var rows = [].concat(params); // even if we receive just one object, we create an array with that object
        console.log(rows);
        console.log(rows.length);

        var updatesToDo = rows.length;
        var updatesDone = [];
        var pgclient = null;
        var pgdone = null;
        var gid;

        function updateRow(element, index, array) {
            var i = 1, gid, fields = [], values = [];
            gid = element.gid;
            delete element.gid;

            var statusURL = element.statusURL;
            delete element.statusURL;

            for (var key in element) {
                fields.push(key + '= $' + i);
                values.push(element[key]);
                i = i + 1;
            }
            var sql = `UPDATE ${table} SET ${fields.join()} WHERE gid = ${gid}`;
            console.log(sql);
            pgclient.query(sql, values, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql} Values: ${values.toString()}`, err, callback);
                console.log('Rows updated: ' + result.rowCount);

                if (params.download_cod) {
                    console.log('Tenho fazer o download do report para o servidor.');
                    var startTime = new Date().getTime();
                    module.exports.downloadWhenReady(gid, element.pdf, startTime, {statusURL: statusURL});
                }

                if (result.rowCount != updatesToDo) {
                    console.error('Error: only ' + result.rowCount + ' rows of ' + updatesToDo + ' were updated');
                }
                updatesDone.push(gid);
                finish();
            });
        }

        function finish() {
            if (updatesToDo == updatesDone.length) {
                console.log('Done!');
                sql = `SELECT * FROM ${table} where gid IN (${updatesDone.toString()})`;
                console.log(sql);
                pgclient.query(sql, function (err, result) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                    //console.log(result.rows);
                    callback(null, {
                        data: result.rows,
                        total: result.rows.length
                    });
                    pgdone();
                });
            } else {
                console.log('Not yet... ' + updatesDone.length + ' de ' + updatesToDo);
            }
        }

        var detail = global.App.connection.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'Pedidos.update'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            pgclient = client;
            pgdone = done;
            rows.forEach(updateRow);
        });
    },

    // curl -v -H "Content-type: application/json" -d '{"action":"Plantas.Pedidos","method":"read","data":[{}],"type":"rpc","tid":5}' http://localhost:3000/direct

    estatisticas: function (params, callback) {
        console.log(params);
        /*
         */

        var colunas = 'EXTRACT(YEAR FROM datahora) as ano, count(*) as contador',
            where = '',
            group = ' group by 1',
            order = ' order by 1';

        if (params.filter) {
            console.log('Exitem filtros:' + JSON.stringify(params.filter));
            var condicoes = [];
            console.log('filtros.length: ' + params.filter.length);
            for (var k = 0; k < params.filter.length; k++) {
                console.log('Filtrar por ' + params.filter[k].property + ' do tipo ' + params.filter[k].type);
                switch (params.filter[k].type) {
                    case 'string':
                        console.log('filtro sobre o tipo: ' + params.filter[k].type + ' com o valor ' + params.filter[k].value);
                        //condicoes.push(params.filter[k].property + " ilike '%" + params.filter[k].value + "%'");
                        condicoes.push(params.filter[k].property + " = '" + params.filter[k].value + "'");
                        break;
                    case 'date':
                        console.log('filtro sobre o tipo: ' + params.filter[k].type + ' com o valor ' + params.filter[k].value);
                        condicoes.push("EXTRACT(YEAR FROM " + params.filter[k].property + ") = " + params.filter[k].value);
                        colunas = "date_trunc('year', datahora) as ano, EXTRACT(MONTH FROM datahora) as mes, to_char(datahora, 'Mon') as abrmes, count(*) as contador";
                        group = ' group by 1, 2, 3 ';
                        order = ' order by 1, 2 ';
                        break;
                    case 'numeric':
                    case 'number':
                        console.log('filtro sobre o tipo: ' + params.filter[k].type + ' com o valor ' + params.filter[k].value);
                        condicoes.push(params.filter[k].property + ' ' + " = " + ' ' + params.filter[k].value);
                        break;
                    default:
                        console.log('filtro inesperado sobre o tipo: ' + filtros[k].type);
                        break;
                }
            }
            console.log(condicoes.join(" AND "));
            if (where == '') {
                where = ' WHERE ' + condicoes.join(" AND ");
            } else {
                where = where + ' AND ' + condicoes.join(" AND ");
            }
        }

        var sql = 'SELECT ' + colunas + ' FROM ' + table;
        sql += where;
        sql += group;
        sql += order;

        var detail = global.App.connection.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'estatisticas'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            console.log(sql);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                callback(null, {
                    data: result.rows,
                    total: result.rows.length
                });
                // free this client, from the client pool
                done();
            });
        });
    },

    read: function (params, callback, sessionID, request, res) {
        console.log('Server.Plantas.Pedidos.read()');
        console.log(params);
        /*
         { page: 1,
         start: 0,
         limit: 5,
         sort: [ { property: 'cal_a_old', direction: 'DESC' } ],
         filter:
         [ { property: 'sensorid', type: 'number', value: 2 },
         { property: 'address', type: 'string', value: '30:14:12:18:06:34' } ] }
         */

        //var sql = 'SELECT id, elevation, name, ST_AsGeoJSON(the_geom) as geojson FROM amr.summits';

        //var sql = 'SELECT  sensorid, address, location, installdate, sensortype, metric, calibrated, quantity, decimalplaces, cal_a, cal_b, read_interval, record_sample FROM ' + table,
        var sql = 'SELECT *, ST_AsGeoJSON(pretensao) as geojson FROM ' + table,
            where = '', order = '', paging = '';
        if (params.filter) {
            console.log('Exitem filtros:' + JSON.stringify(params.filter));
            var condicoes = [];
            console.log('filtros.length: ' + params.filter.length);
            for (var k = 0; k < params.filter.length; k++) {
                console.log('Filtrar por ' + params.filter[k].property + ' do tipo ' + params.filter[k].type);
                switch (params.filter[k].type) {
                    case 'string':
                        console.log('filtro sobre o tipo: ' + params.filter[k].type + ' com o valor ' + params.filter[k].value);
                        //condicoes.push(params.filter[k].property + " ilike '%" + params.filter[k].value + "%'");
                        condicoes.push(params.filter[k].property + " = '" + params.filter[k].value + "'");
                        break;
                    case 'date':
                        console.log('filtro sobre o tipo: ' + params.filter[k].type + ' com o valor ' + params.filter[k].value);
                        condicoes.push("date_trunc('day', " + params.filter[k].property + ') ' + " = " + " '" + params.filter[k].value + "'");
                        break;
                    case 'numeric':
                    case 'number':
                        console.log('filtro sobre o tipo: ' + params.filter[k].type + ' com o valor ' + params.filter[k].value);
                        condicoes.push(params.filter[k].property + ' ' + " = " + ' ' + params.filter[k].value);
                        break;
                    default:
                        console.log('filtro inesperado sobre o tipo: ' + filtros[k].type);
                        break;
                }
            }
            console.log(condicoes);
            console.log(condicoes.join(" AND "));
            if (where == '') {
                //where = ' WHERE ' + condicoes.join(" AND ") + " OR fs = '" + sessionID + "'";
                where = ' WHERE ' + condicoes.join(" AND ");
            } else {
                where = where + ' AND ' + condicoes.join(" AND ");
            }
        }
        if (params.sort) {
            var s = params.sort[0];
            order = ' ORDER BY ' + s.property + ' ' + s.direction;
        }

        if (params.hasOwnProperty('limit'))
            console.log('params.limit: ' + params.limit);
        if (params.hasOwnProperty('start'))
            console.log('params.start: ' + params.start);

        if (params.hasOwnProperty('limit') && params.hasOwnProperty('start')) {
            console.log('params.limit: ' + params.limit);
            console.log('params.start: ' + params.start);
            paging = ' LIMIT ' + params.limit + ' OFFSET ' + params.start;
        }
        sql += where;
        sql += order;
        sql += paging;
        // pg.connect(global.App.connection, function (err, client, done) {
        var detail = global.App.connection.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'Urbanismo.Pedidos.read'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            console.log("sql = " + sql);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);

                //get totals for paging
                var totalQuery = sql.replace(/SELECT \*, ST_AsGeoJSON\(pretensao\) as geojson/i, 'SELECT count(*) as totals');
                totalQuery = totalQuery.replace(/ order by .+$/i, '');
                totalQuery = totalQuery.replace(/ limit .+$/i, '');
                console.log('totalQuery = ' + totalQuery);
                client.query(totalQuery, function (err, resultTotalQuery) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${totalQuery}`, err, callback);
                    callback(null, {
                        data: result.rows,
                        total: resultTotalQuery.rows[0].totals
                    });
                    // free this client, from the client pool
                    done();

                });
            });
        });
    }

};

module.exports = Pedidos;