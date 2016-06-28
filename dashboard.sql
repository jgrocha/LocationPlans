--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.3
-- Dumped by pg_dump version 9.5.3

-- Started on 2016-06-28 13:59:22 WEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 8 (class 2615 OID 23716)
-- Name: activenglabs; Type: SCHEMA; Schema: -; Owner: geobox
--

CREATE SCHEMA activenglabs;


ALTER SCHEMA activenglabs OWNER TO geobox;

--
-- TOC entry 12 (class 2615 OID 51437)
-- Name: edificios; Type: SCHEMA; Schema: -; Owner: geobox
--

CREATE SCHEMA edificios;


ALTER SCHEMA edificios OWNER TO geobox;

--
-- TOC entry 9 (class 2615 OID 23718)
-- Name: plantas; Type: SCHEMA; Schema: -; Owner: geobox
--

CREATE SCHEMA plantas;


ALTER SCHEMA plantas OWNER TO geobox;

--
-- TOC entry 10 (class 2615 OID 23719)
-- Name: users; Type: SCHEMA; Schema: -; Owner: geobox
--

CREATE SCHEMA users;


ALTER SCHEMA users OWNER TO geobox;

--
-- TOC entry 1 (class 3079 OID 12397)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3669 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 2 (class 3079 OID 22227)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 3670 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


SET search_path = edificios, pg_catalog;

--
-- TOC entry 1355 (class 1255 OID 51513)
-- Name: countimages(); Type: FUNCTION; Schema: edificios; Owner: geobox
--

CREATE FUNCTION countimages() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

    IF TG_OP != 'DELETE' THEN
	UPDATE edificios.edificado_vti2 e
	set fotografias = (
		select count(*) from edificios.fotografia f
		where f.id_edifica = e.id_edifica)
	WHERE e.id_edifica = NEW.id_edifica;
	RETURN NEW;
    END IF;
    IF TG_OP != 'INSERT' THEN
	UPDATE edificios.edificado_vti2 e
	set fotografias = (
		select count(*) from edificios.fotografia f
		where f.id_edifica = e.id_edifica)
	WHERE e.id_edifica = OLD.id_edifica;
	RETURN OLD;
    END IF;

    

END;
$$;


ALTER FUNCTION edificios.countimages() OWNER TO geobox;

SET search_path = public, pg_catalog;

--
-- TOC entry 1356 (class 1255 OID 51512)
-- Name: countimages(); Type: FUNCTION; Schema: public; Owner: geobox
--

CREATE FUNCTION countimages() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	UPDATE edificios.edificado_vti2 e
	set fotografias = (
		select count(*) from edificios.fotografia f
		where f.id_edifica = e.id_difica)
	WHERE e.id_edifica = NEW.id_edifica;
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.countimages() OWNER TO geobox;

