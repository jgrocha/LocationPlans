Ext.define('Admin.view.profile.SocialController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.profilesocialpanel',

    requires: [
        'Ext.form.action.DirectLoad',
        'Ext.form.action.DirectSubmit'
    ],

    init: function (view) {
        console.log('Admin.view.profile.SocialController init...');
    },

    onButtonUpload: function (filefield, e, options) {
        var me = this;
        console.log("onButtonUpload");

        var vm = me.getViewModel();

        var form = me.lookupReference('photoform');

        form.submit({
            waitMsg: 'Uploading your photo...',

            success: function (fp, o) {
                console.log(o);
                //var big = me.lookupReference('imagecomponent160');
                //var small = me.lookupReference('imagecomponent32');
                //console.log(big);
                //// uploaded_images/profiles/32x32/31_5f66cde0f0ae3fdf99c9169f657a1834.png
                ////me.getImageUm().setSrc(o.result.name32);
                //big.setSrc(o.result.name160);
                //small.setSrc(o.result.name32);

                vm.set('current.user.fotografia', o.result.name32);

                //Ext.Msg.alert('Success'.translate(), 'Your photo has been uploaded'.translate());
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
    }

});
