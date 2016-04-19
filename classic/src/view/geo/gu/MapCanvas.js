Ext.define("Admin.view.geo.gu.MapCanvas", {
    //extend: "Ext.panel.Panel",
    extend: "Admin.view.geo.MapCanvas",
    alias: 'widget.geo-mapcanvas-gu',

    requires: [
        "Admin.view.geo.gu.MapCanvasController"
    ],

    controller: "geo-mapcanvas-gu"

});
