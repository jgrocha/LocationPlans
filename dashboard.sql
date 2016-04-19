--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.1
-- Dumped by pg_dump version 9.5.2

-- Started on 2016-04-12 17:05:27 WEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 9 (class 2615 OID 27628)
-- Name: activenglabs; Type: SCHEMA; Schema: -; Owner: geobox
--

CREATE SCHEMA activenglabs;


ALTER SCHEMA activenglabs OWNER TO geobox;

--
-- TOC entry 10 (class 2615 OID 27629)
-- Name: users; Type: SCHEMA; Schema: -; Owner: geobox
--

CREATE SCHEMA users;


ALTER SCHEMA users OWNER TO geobox;

SET search_path = users, pg_catalog;

--
-- TOC entry 1442 (class 1255 OID 29120)
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
-- TOC entry 202 (class 1259 OID 29121)
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
-- TOC entry 203 (class 1259 OID 29125)
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
-- TOC entry 3832 (class 0 OID 0)
-- Dependencies: 203
-- Name: calibration_id_seq; Type: SEQUENCE OWNED BY; Schema: activenglabs; Owner: geobox
--

ALTER SEQUENCE calibration_id_seq OWNED BY calibration.id;


--
-- TOC entry 204 (class 1259 OID 29127)
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
-- TOC entry 205 (class 1259 OID 29139)
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
-- TOC entry 3833 (class 0 OID 0)
-- Dependencies: 205
-- Name: sensor_id_seq; Type: SEQUENCE OWNED BY; Schema: activenglabs; Owner: geobox
--

ALTER SEQUENCE sensor_id_seq OWNED BY sensor.id;


--
-- TOC entry 206 (class 1259 OID 29141)
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
-- TOC entry 207 (class 1259 OID 29147)
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
-- TOC entry 3834 (class 0 OID 0)
-- Dependencies: 207
-- Name: temperature_id_seq; Type: SEQUENCE OWNED BY; Schema: activenglabs; Owner: geobox
--

ALTER SEQUENCE temperature_id_seq OWNED BY temperature.id;


SET search_path = users, pg_catalog;

--
-- TOC entry 248 (class 1259 OID 29334)
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
-- TOC entry 249 (class 1259 OID 29338)
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
-- TOC entry 3835 (class 0 OID 0)
-- Dependencies: 249
-- Name: grupo_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: geobox
--

ALTER SEQUENCE grupo_id_seq OWNED BY grupo.id;


--
-- TOC entry 250 (class 1259 OID 29340)
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
-- TOC entry 251 (class 1259 OID 29349)
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
-- TOC entry 3836 (class 0 OID 0)
-- Dependencies: 251
-- Name: layer_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: geobox
--

ALTER SEQUENCE layer_id_seq OWNED BY layer.id;


--
-- TOC entry 252 (class 1259 OID 29351)
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
-- TOC entry 253 (class 1259 OID 29354)
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
-- TOC entry 3837 (class 0 OID 0)
-- Dependencies: 253
-- Name: menu_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: geobox
--

ALTER SEQUENCE menu_id_seq OWNED BY menu.id;


--
-- TOC entry 254 (class 1259 OID 29356)
-- Name: permissao; Type: TABLE; Schema: users; Owner: geobox
--

CREATE TABLE permissao (
    idmenu integer NOT NULL,
    idgrupo integer NOT NULL
);


ALTER TABLE permissao OWNER TO geobox;

--
-- TOC entry 255 (class 1259 OID 29359)
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
-- TOC entry 256 (class 1259 OID 29366)
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
-- TOC entry 3838 (class 0 OID 0)
-- Dependencies: 256
-- Name: sessao_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: geobox
--

ALTER SEQUENCE sessao_id_seq OWNED BY sessao.id;


--
-- TOC entry 257 (class 1259 OID 29368)
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
    preferencias public.hstore,
    ativo boolean DEFAULT true,
    emailconfirmacao boolean DEFAULT false,
    token character varying(64),
    CONSTRAINT enforce_dims_geometria CHECK ((public.st_ndims(ponto) = 2)),
    CONSTRAINT enforce_geotype_geometria CHECK (((public.geometrytype(ponto) = 'POINT'::text) OR (ponto IS NULL))),
    CONSTRAINT enforce_srid_geometria CHECK ((public.st_srid(ponto) = 3763))
);


ALTER TABLE utilizador OWNER TO geobox;

--
-- TOC entry 258 (class 1259 OID 29381)
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
-- TOC entry 3839 (class 0 OID 0)
-- Dependencies: 258
-- Name: utilizador_id_seq; Type: SEQUENCE OWNED BY; Schema: users; Owner: geobox
--

ALTER SEQUENCE utilizador_id_seq OWNED BY utilizador.id;


SET search_path = activenglabs, pg_catalog;

--
-- TOC entry 3641 (class 2604 OID 29383)
-- Name: id; Type: DEFAULT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY calibration ALTER COLUMN id SET DEFAULT nextval('calibration_id_seq'::regclass);


--
-- TOC entry 3651 (class 2604 OID 29384)
-- Name: id; Type: DEFAULT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY sensor ALTER COLUMN id SET DEFAULT nextval('sensor_id_seq'::regclass);


--
-- TOC entry 3655 (class 2604 OID 29385)
-- Name: id; Type: DEFAULT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY temperature ALTER COLUMN id SET DEFAULT nextval('temperature_id_seq'::regclass);


SET search_path = users, pg_catalog;

