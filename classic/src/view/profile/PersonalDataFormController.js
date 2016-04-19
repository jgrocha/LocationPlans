/**
 * @class Admin.view.forms.WizardFormController
 */
Ext.define('Admin.view.profile.PersonalDataFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.personaldataform',

    init: function (view) {
        console.log('Admin.view.profile.PersonalDataFormController init...');
        var me = this;
        var user = me.getView().getViewModel().get('current.user');
        console.log(user);
        var personaldata = me.lookupReference('personaldata');
        personaldata.getForm().setValues(user.data);

    },

    onSaveClick: function (button) {
        console.log('Vai gravar...');
        var me = this;
        var vm = me.getView().getViewModel();

        var personaldata = this.lookupReference('personaldata');
        var params = personaldata.getForm().getValues();
        var paramsdirty = personaldata.getForm().getValues(false, true, false, false);
        console.log(paramsdirty);

        if (Object.getOwnPropertyNames(paramsdirty).length > 0) {
            Server.DXLogin.update(paramsdirty, function (result, event) {
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
