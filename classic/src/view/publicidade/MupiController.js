Ext.define('Admin.view.publicidade.MupiController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mupi',

    onButtonUpload: function (filefield, e, options) {
        var me = this;
        console.log("onButtonUpload");
        var vm = me.getViewModel();
        // var form = me.lookupReference('buildingphotoform');
        var form = me.lookupReference('mupidetail');
        form.submit({
            waitMsg: 'Uploading your photo...'.translate(),
            success: function (fp, o) {
                console.log(o);
                var fotografiasStore = vm.getStore('fotografia');
                fotografiasStore.load();

/*                // atualizar o WFS para aparecer o estilo correto
                var grid = me.getView().up('publicidade').down('gridpublicidadelevantada');
                var sm = grid.getSelectionModel();
                var record = sm.getSelection()[0];
                record.set('fotografias', record.get('fotografias') + 1);*/
            },

            failure: function (form, action) {
                console.log(arguments);
                Ext.MessageBox.show({
                    title: 'Error'.translate(),
                    msg: 'Error uploading file'.translate(),
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
        });
    },

    onButtonOpenProcess: function (button, e, options) {
        var me = this;
        console.log("onButtonOpenProcess");
    },

    onButtonRemoverInstantaneo: function (button, e, options) {
        var me = this;
        console.log("onButtonRemoverInstantaneo");

        var form = me.lookupReference('mupidetail');
        var dv = form.down('fotografia').down('dataview');
        var sm = dv.getSelectionModel();
        var records = sm.getSelection();

        console.log(records);

        var vm = me.getViewModel();
        var fotografiasStore = vm.getStore('fotografia');
        fotografiasStore.remove(records);

        // atualizar o WFS para aparecer o estilo correto
        var grid = me.getView().up('publicidade').down('gridpublicidadelevantada');
        var sm = grid.getSelectionModel();
        var record = sm.getSelection()[0];
        record.set('fotografias', record.get('fotografias') - 1);

    },

    onPrintClick: function (button) {
        var me = this;
        var vm = me.getViewModel();

        var record = vm.get('edificadoGrid.selection');
        console.log(record);
        var extent = record.get('geometry').getExtent();
        var center = ol.extent.getCenter(extent);

        var layoutname ='A4_landscape';

        var stringifyFunc = ol.coordinate.createStringXY(0);
        var out = stringifyFunc(center);

        // var printid = '5126';
        var printid = record.get('id_edifica');

        var spec = {
            layout: layoutname,
            outputFilename: printid,
            attributes: {
                centro: out,
                pedido: printid,
                requerente: 'Ana Rita Forjaz Rocha' // name
            }
        };

        var util = GeoExt.data.MapfishPrintProvider;

        var serializedLayers2k = [];
        var serializedLayers10k = [];

        serializedLayers2k.push({
            "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
            "customParams": {"VERSION": "1.1.1", "tiled": true},
            "layers": ["carto2_5k"],
            "opacity": 1,
            "styles": [""],
            "type": "WMS"
        });
        serializedLayers10k.push({
            "baseURL": "http://softwarelivre.cm-agueda.pt/geoserver/wms",
            "customParams": {"VERSION": "1.1.1", "tiled": true},
            "layers": ["carto10k"],
            "opacity": 1,
            "styles": [""],
            "type": "WMS"
        });
        //serializedLayers.reverse();

        spec.attributes['map2k'] = {
            center: center,
            dpi: 200, // clientInfo.dpiSuggestions[0],
            layers: serializedLayers2k,
            projection: 'EPSG:3763', // mapView.getProjection().getCode(),
            rotation: 0, // mapView.getRotation(),
            scale: 2000
        };

        spec.attributes['map10k'] = {
            center: center,
            dpi: 200, // clientInfo.dpiSuggestions[0],
            layers: serializedLayers10k,
            projection: 'EPSG:3763', // mapView.getProjection().getCode(),
            rotation: 0, // mapView.getRotation(),
            scale: 10000
        };

        Ext.Ajax.request({
            url: 'http://localhost:8080/print/print/plantas/report.pdf',
            // url: 'http://geoserver.sig.cm-agueda.pt/print/print/plantas/report.pdf',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            jsonData: spec,
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                console.dir(obj);

                var startTime = new Date().getTime();
                me.downloadWhenReady(me, startTime, obj);

                Ext.Msg.alert(Ext.String.format("Print request {0}".translate(), printid),
                    'Your Location Plan can take up to 30 seconds to be ready.'.translate() + '<br/>' +
                    'It will be downloaded automatically.'.translate() + '<br/>' +
                    'Please wait.'.translate());

                /*
                 downloadURL: "/print/print/report/47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c"
                 ref: "47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c"
                 statusURL: "/print/print/status/47470980-2975-418e-8841-08261c9fd6ea@dbfe37f9-02ef-4f4b-9441-4e3d0247733c.json"
                 */

/*                var folderpdf = 'print-requests/' + Math.floor(printid / 1000);
                var pathpdf = folderpdf + '/' + printid + '.pdf';*/

                /*                Server.Plantas.Pedidos.update({
                 gid: printid,
                 pdf: pathpdf,
                 download_cod: obj.downloadURL,
                 //ref: obj.ref,
                 statusURL: obj.statusURL
                 }, function (result, event) {
                 if (result) {
                 if (result.success) {
                 console.log('Correu bem o update', result.message);
                 } else {
                 console.log('Correu mal o update', result.message);
                 }
                 } else {
                 console.log('Correu mal o update', result.message);
                 }
                 });*/
            },

            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });


    },

    downloadWhenReady: function (me, startTime, data) {
        if ((new Date().getTime() - startTime) > 50000) {
            console.log('Gave up waiting after 50 seconds');
        } else {
            //updateWaitingMsg(startTime, data);
            setTimeout(function () {
                Ext.Ajax.request({
                    // url: 'http://geoserver.sig.cm-agueda.pt' + data.statusURL,
                    url: 'http://localhost:8080' + data.statusURL,
                    success: function (response, opts) {
                        var statusData = Ext.decode(response.responseText);
                        console.dir(statusData);

                        if (!statusData.done) {
                            me.downloadWhenReady(me, startTime, data);
                        } else {
                            // window.location = 'http://geoserver.sig.cm-agueda.pt' + statusData.downloadURL;
                            window.location = 'http://localhost:8080' + statusData.downloadURL;
                        }
                    },
                    failure: function (response, opts) {
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }, 1000);
        }
    },

    onSaveClick: function (button) {
        console.log('Vai gravar...');
        var me = this;
        var vm = me.getViewModel();

        var record = vm.get('publicidadeLevantadaGrid.selection');
        console.log(record);
        // console.log(record.getModifiedFieldNames());

        var params = {};
        params['id_edifica'] = record.get('id_edifica');

        for (var key in record.modified) {
            if (record.modified.hasOwnProperty(key)) {
                params[key] = record.get(key);
                console.log(key, record.get(key));
            }
        }

        console.log(params);

        //
        var personaldata = this.lookupReference('mupidetail');
        // var params = personaldata.getForm().getValues();
        var paramsdirty = personaldata.getForm().getValues(false, true, false, false);
        console.log(paramsdirty);
        //
        // var paramsdirtyaux = personaldata.getForm().getValues(false, true, false, true);
        // console.log(paramsdirtyaux);

        if (Object.getOwnPropertyNames(params).length > 0) {
            Server.Urbanismo.Urbanismo.updateEdificio(params, function (result, event) {
                if (result) {
                    if (result.success) {
                        // recrio a cópia dos dados do utilizador no lado do cliente, com as alterações efetuadas
                        // não preciso de fazer isto quando mudo a password
                        // não sei se preciso de fazer isto quando mudo a fotografia!
                        //GeoPublic.LoggedInUser = Ext.create('GeoPublic.model.Utilizador', result.data[0]);
                        Ext.Msg.alert('Successo', 'As alterações foram gravadas com sucesso.');

                        // for (var key in paramsdirty) {
                        //     // vm.set('current.user.' + key, paramsdirty[key]);
                        //     console.log("vm.set('edificadoGrid.selection.'" + key + "', " + paramsdirty[key] + ')');
                        // }

                    } else {
                        Ext.Msg.alert('Erro', 'Ocorreu um erro ao gravar as alterações.');
                    }
                } else {
                    Ext.Msg.alert('Erro', 'Ocorreu um erro ao gravar as alterações.<br/>Tente mais tarde.');
                }
            });
        }
    }


});
