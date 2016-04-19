var table = 'users.utilizador';

var crypto = require('crypto');
var generatePassword = require('password-generator');

var emailTemplates = require('email-templates');

exports.registo = function (pg) {
    return function (req, res) {
        console.log('/registo/' + req.params.id + ' ' + req.headers.host);
        //console.log('Vai-se registar com a língua: ' + req.session.lang);
        var siteStr = '';
        if (global.App.url) {
            siteStr = global.App.url;
        } else {
            siteStr = 'http://' + req.headers.host;
        }
        var sql = "select * from " + table + " where token = '" + req.params.id + "'";

        pg.connect(global.App.connection, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback, done);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, done);
                if (result.rowCount == 0) {
                    console.log('SQL =' + sql + ' Sem registo!');
                    res.render('registo', {
                        title: 'Registo de utilizadores',
                        site: siteStr
                    });
                } else {
                    var sql = "UPDATE " + table + " SET datamodificacao = now(), emailconfirmacao = true, ativo = true, token=null ";
                    sql += " where token = '" + req.params.id + "'";
                    client.query(sql, function (err, updateResult) {
                        if (err)
                            return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, done);
                        if (updateResult.rowCount == 0) {
                            console.log('UPDATE: rowCount == 0 ' + sql);
                            res.render('registo', {
                                title: 'Registo de utilizadores',
                                site: siteStr
                            });
                        } else {
                            res.render('registo', {
                                title: 'Registo de utilizadores',
                                site: siteStr,
                                user: {
                                    name: result.rows[0].nome,
                                    email: result.rows[0].email
                                }
                            });
                        }
                    });
                }
            }); // client.query
            done();
        });
    };
};

exports.reset = function (pg) {
    return function (req, res) {
        console.log('/reset/' + req.params.id);
        var siteStr = '';
        if (global.App.url) {
            siteStr = global.App.url;
        } else {
            siteStr = 'http://' + req.headers.host;
        }
        /*
         * http://development.localhost.lan/reset/e4a247b6dbd054cadfe00857ae0717c625c031184d58db9e7078aa46f1788956
         * Se apareceu este URL, é porque o utilizador clicou num link que recebeu com o reset da password
         * Fazemos o seguinte:
         * i) verificar que existe o token e qual o utilizador/email associado
         * ii) gerar uma nova password
         * ii) enviar novo email com uma nova password (que ele depois pode mudar no perfil)
         */

        pg.connect(global.App.connection, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback, done);
            var sql = "select * from " + table + " where token = '" + req.params.id + "'";
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, done);
                if (result.rowCount == 0) {
                    console.log('SQL =' + sql + ' Error: ' + err);
                    res.render('reset', {
                        title: 'Reposição da senha',
                        site: siteStr
                    });
                } else {
                    var newpassword = generatePassword();
                    var shasum = crypto.createHash('sha1');
                    shasum.update(newpassword);
                    var encrypted = shasum.digest('hex');
                    // token should be removed, to prevent duplicated tokens
                    var sqlUpdate = "UPDATE " + table + " SET datamodificacao = now(), token = NULL, password = '" + encrypted + "' where token = '" + req.params.id + "'";
                    client.query(sqlUpdate, function (err, updateResult) {
                        if (err)
                            return dberror('Database error', `${err.toString()} SQL: ${sqlUpdate}`, err, callback, done);
                        if (updateResult.rowCount == 0) {
                            console.log('UPDATE =' + sqlUpdate + ' Error: ' + err);
                            res.render('reset', {
                                title: 'Reposição da senha',
                                site: siteStr
                            });
                        } else {
                            var locals = {
                                saudacao: result.rows[0].masculino ? 'Caro' : 'Cara',
                                name: result.rows[0].nome,
                                email: result.rows[0].email, //  'info@jorge-gustavo-rocha.pt',
                                subject: 'Nova senha de acesso',
                                site: siteStr,
                                password: newpassword,
                                callback: function (err, responseStatus) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(responseStatus.message);
                                    }
                                    res.render('reset', {
                                        title: 'Registo de utilizadores',
                                        site: siteStr,
                                        user: {
                                            name: result.rows[0].nome,
                                            email: result.rows[0].email
                                        }
                                    });
                                    global.App.transport.close();
                                }
                            };
                            emailTemplates(global.App.templates, function (err, template) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    template('password', locals, function (err, html, text) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            global.App.transport.sendMail({
                                                from: global.App.from, // 'Jorge Gustavo <jorgegustavo@sapo.pt>',
                                                to: locals.email,
                                                subject: locals.subject,
                                                html: html,
                                                // generateTextFromHTML: true,
                                                text: text
                                            }, locals.callback);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            done();
        });
    };
};
