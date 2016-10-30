Ext.define('Admin.view.redeviaria.RedeViariaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.redeviaria',

    onShowView: function () {
        console.log('onShowView');
        // if new location plans were requested, update the statistics!
        // console.log('onShowView dashboard');
        var me = this;
        var trafego = me.getViewModel().getStore('trafego');
        // prevent the stange error: DashboardController.js?_dc=20160403201407:64 Uncaught TypeError: Cannot read property 'reload' of null
        if (trafego) {
            console.log('reload');
            trafego.reload();
        } else {
            console.log('NOT reload');
        }
    },

    init: function () {
        var me = this;
        me.callParent(arguments);
    }

});