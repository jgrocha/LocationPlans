Ext.define('Admin.view.pages.FAQ', {
    extend: 'Ext.container.Container',
    xtype: 'faq',

    requires: [
        'Ext.panel.Panel',
        'Ext.plugin.Responsive',
        'Ext.button.Button',
        'Ext.layout.container.Accordion'
    ],

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    padding: 10,

    items: [{
        xtype: 'panel',
        cls: 'faq-left-sidebar shadow-panel',
        //margin: 10,
        header: false,
        ui: 'light',
        responsiveConfig: {
            'width < 1000': {
                width: 0,
                visible: false
            },
            'width >= 1000 && width < 1600': {
                width: 230,
                visible: true
            },
            'width >= 1600': {
                width: 300,
                visible: true
            }
        },

        items: [{
            xtype: 'panel',
            title: 'Welcome'.translate(),
            ui: 'light',
            cls: 'shadow-panel pages-faq-container',
            iconCls: 'x-fa fa-lightbulb-o',
            html: '',
            bodyPadding: 15,
            loader: {
                url: Configuration.helpbasefolder + 'en/welcome.html'.translate(),
                autoLoad: true
            }
        }, {
            xtype: 'panel',
            bodyPadding: 20,
            ui: 'light',
            cls: 'shadow-panel pages-faq-container',
            iconCls: 'x-fa fa-question',
            title: 'Need help?'.translate(),
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'box',
                    loader: {
                        url: Configuration.helpbasefolder + 'en/help.html'.translate(),
                        autoLoad: true
                    }
                } /*,
                 {
                 xtype: 'button',
                 ui: 'soft-blue',
                 margin: '20 20 20 20',
                 text: 'Contact Us'
                 }
                 */
            ]
        }/*, {
         xtype: 'panel',
         title: 'STORM Clouds',
         ui: 'light',
         cls: 'shadow-panel pages-faq-container',
         iconCls: 'x-fa fa-lightbulb-o',
         flex: 1,
         items: [
         {
         xtype: 'image',
         src: 'resources/images/storm.png',
         height: 144
         }
         ]
         }*/
        ],
        plugins: [{
            ptype: 'responsive'
        }]
    }, {
        xtype: 'panel',
        ui: 'light',
        //margin: 10,
        flex: 1,
        cls: 'pages-faq-container shadow-panel',

        iconCls: 'x-fa fa-question-circle',
        title: 'Frequented asked questions'.translate(),
        bodyPadding: 15,
        items: [
            /*                {
             xtype: 'panel',
             cls: 'FAQPanel',
             layout: 'accordion',
             title: 'Genéricas',
             height: 340,
             ui: 'light',
             items: [
             {
             xtype: 'panel',
             html: 'Não precisa de se registar e entrar com a sua conta para poder explorar as várias aplicações. Contudo, há funcionalidades específicas que carecem de autenticação.',
             title: 'Preciso de me registar?',
             iconCls: 'x-fa fa-caret-down'
             },
             {
             xtype: 'panel',
             html: 'Sim, vai poder usar a sua conta das principais redes sociais muito em breve.',
             title: 'Posso usar uma rede social?',
             iconCls: 'x-fa fa-caret-down'
             },
             {
             xtype: 'panel',
             html: 'Em breve.',
             title: 'Quando estão mais aplicações disponíveis?',
             iconCls: 'x-fa fa-caret-down'
             }
             ]
             },*/
            {
                xtype: 'panel',
                cls: 'FAQPanel',
                layout: 'accordion',
                title: 'Authentication'.translate(),
                height: 380,
                bodyPadding: 10,
                ui: 'light',
                items: [{
                    xtype: 'panel',
                    title: 'Do I need to register?'.translate(),
                    html: 'No need to register and enter your account to be able to explore the various applications. However, there are specific features that require authentication.'.translate(),
                    iconCls: 'x-fa fa-caret-down'
                }, {
                    xtype: 'panel',
                    title: 'Can I use a social login on Loacation Plans?'.translate(),
                    html: 'This login tool is not available.'.translate(),
                    iconCls: 'x-fa fa-caret-down'
                }, {
                    xtype: 'panel',
                    title: 'Can I use the same credentials, username and password, which used the previous version of the EPL?'.translate(),
                    html: 'A new registration is required, which is more simplified.'.translate(),
                    iconCls: 'x-fa fa-caret-down'
                }, {
                    xtype: 'panel',
                    title: 'How do I change my password?'.translate(),
                    html: 'Under the "Login" drop down menu, (it has your name after login), click on "Profile". On the "Change password" form, type the new password twice and save it.'.translate(),
                    iconCls: 'x-fa fa-caret-down'
                }, {
                    xtype: 'panel',
                    title: 'How do I reset my password?'.translate(),
                    html: 'On the login form, follow the link "Forgot Password?". Enter your email address. You will receive an email with a link to assign a new password.'.translate(),
                    iconCls: 'x-fa fa-caret-down'
                }]
            }/*,
             {
             xtype: 'panel',
             cls: 'FAQPanel',
             layout: 'accordion',
             title: 'Plantas de Localização',
             height: 300,
             bodyPadding: 10,
             ui: 'light',
             items: [
             {
             xtype: 'panel',
             html: 'As plantas de localização são impressas usando <b>apenas</b> a cartografia oficial do município, nas escalas 1:2000, 1:5000 e 1:10000.<br/>Sobre essa cartografia, deve desenhar as peças que achar convenientes.',
             title: 'Os ortofotomapas não aparecem na impressão',
             iconCls: 'x-fa fa-caret-down'
             },
             {
             xtype: 'panel',
             html: 'Pode desenhar pontos, linhas de polígonos, assim como círculos, retângulos e caixas.<br/>Depois de desenhar algo, pode selecionar o mesmo e editar os vértices. Para remover um vértice, depois de escolher o vértice, tem que premir a tecla shift.',
             title: 'Que geometrias posso desenhar?',
             iconCls: 'x-fa fa-caret-down'
             }
             ]
             }*/
        ]
    }
    ]
});
