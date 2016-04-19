var mssql = require('mssql');

/*
mssql.connect("mssql://sig:sig@localhost:8433/SIGMAGEST15").then(function() {
    // Query 
    new mssql.Request().query('select * from dbo.tipoproc').then(function(recordset) {
        console.dir(recordset);
    }).catch(function(err) {
        console.log(err);
    });

}).catch(function(err) {
    console.log(err);
});
*/

// connection string OR config object :-)

var connectionString = "mssql://sig:sig@localhost:8433/SIGMAGEST15";
var dbConfig = {
    server: "localhost",
    database: "SIGMAGEST15",
    user: "sig",
    password: "sig",
    port: 8433
};

function getEmp1() {
    //var conn = new mssql.Connection(dbConfig);
    var conn = new mssql.Connection(connectionString);

    conn.connect().then(function () {
            var req = new mssql.Request(conn);
            req.query("select * from dbo.tipoproc").then(function (recordset) {
                    console.log(recordset);
                    conn.close();
                })
                .catch(function (err) {
                    console.log(err);
                    conn.close();
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}

function getEmp2() {
    //var conn = new mssql.Connection(dbConfig);
    var conn = new mssql.Connection(connectionString);
    var req = new mssql.Request(conn);

    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        req.query("select * from dbo.tipoproc", function (err, recordset) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(recordset);
                console.log(recordset.length);
            }
            conn.close();
        });
    });
}

//getEmp1();
getEmp2();