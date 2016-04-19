--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.1
-- Dumped by pg_dump version 9.5.2

-- Started on 2016-04-12 17:10:52 WEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = users, pg_catalog;

--
-- TOC entry 3765 (class 0 OID 29334)
-- Dependencies: 248
-- Data for Name: grupo; Type: TABLE DATA; Schema: users; Owner: geobox
--

COPY grupo (id, nome, datacriacao, datamodificacao, idutilizador, omissao) FROM stdin;
2	Staff	2014-01-03 01:01:31.906002+00	\N	\N	f
1	Administrator	2014-01-03 01:01:31.902406+00	\N	\N	f
0	Anonymous	2016-01-25 17:13:37.337348+00	\N	\N	f
3	Citizen	2014-01-03 01:01:31+00	\N	\N	t
\.


--
-- TOC entry 3774 (class 0 OID 0)
-- Dependencies: 249
-- Name: grupo_id_seq; Type: SEQUENCE SET; Schema: users; Owner: geobox
--

SELECT pg_catalog.setval('grupo_id_seq', 5, true);


--
-- TOC entry 3767 (class 0 OID 29351)
-- Dependencies: 252
-- Data for Name: menu; Type: TABLE DATA; Schema: users; Owner: geobox
--

COPY menu (id, text, "iconCls", idparent, extjsview, "routeId") FROM stdin;
27	Search results	x-fa fa-search	\N	search.Results	search
37	Widgets	x-fa fa-flask	\N	widgets.Widgets	widgets
38	Forms	x-fa fa-edit	\N	forms.Wizards	forms
39	Charts	x-fa fa-pie-chart	\N	charts.Charts	charts
30	Blank Page	x-fa fa-file-o	29	pages.BlankPage	pages.blank
31	404 Error	x-fa fa-exclamation-triangle	29	pages.Error404Window	pages.404
32	500 Error	x-fa fa-times-circle	29	pages.Error500Window	pages.500
33	Lock Screen	x-fa fa-lock	29	authentication.LockScreen	authentication.lockscreen
34	Login	x-fa fa-check	29	authentication.Login	authentication.login
35	Register	x-fa fa-pencil-square-o	29	authentication.Register	authentication.register
40	Sensors Básico	x-fa fa-line-chart	\N	sync.SyncReadOnly	basic
42	Medidata	x-fa fa-database	\N		medidata-parent
43	Munícipes	x-fa fa-university	42	consulta.Municipe	municipe
41	Embargos	x-fa fa-legal	42	consulta.Embargo	embargo
45	Infraestruturas	x-fa fa-retweet	44	geo.MapPanel	mapa10
48	Publicidade	x-fa fa-flag-o	44	publicidade.Publicidade	publicidade
50	Rede Viária	x-fa fa-file-text-o	44	redeviaria.RedeViaria	redeviaria
47	IP no minuto	x-fa fa-clock-o	44	infprevia.InfPrevia	infprevia
24	Email	right-icon x-fa fa-send 	\N	email.Email	email
23	Dashboard	right-icon x-fa fa-desktop	\N	dashboard.Dashboard	dashboard
26	Sensors	x-fa fa-line-chart	\N	sync.Sync	full
25	Profile	x-fa fa-user	29	profile.UserProfile	profile
49	Location Plan	x-fa fa-map-marker	44	plantas.Plantas	plantas
28	Help	x-fa fa-question	\N	pages.FAQ	faq
29	Users	x-fa fa-users	\N		pages-parent
46	Urban management	x-fa fa-building-o	44	urbanismo.Urbanismo	urbanismo
44	Applications	x-fa fa-umbrella	\N		sig-parent
51	Password Change	x-fa fa-lightbulb-o	29	authentication.PasswordChange	authentication.passwordchange
36	Password Reset	x-fa fa-lightbulb-o	29	authentication.PasswordReset	authentication.passwordreset
\.


--
-- TOC entry 3775 (class 0 OID 0)
-- Dependencies: 253
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: users; Owner: geobox
--

SELECT pg_catalog.setval('menu_id_seq', 51, true);


--
-- TOC entry 3769 (class 0 OID 29356)
-- Dependencies: 254
-- Data for Name: permissao; Type: TABLE DATA; Schema: users; Owner: geobox
--

COPY permissao (idmenu, idgrupo) FROM stdin;
23	1
28	1
23	2
28	2
23	3
28	3
23	0
28	0
41	1
41	2
42	1
42	2
43	1
43	2
44	1
44	2
46	1
46	2
47	2
47	1
48	2
48	1
49	1
49	2
50	1
50	2
26	0
26	1
26	2
26	3
44	0
49	0
47	0
47	3
49	3
44	3
\.


-- Completed on 2016-04-12 17:10:52 WEST

--
-- PostgreSQL database dump complete
--

