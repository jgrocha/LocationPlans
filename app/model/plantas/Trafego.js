Ext.define('Admin.model.plantas.Trafego', {
	extend : 'Ext.data.Model',
    fields: [{
        name: 'ano',
        type: 'int'
    }, {
        name: 'mes',
        type: 'int'
    }, {
        name: 'abrmes',
        type: 'string'
    }, {
        name: 'contador',
        type: 'int'
    }],
    proxy : {
        type : 'direct',
        api : {
            read : 'Server.Plantas.Pedidos.trafegoestatisticas'
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'message'
        }
    }
});

/*

 DROP TABLE plantas.pedido;

 CREATE TABLE plantas.pedido
 (
 gid serial NOT NULL,
 nome character varying(100),
 pretensao geometry,
 pdf character varying(250),
 tipo integer,
 obs character varying(250),
 datahora timestamp with time zone DEFAULT now(),
 utilizador character varying(24) NOT NULL,
 coord_x double precision,
 coord_y double precision,
 nif character varying(12),
 fs character(150),
 download_cod character varying,
 -- novo
 userid integer,
 CONSTRAINT plantas_pedido_pk PRIMARY KEY (gid),

 CONSTRAINT enforce_dims_the_geom CHECK (st_ndims(pretensao) = 2),
 -- CONSTRAINT enforce_geotype_the_geom CHECK (geometrytype(pretensao) = 'POLYGON'::text OR geometrytype(pretensao) = 'MULTIPOLYGON'::text OR pretensao IS NULL),
 -- CONSTRAINT enforce_is_valid CHECK (st_isvalid(pretensao)),
 CONSTRAINT enforce_srid_the_geom CHECK (st_srid(pretensao) = 3763)
 );

 -- import
 insert into plantas.pedido
 select gid,  nome,  ST_Transform(pretencao, 3763) as pretensao,  pdf,  tipo,  obs,  datahora,  utilizador,  coord_x,  coord_y,  nif,  fs,  download_cod
 from plantas.pedidoold

 -- contador
 SELECT setval('plantas.pedido_gid_seq1', (SELECT COALESCE(MAX(gid),0)+1 FROM plantas.pedido))

 -- Constrains...
 -- Não dá!
 ALTER TABLE plantas.pedido ADD CONSTRAINT enforce_is_valid CHECK (st_isvalid(pretensao));




 select ST_GeometryType(pretencao)
 from plantas.pedidoold
 where NOT st_isvalid(pretencao) -- ST_GeometryType(pretencao) != 'ST_MultiPolygon'
 LIMIT 10

 */