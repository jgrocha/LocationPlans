Ext.define('Admin.view.urbanismo.EdificioController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.edificio',

    onButtonUpload: function (filefield, e, options) {
        var me = this;
        console.log("onButtonUpload");
        var vm = me.getViewModel();
        // var form = me.lookupReference('buildingphotoform');
        var form = me.lookupReference('buidingdetail');
        form.submit({
            waitMsg: 'Uploading your photo...'.translate(),
            success: function (fp, o) {
                console.log(o);
                var fotografiasStore = vm.getStore('fotografia');
                fotografiasStore.load();
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

    onButtonRemoverInstantaneo: function (button, e, options) {
        var me = this;
        console.log("onButtonRemoverInstantaneo");

        var form = me.lookupReference('buidingdetail');
        var dv = form.down('fotografia').down('dataview');
        var sm = dv.getSelectionModel();
        var records = sm.getSelection();

        console.log(records);

        var vm = me.getViewModel();
        var fotografiasStore = vm.getStore('fotografia');
        fotografiasStore.remove(records);

    },

    onSaveClick: function (button) {
        console.log('Vai gravar...');
        var me = this;
        var vm = me.getView().getViewModel();

        var personaldata = this.lookupReference('buidingdetail');
        var params = personaldata.getForm().getValues();
        var paramsdirty = personaldata.getForm().getValues(false, true, false, false);
        console.log(paramsdirty);

        if (Object.getOwnPropertyNames(paramsdirty).length > 0) {
            Server.Urbanismo.Urbanismo.updateEdificio(paramsdirty, function (result, event) {
                if (result) {
                    if (result.success) {
                        // recrio a cópia dos dados do utilizador no lado do cliente, com as alterações efetuadas
                        // não preciso de fazer isto quando mudo a password
                        // não sei se preciso de fazer isto quando mudo a fotografia!
                        //GeoPublic.LoggedInUser = Ext.create('GeoPublic.model.Utilizador', result.data[0]);
                        Ext.Msg.alert('Successo', 'As alterações foram gravadas com sucesso.');

                        for (var key in paramsdirty) {
                            vm.set('current.user.' + key, paramsdirty[key]);
                            console.log("vm.set('current.user.'" + key + "', " + paramsdirty[key] + ')');
                        }

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
