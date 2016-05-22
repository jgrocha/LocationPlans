var mssql = require('mssql');

var SQLServer = {

    dberror: function (text, log, err, callback) {
        console.error(text + ' ' + err.toString() + ' ' + log);
        callback({
            message: {
                text: text,
                detail: err.toString()
            }
        });
        return false;
    },

    // curl -v -H "Content-type: application/json" -d '{"action":"Urbanismo.SQLServer","method":"readTipoproc","data":[{"userid":25,"from":"test2","node":"root"}],"type":"rpc","tid":5}' http://localhost:3000/direct
    readTipoproc: function (params, callback) {
        console.log(params);

        var conn = new mssql.Connection(global.App.mssql2012);
        var req = new mssql.Request(conn);
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return module.exports.dberror('Database error', 'Connection error', err, callback);
            }
            var sql = "SELECT * FROM (";
            sql += "SELECT *, ROW_NUMBER() OVER (ORDER BY codigo) as row FROM dbo.tipoproc WHERE area = 'OBP' ";
            sql += ") a WHERE row > 8 and row <= 10";
            req.query(sql, function (err, recordset) {
                if (err) {
                    console.log(err);
                    return module.exports.dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                }
                else {
                    //console.log(recordset);
                    callback(null, {
                        data: recordset,
                        total: recordset.length
                    });
                }
                conn.close();
            });
        });
    },

    // curl -v -H "Content-type: application/json" -d '{"action":"Urbanismo.SQLServer","method":"readContrib","data":[{"userid":25,"limit":20,"start":0}],"type":"rpc","tid":5}' --resolve 127.0.0.1:3000:127.0.0.1 http://127.0.0.1:3000/direct
    readContrib: function (params, callback) {
        console.log('Urbanismo.SQLServer.readContrib');
        console.log(params);
        //{ page: 1, start: 0, limit: 25 }

        var where = '';
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

        var order = 'ORDER BY nome';
        if (params.sort) {
            var s = params.sort[0];
            order = 'ORDER BY ' + s.property + ' ' + s.direction;
        }

        var paging = '';
        if (params.hasOwnProperty('limit') && params.hasOwnProperty('start')) {
            console.log('params.limit: ' + params.limit);
            console.log('params.start: ' + params.start);
            var sum = parseInt(params.start) + parseInt(params.limit);
            paging = ' WHERE row > ' + params.start + ' and row <= ' + sum;
            console.log('paging: ' + paging);
        }

        var conn = new mssql.Connection(global.App.mssql2012);
        var req = new mssql.Request(conn);
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return module.exports.dberror('Database error', 'Connection error', err, callback);
            }
            var sql = "SELECT * FROM (";
            sql += "SELECT *, ROW_NUMBER() OVER (" + order + ") as row FROM dbo.contrib " + where;
            sql += ") a ";
            sql += paging;
            req.query(sql, function (err, recordset) {
                if (err) {
                    console.log(err);
                    return module.exports.dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                }
                else {
                    var totalQuery = 'SELECT count(*) as totals FROM dbo.contrib ' + where;
                    req.query(totalQuery, function (err, recordsettotals) {
                        if (err) {
                            console.log(err);
                            return module.exports.dberror('Database error', `${err.toString()} SQL: ${totalQuery}`, err, callback);
                        }
                        else {
                            callback(null, {
                                data: recordset,
                                total: recordsettotals[0].totals
                            });
                        }
                        conn.close();
                    });
                }
            });
        });
    },

    // curl -v -H "Content-type: application/json" -d '{"action":"Urbanismo.SQLServer","method":"readEmbargos","data":[{"userid":25,"limit":20,"start":0}],"type":"rpc","tid":5}' --resolve 127.0.0.1:3000:127.0.0.1 http://127.0.0.1:3000/direct
    readEmbargos: function (params, callback) {
        console.log('Urbanismo.SQLServer.readEmbargos');
        console.log(params);
        // { tableName: 'dbo.embargos', defaultOrderColumn: 'rowid', page : 1, start : 0, limit : 20 }

        if (params.tableName && params.defaultOrderColumn && params.defaultOrderDirection) {
            var where = '';
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

            var order = 'ORDER BY ' + params.defaultOrderColumn + ' ' + params.defaultOrderDirection;
            if (params.sort) {
                var s = params.sort[0];
                order = 'ORDER BY ' + s.property + ' ' + s.direction;
            }

            var paging = '';
            if (params.hasOwnProperty('limit') && params.hasOwnProperty('start')) {
                console.log('params.limit: ' + params.limit);
                console.log('params.start: ' + params.start);
                var sum = parseInt(params.start) + parseInt(params.limit)
                paging = ' WHERE row > ' + params.start + ' and row <= ' + sum;
                console.log('paging: ' + paging);
            }

            var conn = new mssql.Connection(global.App.mssql2012);
            var req = new mssql.Request(conn);
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    return module.exports.dberror('Database error', 'Connection error', err, callback);
                }
                var sql = "SELECT * FROM (";
                sql += "SELECT *, ROW_NUMBER() OVER (" + order + ") as row FROM " + params.tableName + " " + where;
                sql += ") a ";
                sql += paging;
                req.query(sql, function (err, recordset) {
                    if (err) {
                        console.log(err);
                        return module.exports.dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                    }
                    else {
                        var totalQuery = 'SELECT count(*) as totals FROM ' + params.tableName + ' ' + where;
                        req.query(totalQuery, function (err, recordsettotals) {
                            if (err) {
                                console.log(err);
                                return module.exports.dberror('Database error', `${err.toString()} SQL: ${totalQuery}`, err, callback);
                            }
                            else {
                                callback(null, {
                                    data: recordset,
                                    total: recordsettotals[0].totals
                                });
                            }
                            conn.close();
                        });
                    }
                });
            });
        } // if (params.tableName && params.defaultOrderColumn && params.defaultOrderDirection)
    }
};

module.exports = SQLServer;