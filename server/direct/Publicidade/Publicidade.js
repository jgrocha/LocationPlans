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
        // pg.connect(global.App.connection, function (err, client, done) {
        var detail = global.App.connection.split('/');
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

    read: function (params, callback) {
        console.log('Publicidade.Publicidade.read');
        console.log(params);
        /*

         // {
         tableName: 'dbo.embargos',
         defaultOrderColumn: 'rowid',
         page : 1,
         start : 0,
         limit : 20 }

         { page: 1,
         start: 0,
         limit: 5,
         sort: [ { property: 'cal_a_old', direction: 'DESC' } ],
         filter:
         [ { property: 'sensorid', type: 'number', value: 2 },
         { property: 'address', type: 'string', value: '30:14:12:18:06:34' } ] }
         */

        //var sql = 'SELECT  sensorid, address, location, installdate, sensortype, metric, calibrated, quantity, decimalplaces, cal_a, cal_b, read_interval, record_sample FROM ' + table,

        if (params.tableName && params.defaultOrderColumn && params.defaultOrderDirection) {
            var sql = 'SELECT * FROM ' + params.tableName,
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
            var order = ' ORDER BY ' + params.defaultOrderColumn + ' ' + params.defaultOrderDirection;
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
        }
    }

};

module.exports = Publicidade;