Ext.define('Admin.view.urbanismo.FotografiaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fotografia',

    onSelectionChange: function(dv, nodes ) {
        var l = nodes.length,
            s = l !== 1 ? 's' : '';
        console.log('Simple DataView (' + l + ' item' + s + ' selected)');
    },
    
    onItemClick: function (dv, record, item, index, e, eOpts) {
        // console.log('itemclick');
        // console.log(arguments);

        var imagem = "uploaded_images/edificado/" + record.get('pasta') + "/" + record.get('caminho') ;
        var win = window.open(imagem, '_blank');
        win.focus();

    }

});