--
-- TOC entry 3657 (class 2604 OID 29400)
-- Name: id; Type: DEFAULT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY grupo ALTER COLUMN id SET DEFAULT nextval('grupo_id_seq'::regclass);


--
-- TOC entry 3662 (class 2604 OID 29401)
-- Name: id; Type: DEFAULT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY layer ALTER COLUMN id SET DEFAULT nextval('layer_id_seq'::regclass);


--
-- TOC entry 3664 (class 2604 OID 29402)
-- Name: id; Type: DEFAULT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY menu ALTER COLUMN id SET DEFAULT nextval('menu_id_seq'::regclass);


--
-- TOC entry 3669 (class 2604 OID 29403)
-- Name: id; Type: DEFAULT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY sessao ALTER COLUMN id SET DEFAULT nextval('sessao_id_seq'::regclass);


--
-- TOC entry 3674 (class 2604 OID 29404)
-- Name: id; Type: DEFAULT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY utilizador ALTER COLUMN id SET DEFAULT nextval('utilizador_id_seq'::regclass);


SET search_path = activenglabs, pg_catalog;

--
-- TOC entry 3679 (class 2606 OID 29406)
-- Name: calibration_pkey; Type: CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY calibration
    ADD CONSTRAINT calibration_pkey PRIMARY KEY (id);


--
-- TOC entry 3681 (class 2606 OID 29408)
-- Name: sensor_pkey; Type: CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY sensor
    ADD CONSTRAINT sensor_pkey PRIMARY KEY (id);


--
-- TOC entry 3683 (class 2606 OID 29410)
-- Name: sensorid_address_key; Type: CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY sensor
    ADD CONSTRAINT sensorid_address_key UNIQUE (sensorid, address);


--
-- TOC entry 3685 (class 2606 OID 29412)
-- Name: temperature_pkey; Type: CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY temperature
    ADD CONSTRAINT temperature_pkey PRIMARY KEY (id);


SET search_path = users, pg_catalog;

--
-- TOC entry 3687 (class 2606 OID 29452)
-- Name: grupo_pkey; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY grupo
    ADD CONSTRAINT grupo_pkey PRIMARY KEY (id);


--
-- TOC entry 3689 (class 2606 OID 29454)
-- Name: layer_pk; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY layer
    ADD CONSTRAINT layer_pk PRIMARY KEY (id);


--
-- TOC entry 3691 (class 2606 OID 29456)
-- Name: menu_pkey; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- TOC entry 3693 (class 2606 OID 29458)
-- Name: permissao_pk; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_pk PRIMARY KEY (idmenu, idgrupo);


--
-- TOC entry 3695 (class 2606 OID 29460)
-- Name: sessao_pkey; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY sessao
    ADD CONSTRAINT sessao_pkey PRIMARY KEY (id);


--
-- TOC entry 3699 (class 2606 OID 29462)
-- Name: utilizador_login_key; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_login_key UNIQUE (login);


--
-- TOC entry 3701 (class 2606 OID 29464)
-- Name: utilizador_pkey; Type: CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY utilizador
    ADD CONSTRAINT utilizador_pkey PRIMARY KEY (id);


--
-- TOC entry 3696 (class 1259 OID 29483)
-- Name: sessao_sessionid_idx; Type: INDEX; Schema: users; Owner: geobox
--

CREATE INDEX sessao_sessionid_idx ON sessao USING btree (sessionid);


--
-- TOC entry 3697 (class 1259 OID 29484)
-- Name: sessao_userid_idx; Type: INDEX; Schema: users; Owner: geobox
--

CREATE INDEX sessao_userid_idx ON sessao USING btree (userid);


--
-- TOC entry 3706 (class 2620 OID 29485)
-- Name: fill_isleaf; Type: TRIGGER; Schema: users; Owner: geobox
--

CREATE TRIGGER fill_isleaf BEFORE INSERT OR DELETE OR UPDATE ON menu FOR EACH ROW EXECUTE PROCEDURE isleaf();

ALTER TABLE menu DISABLE TRIGGER fill_isleaf;


SET search_path = activenglabs, pg_catalog;

--
-- TOC entry 3702 (class 2606 OID 29486)
-- Name: calibration_sensor_fk; Type: FK CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY calibration
    ADD CONSTRAINT calibration_sensor_fk FOREIGN KEY (sensorid, address) REFERENCES sensor(sensorid, address) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3703 (class 2606 OID 29491)
-- Name: temperature_sensor_fk; Type: FK CONSTRAINT; Schema: activenglabs; Owner: geobox
--

ALTER TABLE ONLY temperature
    ADD CONSTRAINT temperature_sensor_fk FOREIGN KEY (sensorid, address) REFERENCES sensor(sensorid, address) ON UPDATE CASCADE ON DELETE CASCADE;


SET search_path = users, pg_catalog;

--
-- TOC entry 3704 (class 2606 OID 29501)
-- Name: permissao_idgrupo_fkey; Type: FK CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_idgrupo_fkey FOREIGN KEY (idgrupo) REFERENCES grupo(id);


--
-- TOC entry 3705 (class 2606 OID 29506)
-- Name: permissao_idmenu_fkey; Type: FK CONSTRAINT; Schema: users; Owner: geobox
--

ALTER TABLE ONLY permissao
    ADD CONSTRAINT permissao_idmenu_fkey FOREIGN KEY (idmenu) REFERENCES menu(id);


-- Completed on 2016-04-12 17:05:27 WEST

--
-- PostgreSQL database dump complete
--

