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

var unflatten = function (arr) {
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;
    // First map the nodes of the array to an object -> create a hash table.
    for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.id] = arrElem;
        mappedArr[arrElem.id]['children'] = [];
    }
    for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
            // If the element is not at the root level, add it to its parent array of children.
            if (mappedElem.idparent) {
                mappedArr[mappedElem['idparent']]['children'].push(mappedElem);
            }
            // If the element is at the root level, add it to first level elements array.
            else {
                tree.push(mappedElem);
            }
        }
    }
    return tree;
};

var User = {

    // curl -v -H "Content-type: application/json" -d '{"action":"Users.User","method":"read","data":[{"userid":25}],"type":"rpc","tid":5}' http://localhost:3000/direct

    readNavTree: function (params, callback) {
        console.log(params);
        //console.log(request.session);
        //console.log(request.session.userid);

        var sql = '';

        if (params.hasOwnProperty('userid') && (parseInt(params.userid) > 0)) {
            sql += 'select *, NOT EXISTS (select * from users.menu inm where inm.idparent = users.menu.id) leaf ';
            sql += 'from users.menu ';
            sql += 'where id IN (select idmenu from users.permissao p, users.utilizador u ';
            sql += 'where p.idgrupo = u.idgrupo and id = ' + params.userid + ' ) ';
        } else {
            sql += 'select *, NOT EXISTS (select * from users.menu inm where inm.idparent = users.menu.id) leaf ';
            sql += 'from users.menu ';
            sql += 'where id IN (select idmenu from users.permissao p where p.idgrupo = 0 ) ';
        }
        sql += 'order by id ';

        var detail = global.App.connection.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'readNavTree'
        }, function (err, client, done) {
            if (err)
                return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                var tree = unflatten(result.rows);
                callback(null, tree);
                done();
            });
        });
    },

    update: function (params, callback) {
        console.log('Users.User.update');
        console.log(params);
        var table = 'users.utilizador';

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

    // destroy: function (params, callback) {
    //     console.log('Users.User.destroy');
    //     console.log(params);
    //     callback(null, {});
    // },

    destroy: function (params, callback) {
        console.log('Users.User.destroy');
        console.log(params);
        var table = 'users.utilizador';

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
    },

    read: function (params, callback) {
        console.log('Users.User.read');
        console.log(params);

        var sql = 'SELECT users.utilizador.*, users.grupo.nome AS group FROM users.utilizador, users.grupo ',
            where = ' WHERE users.utilizador.idgrupo = users.grupo.id AND ativo ', order = '', paging = '';

        var condicoes = [];

        if (params.filter) {
            console.log('Exitem filtros:' + JSON.stringify(params.filter));
            var condicoes = [];
            console.log('filtros.length: ' + params.filter.length);
            for (var k = 0; k < params.filter.length; k++) {
                console.log('Filtrar por: ' + params.filter[k].property + ' com o operador ' + params.filter[k].operator + ' valor ' + params.filter[k].value);
                switch (params.filter[k].operator) {
                    case 'eq':
                        //console.log('filtro sobre o tipo: ' + params.filter[k].type + ' com o valor ' + params.filter[k].value);
                        //condicoes.push(params.filter[k].property + " ilike '%" + params.filter[k].value + "%'");
                        condicoes.push(params.filter[k].property + " = '" + params.filter[k].value + "'");
                        break;
                    case 'lt':
                        //console.log('filtro sobre o tipo: ' + params.filter[k].type + ' com o valor ' + params.filter[k].value);
                        //condicoes.push(params.filter[k].property + " ilike '%" + params.filter[k].value + "%'");
                        condicoes.push(params.filter[k].property + " < '" + params.filter[k].value + "'");
                        break;
                    case 'gt':
                        //console.log('filtro sobre o tipo: ' + params.filter[k].type + ' com o valor ' + params.filter[k].value);
                        //condicoes.push(params.filter[k].property + " ilike '%" + params.filter[k].value + "%'");
                        condicoes.push(params.filter[k].property + " > '" + params.filter[k].value + "'");
                        break;
                    case 'like':
                        //console.log('filtro sobre o tipo: ' + params.filter[k].type + ' com o valor ' + params.filter[k].value);
                        //condicoes.push("date_trunc('day', " + params.filter[k].property + ') ' + " = " + " '" + params.filter[k].value + "'");
                        condicoes.push(params.filter[k].property + " LIKE '%" + params.filter[k].value + "%'");
                        break;
                    /*
                     case 'numeric':
                     case 'number':
                     console.log('filtro sobre o tipo: ' + params.filter[k].type + ' com o valor ' + params.filter[k].value);
                     condicoes.push(params.filter[k].property + ' ' + " = " + ' ' + params.filter[k].value);
                     break;
                     */
                    default:
                        console.log('filtro inesperado com o operador: ' + filtros[k].operator);
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
            order = ' ORDER BY datacriacao DESC';
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
            application_name: 'DXSessao.readUtilizador'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback);
            console.log(sql);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);

                //get totals for paging
                // var totalQuery = sql.replace(/SELECT \*/i, 'SELECT count(*) as totals');
                var totalQuery = sql.replace(/SELECT users.utilizador.\*, users.grupo.nome AS group/i, 'SELECT count(*) as totals');
                totalQuery = totalQuery.replace(/ order by .+$/i, '');
                totalQuery = totalQuery.replace(/ limit .+$/i, '');
                console.log('total query:');
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

};

module.exports = User;