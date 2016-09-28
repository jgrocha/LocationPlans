var pg = global.App.postgres;
var pgcfg = global.App.pgcfg;

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

var Util = {

    read: function (params, callback) {
        console.log('Util.read');
        console.log(params);

        var sql = 'SELECT * FROM ' + params.defaultTable + ' ',
            where = '', order = '', paging = '';

        var condicoes = [];

        if (params.filter) {
            console.log('Exitem filtros:' + JSON.stringify(params.filter));
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
        } else {
            if (params.defaultSortColumn) {
                order = ' ORDER BY ' + params.defaultSortColumn;
                if (params.defaultSordDirection) {
                    order += ' ' + params.defaultSordDirection;
                }
            }
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
        var detail = global.App.connection.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'Util.read'
        }, function (err, client, done) {
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

        var table = 'erro';

        if (params.defaultTable) {
            table = params.defaultTable;
            delete params.defaultTable;
        }

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
    }

};

module.exports = Util;