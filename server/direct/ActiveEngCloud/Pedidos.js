var pg = global.App.postgres;

var dbconnerror = function (text, log, err, callback) {
    console.error(text + ' ' + err.toString() + ' ' + log);
    done();
    callback({
        message: {
            text: text,
            detail: err.toString()
        }
    });
    return false;
};

var dberror = function (done, text, log, err, callback) {
    console.error(text + ' ' + err.toString() + ' ' + log);
    done();
    callback({
        message: {
            text: text,
            detail: err.toString()
        }
    });
    return false;
};

var Pedidos = {

    estatisticas: function (params, callback) {

        var sql = "select 'sensors' as item, count(*) as contador from activenglabs.sensor ";
        sql += "union ";
        sql += "select 'readings' as item, count(*) as contador  from activenglabs.temperature ";
        sql += "union ";
        sql += "select 'calibrations' as item, count(*) as contador  from activenglabs.calibration";

        pg.connect(global.App.connection, function (err, client, done) {
            if (err)
                return dbconnerror('Database connection error', '', err, callback);
            console.log(sql);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror(done, 'Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                callback(null, {
                    data: result.rows,
                    total: result.rows.length
                });
                // free this client, from the client pool
                done();
            });
        });
    }

};

module.exports = Pedidos;