--
-- TOC entry 1353 (class 1255 OID 23720)
-- Name: randompointsinpolygon(geometry, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION randompointsinpolygon(geom geometry, num_points integer) RETURNS SETOF geometry
    LANGUAGE plpgsql
    AS $$DECLARE
  target_proportion numeric;
  n_ret integer := 0;
  loops integer := 0;
  x_min float8;
  y_min float8;
  x_max float8;
  y_max float8;
  srid integer;
  rpoint geometry;
BEGIN
  -- Get envelope and SRID of source polygon
  SELECT ST_XMin(geom), ST_YMin(geom), ST_XMax(geom), ST_YMax(geom), ST_SRID(geom)
    INTO x_min, y_min, x_max, y_max, srid;
  -- Get the area proportion of envelope size to determine if a
  -- result can be returned in a reasonable amount of time
  SELECT ST_Area(geom)/ST_Area(ST_Envelope(geom)) INTO target_proportion;
  RAISE DEBUG 'geom: SRID %, NumGeometries %, NPoints %, area proportion within envelope %',
                srid, ST_NumGeometries(geom), ST_NPoints(geom),
                round(100.0*target_proportion, 2) || '%';
  IF target_proportion < 0.0001 THEN
    RAISE EXCEPTION 'Target area proportion of geometry is too low (%)', 
                    100.0*target_proportion || '%';
  END IF;
  RAISE DEBUG 'bounds: % % % %', x_min, y_min, x_max, y_max;
  
  WHILE n_ret < num_points LOOP
    loops := loops + 1;
    SELECT ST_SetSRID(ST_MakePoint(random()*(x_max - x_min) + x_min,
                                   random()*(y_max - y_min) + y_min),
                      srid) INTO rpoint;
    IF ST_Contains(geom, rpoint) THEN
      n_ret := n_ret + 1;
      RETURN NEXT rpoint;
    END IF;
  END LOOP;
  RAISE DEBUG 'determined in % loops (% efficiency)', loops, round(100.0*num_points/loops, 2) || '%';
END$$;


ALTER FUNCTION public.randompointsinpolygon(geom geometry, num_points integer) OWNER TO postgres;

SET search_path = users, pg_catalog;

--
-- TOC entry 1354 (class 1255 OID 23721)
-- Name: isleaf(); Type: FUNCTION; Schema: users; Owner: geobox
--

CREATE FUNCTION isleaf() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        IF NEW.leaf IS NULL THEN
		NEW.leaf := NOT EXISTS (select * from users.menu inm where idparent = NEW.id);
        END IF;
        -- fazer um update ao pai para ser calculado...
        IF NEW.idparent IS NOT NULL THEN
		UPDATE users.menu SET leaf = false where id = NEW.idparent;
        END IF;
        RETURN NEW;
    END;
$$;


ALTER FUNCTION users.isleaf() OWNER TO geobox;

SET search_path = activenglabs, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 225 (class 1259 OID 51391)
-- Name: alarm; Type: TABLE; Schema: activenglabs; Owner: geobox
--

CREATE TABLE alarm (
    id integer NOT NULL,
    sensorid integer NOT NULL,
    address character varying(40) NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    value double precision NOT NULL,
    within double precision NOT NULL,
    compare integer NOT NULL,
    sound integer,
    email integer,
    sms integer,
    active integer DEFAULT 1 NOT NULL
);


ALTER TABLE alarm OWNER TO geobox;

--
-- TOC entry 224 (class 1259 OID 51389)
-- Name: alarm_id_seq; Type: SEQUENCE; Schema: activenglabs; Owner: geobox
--

CREATE SEQUENCE alarm_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE alarm_id_seq OWNER TO geobox;

--
-- TOC entry 3672 (class 0 OID 0)
-- Dependencies: 224
-- Name: alarm_id_seq; Type: SEQUENCE OWNED BY; Schema: activenglabs; Owner: geobox
--

ALTER SEQUENCE alarm_id_seq OWNED BY alarm.id;


--
-- TOC entry 201 (class 1259 OID 23722)
-- Name: calibration; Type: TABLE; Schema: activenglabs; Owner: geobox
--

CREATE TABLE calibration (
    id integer NOT NULL,
    sensorid integer NOT NULL,
    address character varying(40) NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    cal_a_old double precision NOT NULL,
    cal_b_old double precision NOT NULL,
    cal_a_new double precision NOT NULL,
    cal_b_new double precision NOT NULL,
    ref_value_high double precision NOT NULL,
    ref_value_low double precision NOT NULL,
    read_value_high double precision NOT NULL,
    read_value_low double precision NOT NULL
);


ALTER TABLE calibration OWNER TO geobox;

--
-- TOC entry 202 (class 1259 OID 23726)
-- Name: calibration_id_seq; Type: SEQUENCE; Schema: activenglabs; Owner: geobox
--

CREATE SEQUENCE calibration_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE calibration_id_seq OWNER TO geobox;

--
-- TOC entry 3673 (class 0 OID 0)
-- Dependencies: 202
-- Name: calibration_id_seq; Type: SEQUENCE OWNED BY; Schema: activenglabs; Owner: geobox
--

ALTER SEQUENCE calibration_id_seq OWNED BY calibration.id;


--
-- TOC entry 203 (class 1259 OID 23728)
-- Name: sensor; Type: TABLE; Schema: activenglabs; Owner: geobox
--

CREATE TABLE sensor (
    sensorid integer NOT NULL,
    address character varying(40) NOT NULL,
    location character varying(80) NOT NULL,
    installdate timestamp with time zone DEFAULT now() NOT NULL,
    sensortype character varying(40) NOT NULL,
    metric integer DEFAULT 1 NOT NULL,
    calibrated integer DEFAULT 0 NOT NULL,
    quantity character(1) DEFAULT 'T'::bpchar NOT NULL,
    decimalplaces integer DEFAULT 3 NOT NULL,
    cal_a double precision DEFAULT 0 NOT NULL,
    cal_b double precision DEFAULT 1 NOT NULL,
    read_interval integer DEFAULT 2000 NOT NULL,
    record_sample integer DEFAULT 1 NOT NULL,
    id integer NOT NULL
);


ALTER TABLE sensor OWNER TO geobox;

--
-- TOC entry 204 (class 1259 OID 23740)
-- Name: sensor_id_seq; Type: SEQUENCE; Schema: activenglabs; Owner: geobox
--

CREATE SEQUENCE sensor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sensor_id_seq OWNER TO geobox;

--
-- TOC entry 3674 (class 0 OID 0)
-- Dependencies: 204
-- Name: sensor_id_seq; Type: SEQUENCE OWNED BY; Schema: activenglabs; Owner: geobox
--

ALTER SEQUENCE sensor_id_seq OWNED BY sensor.id;


--
-- TOC entry 205 (class 1259 OID 23742)
-- Name: temperature; Type: TABLE; Schema: activenglabs; Owner: geobox
--

CREATE TABLE temperature (
    id integer NOT NULL,
    sensorid integer NOT NULL,
    address character varying(40) NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    value double precision NOT NULL,
    metric integer DEFAULT 1 NOT NULL,
    calibrated integer DEFAULT 0 NOT NULL
);


ALTER TABLE temperature OWNER TO geobox;

--
-- TOC entry 206 (class 1259 OID 23748)
-- Name: temperature_id_seq; Type: SEQUENCE; Schema: activenglabs; Owner: geobox
--

CREATE SEQUENCE temperature_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE temperature_id_seq OWNER TO geobox;

--
-- TOC entry 3675 (class 0 OID 0)
-- Dependencies: 206
-- Name: temperature_id_seq; Type: SEQUENCE OWNED BY; Schema: activenglabs; Owner: geobox
--

ALTER SEQUENCE temperature_id_seq OWNED BY temperature.id;


SET search_path = edificios, pg_catalog;

--
-- TOC entry 226 (class 1259 OID 51441)
-- Name: edificado_vti2_gid_seq; Type: SEQUENCE; Schema: edificios; Owner: geobox
--

CREATE SEQUENCE edificado_vti2_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE edificado_vti2_gid_seq OWNER TO geobox;

--
-- TOC entry 227 (class 1259 OID 51443)
-- Name: edificado_vti2; Type: TABLE; Schema: edificios; Owner: geobox
--

CREATE TABLE edificado_vti2 (
    gid integer DEFAULT nextval('edificado_vti2_gid_seq'::regclass) NOT NULL,
    the_geom public.geometry,
    id_edifica character varying(21),
    data_inser character varying(80),
    data_sub character varying(80),
    estado character varying(80),
    data_const character varying(80),
    data_renov character varying(80),
    refer_elev character varying(80),
    v_crsi character varying(80),
    valor_elev numeric,
    cota_p_a numeric,
    cota_solei numeric,
    ref_altura character varying(80),
    valor_altu numeric,
    altura_max numeric,
    nome character varying(80),
    tipo character varying(50),
    uso character varying(254),
    uso_corren character varying(100),
    percent numeric,
    num_fogos character varying(21),
    habitantes character varying(21),
    n_servicos character varying(21),
    n_comercio character varying(21),
    n_entradas character varying(21),
    n_fracoes character varying(21),
    n_pisos_ac character varying(21),
    n_pisos_ab character varying(21),
    n_proc character varying(10),
    n_alvara character varying(10),
    id_lev numeric,
    siou character varying(254),
    fonte_vect character varying(80),
    fonte_alfa character varying(80),
    fonte_var character varying(254),
    ref_extern character varying(80),
    r_ext_nome character varying(80),
    perimetro numeric,
    area numeric,
    obs text,
    u_insere character varying(254),
    d_insere character varying(254),
    u_actualiz character varying(254),
    d_actualiz character varying(254),
    fotografias smallint,
    CONSTRAINT enforce_dims_the_geom CHECK ((public.st_ndims(the_geom) = 2)),
    CONSTRAINT enforce_geotype_the_geom CHECK (((public.geometrytype(the_geom) = 'POLYGON'::text) OR (the_geom IS NULL))),
    CONSTRAINT enforce_srid_the_geom CHECK ((public.st_srid(the_geom) = 3763))
);


ALTER TABLE edificado_vti2 OWNER TO geobox;

--
-- TOC entry 228 (class 1259 OID 51479)
-- Name: fotografia; Type: TABLE; Schema: edificios; Owner: geobox
--

CREATE TABLE fotografia (
    id integer NOT NULL,
    id_edifica character varying(21) NOT NULL,
    pasta character varying(255),
    caminho character varying(255) NOT NULL,
    observacoes text,
    idutilizador integer NOT NULL,
    tamanho integer,
    largura integer,
    altura integer,
    inapropriada boolean DEFAULT false NOT NULL,
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone DEFAULT now(),
    apagado boolean DEFAULT false NOT NULL,
    name character varying(255)
);


ALTER TABLE fotografia OWNER TO geobox;

--
-- TOC entry 229 (class 1259 OID 51489)
-- Name: fotografia_id_seq; Type: SEQUENCE; Schema: edificios; Owner: geobox
--

CREATE SEQUENCE fotografia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE fotografia_id_seq OWNER TO geobox;

--
-- TOC entry 3678 (class 0 OID 0)
-- Dependencies: 229
-- Name: fotografia_id_seq; Type: SEQUENCE OWNED BY; Schema: edificios; Owner: geobox
--

ALTER SEQUENCE fotografia_id_seq OWNED BY fotografia.id;


SET search_path = plantas, pg_catalog;

--
-- TOC entry 207 (class 1259 OID 23784)
-- Name: pedido; Type: TABLE; Schema: plantas; Owner: geobox
--

CREATE TABLE pedido (
    gid integer NOT NULL,
    nome character varying(100),
    pretensao public.geometry,
    pdf character varying(250),
    tipo integer,
    obs character varying(250),
    datahora timestamp with time zone DEFAULT now(),
    utilizador character varying(100) NOT NULL,
    coord_x double precision,
    coord_y double precision,
    nif character varying(12),
    fs character(150),
    download_cod character varying,
    userid integer,
    CONSTRAINT enforce_dims_the_geom CHECK ((public.st_ndims(pretensao) = 2)),
    CONSTRAINT enforce_srid_the_geom CHECK ((public.st_srid(pretensao) = 3763))
);


ALTER TABLE pedido OWNER TO geobox;

--
-- TOC entry 208 (class 1259 OID 23793)
-- Name: pedidoold; Type: TABLE; Schema: plantas; Owner: geobox
--

CREATE TABLE pedidoold (
    gid integer NOT NULL,
    nome character varying(100),
    pretencao public.geometry,
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
    CONSTRAINT enforce_dims_pretencao CHECK ((public.st_ndims(pretencao) = 2)),
    CONSTRAINT enforce_srid_pedido CHECK ((public.st_srid(pretencao) = 27492))
);


ALTER TABLE pedidoold OWNER TO geobox;

--
-- TOC entry 209 (class 1259 OID 23802)
-- Name: pedido_gid_seq; Type: SEQUENCE; Schema: plantas; Owner: geobox
--

CREATE SEQUENCE pedido_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pedido_gid_seq OWNER TO geobox;

--
-- TOC entry 3679 (class 0 OID 0)
-- Dependencies: 209
-- Name: pedido_gid_seq; Type: SEQUENCE OWNED BY; Schema: plantas; Owner: geobox
--

ALTER SEQUENCE pedido_gid_seq OWNED BY pedidoold.gid;


--
-- TOC entry 210 (class 1259 OID 23804)
-- Name: pedido_gid_seq1; Type: SEQUENCE; Schema: plantas; Owner: geobox
--

CREATE SEQUENCE pedido_gid_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pedido_gid_seq1 OWNER TO geobox;

--
-- TOC entry 3680 (class 0 OID 0)
-- Dependencies: 210
-- Name: pedido_gid_seq1; Type: SEQUENCE OWNED BY; Schema: plantas; Owner: geobox
--

ALTER SEQUENCE pedido_gid_seq1 OWNED BY pedido.gid;


--
-- TOC entry 211 (class 1259 OID 23806)
-- Name: pedidodetail; Type: TABLE; Schema: plantas; Owner: geobox
--

CREATE TABLE pedidodetail (
    id integer NOT NULL,
    gid integer NOT NULL,
    userid integer,
    sessionid character varying(36),
    createdate timestamp with time zone DEFAULT now(),
    pretensao public.geometry,
    CONSTRAINT enforce_dims_the_geom CHECK ((public.st_ndims(pretensao) = 2)),
    CONSTRAINT enforce_srid_the_geom CHECK ((public.st_srid(pretensao) = 3763))
);


ALTER TABLE pedidodetail OWNER TO geobox;

--
-- TOC entry 212 (class 1259 OID 23815)
-- Name: pedidodetail_id_seq; Type: SEQUENCE; Schema: plantas; Owner: geobox
--

CREATE SEQUENCE pedidodetail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pedidodetail_id_seq OWNER TO geobox;

--
-- TOC entry 3681 (class 0 OID 0)
-- Dependencies: 212
-- Name: pedidodetail_id_seq; Type: SEQUENCE OWNED BY; Schema: plantas; Owner: geobox
--

ALTER SEQUENCE pedidodetail_id_seq OWNED BY pedidodetail.id;


SET search_path = users, pg_catalog;

--
-- TOC entry 213 (class 1259 OID 24018)
-- Name: grupo; Type: TABLE; Schema: users; Owner: geobox
--

CREATE TABLE grupo (
    id integer NOT NULL,
    nome character varying(45) NOT NULL,
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone,
    idutilizador integer,
    omissao boolean DEFAULT false NOT NULL
);


ALTER TABLE grupo OWNER TO geobox;

--
-- TOC entry 214 (class 1259 OID 24023)
-- Name: grupo_id_seq; Type: SEQUENCE; Schema: users; Owner: geobox
--

CREATE SEQUENCE grupo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE grupo_id_seq OWNER TO geobox;

--
-- TOC entry 3682 (class 0 OID 0)
-- Dependencies: 214
-- Name: grupo_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: geobox
--

ALTER SEQUENCE grupo_id_seq OWNED BY grupo.id;


--
-- TOC entry 215 (class 1259 OID 24025)
-- Name: layer; Type: TABLE; Schema: users; Owner: geobox
--

CREATE TABLE layer (
    id integer NOT NULL,
    ord bigint,
    title character varying(120),
    layer character varying(76),
    layergroup character varying(120),
    url character varying(512),
    service character varying(48),
    srid bigint,
    style character varying(255),
    qtip character varying(255),
    baselayer boolean DEFAULT false,
    singletile boolean,
    active boolean,
    visible boolean,
    attribution character varying(255),
    notes character varying(255),
    create_date timestamp with time zone DEFAULT now() NOT NULL,
    modify_date timestamp with time zone DEFAULT now() NOT NULL,
    userid integer,
    viewid integer,
    opacity real,
    legendurl character varying(512),
    getfeatureinfo boolean DEFAULT true NOT NULL,
    gficolumns character varying(2048)
);


ALTER TABLE layer OWNER TO geobox;

--
-- TOC entry 216 (class 1259 OID 24035)
-- Name: layer_id_seq; Type: SEQUENCE; Schema: users; Owner: geobox
--

CREATE SEQUENCE layer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE layer_id_seq OWNER TO geobox;

--
-- TOC entry 3683 (class 0 OID 0)
-- Dependencies: 216
-- Name: layer_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: geobox
--

ALTER SEQUENCE layer_id_seq OWNED BY layer.id;


--
-- TOC entry 217 (class 1259 OID 24037)
-- Name: menu; Type: TABLE; Schema: users; Owner: geobox
--

CREATE TABLE menu (
    id integer NOT NULL,
    text character varying(45) NOT NULL,
    "iconCls" character varying(45),
    idparent integer,
    extjsview character varying(45),
    "routeId" character varying(45)
);


ALTER TABLE menu OWNER TO geobox;

--
-- TOC entry 218 (class 1259 OID 24040)
-- Name: menu_id_seq; Type: SEQUENCE; Schema: users; Owner: geobox
--

CREATE SEQUENCE menu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE menu_id_seq OWNER TO geobox;

--
-- TOC entry 3684 (class 0 OID 0)
-- Dependencies: 218
-- Name: menu_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: geobox
--

ALTER SEQUENCE menu_id_seq OWNED BY menu.id;


--
-- TOC entry 219 (class 1259 OID 24042)
-- Name: permissao; Type: TABLE; Schema: users; Owner: geobox
--

CREATE TABLE permissao (
    idmenu integer NOT NULL,
    idgrupo integer NOT NULL
);


ALTER TABLE permissao OWNER TO geobox;

--
-- TOC entry 220 (class 1259 OID 24045)
-- Name: sessao; Type: TABLE; Schema: users; Owner: geobox
--

CREATE TABLE sessao (
    id integer NOT NULL,
    userid integer NOT NULL,
    sessionid character varying(36),
    datalogin timestamp with time zone DEFAULT now(),
    datalogout timestamp with time zone,
    ativo boolean DEFAULT true,
    ip character varying(45),
    hostname character varying(45),
    dataultimaatividade timestamp with time zone DEFAULT now(),
    browser character varying(120),
    reaproveitada integer DEFAULT 0,
    socialid integer
);


ALTER TABLE sessao OWNER TO geobox;

--
-- TOC entry 221 (class 1259 OID 24052)
-- Name: sessao_id_seq; Type: SEQUENCE; Schema: users; Owner: geobox
--

CREATE SEQUENCE sessao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sessao_id_seq OWNER TO geobox;

--
-- TOC entry 3685 (class 0 OID 0)
-- Dependencies: 221
-- Name: sessao_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: geobox
--

ALTER SEQUENCE sessao_id_seq OWNED BY sessao.id;


--
-- TOC entry 222 (class 1259 OID 24054)
-- Name: utilizador; Type: TABLE; Schema: users; Owner: geobox
--

CREATE TABLE utilizador (
    id integer NOT NULL,
    login character varying(20),
    password character varying(100),
    idgrupo integer,
    email character varying(100),
    fotografia character varying(1024),
    nome character varying(120) NOT NULL,
    morada character varying(80),
    localidade character varying(80),
    codpostal character varying(8),
    despostal character varying(80),
    nif character varying(9),
    nic character varying(9),
    masculino boolean,
    pessoacoletiva boolean,
    telemovel character varying(15),
    telefone character varying(15),
    observacoes text,
    dicofre character varying(6),
    ponto public.geometry(Point,3763),
    datacriacao timestamp with time zone DEFAULT now(),
    datamodificacao timestamp with time zone DEFAULT now(),
    ultimologin timestamp with time zone,
    ativo boolean DEFAULT true,
    emailconfirmacao boolean DEFAULT false,
    token character varying(64),
    preferencias text,
    CONSTRAINT enforce_dims_geometria CHECK ((public.st_ndims(ponto) = 2)),
    CONSTRAINT enforce_geotype_geometria CHECK (((public.geometrytype(ponto) = 'POINT'::text) OR (ponto IS NULL))),
    CONSTRAINT enforce_srid_geometria CHECK ((public.st_srid(ponto) = 3763))
);


ALTER TABLE utilizador OWNER TO geobox;

--
-- TOC entry 223 (class 1259 OID 24067)
-- Name: utilizador_id_seq; Type: SEQUENCE; Schema: users; Owner: geobox
--

CREATE SEQUENCE utilizador_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE utilizador_id_seq OWNER TO geobox;

--
-- TOC entry 3686 (class 0 OID 0)
-- Dependencies: 223
-- Name: utilizador_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: geobox
--

ALTER SEQUENCE utilizador_id_seq OWNED BY utilizador.id;


SET search_path = activenglabs, pg_catalog;

--
-- TOC entry 3480 (class 2604 OID 51394)
-- Name: id; Type: DEFAULT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY alarm ALTER COLUMN id SET DEFAULT nextval('alarm_id_seq'::regclass);


--
-- TOC entry 3431 (class 2604 OID 24069)
-- Name: id; Type: DEFAULT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY calibration ALTER COLUMN id SET DEFAULT nextval('calibration_id_seq'::regclass);


--
-- TOC entry 3441 (class 2604 OID 24070)
-- Name: id; Type: DEFAULT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY sensor ALTER COLUMN id SET DEFAULT nextval('sensor_id_seq'::regclass);


--
-- TOC entry 3445 (class 2604 OID 24071)
-- Name: id; Type: DEFAULT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY temperature ALTER COLUMN id SET DEFAULT nextval('temperature_id_seq'::regclass);


SET search_path = edificios, pg_catalog;

--
-- TOC entry 3491 (class 2604 OID 51491)
-- Name: id; Type: DEFAULT; Schema: edificios; Owner: geobox
--

ALTER TABLE ONLY fotografia ALTER COLUMN id SET DEFAULT nextval('fotografia_id_seq'::regclass);


SET search_path = plantas, pg_catalog;

--
-- TOC entry 3447 (class 2604 OID 24073)
-- Name: gid; Type: DEFAULT; Schema: plantas; Owner: geobox
--

ALTER TABLE ONLY pedido ALTER COLUMN gid SET DEFAULT nextval('pedido_gid_seq1'::regclass);


--
-- TOC entry 3455 (class 2604 OID 24074)
-- Name: id; Type: DEFAULT; Schema: plantas; Owner: geobox
--

ALTER TABLE ONLY pedidodetail ALTER COLUMN id SET DEFAULT nextval('pedidodetail_id_seq'::regclass);


--
-- TOC entry 3451 (class 2604 OID 24075)
-- Name: gid; Type: DEFAULT; Schema: plantas; Owner: geobox
--

ALTER TABLE ONLY pedidoold ALTER COLUMN gid SET DEFAULT nextval('pedido_gid_seq'::regclass);


SET search_path = users, pg_catalog;

--
-- TOC entry 3460 (class 2604 OID 24092)
-- Name: id; Type: DEFAULT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY grupo ALTER COLUMN id SET DEFAULT nextval('grupo_id_seq'::regclass);


--
-- TOC entry 3465 (class 2604 OID 24093)
-- Name: id; Type: DEFAULT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY layer ALTER COLUMN id SET DEFAULT nextval('layer_id_seq'::regclass);


--
-- TOC entry 3466 (class 2604 OID 24094)
-- Name: id; Type: DEFAULT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY menu ALTER COLUMN id SET DEFAULT nextval('menu_id_seq'::regclass);


--
-- TOC entry 3471 (class 2604 OID 24095)
-- Name: id; Type: DEFAULT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY sessao ALTER COLUMN id SET DEFAULT nextval('sessao_id_seq'::regclass);


--
-- TOC entry 3476 (class 2604 OID 24096)
-- Name: id; Type: DEFAULT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY utilizador ALTER COLUMN id SET DEFAULT nextval('utilizador_id_seq'::regclass);


SET search_path = activenglabs, pg_catalog;

--
-- TOC entry 3523 (class 2606 OID 51398)
-- Name: alarm_pkey; Type: CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY alarm
    ADD CONSTRAINT alarm_pkey PRIMARY KEY (id);


--
-- TOC entry 3493 (class 2606 OID 51155)
-- Name: calibration_pkey; Type: CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY calibration
    ADD CONSTRAINT calibration_pkey PRIMARY KEY (id);


--
-- TOC entry 3495 (class 2606 OID 51157)
-- Name: sensor_pkey; Type: CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY sensor
    ADD CONSTRAINT sensor_pkey PRIMARY KEY (id);


--
-- TOC entry 3497 (class 2606 OID 51159)
-- Name: sensorid_address_key; Type: CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY sensor
    ADD CONSTRAINT sensorid_address_key UNIQUE (sensorid, address);


--
-- TOC entry 3499 (class 2606 OID 51161)
-- Name: temperature_pkey; Type: CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY temperature
    ADD CONSTRAINT temperature_pkey PRIMARY KEY (id);


SET search_path = edificios, pg_catalog;

--
-- TOC entry 3525 (class 2606 OID 51473)
-- Name: edificado_vti2_pkey; Type: CONSTRAINT; Schema: edificios; Owner: geobox
--

ALTER TABLE ONLY edificado_vti2
    ADD CONSTRAINT edificado_vti2_pkey PRIMARY KEY (gid);


--
-- TOC entry 3530 (class 2606 OID 51493)
-- Name: fotografia_pk; Type: CONSTRAINT; Schema: edificios; Owner: geobox
--

ALTER TABLE ONLY fotografia
    ADD CONSTRAINT fotografia_pk PRIMARY KEY (id);


--
-- TOC entry 3527 (class 2606 OID 51475)
-- Name: id_unico; Type: CONSTRAINT; Schema: edificios; Owner: geobox
--

ALTER TABLE ONLY edificado_vti2
    ADD CONSTRAINT id_unico UNIQUE (id_edifica);


SET search_path = plantas, pg_catalog;

--
-- TOC entry 3503 (class 2606 OID 51173)
-- Name: pedido_pk; Type: CONSTRAINT; Schema: plantas; Owner: geobox
--

ALTER TABLE ONLY pedidoold
    ADD CONSTRAINT pedido_pk PRIMARY KEY (gid);


--
-- TOC entry 3501 (class 2606 OID 51175)
-- Name: plantas_pedido_pk; Type: CONSTRAINT; Schema: plantas; Owner: geobox
--

ALTER TABLE ONLY pedido
    ADD CONSTRAINT plantas_pedido_pk PRIMARY KEY (gid);


--
-- TOC entry 3505 (class 2606 OID 51177)
-- Name: plantas_pedidodetail_pk; Type: CONSTRAINT; Schema: plantas; Owner: geobox
--

ALTER TABLE ONLY pedidodetail
    ADD CONSTRAINT plantas_pedidodetail_pk PRIMARY KEY (id);


SET search_path = users, pg_catalog;

--
-- TOC entry 3507 (class 2606 OID 51221)
-- Name: grupo_pkey; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY grupo
    ADD CONSTRAINT grupo_pkey PRIMARY KEY (id);


--
-- TOC entry 3509 (class 2606 OID 51223)
-- Name: layer_pk; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY layer
    ADD CONSTRAINT layer_pk PRIMARY KEY (id);


--
-- TOC entry 3511 (class 2606 OID 51225)
-- Name: menu_pkey; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- TOC entry 3513 (class 2606 OID 51227)
-- Name: permissao_pk; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_pk PRIMARY KEY (idmenu, idgrupo);


--
-- TOC entry 3515 (class 2606 OID 51229)
-- Name: sessao_pkey; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY sessao
    ADD CONSTRAINT sessao_pkey PRIMARY KEY (id);


--
-- TOC entry 3519 (class 2606 OID 51231)
-- Name: utilizador_login_key; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_login_key UNIQUE (login);


--
-- TOC entry 3521 (class 2606 OID 51233)
-- Name: utilizador_pkey; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_pkey PRIMARY KEY (id);


SET search_path = edificios, pg_catalog;

--
-- TOC entry 3528 (class 1259 OID 51476)
-- Name: sidx_edificado_vti2_the_geom; Type: INDEX; Schema: edificios; Owner: geobox
--

CREATE INDEX sidx_edificado_vti2_the_geom ON edificado_vti2 USING gist (the_geom);


SET search_path = users, pg_catalog;

--
-- TOC entry 3516 (class 1259 OID 51253)
-- Name: sessao_sessionid_idx; Type: INDEX; Schema: users; Owner: geobox
--

CREATE INDEX sessao_sessionid_idx ON sessao USING btree (sessionid);


--
-- TOC entry 3517 (class 1259 OID 51254)
-- Name: sessao_userid_idx; Type: INDEX; Schema: users; Owner: geobox
--

CREATE INDEX sessao_userid_idx ON sessao USING btree (userid);


SET search_path = edificios, pg_catalog;

--
-- TOC entry 3540 (class 2620 OID 51514)
-- Name: contagem; Type: TRIGGER; Schema: edificios; Owner: geobox
--

CREATE TRIGGER contagem AFTER INSERT OR DELETE OR UPDATE ON fotografia FOR EACH ROW EXECUTE PROCEDURE countimages();


SET search_path = users, pg_catalog;

--
-- TOC entry 3539 (class 2620 OID 51255)
-- Name: fill_isleaf; Type: TRIGGER; Schema: users; Owner: geobox
--

CREATE TRIGGER fill_isleaf BEFORE INSERT OR DELETE OR UPDATE ON menu FOR EACH ROW EXECUTE PROCEDURE isleaf();

ALTER TABLE menu DISABLE TRIGGER fill_isleaf;


SET search_path = activenglabs, pg_catalog;

--
-- TOC entry 3536 (class 2606 OID 51399)
-- Name: alarm_sensor_fk; Type: FK CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY alarm
    ADD CONSTRAINT alarm_sensor_fk FOREIGN KEY (sensorid, address) REFERENCES sensor(sensorid, address) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3531 (class 2606 OID 51256)
-- Name: calibration_sensor_fk; Type: FK CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY calibration
    ADD CONSTRAINT calibration_sensor_fk FOREIGN KEY (sensorid, address) REFERENCES sensor(sensorid, address) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3532 (class 2606 OID 51261)
-- Name: temperature_sensor_fk; Type: FK CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY temperature
    ADD CONSTRAINT temperature_sensor_fk FOREIGN KEY (sensorid, address) REFERENCES sensor(sensorid, address) ON UPDATE CASCADE ON DELETE CASCADE;


SET search_path = edificios, pg_catalog;

--
-- TOC entry 3537 (class 2606 OID 51494)
-- Name: fotografia_edificado_fk; Type: FK CONSTRAINT; Schema: edificios; Owner: geobox
--

ALTER TABLE ONLY fotografia
    ADD CONSTRAINT fotografia_edificado_fk FOREIGN KEY (id_edifica) REFERENCES edificado_vti2(id_edifica);


--
-- TOC entry 3538 (class 2606 OID 51499)
-- Name: fotografia_utilizador_fk; Type: FK CONSTRAINT; Schema: edificios; Owner: geobox
--

ALTER TABLE ONLY fotografia
    ADD CONSTRAINT fotografia_utilizador_fk FOREIGN KEY (idutilizador) REFERENCES users.utilizador(id);


SET search_path = plantas, pg_catalog;

--
-- TOC entry 3533 (class 2606 OID 51266)
-- Name: plantas_pedido_fkey; Type: FK CONSTRAINT; Schema: plantas; Owner: geobox
--

ALTER TABLE ONLY pedidodetail
    ADD CONSTRAINT plantas_pedido_fkey FOREIGN KEY (gid) REFERENCES pedido(gid);


SET search_path = users, pg_catalog;

--
-- TOC entry 3534 (class 2606 OID 51276)
-- Name: permissao_idgrupo_fkey; Type: FK CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_idgrupo_fkey FOREIGN KEY (idgrupo) REFERENCES grupo(id);


--
-- TOC entry 3535 (class 2606 OID 51281)
-- Name: permissao_idmenu_fkey; Type: FK CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_idmenu_fkey FOREIGN KEY (idmenu) REFERENCES menu(id);


--
-- TOC entry 3668 (class 0 OID 0)
-- Dependencies: 11
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


SET search_path = activenglabs, pg_catalog;

--
-- TOC entry 3671 (class 0 OID 0)
-- Dependencies: 225
-- Name: alarm; Type: ACL; Schema: activenglabs; Owner: geobox
--

REVOKE ALL ON TABLE alarm FROM PUBLIC;
REVOKE ALL ON TABLE alarm FROM geobox;
GRANT ALL ON TABLE alarm TO geobox;
GRANT ALL ON TABLE alarm TO PUBLIC;


SET search_path = edificios, pg_catalog;

--
-- TOC entry 3676 (class 0 OID 0)
-- Dependencies: 227
-- Name: edificado_vti2; Type: ACL; Schema: edificios; Owner: geobox
--

REVOKE ALL ON TABLE edificado_vti2 FROM PUBLIC;
REVOKE ALL ON TABLE edificado_vti2 FROM geobox;
GRANT ALL ON TABLE edificado_vti2 TO geobox;
GRANT ALL ON TABLE edificado_vti2 TO PUBLIC;


--
-- TOC entry 3677 (class 0 OID 0)
-- Dependencies: 228
-- Name: fotografia; Type: ACL; Schema: edificios; Owner: geobox
--

REVOKE ALL ON TABLE fotografia FROM PUBLIC;
REVOKE ALL ON TABLE fotografia FROM geobox;
GRANT ALL ON TABLE fotografia TO geobox;
GRANT ALL ON TABLE fotografia TO PUBLIC;


--
-- TOC entry 3013 (class 826 OID 51287)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: geobox
--

ALTER DEFAULT PRIVILEGES FOR ROLE geobox REVOKE ALL ON TABLES  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE geobox REVOKE ALL ON TABLES  FROM geobox;
ALTER DEFAULT PRIVILEGES FOR ROLE geobox GRANT ALL ON TABLES  TO geobox;
ALTER DEFAULT PRIVILEGES FOR ROLE geobox GRANT ALL ON TABLES  TO PUBLIC;


-- Completed on 2016-06-28 13:59:23 WEST

--
-- PostgreSQL database dump complete
--

