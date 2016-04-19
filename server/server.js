//Add App to global namespace. We wil store any global variables we would like to be accessible from other modules

if (!global['App']) {
    global.App = {};
}

var express = require('express'),
    path = require('path'),
    direct = require('extdirect'),
//db = require('./server-db'),
    pg = require('pg'),
    nconf = require('nconf'),
    accepts = require('accepts'),
    fs = require('fs');

pg.defaults.poolSize = 100;

//cookieParser = require('cookie-parser');

nconf.env().file({
    file: './server-config.json'
});

var serverConfig = nconf.get("ServerConfig"),
    directConfig = nconf.get("ExtDirectConfig"),
    clientConfig = nconf.get("ClientConfig");

//Middleware
var favicon = require('serve-favicon'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    compression = require('compression'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    errorHandler = require('errorhandler');

var app = express();
global.App.env = app.get('env');
global.App.fs = fs;

global.App.postgres = pg;
if (global.App.env === 'development') {
    global.App.connection = serverConfig.dbdevelopment;
} else {
    global.App.connection = serverConfig.dbproduction;
}

global.App.connectionide = serverConfig.dbide;
global.App.connectionpublica = serverConfig.dbpublica;

global.App.mssql2012 = serverConfig.mssqlserver; // require('./mssql-tunnel').init(serverConfig.mssqlserver, serverConfig.sshtunnel);

//console.log(global.App.env);
//console.log(global.App.connection);

pg.on('error', function () {
    // https://github.com/brianc/node-postgres/issues/821
    console.log('PostgreSQL server error');
});

var templatesBase = path.resolve(__dirname, 'templates'), //
    templatesDir = templatesBase + '/en', //
    emailTemplates = require('email-templates');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// TODO
// configuration
var smtpServer = '172.16.2.126';

if (app.get('env') === 'development') {
    smtpServer = 'jupiter.sig.cm-agueda.pt';
}

var transport = nodemailer.createTransport(smtpTransport({
    // host: 'mail.cm-agueda.pt',
    //host: 'mail.geomaster.pt',
    //host: 'jupiter.sig.cm-agueda.pt',
    host: smtpServer,
    port: 465,
    secure: true,
    tls: {
        rejectUnauthorized: false
    },
    // debug: true,
    //connectionTimeout: 5000,
    logger: true,
    auth: {
        user: 'web@sig.cm-agueda.pt',
        pass: '20160229'
    }
}));

// 'http://cm-agueda.geomaster.pt/ppgis/';
global.App.from = 'web@sig.cm-agueda.pt';
global.App.transport = transport;
global.App.templates = templatesBase; // we need to add the lang to this path

// Deployment url
if (serverConfig.url) {
    global.App.url = serverConfig.url;
}

//Configure
app.set('port', process.env.PORT || serverConfig.port);

//app.use(favicon(__dirname + serverConfig.webRoot + '/favicon.ico'));

app.use(logger(serverConfig.logger));

app.use(methodOverride());

// app.use(express.static(path.join(__dirname, serverConfig.webRoot)));

if (serverConfig.enableSessions) {
    var RedisStore = require('connect-redis')(session);
    var redis = require("redis").createClient();
    //app.use(cookieParser());
    app.use(session({
        store: new RedisStore({
            host: 'localhost',
            port: 6379,
            client: redis
        }),
        name: 'geomaster.sid',
        secret: 'nabocudnosor',
        resave: false,
        secure: false, // Para não mudar de sessionId
        saveUninitialized: false
    }));
}

if (serverConfig.enableCompression) {
    app.use(compression()); //Performance - we tell express to use Gzip compression
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json());

if (serverConfig.enableUpload) {
    app.use(multer({dest: serverConfig.fileUploadFolder}));
}

// var configuracao = {};
// configuracao.title = "Espetadas de peixe";
// configuracao.author = "Geomaster, Lda";

app.engine('.html', require('ejs').__express);
app.engine('jade', require('jade').__express);

app.set('views', __dirname);
// app.set('views', path.join(__dirname, '.'));

app.get('/', function(req, res) {
    res.render('public/index.html', clientConfig);
});

app.get('/download/:id.pdf', function (req, res) {
    console.log(req.params.id);
    // TODO
    // validate by userid or sesionid

    //console.log(parseInt(req.params.id));
    //console.log(parseInt(req.params.id)/1000);
    //console.log(Math.floor(parseInt(req.params.id)/1000));
    var folderpdf = '/print-requests/' + Math.floor(parseInt(req.params.id) / 1000);
    var pathpdf = folderpdf + '/' + req.params.id + '.pdf';
    var file = __dirname + pathpdf;
    fs.stat(file, function (err, stat) {
        if (err == null) {
            res.download(file); // Set disposition and send it.
        } else {
            res.render('notfound', {
                pedido: req.params.id
            });
        }
    });
});

//CORS Supports
if (serverConfig.enableCORS) {

    app.use(function (req, res, next) {
        var ac = serverConfig.AccessControl;
        res.header('Access-Control-Allow-Origin', ac.AllowOrigin); // allowed hosts
        res.header('Access-Control-Allow-Methods', ac.AllowMethods); // what methods should be allowed
        res.header('Access-Control-Allow-Headers', ac.AllowHeaders); //specify headers
        res.header('Access-Control-Allow-Credentials', ac.AllowCredentials); //include cookies as part of the request if set to true
        res.header('Access-Control-Max-Age', ac.MaxAge); //prevents from requesting OPTIONS with every server-side call (value in seconds)

        if (req.method === 'OPTIONS') {
            res.sendStatus(204);
        }
        else {
            next();
        }
    });
}

//Warm up Direct
var directApi = direct.initApi(directConfig);
var directRouter = direct.initRouter(directConfig);

//Routes
//GET method returns API
app.get(directConfig.apiUrl, function (req, res) {
    try {
        directApi.getAPI(
            function (api) {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(api);
            }, req, res
        );
    } catch (e) {
        console.log(e);
    }
});

// Ignoring any GET requests on class path
app.get(directConfig.classRouteUrl, function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify({success: false, msg: 'Unsupported method. Use POST instead.'}));
});

