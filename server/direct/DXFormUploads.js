var gm = require('gm');
// var im = require('imagemagick');
var crypto = require('crypto');
var db = global.App.database;
var mkdirp = require('mkdirp');
var fileType = require('file-type');
var readChunk = require('read-chunk');

var table = 'plantas.pedido';
var pg = global.App.postgres;
//var fs = global.App.fs;

var request = require('request');

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

/*var dberror = function (text, log, err, callback) {
    console.error(text + ' ' + err.toString() + ' ' + log);
    callback({
        message: {
            text: text,
            detail: err.toString()
        }
    });
    return false;
};*/

var DXFormUploads = {
    /*
     testMe : function(params, callback) {
     console.log(params);
     callback({
     success : true,
     msg : 'Hello world',
     params : params
     });
     },
     */
    testMe: function (params, callback, sessionID, request, response) {
        // testMe : function(params, callback) {
        console.log('Session ID = ' + sessionID);
        console.log('Params = ' + JSON.stringify(params));
        console.log('session.userid = ' + request.session.userid);
        console.log('Cookie = ' + JSON.stringify(request.session.cookie));
        request.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
        console.log('Cookie = ' + JSON.stringify(request.session.cookie));
        callback({
            success: true,
            msg: 'Hello world',
            params: params
        });
    },

    testException: function (params, callback) {
        failedHere;// explicit typo
        callback({
            success: true
        });
    },

    load: function (params, callback) {
        callback({
            success: true,
            data: {
                firstname: 'John',
                lastname: 'Smith',
                email: 'john.smith@comapny.info'
            }
        });
    },

    submit: function (params, callback/*formHandler*/) {
        callback({
            success: true,
            params: params
        });
    },

    // http://shapeshed.com/working_with_filesystems_in_nodejs/
    // http://ogre.adc4gis.com/

    filesubmitshapefile: function (params, callback, sessionID, request, response/*formHandler*/) {
        var files = request.files;
        //get files from request object
        console.log(files);
        var userid = request.session.userid;
        console.log('DXFormTest.filesubmitshapefile Session ID = ' + sessionID + ' com o utilizador ' + userid);

        // Do something with uploaded file, e.g. move to another location
        var fs = require('fs'), file = files.shapefile, tmp_path = file.path;
        console.log(file);
        var path = require('path');

        var target_path = './public/uploaded_shapefiles';
        var target_file = target_path + '/' + file.name;

        console.log('Tempory path = ' + tmp_path);
        console.log('Target path = ' + target_file);

        var successfulUpload = function (cb) {

        };

        var failedUpload = function (cd, error) {

        };

        if (file.size > 0) {
            if (file.size < 100000) {
                try {
                    fs.rename(tmp_path, target_file, function (err) {
                        if (err) {
                            console.log('fs.rename');
                            console.log(err);
                            callback({
                                success: false,
                                msg: "Erro ao copiar da pasta temporária para a pasta dos uploads.",
                                errors: err.message
                            });
                        }
                        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
                        fs.unlink(tmp_path, function () {
                            callback({
                                success: true,
                                msg: 'Carregamento com sucesso.',
                                size: file.size,
                                name: target_file
                            });
                        });
                    });
                } catch (e) {
                    console.log('Exception on fs.rename');
                    callback({
                        success: false,
                        msg: "Erro ao copiar da pasta temporária para a pasta dos uploads.",
                        errors: e.message
                    });
                }
            } else {
                console.log('Shapefile demasiado grande');
                callback({
                    success: false,
                    msg: "A shapefile é demasiado grande.",
                    errors: e.message
                });
            }
        } else {
            console.log('file.size === 0');
            callback({
                success: false,
                msg: "Ficheiro vazio.",
                params: params,
                errors: {
                    clientCode: "File not found",
                    portOfLoading: "This field must not be null"
                }
            });
        }

    },

    /*
     * Tenho que estar em sessão...
     */

    filesubmitinstantaneo: function (params, callback, sessionID, request, response) {
        //@formHandler
        console.log('filesubmitinstantaneo');
        var files = request.files;
        // get files from request object
        console.log(params);

        var edificio = -1;
        if (params.hasOwnProperty('id_edifica') && parseInt(params.id_edifica) > 0) {
            edificio = parseInt(params.id_edifica);
            console.log('edificio: ' + edificio);
        } else {
            callback({
                message: 'Missing building id'
            });
        }

        // console.log(request);
        console.log(files);

        //imagens
        // uploaded_images/edificado/91/medium/img_3398_1a9c3aad506dbeab0af53985665f6eee.jpg
        // uploaded_images/edificado/91/original/img_3398_1a9c3aad506dbeab0af53985665f6eee.jpg
        // uploaded_images/edificado/91/thumb/img_3398_1a9c3aad506dbeab0af53985665f6eee.jpg

        // documentos
        // uploaded_images/edificado/91/doc/megatronica_2132306_2013_40652322cfd5ca72c6fe0614615a1f79.pdf
        // uploaded_images/edificado/91/thumb/megatronica_2132306_2013_40652322cfd5ca72c6fe0614615a1f79.pdf.png

        var fs = require('fs-extra'), path = require('path');

        var file;
        if (files.instantaneo && files.instantaneo.size > 0) {
            file = files.instantaneo;
        } else {
            if (files.documento && files.documento.size > 0) {
                file = files.documento;
            } else {
                console.log('file.size === 0');
                callback({
                    success: false,
                    message: "Upload failed - empty file",
                    params: params,
                    errors: {
                        clientCode: "File not found",
                        portOfLoading: "This field must not be null"
                    }
                });
            }
        }

        var tmp_path = file.path;
        console.log('Temporary path = ' + tmp_path);

        // var aleatorio = tmp_path.split('/')[1];
        var base = Math.floor(edificio / 100) + 1;
        // var pasta = 'uploaded_images/edificado/' + base + '/' ; // + params.idpromotor + '/' + params.idplano;

        var pasta = path.join('./public/uploaded_images/edificado/', base.toString());

        // we can use the extension of the original file
        // or the file type returned by gm().identify
        // var extension = path.extname(file.name).toLowerCase();
        var extension = file.extension.toLowerCase();

        // remove extension
        // change non alpha chars with _
        var original = file.originalname.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, '_').toLowerCase();
        var aleatorio = file.name.replace(/\.[^/.]+$/, "");

        // the usar can upload two different images with the same name
        var newfilename = original + '_' + aleatorio + '.' + extension;
        var path_thumb = path.join(pasta, 'thumb', newfilename);
        var path_medium = path.join(pasta, 'medium', newfilename);
        var path_normal = ''; // mudará consoante se for imagem ou documento

        console.log(newfilename);
        console.log(pasta);
        console.log(path_normal, path_thumb, path_medium);

        var resize80 = null, resize600 = null;

        function complete(folder, largura, altura) {
            if (resize600 !== null && resize80 !== null) {
                try {
                    fs.move(tmp_path, path_normal, function (err) {
                        // fs.rename does not work between filesystems
                        // fs.rename(tmp_path, path_normal, function (err) {
                        if (err)
                            throw err;
                        var fields = ['id_edifica', 'pasta', 'caminho', 'idutilizador', 'tamanho', 'largura', 'altura', 'name'];
                        var buracos = ['$1', '$2', '$3', '$4', '$5', '$6', '$7', '$8'];
                        var values = [params.id_edifica, folder.replace(/^public\//, ''), newfilename, request.session.userid, file.size, largura, altura, file.originalname];
                        console.log(values);

                        // pg.connect(global.App.connection, function (err, client, done) {
                        // var detail = global.App.connection.split('/');
                        var detail = global.App.connectionide.split('/');
                        pg.connect({
                            user: detail[2].split('@')[0].split(':')[0],
                            password: detail[2].split('@')[0].split(':')[1], // 'geobox',
                            database: detail[3], // 'geotuga',
                            host: detail[2].split('@')[1].split(':')[0], // 'localhost',
                            port: detail[2].split('@')[1].split(':')[1] ? detail[2].split('@')[1].split(':')[1] : "5432",
                            application_name: 'filesubmitinstantaneo'
                        }, function (err, client, done) {
                            if (err)
                                // return dberror('Database connection error', '', err, callback);
                                return dberror('Database connection error', '', err, callback, request, done);

                            var sql = `INSERT INTO edificios.fotografia (${fields.join()}) VALUES (${buracos.join()}) RETURNING id`;
                            console.log(sql);
                            client.query(sql, values, function (err, result) {
                                if (err)
                                    // return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback);
                                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                                console.log(result.rows[0]);
                                callback(null, {
                                    message: 'Uploaded successfully',
                                    size: file.size,
                                    path: path_normal,
                                    data: result.rows,
                                    total: result.rows.length
                                });
                                // free this client, from the client pool
                                done();
                            });
                        });

                    });
                } catch (e) {
                    console.log('Exception');
                    callback({
                        success: false,
                        msg: "Upload failed - can't rename the uploaded file",
                        errors: e.message
                    });
                }
            }
        }

        function complete_documento(folder, largura, altura) {
            try {
                fs.move(tmp_path, path_normal, function (err) {
                    // fs.rename(tmp_path, path_normal, function (err) {
                    if (err)
                        throw err;
                    var fields = ['id_edifica', 'pasta', 'caminho', 'idutilizador', 'tamanho', 'largura', 'altura', 'name'];
                    var buracos = ['$1', '$2', '$3', '$4', '$5', '$6', '$7', '$8'];
                    var values = [params.id_edifica, folder.replace(/^public\//, ''), newfilename, request.session.userid, file.size, largura, altura, file.originalname];
                    console.log(values);

                    // pg.connect(global.App.connection, function (err, client, done) {
                    pg.connect(global.App.connectionide, function (err, client, done) {
                        if (err)
                            return dberror('Database connection error', '', err, callback, request, done);
                        var sql = `INSERT INTO edificios.fotografia (${fields.join()}) VALUES (${buracos.join()}) RETURNING id`;
                        console.log(sql);
                        client.query(sql, values, function (err, result) {
                            if (err)
                                return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                            console.log(result.rows[0]);
                            callback(null, {
                                message: 'Uploaded successfully',
                                size: file.size,
                                path: path_normal,
                                data: result.rows,
                                total: result.rows.length
                            });
                            // free this client, from the client pool
                            done();
                        });
                    })

                });
            } catch (e) {
                console.log('Exception');
                callback({
                    success: false,
                    msg: "Upload failed - can't rename the uploaded file",
                    errors: e.message
                });
            }
        }

        function processa() {
            console.log('processa');
            var buffer = readChunk.sync(tmp_path, 0, 262);
            var tipo = fileType(buffer);
            console.log(tipo);
            if (tipo.hasOwnProperty('mime')) {
                switch (tipo['mime']) {
                    case "application/pdf":
                        console.log('PDF a CAMINHO...', extension, tipo['mime']);
                        // path_normal = pasta + '/doc/' + newfilename;
                        path_normal = path.join(pasta, 'doc', newfilename);
                        // path_thumb = pasta + '/thumb/' + newfilename + '.png';
                        path_thumb = path.join(pasta, 'thumb', newfilename + '.png');
                        gm(tmp_path + '[0]').resize(80, 80, "^").gravity('Center').extent(80, 80).noProfile().write(path_thumb, function (err) {
                            if (err) {
                                console.log('Erro: ', err);
                            } else {
                                console.log(path_thumb, ' was saved');
                                complete_documento(pasta, 0, 0); // o tamanho é irrelevante
                            }
                        });
                        break;
                    case "image/jpeg":
                    case "image/png":
                    case "image/tiff":
                        path_normal = path.join(pasta, 'original', newfilename);
                        gm(tmp_path).identify(function (err, data) {
                            if (err) {
                                // Penso que não se trata de uma imagem
                                console.log("Upload failed. Can't identify file format. File does not exist or no decode exist for this file format.");
                                callback({
                                    success: false,
                                    msg: "Upload failed. Can't identify file format. File does not exist or no decode exist for this file format.",
                                    errors: err.message
                                });
                            } else {
                                console.log(data.format);
                                // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
                                // { format: 'PNG',
                                // if (data.format == 'JPEG')
                                gm(tmp_path).resize(800, 800).noProfile().write(path_medium, function (err) {
                                    if (err) {
                                        console.log('Erro: ', err);
                                    } else {
                                        resize600 = path_medium;
                                        complete(pasta, data.size.width, data.size.height);
                                    }
                                });
                                gm(tmp_path).resize(80, 80, "^").gravity('Center').extent(80, 80).noProfile().write(path_thumb, function (err) {
                                    if (err) {
                                        console.log('Erro: ', err);
                                    } else {
                                        resize80 = path_thumb;
                                        complete(pasta, data.size.width, data.size.height);
                                    }
                                });

                            }
                        });
                        break;
                    case "application/zip":
                        console.log('Não sei tratar um ', extension, tipo['mime']);
                        break;
                    default:
                        console.log('Não sei tratar um ', extension, tipo['mime']);
                        break;
                }
            } else {
                callback({
                    success: false,
                    msg: 'File type not supported'
                });
            }

        }

        if (sessionID && request.session.userid) {
            mkdirp(pasta + '/thumb/', function (err) {
                if (err) {
                    console.error(err);
                    callback({
                        success: false,
                        msg: "Upload failed. Server error.",
                        params: params
                    });
                }
                else { //
                    mkdirp(pasta + '/medium/', function (err) {
                        if (err) {
                            console.error(err);
                            callback({
                                success: false,
                                msg: "Upload failed. Server error.",
                                params: params
                            });
                        }
                        else { //
                            mkdirp(pasta + '/doc/', function (err) {
                                if (err) {
                                    console.error(err);
                                    callback({
                                        success: false,
                                        msg: "Upload failed. Server error.",
                                        params: params
                                    });
                                }
                                else { //
                                    mkdirp(pasta + '/original/', function (err) {
                                        if (err) {
                                            console.error(err);
                                            callback({
                                                success: false,
                                                msg: "Upload failed. Server error.",
                                                params: params
                                            });
                                        }
                                        else {
                                            processa();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            callback({
                success: false,
                msg: "Upload failed - some parameters are missing",
                params: params
            });
        }
    },

    filesubmit: function (params, callback, sessionID, request, response) {
        //@formHandler
        var files = request.files; //get files from request object
        console.log(params, files)

        // Do something with uploaded file, e.g. move to another location
        var fs = require('fs'),
            file = files.photo,
            tmp_path = file.path;

        // set where the file should actually exists - in this case it is in the "demo" directory
        var target_path = './public/uploaded_images/' + file.name;

        console.log(request.session.userid);

        var folder160 = 'uploaded_images/profiles/160x160/' + Math.floor(request.session.userid / 1000) + '/';
        var folder32 = 'uploaded_images/profiles/32x32/' + Math.floor(request.session.userid / 1000) + '/';

        var path_160 = folder160 + file.name.toLowerCase();
        var path_32 = folder32 + file.name.toLowerCase();

        var target_path_160 = './public/' + path_160;
        var target_path_32 = './public/' + path_32;

        console.log(folder160);
        console.log(folder32);

        console.log(target_path_160);
        console.log(target_path_32);

        var resize32 = null, resize160 = null;

        var successfulUpload = function (cb) {
        };

        var failedUpload = function (cd, error) {
        };

        // move the file from the temporary location to the intended location
        // do it only if there is a file with size
        if (file.size > 0) {

            console.log('Tentar o gm...');
            gm(tmp_path).identify(function (err, data) {
                console.log('Dentro do gm...');

                if (err) {
                    console.log('Deu erro...');

                    // Penso que não se trata de uma imagem
                    callback({
                        success: false,
                        msg: "Upload failed - can't identify file format",
                        errors: err.message
                    });
                } else {
                    console.log('Vou criar a pasta ' + folder160);

                    mkdirp('./public/' + folder160, function (err) {
                        if (err)
                            callback({
                                success: false,
                                msg: "Upload failed - mkdir failed",
                                errors: err.message
                            });
                        else {
                            console.log('pasta ' + folder160 + ' criada ');
                            mkdirp('./public/' + folder32, function (err) {
                                if (err)
                                    callback({
                                        success: false,
                                        msg: "Upload failed - mkdir failed",
                                        errors: err.message
                                    });
                                else {
                                    console.log('NÃO deu erro...');
                                    console.log('Detalhes da imagem: ');
                                    console.log(data);

                                    function complete() {
                                        if (resize160 !== null && resize32 !== null) {
                                            try {

                                                // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
                                                fs.unlink(tmp_path, function () {


                                                    var sql = "UPDATE users.utilizador SET fotografia = '" + path_32 + "', datamodificacao = now() where id = " + request.session.userid;

                                                    pg.connect(global.App.connection, function (err, client, done) {
                                                        if (err)
                                                            return dberror('Database connection error', '', err, callback, request, done);
                                                        console.log(sql);
                                                        client.query(sql, function (err, result) {
                                                            if (err)
                                                                return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                                                            callback(null, {
                                                                message: 'Uploaded successfully',
                                                                size: file.size,
                                                                name32: path_32,
                                                                name160: path_160
                                                            });
                                                            // free this client, from the client pool
                                                            done();
                                                        });
                                                    });

                                                    callback(null, {
                                                        message: 'Uploaded successfully',
                                                        size: file.size,
                                                        //name: file.name,
                                                        name32: path_32,
                                                        name160: path_160
                                                    });


                                                });

                                            } catch (e) {
                                                console.log('Exception on fs.unlink');
                                                callback({
                                                    errors: err.message,
                                                    message: "Upload failed - can't rename the file"
                                                });
                                            }
                                        }
                                    }

                                    gm(tmp_path).resize(160, 160).noProfile().write(target_path_160, function (err) {
                                        if (err) {
                                            console.log('Erro: ', err);
                                        } else {
                                            resize160 = target_path_160;
                                            complete();
                                        }
                                    });

                                    gm(tmp_path).resize(32, 32).noProfile().write(target_path_32, function (err) {
                                        if (err) {
                                            console.log('Erro: ', err);
                                        } else {
                                            resize32 = target_path_32;
                                            complete();
                                        }
                                    });

                                }
                            });
                        }
                    });


                }
            });


        } else {
            callback({
                //success: false, // will be set to false automatically as we have configured our server with responseHelper: true
                message: "Upload failed - empty file",
                params: params,
                errors: {
                    clientCode: "File not found",
                    portOfLoading: "This field must not be null"
                }
            });
        }
    },

    filesubmitphotoprofile: function (params, callback, sessionID, request, response /*formHandler*/) {
        var files = request.files;
        //get files from request object
        // console.log(params, files)
        var userid = request.session.userid;
        console.log('DXFormTest.filesubmitphotoprofile Session ID = ' + sessionID + ' com o utilizador ' + userid);

        // Do something with uploaded file, e.g. move to another location
        var fs = require('fs'), file = files.photo, tmp_path = file.path;
        var path = require('path');

        console.log('Tempory path = ' + tmp_path);

        var successfulUpload = function (cb) {

        };

        var failedUpload = function (cd, error) {

        };

        crypto.randomBytes(16, function (ex, buf) {
            token = buf.toString('hex');
            // set path in utilizador table (path_xxx)
            // set where the file should be saved (target_path_xxx)
            var path_160 = 'uploaded_images/profiles/160x160/' + userid + '_' + token + path.extname(file.name);
            var path_32 = 'uploaded_images/profiles/32x32/' + userid + '_' + token + path.extname(file.name);

            var target_path_160 = './public/' + path_160;
            var target_path_32 = './public/' + path_32;

            gm(tmp_path).identify(function (err, data) {
                if (err) {
                    // Penso que não se trata de uma imagem
                    callback({
                        success: false,
                        msg: "Upload failed - can't identify file format",
                        errors: err.message
                    });
                } else {
                    console.log(data);
                    // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
                    // { format: 'PNG',
                    // if (features.format == 'JPEG')

                    // move the file from the temporary location to the intended location
                    // do it only if there is a file with size
                    if (file.size > 0) {
                        var resize32 = null, resize160 = null;

                        gm(tmp_path).resize(160, 160).noProfile().write(target_path_160, function (err) {
                            if (err) {
                                console.log('Erro: ', err);
                            } else {
                                resize160 = target_path_160;
                                complete();
                            }
                        });

                        gm(tmp_path).resize(32, 32).noProfile().write(target_path_32, function (err) {
                            if (err) {
                                console.log('Erro: ', err);
                            } else {
                                resize32 = target_path_32;
                                complete();
                            }
                        });

                        function complete() {
                            if (resize160 !== null && resize32 !== null) {
                                try {
                                    fs.unlink(tmp_path, function () {
                                        // atualiza a base de dados!
                                        var conn = db.connect();
                                        var sql = "UPDATE utilizador SET fotografia = '" + path_32 + "', datamodificacao = now() where id = " + userid;

                                        pg.connect(global.App.connection, function (err, client, done) {
                                            if (err)
                                                return dberror('Database connection error', '', err, callback, request, done);
                                            console.log(sql);
                                            client.query(sql, function (err, result) {
                                                if (err)
                                                    return dberror('Database error', `${err.toString()} SQL: ${sql}`, err, callback, request, done);
                                                callback(null, {
                                                    //success: true,
                                                    message: 'Uploaded successfully',
                                                    size: file.size,
                                                    name32: path_32,
                                                    name160: path_160
                                                });
                                                // free this client, from the client pool
                                                done();
                                            });
                                        });
                                    });
                                } catch (e) {
                                    console.log('Exception on fs.unlink');
                                    callback({
                                        success: false,
                                        msg: "Upload failed - can't rename the uploaded file",
                                        errors: e.message
                                    });
                                }
                            }
                        }

                    } else {
                        console.log('file.size === 0');
                        callback({
                            success: false,
                            msg: "Upload failed - empty file",
                            params: params,
                            errors: {
                                clientCode: "File not found",
                                portOfLoading: "This field must not be null"
                            }
                        });
                    }
                }

            });
        });

    }
};

module.exports = DXFormUploads;
