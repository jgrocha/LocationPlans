Ext.define('Admin.view.maps.Ogre', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ogre',

    requires: [
        'Ext.form.action.DirectLoad',
        'Ext.form.action.DirectSubmit'
    ],

    onEnviar: function (item, e, eOpts) {
        console.log('onEnviar');
        var me = this;
        var view = me.getView();
        var form = me.lookupReference('ogreform');

        form.submit({
            waitMsg: 'Uploading your data...',

            success: function (fp, o) {
                console.log(o.result.data);
                me.fireEvent('uploadSuccessful', o.result.data);
                view.close();
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

    onCancelar: function (item, e, eOpts) {
        console.log('onCancelar');
        var me = this;
        var view = me.getView();
        view.close();
    }/*,

     posOgre: function () {
     console.log('posOgre');
     console.log(arguments);
     },

     onButtonClickEnvia: function (button, e, options) {
     var me = this;
     var form = this.getFormulario().getForm();
     console.log(form);
     if (form.isValid()) {
     console.log('Form válido. Vai submeter.');
     form.submit({
     waitMsg: 'A carregar a shapefile ...',
     success: function (form, action) {
     console.log('success');
     console.log(action.result);
     // action.result.data is a "FeatureCollection"
     me.fireEvent('uploadSuccessful', action.result.data);
     button.up('ogre').close();
     },
     failure: function (form, action) {
     console.log('failure');
     // console.log(Ext.JSON.decode(response) );
     console.log(action );
     }
     }
     );
     } else {
     Ext.MessageBox.show({
     title: 'Erro',
     msg: 'O formulário não está corretamente preenchido.',
     icon: Ext.MessageBox.ERROR,
     buttons: Ext.Msg.OK
     });
     }
     },

     onButtonClickCancela: function (button, e, options) {
     button.up('ogre').close();
     }*/
});