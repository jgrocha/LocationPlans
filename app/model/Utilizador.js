Ext.define('Admin.model.Utilizador', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        persist: false
    }, {
        name: 'login',
        type: 'string',
        persist: false
    }, {
        name: 'idgrupo',
        type: 'int',
        persist: false
    }, {
        name: 'email',
        type: 'string',
        persist: false
    }, {
        name: 'fotografia',
        type: 'string',
        persist: false
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
        type: 'string',
        persist: false
    }, {
        name: 'morada',
        type: 'string',
        persist: false
    }, {
        name: 'localidade',
        type: 'string',
        persist: false
    }, {
        name: 'codpostal',
        type: 'string',
        persist: false
    }, {
        name: 'despostal',
        type: 'string',
        persist: false
    }, {
        name: 'nif',
        type: 'string',
        persist: false
    }, {
        name: 'nic',
        type: 'string',
        persist: false
    }, {
        name: 'masculino',
        type: 'auto', // 'boolean', // importante para não converter null para falso
        persist: false
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
        type: 'boolean',
        persist: false
    }, {
        name: 'telemovel',
        type: 'string',
        persist: false
    }, {
        name: 'telefone',
        type: 'string',
        persist: false
    }, {
        name: 'observacoes',
        type: 'string',
        persist: false
    }, {
        name: 'dicofre',
        type: 'string',
        persist: false
    }, {
        name: 'ponto',
        //type : 'any',
        persist: false
    }, {
        name: 'datacriacao',
        type: 'date'
    }, {
        name: 'datacriacaoiso',
        convert: function (value, record) {
            return record.get('datacriacao').toISOString();
        },
        depends: ['datacriacao']
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
            read: 'Server.DXSessao.readUtilizador'
            // update : 'ExtRemote.DXSessao.update',
            // destroy : 'ExtRemote.DXSessao.destroy'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        }
    }
});