// POST request process route and calls class
app.post(directConfig.classRouteUrl, function (req, res) {
    //console.log('directRouter.processRoute(req, res);');
    //console.log(req.body);
    //console.log(req.route);
    directRouter.processRoute(req, res);
});

app.get('/configuration', function (request, response) {
    try {
        // var Configuration = {};
        // for (var property in clientConfig) {
        //     if (clientConfig.hasOwnProperty(property)) {
        //         Configuration[property] = clientConfig[property];
        //     }
        // }
        // console.log(Configuration);
        response.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        response.end('Configuration = ' + JSON.stringify(clientConfig) + ';');
    } catch (e) {
        console.log(e);
    }
});

app.get('/translation', function (request, response) {
    console.log('/translation: Session ID = ' + request.sessionID);
    console.log(request.session);

    var buf = '';
    var prototype = fs.readFileSync('./public/resources/languages/prototype.js');

    if (request.session && request.session.lang) {
        console.log('→→→ Já existe request.session.lang → ' + request.session.lang);
        console.log('→→→ TENHO QUE MANDAR A QUE ME PEDEM! → ' + request.session.lang);
        buf = fs.readFileSync('./public/resources/languages/' + request.session.lang + '.js', 'utf8');
        response.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        response.end(buf + prototype);
    } else {
        console.log('→→→ Não existe request.session.lang :-(');
        var acceptedLanguages = accepts(request).languages();
        // if request.session.lang exists, we don't care about
        console.log(acceptedLanguages);
        // [ 'pt-PT', 'pt', 'en-US', 'en', 'es', 'fr', 'it' ]
        var exist = 0, i = 0, n = 0;
        if (acceptedLanguages) {
            n = acceptedLanguages.length;
        }

        while (!exist && (i < n)) {
            try {
                console.log('./public/resources/languages/' + acceptedLanguages[i] + '.js');
                buf = fs.readFileSync('./public/resources/languages/' + acceptedLanguages[i] + '.js', 'utf8');
                response.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                request.session.lang = acceptedLanguages[i];
                console.log('Language ' + request.session.lang + ' added to request.session.lang');
                response.end(buf + prototype);
                exist = 1;
            } catch (err) {
                console.log('Language ' + acceptedLanguages[i] + ' not supported.');
                //console.log(err);
            }
            i++;
        }
        if (!exist) {
            console.log('None of the accepted languages is supported');
            buf = fs.readFileSync('./public/resources/languages/en.js', 'utf8');
            response.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            request.session.lang = 'en';
            console.log('Language ' + request.session.lang + ' added to request.session.lang');
            response.end(buf + prototype);
            
        }
    }
});

app.locals.dic = {};
app.locals.translate = function (text, lang) {
    var buf = '', fn;
    if (app.locals.dic[lang]) {
        console.log('Já foi carregada a língua ' + lang);
    } else {
        console.log('Ainda não foi carregada a língua ' + lang);
        try {
            fn = './languages/' + lang + '.json';
            console.log(fn);
            buf = fs.readFileSync(fn, 'utf8');
            // eval(buf);
            // app.locals.dic[lang] = Translation.slice(0);
            app.locals.dic[lang] = JSON.parse(buf);
        } catch (err) {
            console.log('Translation ' + lang + ' not supported.');
            console.log(err);
            app.locals.dic[lang] = [];
        }
    }
    var T = app.locals.dic[lang];
    var t = {}, i = 0, n = T.length;
    while (i < n) {
        t = T[i];
        console.log('Test Translate (' + t.id + '): ' + text + ' → ' + t.translation);
        if (t.id == text) {
            console.log('Translate (' + lang + '): ' + text + ' → ' + t.translation);
            return t.translation;
        }
        i++;
    }
    console.log('Without translation: (' + lang + '): ' + text + ' → ' + text);
    return text;
};

//Dev
if (app.get('env') === 'development') {
    app.use(errorHandler({dumpExceptions: true, showStack: true}));
}

app.use(express.static(path.join(__dirname, serverConfig.webRoot)));

app.listen(app.get('port'), function () {
    console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});