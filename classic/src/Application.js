Ext.define('Admin.Application', {
    extend: 'Ext.app.Application',

    name: 'Admin',

    requires: [
        'Ext.direct.*', 'Ext.data.proxy.Direct'
    ],

    // https://docs.sencha.com/extjs/6.0/application_architecture/router.html
    defaultToken: 'dashboard',

    //controllers: [
    // TODO - Add Global View Controllers here
    //],

    init: function () {
        // console.log('Admin.Application init()');
        Ext.enableAriaButtons = false;

        var db = Translation;
        if (db) {
            // console.log('Com suporte a traduções');
            String.prototype.translate = function () {
                var s = this.valueOf();
                // console.log('TRANSLATE: ' + s);
                var t = {},
                    i = 0,
                    n = db.length;
                while (i < n) {
                    t = db[i];
                    // console.log(t);
                    if (t.id == s) {
                        return t.translation;
                    }
                    i++;
                }
                return s;
            };
        } else {
            // console.log('Sem suporte a traduções');
            String.prototype.translate = function () {
                var s = this.valueOf();
                return s;
            };
        }

    },

    //https://sencha.guru/2015/09/22/loading-ext-direct-api/
    // pull request to https://github.com/jurisv/extdirect.examples/issues
    launch: function () {
        var me = this;
        Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider'));
        // The 'directapi' is called from app.json
        // console.log('Admin.Application launch()');

        // alias for Geoserver WFS geojson requests
        proj4.defs('urn:ogc:def:crs:EPSG::3763', proj4.defs('EPSG:3763'));

        // tradução da aplicação...
        // http://www.enovision.net/how-to-add-missing-extjs-6-locale-properties-in-your-application/
        // console.log('app-language'.translate());

        var ns = Server.API;
        if (ns) {
            if (ns.error) {
                Ext.Msg.alert('Error', ns.error.message);
            } else {
                Ext.direct.Manager.addProvider(ns);
                this.setMainView('Admin.view.main.Viewport');
                Server.DXLogin.alive({}, function (result, event) {
                    //<debug>
                    console.log('------------------- ALIVE --------------------');
                    //</debug>
                    if (result) {
                        if (result.success) {
                            // We have a valid user data
                            //console.log('------------------- ALIVE: Success --------------------');
                            //Ext.Msg.alert('Successful login: session was recovered', Ext.encode(result));
                            //GeoPublic.LoggedInUser = Ext.create('GeoPublic.model.Utilizador', result.data[0]);
                            //GeoPublic.LoggedInUser["login"] = "local";
                            //// console.log(GeoPublic.LoggedInUser);
                            //me.fireEvent('loginComSucesso', result.data[0]);
                            Ext.GlobalEvents.fireEvent('loginComSucesso', result.data[0]);
                        } else {
                            //Ext.Msg.alert('No session available', Ext.encode(result));
                            //Ext.Msg.alert('No session available', result.message.text);
                            // console.log('------------------- ALIVE: not success --------------------');
                            Ext.GlobalEvents.fireEvent('logoutComSucesso');
                        }
                    } else {
                        // console.log('------------------- ALIVE: Error --------------------');
                        Ext.GlobalEvents.fireEvent('logoutComSucesso');
                    }
                });
            }
        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
