Ext.define('Admin.model.Utilizador', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'login',
        type: 'string',
        persist: false
    }, {
        name: 'idgrupo',
        type: 'int'
    }, {
        name: 'group',
        type: 'string',
        persist: false
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'fotografia',
        type: 'string'
    }, {
        name: 'fotografia160',
        convert: function (value, record) {
            var foto = record.get('fotografia');
            if (foto.length > 0)
                return foto.replace(/32x32/, '160x160');
            else {
                return 'resources/images/Man-Silhouette-Clip-Art-160.jpg';
            }
        },
        depends: ['fotografia']
    }, {
        name: 'fotografia32',
        convert: function (value, record) {
            var foto = record.get('fotografia');
            if (foto.length > 0)
                return foto;
            else {
                return 'resources/images/Man-Silhouette-Clip-Art-32.jpg';
            }
        },
        depends: ['fotografia']
    }, {
        name: 'nome',
        type: 'string'
    }, {
        name: 'morada',
        type: 'string'
    }, {
        name: 'localidade',
        type: 'string'
    }, {
        name: 'codpostal',
        type: 'string'
    }, {
        name: 'despostal',
        type: 'string'
    }, {
        name: 'nif',
        type: 'string'
    }, {
        name: 'nic',
        type: 'string'
    }, {
        name: 'masculino',
        type: 'auto' // 'boolean', // importante para não converter null para falso
    }, {
        name: 'sexo',
        convert: function (value, record) {
            var masculino = record.get('masculino');
            if (masculino)
                return 'male';
            else {
                if (masculino == false)
                    return 'female';
                else
                    return null;
            }
        },
        depends: ['masculino']
    }, {
        name: 'pessoacoletiva',
        type: 'boolean'
    }, {
        name: 'telemovel',
        type: 'string'
    }, {
        name: 'telefone',
        type: 'string'
    }, {
        name: 'observacoes',
        type: 'string'
    }, {
        name: 'dicofre',
        type: 'string'
    }, {
        name: 'ponto'
        //type : 'any',
    }, {
        name: 'datacriacao',
        type: 'date',
        persist: false
    }, {
        name: 'datacriacaoiso',
        convert: function (value, record) {
            return record.get('datacriacao').toISOString();
        },
        depends: ['datacriacao'],
        persist: false
    }, {
        name: 'datamodificacao',
        type: 'date'
    }, {
        name: 'ultimologin',
        type: 'date'
    }, {
        name: 'preferencias',
        type: 'string'

        /*        //type : 'any',
                persist: false*/
    }, {
        name: 'ativo',
        type: 'boolean'
    }, {
        name: 'latitude',
        type: 'int',
        useNull: true
    }, {
        // http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.data.Field-cfg-useNull
        name: 'longitude',
        type: 'int',
        useNull: true
    }],
    proxy: {
        type: 'direct',
        api: {
            // create : 'ExtRemote.DXSessao.create',
            read: 'Server.Users.User.read',
            update : 'Server.Users.User.update',
            destroy : 'Server.Users.User.destroy'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        }
    }
});
