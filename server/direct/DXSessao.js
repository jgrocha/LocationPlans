var table = 'users.layer';

var pg = global.App.postgres;

//var sql = 'SELECT * FROM users.layer';

var DXSessao = {

    //curl -v -H "Content-type: application/json" -d '{"action":"DXSessao","method":"readLayer","data":[{"userid":25,"from":"test2","node":"root"}],"type":"rpc","tid":5}' http://localhost:3000/direct
    readLayer: function (params, callback) {
        console.log('DXSessao.readLayer');
        console.log(params);
        /*

         */
        var sql = 'SELECT * FROM ' + table,
            where = ' WHERE active ', order = '', paging = '';

        var condicoes = [];

        if (params.hasOwnProperty('viewid') && parseInt(params.viewid) >= 0) {
            where += " AND viewid = " + parseInt(params.viewid);
        }

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
            order = ' ORDER BY ord DESC';
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
            application_name: 'DXSessao.readLayer'
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
    }

};

module.exports = DXSessao;