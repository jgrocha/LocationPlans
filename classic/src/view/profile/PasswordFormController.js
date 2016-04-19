Ext.define('Admin.view.profile.PasswordFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.passwordform',

    init: function (view) {
        console.log('Admin.view.profile.PasswordFormController init...');
    },

    onSaveClick: function (button) {
        console.log('Vai gravar...');
        var me = this;
        var vm = me.getView().getViewModel();

        var passworddata = this.lookupReference('passworddata');
        var params = passworddata.getForm().getValues();

        if (params.newpassword && params.newpasswordrepeat && params.newpassword == params.newpasswordrepeat) {
            var sha1 = CryptoJS.SHA1(params.newpassword).toString();

            Server.DXLogin.update({
                password: sha1
            }, function (result, event) {
                if (result) {
                    if (result.success) {
                        Ext.Msg.alert('Successo', 'As alterações foram gravadas com êxito.');
                    } else {
                        Ext.Msg.alert('Problema', 'Ocorreu um problema ao gravar as alterações.');
                    }
                } else {
                    Ext.Msg.alert('Erro', 'Ocorreu um erro ao gravar as alterações.<br/>Tente mais tarde.');
                }
            });
        } else {
            Ext.Msg.alert('Erro', 'Certifique-se que escreveu as duas senhas exatamente da mesma forma.');
        }
    }

});
