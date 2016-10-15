var table = 'publicidade.pub3763';

var pg = global.App.postgres;

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

var Publicidade = {

    create: function (params, callback) {
        console.log('Publicidade.Publicidade.create');
        console.log(params);

        var rows = [].concat(params); // even if we receive just one object, we create an array with that object
        console.log(rows);
        console.log(rows.length);

        var insertsToDo = rows.length;
        var insertsDone = [];
        var pgclient = null;
        var pgdone = null;

        function insertRow(element, index, array) {
            var fields = [], values = [];
            for (var key in element) {
                switch (key) {
                    case "id":
                        break;
                    default:
                        fields.push(key);
                        values.push(element[key]);
                        break;
                }
            }
            var i = 0, buracos = [];
            for (i = 1; i <= fields.length; i++) {
                buracos.push('$' + i);
            }
            var sql = `INSERT INTO ${table} (${fields.join()}) VALUES (${buracos.join()}) RETURNING id`;
            console.log(sql);
            pgclient.query(sql, values, function (err, result) {
                // maybe some rows are insert and other are not inserted...
                // missing tests with rows ok and rows that will fail
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
                sql = `SELECT * FROM ${table} where id IN (${insertsDone.toString()})`;
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

        pg.connect(global.App.connectionide, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            pgclient = client;
            pgdone = done;
            rows.forEach(insertRow);
        });
    },

    // curl -v -H "Content-type: application/json" -d '{"action":"Publicidade.Publicidade","method":"read","data":[{"userid":25,"from":"test2","node":"root"}],"type":"rpc","tid":5}' http://127.0.0.1:3000/direct
    readFotografia: function (params, callback) {
        console.log(params);
        //var sql = 'SELECT  sensorid, address, location, installdate, sensortype, metric, calibrated, quantity, decimalplaces, cal_a, cal_b, read_interval, record_sample FROM ' + table,
        var sql = 'SELECT * FROM publicidade.fotografia',
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
            var paging = ' LIMIT ' + params.limit + ' OFFSET ' + params.start;
        }
        sql += where;
        sql += order;
        sql += paging;
        pg.connect(global.App.connectionide, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            console.log(sql);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);

                //get totals for paging
                var totalQuery = sql.replace(/SELECT \*/i, 'SELECT count(*) as totals');
                totalQuery = totalQuery.replace(/ order by .+$/i, '');
                totalQuery = totalQuery.replace(/ limit .+$/i, '');
                console.log(totalQuery);
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
    },

    destroyFotografia: function (params, callback) {
        //  { id: 30 }
        //  [ { id: 30 }, { id: 31 }, { id: 71 }, { id: 74 } ]
        var rows = [].concat(params); // even if we receive just one object, we create an array with that object
        console.log(rows);
        console.log(rows.length);
        var ids = rows.reduce(function (previousValue, currentValue, index, array) {
            return previousValue.concat(currentValue['id']);
        }, []);
        console.log(ids);
        var sql = `DELETE FROM publicidade.fotografia WHERE id IN (${ids.toString()})`;
        console.log(sql);
        // pg.connect(global.App.connectionide, function (err, client, done) {
        var detail = global.App.connectionide.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'destroyFotografia'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                console.log(result.rowCount);
                if (result.rowCount != rows.length) {
                    console.error('Error: only ' + result.rowCount + ' rows of ' + rows.length + ' were deleted');
                }
                callback(null, {});
                // free this client, from the client pool
                done();
            });
        });
    },

    updateEdificio: function (params, callback, sessionID, request, response) {
        console.log('Publicidade.updateEdificio() Session ID = ' + sessionID);
        console.log(params);

        var idpub = params.id_edifica;
        delete params.id_pub;

        var fields = [], values = [], i = 1;
        for (var key in params) {
            fields.push(key + '= $' + i);
            values.push(params[key]);
            i = i + 1;
        }
        fields.push('d_actualiz = now()');
        // values.push('now()');
        // i = i + 1;
        fields.push('u_actualiz = $' + i);
        values.push(request.session.userid);

        var sql = `UPDATE edificios.edificado_vti2 SET ${fields.join()} WHERE id_pub = '${idpub}'`;
        console.log(sql);

        if (request.session.userid && parseInt(idpub) > 0) {
            // pg.connect(global.App.connectionide, function (err, client, done) {
            var detail = global.App.connectionide.split('/');
            pg.connect({
                user: detail[2].split('@')[0].split(':')[0],
                password: detail[2].split('@')[0].split(':')[1], // 'geobox',
                database: detail[3], // 'geotuga',
                host: detail[2].split('@')[1].split(':')[0], // 'localhost',
                port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
                application_name: 'updateEdificio'
            }, function (err, client, done) {
                if (err)
                    return dberror('Database connection error', '', err, callback, request, done);
                client.query(sql, values, function (err, result) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                    callback(null, {
                        message: 'Building updated'
                    });
                    done();
                });
            });
        } else {
            callback({
                success: false,
                message: 'Building was not updated'
            });
        }
    },

    // curl -v -H "Content-type: application/json" -d '{"action":"Publicidade.Publicidade","method":"readPubByID","data":[{"id":"9999"}],"type":"rpc","tid":5}' http://127.0.0.1:3000/direct
    readPubByID: function (params, callback) {
        console.log(params);
        /*
         { id: 9999 }
         */

        //var sql = 'SELECT  sensorid, address, location, installdate, sensortype, metric, calibrated, quantity, decimalplaces, cal_a, cal_b, read_interval, record_sample FROM ' + table,
        var sql = "select st_x(st_centroid(the_geom)), st_y(st_centroid(the_geom)) from " + table + " where id_pub = " + params.id;
            where = '', order = '', paging = '';
        var detail = global.App.connectionide.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'Publicidade.readPubByID'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            console.log(sql);
            client.query(sql, function (err, result) {
                done();
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                callback(null, {
                    data: result.rows,
                    total: result.rows.length
                });
            });
        });
    },

    // curl -v -H "Content-type: application/json" -d '{"action":"Publicidade.Publicidade","method":"read","data":[{"userid":25,"from":"test2","node":"root"}],"type":"rpc","tid":5}' http://127.0.0.1:3000/direct
    read: function (params, callback) {
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

        //var sql = 'SELECT  sensorid, address, location, installdate, sensortype, metric, calibrated, quantity, decimalplaces, cal_a, cal_b, read_interval, record_sample FROM ' + table,
        var sql = 'SELECT * FROM ' + table,
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
            var paging = ' LIMIT ' + params.limit + ' OFFSET ' + params.start;
        }
        sql += where;
        sql += order;
        sql += paging;
        pg.connect(global.App.connectionide, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            console.log(sql);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);

                //get totals for paging
                var totalQuery = sql.replace(/SELECT \*/i, 'SELECT count(*) as totals');
                totalQuery = totalQuery.replace(/ order by .+$/i, '');
                totalQuery = totalQuery.replace(/ limit .+$/i, '');
                console.log(totalQuery);
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
    },

    update: function (params, callback) {
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

        function updateRow(element, index, array) {
            var i = 1, id, fields = [], values = [];
            id = element.id;
            delete element.id;
            for (var key in element) {
                fields.push(key + '= $' + i);
                values.push(element[key]);
                i = i + 1;
            }
            var sql = `UPDATE ${table} SET ${fields.join()} WHERE id = ${id}`;
            console.log(sql);
            pgclient.query(sql, values, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql} Values: ${values.toString()}`, err, callback);
                console.log('Rows updated: ' + result.rowCount);
                if (result.rowCount != updatesToDo) {
                    console.error('Error: only ' + result.rowCount + ' rows of ' + updatesToDo + ' were updated');
                }
                updatesDone.push(id);
                finish();
            });
        }

        function finish() {
            if (updatesToDo == updatesDone.length) {
                console.log('Done!');
                sql = `SELECT * FROM ${table} where id IN (${updatesDone.toString()})`;
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
                console.log('Not yet... ' + updatesDone.length + ' de ' + updatesToDo);
            }
        }

        pg.connect(global.App.connectionide, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            pgclient = client;
            pgdone = done;
            rows.forEach(updateRow);
        });
    },

    destroy: function (params, callback) {
        //  { id: 30 }
        //  [ { id: 30 }, { id: 31 }, { id: 71 }, { id: 74 } ]
        var rows = [].concat(params); // even if we receive just one object, we create an array with that object
        console.log(rows);
        console.log(rows.length);
        var ids = rows.reduce(function (previousValue, currentValue, index, array) {
            return previousValue.concat(currentValue['id']);
        }, []);
        console.log(ids);
        var sql = `DELETE FROM ${table} WHERE id IN (${ids.toString()})`;
        console.log(sql);
        pg.connect(global.App.connectionide, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                console.log(result.rowCount);
                if (result.rowCount != rows.length) {
                    console.error('Error: only ' + result.rowCount + ' rows of ' + rows.length + ' were deleted');
                }
                callback(null, {});
                // free this client, from the client pool
                done();
            });
        });
    }

};

module.exports = Publicidade;