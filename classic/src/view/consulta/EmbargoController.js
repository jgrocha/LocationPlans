Ext.define('Admin.view.consulta.EmbargoController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.embargo',

    init: function () {
        var me = this,
            store = me.getViewModel().getStore('embargo');
        store.on('load', function (s) {
            console.log('store embargo loaded: ' + s.count() + ' registos lidos');
            console.log();
        });

        store.proxy.addListener("exception", function (proxy, response, operation, eOpts) {
            console.log(response);
            var title = 'Error', body = 'Error reading store';
            if (response.message.text)
                title = response.message.text;
            if (response.message.detail)
                body = response.message.detail;
            Ext.Msg.show({
                title: title,
                msg: body,
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            });
        }, this);

        me.callParent(arguments);
    }

});