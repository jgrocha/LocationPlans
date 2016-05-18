var table = 'activenglabs.sensor';

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

var Sensor = {

    create: function (params, callback) {
        console.log('ActiveEngCloud.Sensor.create');
        console.log(params);

        var rows = [].concat( params ); // even if we receive just one object, we create an array with that object
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

        pg.connect(global.App.connection, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            pgclient = client;
            pgdone = done;
            rows.forEach(insertRow);
        });
    },

    status: function (params, callback) {
        console.log('ActiveEngCloud.Sensor.status');
        console.log(params);
        /*
         {
         installdate: 'Adelaide',
         location: 'Rita Rocha',
         address: '30:14:12:18:06:34',
         sensorid: '1' }
         */

        /*
         WITH temperature AS (
         select sensorid, address, max(created) as lasttemperature
         from activenglabs.temperature
         group by sensorid, address
         ), calibration AS (
         select sensorid, address, max(created) as lastcalibration
         from activenglabs.calibration
         group by sensorid, address
         )
         select s.sensorid, s.address, s.location, s.sensortype, temperature.lasttemperature, calibration.lastcalibration
         from activenglabs.sensor s
         LEFT JOIN temperature ON s.sensorid = temperature.sensorid and s.address = temperature.address
         LEFT JOIN calibration ON s.sensorid = calibration.sensorid and s.address = calibration.address
         where s.sensorid = 1 and s.address = '30:14:12:18:06:34';
         */

        if (params.sensorid && params.address) {
            var sql = '';
            sql += 'WITH temperature AS ( ';
            sql += '  select sensorid, address, max(created) as lasttemperature ';
            sql += '  from activenglabs.temperature ';
            sql += '  group by sensorid, address ';
            sql += '), calibration AS ( ';
            sql += '  select sensorid, address, max(created) as lastcalibration ';
            sql += '  from activenglabs.calibration ';
            sql += '  group by sensorid, address ';
            sql += ') ';
            sql += 'select s.sensorid, s.address, s.location, s.sensortype, temperature.lasttemperature, calibration.lastcalibration ';
            sql += 'from activenglabs.sensor s ';
            sql += 'LEFT JOIN temperature ON s.sensorid = temperature.sensorid and s.address = temperature.address ';
            sql += 'LEFT JOIN calibration ON s.sensorid = calibration.sensorid and s.address = calibration.address ';
            sql += ` WHERE s.sensorid = ${params.sensorid} and s.address = '${params.address}'`;

            console.log(sql);

            pg.connect(global.App.connection, function (err, client, done) {
                if (err)
                    return dberror('Database connection error', '', err, callback);
                console.log(sql);
                client.query(sql, function (err, result) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                    console.log(result.rows[0]);
                    callback(null, {
                        data: result.rows,
                        total: result.rows.length
                    });
                    // free this client, from the client pool
                    done();
                });
            });
        } else {
            return dberror('Database error', 'Required parameters missing' , {}, callback);
        }
    },

    //callback as last argument is mandatory
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
            paging = ' LIMIT ' + params.limit + ' OFFSET ' + params.start;
        }
        sql += where;
        sql += order;
        sql += paging;
        pg.connect(global.App.connection, function (err, client, done) {
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

        var rows = [].concat( params ); // even if we receive just one object, we create an array with that object
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
        pg.connect(global.App.connection, function (err, client, done) {
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
        var rows = [].concat( params ); // even if we receive just one object, we create an array with that object
        console.log(rows);
        console.log(rows.length);
        var ids = rows.reduce(function(previousValue, currentValue, index, array) {
            return previousValue.concat(currentValue['id']);
        }, []);
        console.log(ids);
        var sql = `DELETE FROM ${table} WHERE id IN (${ids.toString()})`;
        console.log(sql);
        pg.connect(global.App.connection, function (err, client, done) {
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

module.exports = Sensor;