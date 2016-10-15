Ext.define('Admin.view.publicidade.Publicidade', {
    extend: 'Ext.container.Container',
    xtype: 'publicidade',

    controller: 'publicidade',
    viewModel: {
        type: 'publicidade'
    },

    layout: 'responsivecolumn',

    /*
    As tabelas da publicidade estão no esquema public, da BD sig@dolly
        Ligação publica@localhost:9432 → BD sig

    [Done] Tem que ser passar estas tabelas para um esquema de uma nova BD no servidor...
    E passar de 27492 → para 3763

FALTA FAZER RESTORE DESTE DUMP e depois passar as tabelas para um esquema publicidade

    pg_dump --host localhost --port 9432 --username "geobox" --no-password  --format custom --verbose --file "/home/jgr/.dropbox-personal/Dropbox/GeoAgueda/sig_publicidade_20161005.backup" --table "public.contribuinte" --table "public.local_contrib_temp" --table "public.local_requer_temp" --table "public.pub" --table "public.pub_tipo" --table "public.pubimagem" --table "public.pubtipo" "sig"

    A anterior aplicação está em geobox@sw, na pasta /var/www/publicidade

    Informação existente:
        contribuintes x requerimentos
    Gestão:
        publicidade levantada, publicidade x fotografia

    json_contrib.php → local_contrib → (...) FROM sigmagest09.contrib
    json_requer → requerimentos/processos → numero x tipo_publicidade x data_entrada x requerente x

    mapfish → 'publicidades' (tabela 'pub', epsg 27492) + fotografia ← featureStore: gid x num_processo x ordem x tipo x legal x
     legal: Sim | Não | Isento

    Elementos de publicidade (publicidade levantada) → casa com o requerimento

    Associar publicidade ao requerimento:
         publicidadeForm.getForm().findField('tipo').setValue(recRequer.data.tipo_publicidade);
         publicidadeForm.getForm().findField('num_proces').setValue(recRequer.data.numero);
         publicidadeForm.getForm().findField('ordem').setValue(recRequer.data.ordem);
         // os outros campos já estão no form...

    Fotografias: Json_fotografia.php

     $pasta = intval($gid/100) + 1;
     $caminho = 'inbox/publicidade/' . $pasta . '/' . $_FILES["imagem"]["name"];

     CREATE OR REPLACE FUNCTION existe_requer()
     RETURNS trigger AS
     $BODY$
     DECLARE contador INT;
     BEGIN
     SELECT count(*)INTO contador FROM local_requer WHERE
     numero = NEW.NUM_PROCES and tipo_publicidade = NEW.tipo and ordem = NEW.ordem;
     IF (contador > 0) THEN
     NEW.existe_requer = 1;
     ELSE
     NEW.existe_requer = 0;
     END IF;
     RETURN NEW;
     END;
     $BODY$

     CREATE OR REPLACE VIEW local_requer AS
     SELECT requerimento.numero,
     requerimento.tipo_publicidade,
     requerimento.ordem,
     requerimento.data_entrada,
     requerimento.requerente,
     requerimento.qualidade,
     requerimento.estado,
     requerimento.local,
     requerimento.observacoes
     FROM dblink('host=10.1.1.10 port=5433 dbname=ide user=geobox password=geobox'::text, 'select  NUMERO, TIPO_PUBLICIDADE, ORDEM, DATA_ENTRADA, REQUERENTE, QUALIDADE, ESTADO, LOCAL, OBSERVACOES from oracle.requer'::text) requerimento(numero character varying(10), tipo_publicidade character varying(12), ordem numeric, data_entrada date, requerente character varying(11), qualidade character varying(1), estado character varying(1), local character varying(100), observacoes character varying(255));

     CREATE OR REPLACE VIEW local_contrib AS
     SELECT contribuinte.numero,
     contribuinte.nome,
     contribuinte.morada,
     contribuinte.codigo_postal,
     contribuinte.local,
     contribuinte.localidade,
     contribuinte.telefone,
     contribuinte.tipo,
     contribuinte.municipe,
     contribuinte.bi,
     contribuinte.identificacao,
     contribuinte.data_nasc,
     contribuinte.cae,
     contribuinte.email,
     contribuinte.telemovel
     FROM dblink('host=10.1.1.10 port=5433 dbname=ide user=geobox password=geobox'::text, 'select  NUMERO, NOME, MORADA, CODIGO_POSTAL, LOCAL, LOCALIDADE, TELEFONE, TIPO, MUNICIPE, BI, IDENTIFICACAO, DATA_NASC,CAE, EMAIL, TELEMOVEL from oracle.contrib'::text) contribuinte(numero character varying(11), nome character varying(80), morada character varying(60), codigo_postal character varying(8), local character varying(25), localidade character varying(25), telefone character varying(30), tipo character varying(1), municipe character varying(1), bi numeric, identificacao character varying(1), data_nasc date, cae character varying(5), email character varying(50), telemovel numeric);

    // cria uma vista cruzada com requer e pub

     CREATE OR REPLACE VIEW view_requer AS
     SELECT r.numero,
     r.tipo_publicidade,
     r.ordem,
     r.data_entrada,
     r.requerente,
     r.qualidade,
     r.estado,
     r.local,
     r.observacoes,
     (((r.numero::text || '_'::text) || r.tipo_publicidade::text) || '_'::text) || r.ordem AS chave_requer,
     NOT p.the_geom IS NULL AS geo
     FROM local_requer r
     LEFT JOIN pub p ON p.chave::text = ((((r.numero::text || '_'::text) || r.tipo_publicidade::text) || '_'::text) || r.ordem);

     */
    items: [{
        xtype: 'fullmap-publicidade',
        geoExtViewId: 30,
        responsiveCls: 'big-100',
        title: 'Publicidade'
    }, {
        xtype: 'gridpublicidadelevantada',
        responsiveCls: 'big-40'
    }, {
        xtype: 'mupi', // inclui fotografia
        responsiveCls: 'big-60'
    }, {
        xtype: 'requer',
        responsiveCls: 'big-100'
    }]

});
