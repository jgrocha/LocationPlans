Ext.define('Admin.view.dashboard.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard',

    requires: [
        'Ext.util.TaskRunner'
    ],

    onRefreshToggle: function(tool, e, owner) {
        var me = this,
            store=this.getViewModel().getStore('dashboardfulllinechartstore'),
            items=Ext.Array.from(store && store.getData().items),
            num_items=items.length;

        if (tool.toggleValue){
            me.clearChartUpdates(owner);
        } else {
            if (num_items) {
                me.chartTaskRunner  = me.chartTaskRunner || Ext.create('Ext.util.TaskRunner');
                me.chartTaskRunner.start({
                    run : function () {
                        this.last_x += this.last_x - this.second_last_x;
                        var first = this.items[0].data;
                        this.store.removeAt(0);
                        this.store.add({xvalue: first.xvalue, y1value: first.y1value, y2value: first.y2value});
                        this.count++;
                    },
                    store : store,
                    count : 0,
                    items : items,
                    last_x : items[num_items -1].data.xvalue,
                    second_last_x : items[num_items -2].data.xvalue,
                    interval : 200
                });
            }
        }

        // change the toggle value
        tool.toggleValue = !tool.toggleValue;
    },

    clearChartUpdates : function() {
        this.chartTaskRunner = Ext.destroy(this.chartTaskRunner);
    },
    
    onDestroy: function () {
        this.clearChartUpdates();
        this.callParent(arguments);
    },
    
    onHideView: function () {
        // console.log('onHideView dashboard');
        this.clearChartUpdates();
    },

    onShowView: function () {
        // if new location plans were requested, update the statistics!
        // console.log('onShowView dashboard');
        var me = this,
            storeplantastodas = me.getViewModel().getStore('plantastodas'),
            storeplantasmes = me.getViewModel().getStore('plantasmes');
        storeplantastodas.reload();
        // prevent the stange error: DashboardController.js?_dc=20160403201407:64 Uncaught TypeError: Cannot read property 'reload' of null
        if (storeplantasmes)
            storeplantasmes.reload();
    }

});
