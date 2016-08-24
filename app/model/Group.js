Ext.define('Admin.model.Group', {
    extend: 'Ext.data.Model',

/*  id int4 NOT NULL DEFAULT nextval('users.grupo_id_seq'::regclass),
    nome varchar(45) NOT NULL,
    datacriacao timestamptz NULL DEFAULT now(),
    datamodificacao timestamptz NULL,
    idutilizador int4 NULL,
    omissao bool NOT NULL DEFAULT false,*/

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'nome',
        type: 'string'
    }, {
        name: 'datacriacao',
        type: 'date'
    }, {
        name: 'datamodificacao',
        type: 'date'
    }, {
        name: 'omissao',
        type: 'boolean'
    }],
    proxy: {
        type: 'direct',
        api: {
            // create : 'ExtRemote.DXSessao.create',
            read: 'Server.Users.Group.read'
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
