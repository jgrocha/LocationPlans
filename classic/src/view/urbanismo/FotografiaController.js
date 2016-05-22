Ext.define('Admin.view.urbanismo.FotografiaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fotografia',

    onSelectionChange: function(dv, nodes ) {
        var l = nodes.length,
            s = l !== 1 ? 's' : '';
        console.log('Simple DataView (' + l + ' item' + s + ' selected)');
    },
    
    onItemClick: function (dv, record, item, index, e, eOpts) {
        var imagem;
        var filename = record.get('caminho');
        var patt = /pdf$/i;
        if (patt.test(filename)) {
            imagem = record.get('pasta') + "/doc/" + filename;
        } else {
            imagem = record.get('pasta') + "/original/" + filename;
        }
        var win = window.open(imagem, '_blank');
        win.focus();
    }

});
