var table = 'users.utilizador';

var db = global.App.database; // para remover

var pg = global.App.postgres;
var pgcfg = global.App.pgcfg;

var dns = require('dns');
var useragent = require('useragent');
var crypto = require('crypto');
var smtpTransport = global.App.transport;
var emailTemplates = require('email-templates');
var util = require('util');

var dberror = function (text, log, err, callback, request, done) {
    console.error(text + ' ' + err.toString() + ' ' + log);

    var lang = 'en';
    if (request.session && request.session.lang) {
        lang = request.session.lang;
    }

    // the message object is only returned if NODE_ENV != production
    callback({
        message: {
            text: request.app.locals.translate(text, lang),
            detail: err.toString()
        }
    });
    // free this client, from the client pool
    done();
    return false;
};

var DXLogin = {
    // method signature has 5 parameters
    /**
     *
     * @param params object with received parameters
     * @param callback callback function to call at the end of current method
     * @param sessionID - current session ID if "enableSessions" set to true, otherwise null
     *    cf. server-config.json and server.js
     * @param request only if "appendRequestResponseObjects" enabled
     * @param response only if "appendRequestResponseObjects" enabled
     */
    //curl -v -H "Content-type: application/json" -d '{"action":"DXLogin","method":"alive","data":[],"type":"rpc","tid":5}' http://localhost:3000/direct

    alive: function (params, callback, sessionID, request, response) {
        console.log('DXLogin.alive(): Session ID = ' + sessionID);
        console.log(request.session);

        var lang = 'en';
        if (request.session && request.session.lang) {
            lang = request.session.lang;
        }
        console.log('Language: ' + lang + ' request.session.lang=' + request.session.lang);
        
        if (request.session.userid) {
            var sql = 'SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM ' + table, where = '';
            where = " WHERE id = '" + request.session.userid + "' and ativo and emailconfirmacao";
            sql += where;
            // pg.connect(global.App.connection, function (err, client, done) {
            var detail = global.App.connection.split('/');
            pg.connect({
                user: detail[2].split('@')[0].split(':')[0],
                password: detail[2].split('@')[0].split(':')[1], // 'geobox',
                database: detail[3], // 'geotuga',
                host: detail[2].split('@')[1].split(':')[0], // 'localhost',
                port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
                application_name: 'DXLogin.alive'
            }, function (err, client, done) {
                if (err)
                    return dberror('Database connection error', '', err, callback, request, done);
                client.query(sql, function (err, resultSelect) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                    sql = "UPDATE users.sessao SET dataultimaatividade = now(), reaproveitada = reaproveitada+1 where userid = " + request.session.userid + " and sessionid = '" + sessionID + "'";
                    client.query(sql, function (err, resultUpdate) {
                        if (err)
                            return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                        if (resultUpdate.rowCount == 0) {
                            console.log('ERROR: session exists on REDIS but not on database');
                            callback(null, {
                                message: request.app.locals.translate('Session not registered or too old', lang),
                                success: false
                            });
                        } else {
                            callback(null, {
                                message: request.app.locals.translate('Session recovered', lang),
                                data: resultSelect.rows
                            });
                        }
                        done();
                    });
                });
            });
        } else {
            callback(null, {
                message: request.app.locals.translate('Session not registered or too old', lang),
                success: false
            });
        }
    },

    /*
     * req.session.cookie.expires = false;
     * req.session.cookie.maxAge = 5 * 60 * 1000;
     *
     * Por defeito, os cookies têm expire a false.
     * Desaparecem assim que o utilizador fecha o browser.
     * Se vem um cookie novo, o node.js dá um sessionid novo
     *
     * Se o utilizador diz 'estou no meu computador', então altero a validade do cookie.
     *
     * Desta forma, em vez de ser eu a guardar algo no storage local do cliente,
     * a coisa é feita através do mecanismo de cookies existente.
     *
     */
    authenticate: function (params, callback, sessionID, request, response) {
        var email = params.email.toLowerCase(),
            password = params.password;

        var remember = null;
        if (params.hasOwnProperty('remember')) {
            remember = params.remember;
        } else {
            remember = false;
        }

        console.log('DXLogin.authenticate(): Session ID = ' + sessionID);

        var lang = 'en';
        if (request.session && request.session.lang) {
            lang = request.session.lang;
        }
        console.log('Language: ' + lang + ' request.session.lang=' + request.session.lang);
        
        // suporte aos utilizadores antigos da aplicação Plantas de Localização
        var verifica = 'email';
        if (email.search(/@/) == -1) {
            console.log('Utilizador antigo: ' + email);
            verifica = 'lower(login)';
            password = params.passwordold;
        }

        var agent = useragent.parse(request.headers['user-agent']);
        var browser = agent.toAgent();
        var os = agent.os.toString();
        var device = agent.device.toString();
        console.log('Useragent detected: ' + browser, os, device);
        var ip = request.ip;
        var host = '';
        // eventualmente por aqui um timeout curto
        // http://stackoverflow.com/questions/10777657/node-js-dns-lookup-how-to-set-timeout
        dns.reverse(ip, function (err, domains) {
            if (err) {
                console.log(err.toString());
                host = err.code;
            } else {
                if (domains.length > 0) {
                    host = domains[0];
                    console.log(ip, host, browser, os, device);
                    agent.toString();
                }
            }
            var sql = 'SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM ' + table;
            var where = " WHERE " + verifica + " = '" + email + "'  AND password = '" + password + "' and ativo and emailconfirmacao";
            sql += where;
            console.log('SQL=' + sql);
            // pg.connect(global.App.connection, function (err, client, done) {
            var detail = global.App.connection.split('/');
            pg.connect({
                user: detail[2].split('@')[0].split(':')[0],
                password: detail[2].split('@')[0].split(':')[1], // 'geobox',
                database: detail[3], // 'geotuga',
                host: detail[2].split('@')[1].split(':')[0], // 'localhost',
                port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
                application_name: 'DXLogin.authenticate'
            }, function (err, client, done) {
                if (err)
                    return dberror('Database connection error', '', err, callback, request, done);
                client.query(sql, function (err, resultSelect) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                    console.log('Linhas retornadas: ', resultSelect.rows.length);
                    if (resultSelect.rows.length == 0) {
                        callback(null, {
                            message: request.app.locals.translate('Invalid user or password', lang),
                            success: false
                        });
                    } else {
                        console.log(resultSelect.rows);
                        // vamos gravar na base de dados a hora de login
                        var campos = ['userid', 'sessionid', 'ip', 'hostname', 'browser'];
                        var values = [resultSelect.rows[0].id, sessionID, ip, host, browser];
                        var buracos = [];
                        for (i = 1; i <= campos.length; i++) {
                            buracos.push('$' + i);
                        }
                        // Por um UPDATE trigger na BD a fechar todas as outras sessões existentes deste utilizador?
                        // Por um UPDATE trigger na BD para atualizar utilizador (ultimologin, sessionid)?
                        //
                        // A menos que seja permitido ter várias sessões em aberto (também podemos usar o IP para saber se são sessões em dispositivos diferentes)
                        // Podem ser sessões a partir do mesmo IP, mas com browsers diferentes.
                        // insert into sessao (userid, sessionid, ip, hostname) values ();
                        sql = 'INSERT INTO users.sessao (' + campos.join() + ') VALUES (' + buracos.join() + ')';
                        client.query(sql, values, function (err, resultInsert) {
                            if (err)
                                return dberror('Database error', `${err.toString()} SQL: ${sql} Values: ${values.toString()}`, err, callback, request, done);
                            console.log('request.session.cookie.maxAge = ' + request.session.cookie.maxAge);
                            if (remember) {
                                request.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
                            }
                            request.session.userid = resultSelect.rows[0].id;
                            request.session.groupid = resultSelect.rows[0].idgrupo;
                            callback(null, {
                                message: request.app.locals.translate('Login successful', lang),
                                data: resultSelect.rows
                            });
                            done();
                        });
                    }
                });
            });
        });
    },

    ping: function (params, callback, sessionID, request, response) {
        console.log('Ping! Session ID = ' + sessionID);
        // console.log(request);
        console.log(request.session);
        console.log(request.session.userid);
        console.log(request.session.lang);
        callback(null, {
            message: 'Ping ok'
        });
    },

    beforeReset: function (params, callback, sessionID, request, response) {
        console.log('beforeReset: Session ID = ' + sessionID);
        // console.log(request);
        console.log(request.session);
        console.log(request.session.userid);
        console.log(request.session.lang);

        var lang = 'en';
        if (request.session && request.session.lang) {
            lang = request.session.lang;
        }
        console.log('Language: ' + lang + ' request.session.lang=' + request.session.lang);

        var sql = "select * from " + table + " where token = '" + params.token + "'";
        console.log('SQL=' + sql);

        var detail = global.App.connection.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'DXLogin.beforeReset'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback, request, done);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                if (result.rows.length == 0) {
                    console.log('O token não existe');
                    callback(null, {
                        message: request.app.locals.translate('Invalid request', lang),
                        success: false
                    });
                } else {
                    console.log('Pedido existe. Utilizador: ' + result.rows[0].nome + ' → ' + result.rows[0].email);
                    callback(null, {
                        message: request.app.locals.translate('Valid reset password request', lang),
                        data: result.rows
                    });
                }
                done();
            }); // client.query
        });
    },
    
    confirmEmail: function (params, callback, sessionID, request, response) {
        console.log('confirmEmail: Session ID = ' + sessionID);
        // console.log(request);
        console.log(request.session);
        console.log(request.session.userid);
        console.log(request.session.lang);

        var lang = 'en';
        if (request.session && request.session.lang) {
            lang = request.session.lang;
        }
        console.log('Language: ' + lang + ' request.session.lang=' + request.session.lang);

        var sql = "select * from " + table + " where token = '" + params.token + "'";
        console.log('SQL=' + sql);

        var detail = global.App.connection.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'DXLogin.confirmEmail'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback, request, done);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                if (result.rows.length == 0) {
                    console.log('O token não existe');
                    callback(null, {
                        message: request.app.locals.translate('Invalid request', lang),
                        success: false
                    });
                } else {
                    console.log('Pedido existe. Utilizador: ' + result.rows[0].nome + ' → ' + result.rows[0].email);

                    var sqlupdate = "UPDATE " + table + " SET datamodificacao = now(), emailconfirmacao = true, ativo = true, token=null ";
                    sqlupdate += " where token = '" + params.token + "'";
                    client.query(sqlupdate, function (err, updateResult) {
                        if (err)
                            return dberror('Database error', `${err.toString()} SQL: ${sqlupdate}`, err, callback, done);
                        if (updateResult.rowCount == 0) {
                            console.log('UPDATE: rowCount == 0 ' + sql);
                            callback(null, {
                                message: request.app.locals.translate('Error updating user information', lang),
                                success: false
                            });
                        } else {
                            callback(null, {
                                message: request.app.locals.translate('Valid reset password request', lang),
                                data: result.rows
                            });
                        }
                    });
                }
                done();
            }); // client.query
        });
    },

    deauthenticate: function (params, callback, sessionID, request, response) {
        console.log('Vai terminar Session ID = ' + sessionID);
        // console.log(request);
        console.log(request.session);

        var lang = 'en';
        if (request.session && request.session.lang) {
            lang = request.session.lang;
        }

        console.log('Language: ' + lang + ' request.session.lang=' + request.session.lang);

        //console.log(request.session.userid);
        if (request.session.userid && request.session.userid > 0) {
            var sql = "UPDATE users.sessao SET datalogout = now() where userid = " + request.session.userid + " and sessionid = '" + sessionID + "'";
            var detail = global.App.connection.split('/');
            pg.connect({
                user: detail[2].split('@')[0].split(':')[0],
                password: detail[2].split('@')[0].split(':')[1], // 'geobox',
                database: detail[3], // 'geotuga',
                host: detail[2].split('@')[1].split(':')[0], // 'localhost',
                port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
                application_name: 'DXLogin.deauthenticate'
            }, function (err, client, done) {
                if (err)
                    return dberror('Database connection error', '', err, callback, request, done);
                client.query(sql, function (err, resultSelect) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);

                    request.session.destroy(function (err) {
                        // se o cookie tiver sido alterado anteriormente, volta a pô-lo a null
                        // o cookie só dura durante a sessão do browser, com maxAge: null
                        if (err) {
                            console.log('Error destroying session: ' + err);
                        } else {
                            callback(null, {
                                message: request.app.locals.translate('Logout successful', lang)
                            });
                            // free this client, from the client pool
                            done();
                        }
                    });
                });
            })
        } else {
            console.log('Não deauthenticate, se request.session.userid indefinido');
            callback({
                message: {
                    text: request.app.locals.translate('Session not registered or too old', lang),
                    detail: 'This should not happen'
                }
            });
        }
    },

    // para enviar emails:
    // nodemailer (envio)
    // node-email-templates, para a formatação
    registration: function (params, callback, sessionID, request, response) {
        console.log('DXLogin.registration(): Session ID = ' + sessionID);

        var name = params.name, password = params.password, email = params.email.toLowerCase();
        var token = '';

        // console.log(request);
        console.log('registration: request.session.userid = ' + request.session.userid);
        console.log('registration: request.session.lang = ' + request.session.lang);

        var lang = 'en';
        if (request.session && request.session.lang) {
            lang = request.session.lang;
        }
        console.log('Language: ' + lang + ' request.session.lang=' + request.session.lang);

        var enviarEmail = function (parametros, callback) {
            // envio o email!
            var siteStr = '';
            if (global.App.url) {
                siteStr = global.App.url;
            } else {
                siteStr = 'http://' + request.headers.host;
            }
            var locals = {
                email: email,
                subject: request.app.locals.translate('Registration', lang), // 'Registo',
                saudacao: 'Caro(a)', // To discard...
                name: name,
                // site : 'http://' + request.headers.host,
                site: siteStr,
                token: token,
                callback: function (err, responseStatus) {
                    if (err) {
                        console.log('Erro no envio de mail');
                        console.log(err);
                        callback(null, {
                            message: util.format(request.app.locals.translate('Error sending mail to %s', lang), email),
                            success: false
                        });
                    } else {
                        console.log("Message sent: ", responseStatus);
                        callback(null, parametros);
                    }
                    smtpTransport.close();
                }
            };
            emailTemplates(global.App.templates + '/' + lang, function (err, template) {
                if (err) {
                    console.log(err);
                } else {
                    template('registration', locals, function (err, html, text) {
                        if (err) {
                            console.log(err);
                        } else {
                            smtpTransport.sendMail({
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
            //callback(parametros);
        };

        var inserirNovoUtilizador = function (client, done, mensagem, inserirCallback) {
            console.log('inserirNovoUtilizador');
            var campos = ['nome', 'password', 'email', 'ativo', 'emailconfirmacao', 'token', 'idgrupo'];
            var sql = 'INSERT INTO ' + table + ' (' + campos.join() + ')';
            sql += " SELECT " + client.escapeLiteral(name) + ", " + client.escapeLiteral(password) + ", " + client.escapeLiteral(email) + ", false, false, " + client.escapeLiteral(token) + ", min(id)";
            sql += ' from users.grupo where omissao';
            sql += ' RETURNING id;';
            console.log('--sql inserirNovoUtilizador: ' + sql);
            client.query(sql, function (err, resultInsert) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                console.log('resultInsert = ' + resultInsert.rows[0].id);
                inserirCallback({
                    message: mensagem + ' com o id ' + resultInsert.rows[0].id
                }, callback);
                done();
            });
        };

        console.log('Session ID = ' + sessionID);
        var agent = useragent.parse(request.headers['user-agent']);
        var browser = agent.toAgent();
        var os = agent.os.toString();
        var device = agent.device.toString();
        console.log('Useragent detected: ' + browser, os, device);

        crypto.randomBytes(32, function (ex, buf) {
            token = buf.toString('hex');
            // se ele já se registou, mas não confirmou o email, escrevemos em cima do que já existe.
            var sql = "SELECT nome, datacriacao, emailconfirmacao FROM " + table + " WHERE email = '" + email + "'";
            console.log('SQL=' + sql);

            // pg.connect(global.App.connection, function (err, client, done) {
            var detail = global.App.connection.split('/');
            pg.connect({
                user: detail[2].split('@')[0].split(':')[0],
                password: detail[2].split('@')[0].split(':')[1], // 'geobox',
                database: detail[3], // 'geotuga',
                host: detail[2].split('@')[1].split(':')[0], // 'localhost',
                port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
                application_name: 'DXLogin.registration'
            }, function (err, client, done) {
                if (err)
                    return dberror('Database connection error', '', err, callback, request, done);
                client.query(sql, function (err, result) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                    if (result.rows.length == 0) {
                        console.log('Utilizador não existe');
                        inserirNovoUtilizador(client, done, 'Utilizador criado na base de dados', enviarEmail);
                    } else {
                        console.log('Utilizador JÁ existe!');
                        if (result.rows[0].emailconfirmacao) {
                            console.log('Já está registado');
                            callback(null, {
                                message: 'O email ' + email + ' já está registado por ' + result.rows[0].nome + ' desde ' + result.rows[0].datacriacao.toISOString(),
                                success: false
                            });
                            done();
                        } else {
                            // vamos apagar à confiança (???) o registo existente.
                            console.log('Apagar registo existente');
                            client.query("DELETE FROM " + table + " WHERE email = $1", [email], function (err, result) {
                                if (err)
                                    return dberror('Database error', `${err.toString()} email: ${email}`, err, callback, request, done);
                                inserirNovoUtilizador(client, done, 'Utilizador (re)criado na base de dados', enviarEmail);
                            }); // client.query
                        }
                    }
                }); // client.query
            }); // pg.connect
        }); // crypto.randomBytes
    },

    // {"action":"DXLogin","method":"reset","data":[{"email":"nome@servidor.com"}],"type":"rpc","tid":2}
    //curl -v -H "Content-type: application/json" -d '{"action":"DXLogin","method":"reset","data":[{"email":"nome@servidor.com"}],"type":"rpc","tid":2}' http://localhost:3000/direct
    reset: function (params, callback, sessionID, request, response) {
        var email = params.email.toLowerCase();
        console.log('Session ID = ' + sessionID);
        var agent = useragent.parse(request.headers['user-agent']);
        var browser = agent.toAgent();
        var os = agent.os.toString();
        var device = agent.device.toString();
        console.log('Useragent detected: ' + browser, os, device);
        var ip = request.ip;
        var host = '';

        var lang = 'en';
        if (request.session && request.session.lang) {
            lang = request.session.lang;
        }
        console.log('Language: ' + lang + ' request.session.lang=' + request.session.lang);

        // se existe e se já terminou o processo de registo!
        var sql = "SELECT nome, masculino FROM " + table + " WHERE email = '" + email + "' and ativo and emailconfirmacao";
        console.log('SQL=' + sql);

        var detail = global.App.connection.split('/');
        pg.connect({
            user: detail[2].split('@')[0].split(':')[0],
            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
            database: detail[3], // 'geotuga',
            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
            application_name: 'DXLogin.reset'
        }, function (err, client, done) {
            if (err)
                return dberror('Database connection error', '', err, callback, request, done);
            client.query(sql, function (err, result) {
                if (err)
                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                if (result.rows.length == 0) {
                    console.log('O email ' + email + ' não corresponde a nenhum utilizador registado e com o email validado.');
                    callback(null, {
                        message: 'O email ' + email + ' não corresponde a nenhum utilizador registado e com o email validado.',
                        success: false
                    });
                } else {
                    // gero um token
                    crypto.randomBytes(32, function (ex, buf) {
                        var token = buf.toString('hex');
                        // associar token ao utilizador
                        var sql = "UPDATE " + table + " SET token = '" + token + "', datamodificacao = now() where email = '" + email + "'";
                        client.query(sql, function (err, updateResult) {
                            if (err)
                                return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                            // envio o email!
                            var siteStr = '';
                            if (global.App.url) {
                                siteStr = global.App.url;
                            } else {
                                siteStr = 'http://' + request.headers.host;
                            }

                            var saudacao = '';
                            if (result.rows[0].masculino === false)
                                saudacao = 'Cara';
                            if (result.rows[0].masculino === true)
                                saudacao = 'Caro';
                            if (result.rows[0].masculino === null)
                                saudacao = 'Caro(a)';

                            var locals = {
                                email: email,
                                subject: request.app.locals.translate('Password reset', lang),
                                // subject: util.format(request.app.locals.translate('Password reset %s', lang), email),
                                saudacao: saudacao,
                                name: result.rows[0].nome,
                                token: token,
                                // site : 'http://' + request.headers.host,
                                site: siteStr,
                                callback: function (err, responseStatus) {
                                    if (err) {
                                        console.log('Erro no envio de mail');
                                        console.log(err);
                                        console.log(responseStatus);
                                        callback(null, {
                                            message: 'Falhou o envio do email para o endereço ' + email + '.',
                                            success: false
                                        });
                                    } else {
                                        console.log("Message sent: ", responseStatus);
                                        callback(null, {
                                            message: 'O email foi enviado com sucesso.'
                                        });
                                    }
                                    smtpTransport.close();
                                }
                            };
                            emailTemplates(global.App.templates + '/' + lang, function (err, template) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    template('reset', locals, function (err, html, text) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            smtpTransport.sendMail({
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
                            //
                            done();
                        });
                    });
                }
            }); // client.query
        });
    },

    changeLanguage: function (params, callback, sessionID, request, response) {
        console.log('DXLogin.changeLanguage() Session ID = ' + sessionID);
        console.log(params);

        var lang = 'en';
        if (request.session && request.session.lang) {
            lang = request.session.lang;
        }
        console.log('Language: ' + lang + ' request.session.lang=' + request.session.lang);

        if (params.lang) {
            console.log('Changing request.session.lang → ' + params.lang);
            request.session.lang = params.lang;
            lang = request.session.lang;
            callback(null, {
                message: request.app.locals.translate('Language changed', lang)
            });
        } else {
            callback({
                success: false,
                message: request.app.locals.translate('Language was not updated', lang)
            });
        }
    },
    
    update: function (params, callback, sessionID, request, response) {
        console.log('DXLogin.update() Session ID = ' + sessionID);
        console.log(params);
        var fields = [], values = [], i = 1;
        for (var key in params) {
            fields.push(key + '= $' + i);
            values.push(params[key]);
            i = i + 1;
        }
        fields.push('datamodificacao = $' + i);
        values.push('now()');
        if (request.session.userid) {
            var detail = global.App.connection.split('/');
            pg.connect({
                user: detail[2].split('@')[0].split(':')[0],
                password: detail[2].split('@')[0].split(':')[1], // 'geobox',
                database: detail[3], // 'geotuga',
                host: detail[2].split('@')[1].split(':')[0], // 'localhost',
                port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
                application_name: 'DXLogin.update'
            }, function (err, client, done) {
                if (err)
                    return dberror('Database connection error', '', err, callback, request, done);
                client.query('UPDATE ' + table + ' SET ' + fields.join() + ' WHERE id = ' + request.session.userid, values, function (err, result) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                    var sql = 'SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM ' + table + ' where id = ' + request.session.userid;
                    client.query(sql, function (err, resultSelect) {
                        if (err)
                            return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);

                        callback(null, {
                            message: 'User updated',
                            data: resultSelect.rows
                        });
                        done();
                    });
                });
            });
        } else {
            callback({
                success: false,
                message: 'User was not updated'
            });
        }
    },

    updatePassword: function (params, callback, sessionID, request, response) {
        console.log('DXLogin.updatePassword() Session ID = ' + sessionID);
        console.log(params);

        // TODO
        // check that params.token is valid...
        delete params.token;

        var email = null;
        if (params.hasOwnProperty('email')) {
            email = params.email;
            delete params.email;
        }

        var fields = [], values = [], i = 1;
        for (var key in params) {
            fields.push(key + '= $' + i);
            values.push(params[key]);
            i = i + 1;
        }
        fields.push('datamodificacao = $' + i);
        values.push('now()');
        i = i + 1;
        fields.push('token = $' + i);
        values.push('NULL');
        if (email) {
            var detail = global.App.connection.split('/');
            pg.connect({
                user: detail[2].split('@')[0].split(':')[0],
                password: detail[2].split('@')[0].split(':')[1], // 'geobox',
                database: detail[3], // 'geotuga',
                host: detail[2].split('@')[1].split(':')[0], // 'localhost',
                port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
                application_name: 'DXLogin.updatePassword'
            }, function (err, client, done) {
                if (err)
                    return dberror('Database connection error', '', err, callback, request, done);
                client.query('UPDATE ' + table + ' SET ' + fields.join() + " WHERE email = '" + email + "'", values, function (err, result) {
                    if (err)
                        return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                    var sql = 'SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM ' + table + " where email = '" + email + "'";
                    client.query(sql, function (err, resultSelect) {
                        if (err)
                            return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);

                        // TODO
                        // clear token!
                        callback(null, {
                            message: 'User password updated',
                            data: resultSelect.rows
                        });
                        done();
                    });
                });
            });
        } else {
            callback({
                success: false,
                message: 'User password was not updated'
            });
        }
    },

    updateLocation: function (params, callback, sessionID, request, response) {
        console.log('Session ID = ' + sessionID);

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };

        var updatestr = '';
        if (isNumber(params.longitude) && isNumber(params.latitude)) {
            updatestr = ' ponto = ST_SetSRID(ST_Point(' + params.longitude + ', ' + params.latitude + '),3763), ';
        } else {
            updatestr = ' ponto = NULL, ';
        }
        updatestr += 'datamodificacao = now() ';
        console.log(updatestr);

        if (request.session.userid) {
            var conn = db.connect();
            conn.query('UPDATE ' + table + ' SET ' + updatestr + ' WHERE id = ' + request.session.userid, function (err, result) {
                if (err) {
                    console.log('UPDATE =' + sql + ' Error: ' + err);
                    db.debugError(callback, err);
                } else {
                    var sql = 'SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM utilizador where id = ' + request.session.userid;
                    conn.query(sql, function (err, resultSelect) {
                        db.disconnect(conn);
                        if (err) {
                            console.log('SQL=' + sql + ' Error: ', err);
                            db.debugError(callback, err);
                        } else {
                            callback({
                                success: true,
                                message: 'User updated',
                                data: resultSelect.rows
                            });
                        }
                    });

                }
            });
        } else {
            callback({
                success: false,
                message: 'User was not updated'
            });
        }
    },
    /*
     * Se existir alguém com o email retornado, é simples:
     * 	i) Escolhe esse utilizador da BD e retorna esse utilizador
     * 	ii) Eventualmente "vê" se há alguma informação do FB que possa ser acrescentado no perfil do utilizador...
     * 	ii) Será que o utilizador já lá teve essa informação e removeu-a?
     * 	iii) Preciso de flag para saber se faz/fez login pelo facebook:
     * 		só na primeira vez é que copio os dados
     * 		ou tenho um botão específico, caso tenha sido feito o login via FB
     *
     * Se esse email ainda não existir:
     * 	a) Cria um utilizador, com o email, SEM PASSWORD, e com toda a informação possível do FB
     * 	b) Retorna esse utilizador
     */

    /*
     * Applications registered:
     * https://developers.facebook.com/apps/1425420377699726/dashboard/
     * https://console.developers.google.com/project/apps~driven-crane-540/apiui/credential
     * https://account.live.com/developers/applications
     */
    social: function (params, callback, sessionID, request, response) {
        console.log('+1--------------------------------- ' + params.network + ' ---------------------------+');
        console.log(params);
        var network = 0;
        // facebook, google, windows
        switch (params.network) {
            case 'facebook':
                network = 1;
                break;
            case 'google':
                network = 2;
                break;
            case 'windows':
                network = 3;
                break;
            default:
                console.log('unexpected social network: ' + params.network);
                break;
        }
        var name = params.name, email = params.email.toLowerCase();
        var sexo = (params.gender == "male") ? 'true' : 'false';
        console.log('+2--------------------------------- ' + params.network + ' ---------------------------+');

        // facebook
        // var morada = params.hometown.name || ''; // erro silencioso! try exception?
        // console.log(morada);
        // ok
        var fotografia = params.picture || '';
        // console.log(fotografia);
        // a fotografia da microsoft tem o token no url; por isso tem que ser mudada na base de dados
        // URL
        console.log('+3--------------------------------- ' + params.network + ' ---------------------------+');

        var logSessionUpdate = function (rows) {
            if (rows[0].id != request.session.userid) {
                console.log("ERRO: rows[0].id = " + rows[0].id + " != request.session.userid = " + request.session.userid);
                callback({
                    success: false,
                    message: 'Erro: o id do utilizador não coincide com o useid da sessão.'
                });
            } else {
                var sql = "UPDATE sessao SET dataultimaatividade = now(), reaproveitada = reaproveitada+1 where userid = " + request.session.userid + " and sessionid = '" + sessionID + "'";
                conn.query(sql, function (err, updateResult) {
                    if (err) {
                        console.log('UPDATE =' + sql + ' Error: ' + err);
                        db.debugError(callback, err);
                    } else {
                        if (updateResult.rowCount == 0) {
                            // não havia sessao na BD para atualizar?
                            // devia existir! só mesmo se a sessao foi apagada da BD entretanto, numa operação de manutenção/teste
                            logSession(rows);
                        } else {
                            db.disconnect(conn);
                            callback({
                                success: true,
                                message: 'Sessão facebook recuperada.',
                                data: rows
                            });
                        }
                    }
                });

            }
        };

        var logSession = function (rows) {
            var userid = rows[0].id;
            var campos = ['userid', 'sessionid', 'ip', 'hostname', 'browser', 'socialid'];
            var valores = [userid, sessionID, ip, host, browser, network];
            var buracos = [];
            for (i = 1; i <= campos.length; i++) {
                buracos.push('$' + i);
            }
            conn.query('INSERT INTO sessao (' + campos.join() + ') VALUES (' + buracos.join() + ')', valores, function (err, resultInsert) {
                db.disconnect(conn);
                // release connection
                if (err) {
                    db.debugError(callback, err);
                } else {
                    request.session.userid = userid;
                    request.session.groupid = rows[0].idgrupo;
                    console.log("request.session.userid <-- ", userid);
                    callback({
                        success: true,
                        message: 'Facebook login valid and logged',
                        data: rows
                    });
                }
            });
        };

        var inserirNovoUtilizador = function () {
            // falta tratar a fotografia do utilizador...
            var campos = ['nome', 'observacoes', 'email', 'ativo', 'emailconfirmacao', 'masculino', 'idgrupo'];
            // Está harcoded o grupo inicial = 5
            // var valores = [name, 5, 'Criado a partir da rede social ' + params.network, email, 'true', 'true', sexo];

            var adicional = '';
            if (params.hometown && params.hometown.name && params.hometown.name.trim() !== "") {
                campos.push('morada');
                // valores.push(params.hometown.name);
                adicional += ", " + conn.escapeLiteral(params.hometown.name);
            }
            if (params.picture && params.picture.trim() !== "") {
                campos.push('fotografia');
                // valores.push(params.picture);
                adicional += ", " + conn.escapeLiteral(params.picture);
            }

            var sql = 'INSERT INTO utilizador (' + campos.join() + ')';
            sql += " SELECT " + conn.escapeLiteral(name) + ", 'Criado a partir da rede social " + params.network + "', " + conn.escapeLiteral(email) + ", true, true, " + sexo + ", min(id)" + adicional;
            sql += ' from grupo where omissao';
            sql += ' RETURNING id;';
            console.log('--sql inserirNovoUtilizador (social): ' + sql);
            conn.query(sql, function (err, resultInsert) {

                // conn.query('INSERT INTO utilizador (' + campos.join() + ') VALUES (' + buracos.join() + ') RETURNING id', valores, function(err, resultInsert) {

                if (err) {
                    db.debugError(callback, err);
                } else {
                    console.log('resultInsert = ' + resultInsert.rows[0].id);
                    var sql = "SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM utilizador WHERE id = " + resultInsert.rows[0].id;
                    conn.query(sql, function (err, result) {
                        if (err) {
                            db.debugError(callback, err);
                        } else {
                            logSession(result.rows);
                        }
                    });

                }
            });
        };

        console.log('Session ID = ' + sessionID);
        var agent = useragent.parse(request.headers['user-agent']);
        var browser = agent.toAgent();
        var os = agent.os.toString();
        var device = agent.device.toString();
        console.log('Useragent detected: ' + browser, os, device);
        var ip = request.ip;
        var host = '';

        var conn = db.connect();
        var sql = "SELECT *, st_x(ponto) as longitude, st_y(ponto) as latitude FROM utilizador WHERE email = '" + email + "'";

        console.log('+4--------------------------------- ' + params.network + ' ---------------------------+');
        console.log('+sql ----------------------+' + sql);

        conn.query(sql, function (err, result) {
            if (err) {
                db.debugError(callback, err);
            } else {

                if (result.rows.length == 0) {
                    // Ainda não existe este utilizador
                    // Ainda não deve existir a sessão registada... penso eu
                    inserirNovoUtilizador();
                } else {
                    console.log('O utilizador já existe na rede social');
                    // O utilizador existe, e pode-se ter registado de várias formas...
                    // autenticou-se ou já está autenticado  pelo facebook
                    // a sessão pode existir, se ele não fez logout e está autenticado na rede social (voltar a abrir o site)
                    // vou testar o request.session.userid, sem testar se existe a entrada na tabela sessao
                    if (request.session.userid && request.session.userid > 0) {
                        // só se a sessao for apagada da BD é que isto não bate certo...
                        logSessionUpdate(result.rows);
                    } else {
                        logSession(result.rows);
                    }
                }
            }
        });

    }
};

module.exports = DXLogin;

// https://apis.live.net/v5.0/1a701f6273d6dd43/picture?access_token=EwB4Aq1DBAAUGCCXc8wU/zFu9QnLdZXy+YnElFkAAXUO/xd7+r2/Pj/+Ucxm+KYx9anFViAGsoaDARbG3OFfGLWW4kIFZDIVbNMdyBPc9pihY7XGpIKYB/QSTJy/21C46Nxjp6PM984ayzwg+z5E44ja97pRAIUOH0wZZ87u4TSOQQ/H3N6czztOftfnANRYUTChFIuavE5vf7peaskvFggiOysR7uuhzPlu90ngdlHMGx9uMxdwB7zIQ1BTs3uEkYdH8bG2lM//CC2+jWm8dVhPGJ7IoiRfZOBkPNdsS4Fe9vPOyg5/4Emi4Sr8u+VhMZOr2Arcma5+NheSIQaCTLyLXvqi3fzgBYsKqtEiIGP6G4hYTEkkj0fIX/y785sDZgAACLbgSUskcijgSAHG+bK7JgRrEmYxHzr4lVqdXM36WjWveDciicihofhlBRgl/yzFziy7tAzdU2KakjgPeVkNofD7GLwOCUN8i6OsnRGQHZD5yBJeQKFkLRDNk+TZ4D0LF/KU7FR3eoNjDLjngdsh7RD/25PEy8zaZgkguImgqxltusxwEJIh5Qka+XvaVPEQg6qhBnbkBM4hcGzQTWm3npQKVB/H7khmZn63ZmU6L8L9ISFaJTKDLmjGz7xG6BycxgI+8fDDH65fCxcZaIux5pPBk1ABAy+XGlWjvAJuEmt081O+W48csXNYznG7oowT4LBysnSHo1pOv98fTi6O/DIUPepCC48Mh3lFSoRYJ+eHCa/9dWfYV+oe4vMNzvQ1QCBNjgSKqJjy3nRYjL0N2AVLE3MostAhxBvNvzZPI+m+1xDc8IaHCqKMSt+dgT0HQi2fTwE=
// https://apis.live.net/v5.0/1a701f6273d6dd43/picture?access_token=EwB4Aq1DBAAUGCCXc8wU/zFu9QnLdZXy+YnElFkAAQAyhV+UpMhuoPFea22da+qMnxzfYomGxEBVNnyosi+B7ezMPY/mW2RXuZyDNk3lqj2V48qDUChdPGsJg/prtv6QkNnxDIH7SX/080m2JHkVrb315KB8ip684S+ungduORuUZ+8R9cP8JfZ9V/NRcAwxEUDff0PH6n0qGFc6A7DUTrBFBV2mB6S+G7YwNDgIF1b/s6oHzOiZleSqwfAIqkML1fck5ajSUtFUwWVjnop5130XLRgRqY4bLQByE6ydMKwBdikOx0cAsnGoFQmDOOa7Q49nNKhcrQdneHo3caSn+avvZ9HgipXDLP8U7N7mk94EiG/AIJRzTKbbFKTbZpYDZgAACI47Pnu8EFA/SAE1oD293TFkVDbzCaY4ZBkqm2adbtYKrkvjbvVGDhMUuvGF5iEPkWqnMS+ksRVxhDTRzMXjCX7AP2EMN0nN+z1o/6lPd2g0DAMXi+siOL6VCZhFecLJ84p+stj/IEFfqsvuV7MuGoyMG3MMD/u2CHWniP/dsmIb0RYX6H2sSQ/H/76hBUWFuhgvhQrHJqsDJNQUDoKg5mBYG2wCPFCs/qCmgnRPSwxSJcADQbpaPTroCZjP5oAQ1wZG/4yWH3OuysslGoyfAzxOx76f+MGQfUBzSbxRveM7bCyhgA1mUp54lZxLd3mM6RTzM2OoUg+6cZoxR+AdkZmp5VDCPnmzeM6X1v1G8nHgJGBMUD04zzKiSDmCFWVR1wV8tsu1QjTWUqU+sOCgjslLc7GqTCPIZRrmq18RG+qQsOheDhRo45UQ4+dRNO1+FnawTwE=
