Ext.define('Admin.view.authentication.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',

    //TODO: implement central Facebook OATH handling here

    onFaceBookLogin: function (button, e) {
        console.log('onFaceBookLogin');
        this.redirectTo("dashboard");
    },

    onLoginButton: function (button, e, eOpts) {
        var me = this; // ViewController
        console.log('onLoginButton');

        var formpanel = button.up('authdialog');
        var email = formpanel.getViewModel().get('userid');
        var pass = formpanel.getViewModel().get('password');
        var sha1 = CryptoJS.SHA1(pass).toString();
        var md5 = CryptoJS.MD5(pass).toString();
        var remember = formpanel.getViewModel().get('persist');

        Server.DXLogin.authenticate({
            email: email,
            password: sha1,
            passwordold: md5,
            remember: remember
        }, function (result, event) {
            if (result) {
                // event.type : "rpc"
                if (result.success) {
                    me.fireEvent('loginComSucesso', result.data[0]);
                    var viewModel = me.getViewModel();
                    // TODO: is this necessary?
                    viewModel.set('fullName', result.data[0].nome);
                    viewModel.set('email', result.data[0].email);
                } else {
                    Ext.Msg.alert('Error starting session'.translate(), 'Invalid user or password'.translate()); // Ext.encode(result)
                }
            } else {
                // event.type: "exception"
                Ext.Msg.alert('Problema na autenticação', 'Neste momento, não foi possível verificar o utilizador.<br/>Por favor tente mais tarde.');
            }
            me.redirectTo("dashboard");
        });
    },

    onLoginAsButton: function (button, e, eOpts) {
        this.redirectTo("authentication.login");
    },

    onNewAccount: function (button, e, eOpts) {
        this.redirectTo("authentication.register");
    },

    onSignupClick: function (button, e, options) {
        var me = this;
        //<debug>
        console.log('registo submit');
        //</debug>

        var formpanel = button.up('authdialog');
        var name = formpanel.getViewModel().get('fullName');
        var email = formpanel.getViewModel().get('email');
        var pass = formpanel.getViewModel().get('password');
        var sha1 = CryptoJS.SHA1(pass).toString();

        //if (formPanel.getForm().isValid())

        //<debug>
        console.log('Vai tentar com o registo com ' + email + ' e a password = ' + pass + ' codificada = ' + sha1);
        //</debug>
        Server.DXLogin.registration({
            email: email,
            name: name,
            password: sha1
        }, function (result, event) {
            if (result) {
                // event.type : "rpc"
                if (result.success) {
                    Ext.Msg.alert('Registration process initiated'.translate(), Ext.String.format("An email was sent to {0}.".translate(), email) + '<br/>' + 'Follow the instructions on the message.'.translate() + '<br/>' + 'You can login only after your email address has been verified.'.translate() );
                } else {
                    Ext.Msg.alert('Error creating a new account'.translate(), result.message);
                }
            } else {
                // event.type: "exception"
                Ext.Msg.alert('Error creating a new account'.translate(), 'It is not possible to create a new account at the moment.'.translate() + '<br/>' + 'Please try later.'.translate());
            }
            me.redirectTo("dashboard");
        });
    },

    onChangePasswordClick: function (button, e, eOpts) {
        var me = this;
        //<debug>
        console.log('onChangePasswordClick');
        //</debug>

        var formpanel = button.up('authdialog');
        var email = formpanel.getViewModel().get('current.passwordChangeEmail');
        var token = formpanel.getViewModel().get('current.token');
        var password = formpanel.getViewModel().get('password');
        var password2x = formpanel.getViewModel().get('password2x');

        console.log('email → ' + email);
        console.log('password → ' + password);
        console.log('password2x → ' + password2x);

        if (password && password2x && password == password2x) {
            var sha1 = CryptoJS.SHA1(password).toString();

            Server.DXLogin.updatePassword({
                email: email,
                password: sha1,
                token: token
            }, function (result, event) {
                if (result) {
                    if (result.success) {
                        // Ext.Msg.alert('Successo', 'As alterações foram gravadas com êxito.');
                        // call authenticate!

                        Server.DXLogin.authenticate({
                            email: email,
                            password: sha1
                        }, function (result, event) {
                            if (result) {
                                // event.type : "rpc"
                                if (result.success) {
                                    me.fireEvent('loginComSucesso', result.data[0]);
                                    var viewModel = me.getViewModel();
                                    // TODO: is this necessary?
                                    viewModel.set('fullName', result.data[0].nome);
                                    viewModel.set('email', result.data[0].email);
                                } else {
                                    Ext.Msg.alert('Error starting session'.translate(), 'Invalid user or password'.translate()); // Ext.encode(result)
                                }
                            } else {
                                // event.type: "exception"
                                Ext.Msg.alert('Authentication error'.translate(), Ext.String.format('It was not possible to check if the email {0} exists.'.translate(), email) + '<br/>' + 'Please try later.'.translate());
                            }
                            // me.redirectTo("dashboard");
                        });

                    } else {
                        Ext.Msg.alert('Error'.translate(), 'Error starting session on server.'.translate());
                    }
                } else {
                    Ext.Msg.alert('Error'.translate(), 'Error starting session on server.'.translate() + '<br/>' + 'Please try later.'.translate());
                }
            });
        } else {
            Ext.Msg.alert('Error'.translate(), 'Make sure both passwords are equal.'.translate());
        }

    },

    onResetClick: function (button, e, eOpts) {
        var me = this;
        //<debug>
        console.log('onResetClick');
        //</debug>

        var formpanel = button.up('authdialog');
        var email = formpanel.getViewModel().get('email');

        Server.DXLogin.reset({
            email: email
        }, function (result, event) {
            if (result) {
                // event.type : "rpc"
                if (result.success) {
                    Ext.Msg.alert('Reset Password'.translate(), Ext.String.format("An email was sent to {0}.".translate(), email) + '<br/>' + 'Follow the instructions on the message.'.translate());
                } else {
                    Ext.Msg.alert('Request discarded'.translate(), result.message);
                    //Ext.Msg.alert('Pedido sem efeito', 'O email ' + email + ' não corresponde a nenhum utilizador registado.');
                    //Ext.Msg.alert('Pedido sem efeito', 'Falhou o envio para o endereço ' + email + '.');
                }
            } else {
                // event.type: "exception"
                Ext.Msg.alert('Password reset error'.translate(), Ext.String.format('It was not possible to check if the email {0} exists.'.translate(), email) + '<br/>' + 'Please try later.'.translate());
            }
            me.redirectTo("dashboard");
        });

    }
});
