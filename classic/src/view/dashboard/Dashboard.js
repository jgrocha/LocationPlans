Ext.define('Admin.view.dashboard.Dashboard', {
    extend: 'Ext.container.Container',

    requires: [
        'Ext.ux.layout.ResponsiveColumn'
    ],

    id: 'dashboard',

    controller: 'dashboard',
    viewModel: {
        type: 'dashboard'
    },

    layout: 'responsivecolumn',
    
    listeners: {
        show: 'onShowView',
        hide: 'onHideView'
    },

    /*
     select funcao_uso, count(*)
     from cartografia_de_base.edificado_vt_i
     group by funcao_uso
     order by 2 desc

     */

    // TODO
    // Tem que ser o controler a dizer que items são visíveis no dashboard
    // Só os items das aplicações/views visíveis por este anónimo/utilizador estarão disponíveis

    items: [ /*
        {
            xtype: 'dashboardnetworkpanel',

            // 60% width when viewport is big enough,
            // 100% when viewport is small
            responsiveCls: 'big-60 small-100'
        },
        {
            xtype: 'dashboardhddusagepanel',
            responsiveCls: 'big-20 small-50'
        },
        {
            xtype: 'dashboardearningspanel',
            responsiveCls: 'big-20 small-50'
        },
        {
            xtype: 'dashboardtopmoviepanel',
            responsiveCls: 'big-20 small-50'
        },
        {
            xtype: 'dashboardsalespanel',
            responsiveCls: 'big-20 small-50'
        },
        {
            xtype: 'dashboardweatherpanel',
            responsiveCls: 'big-40 small-100'
        },
        {
            xtype: 'dashboardtodospanel',
            responsiveCls: 'big-60 small-100'
        },
        {
            xtype: 'dashboardservicespanel',
            responsiveCls: 'big-40 small-100'
        }, */
        {
            xtype: 'dashboard_plantas_todas',
            // 60% width when viewport is big enough,
            // 100% when viewport is small
            responsiveCls: 'big-60 small-100'
        },
        {
            xtype: 'dashboard_plantas_mes',
            responsiveCls: 'big-40 small-100'
        },
        /*{
            xtype: 'dashboard_sensors',
            responsiveCls: 'big-40 small-100'
        }, */ {
            xtype: 'dashboard_funcao_panel',
            // 60% width when viewport is big enough,
            // 100% when viewport is small
            responsiveCls: 'big-60 small-100'
        },
        {
            xtype: 'dashboard_processo_tipo_panel',
            responsiveCls: 'big-40 small-100'
        }

    ]
});
