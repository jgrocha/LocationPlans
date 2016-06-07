Ext.define('Admin.view.urbanismo.UrbanismoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.urbanismo',

    init: function () {
        var me = this;
        me.callParent(arguments);

    },

    onAfterRender: function () {
        // console.log('onAfterRender');
        var view = this.getView();
        var tree = view.down('fullmap').down('maptree');
        // Não dá. É muito cedo para fazer o collapse
        // tree.toggleCollapse();
        // console.log(tree);
    },

    onDismissClick: function (button, e, eOpts) {
        var me = this; // ViewController
        console.log('onDismissClick');

        var vm = me.getViewModel();
        var fn = vm.get('current.user.preferencias');
        var prefObj = {};
        // var fn = JSON.parse('{"urbanismo":{"hidehelp":false},"plantas":{"color":"red"},"sensor":{"unit":"metric","period":"day"}}');
        if (fn) {
            prefObj = JSON.parse(fn);
            prefObj["urbanismo"]["hidehelp"] = true;
        } else {
            prefObj["urbanismo"] = {
                "hidehelp": true
            }
        }
        vm.set('current.user.preferencias', JSON.stringify(prefObj));
    }

});