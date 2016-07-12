--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.3
-- Dumped by pg_dump version 9.5.3

-- Started on 2016-06-28 14:00:13 WEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = users, pg_catalog;

--
-- TOC entry 3531 (class 0 OID 24018)
-- Dependencies: 213
-- Data for Name: grupo; Type: TABLE DATA; Schema: users; Owner: geobox
--

INSERT INTO grupo VALUES (2, 'Staff', '2014-01-03 01:01:31.906002+00', NULL, NULL, false);
INSERT INTO grupo VALUES (1, 'Administrator', '2014-01-03 01:01:31.902406+00', NULL, NULL, false);
INSERT INTO grupo VALUES (0, 'Anonymous', '2016-01-25 17:13:37.337348+00', NULL, NULL, false);
INSERT INTO grupo VALUES (3, 'Citizen', '2014-01-03 01:01:31+00', NULL, NULL, true);


--
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 214
-- Name: grupo_id_seq; Type: SEQUENCE SET; Schema: users; Owner: geobox
--

SELECT pg_catalog.setval('grupo_id_seq', 5, true);


--
-- TOC entry 3533 (class 0 OID 24025)
-- Dependencies: 215
-- Data for Name: layer; Type: TABLE DATA; Schema: users; Owner: geobox
--

INSERT INTO layer VALUES (8, NULL, 'pARQUE uRBANO 2', 'ppgis_pu', NULL, 'http://softwarelivre.cm-agueda.pt/geoserver/ide_local/wms', 'WMS', 3763, NULL, NULL, false, false, true, false, 'UT-SIG - Câmara Municipal de Águeda', NULL, '2016-02-01 22:00:03.37594+00', '2016-02-01 22:00:03.37594+00', NULL, 10, 1, NULL, false, NULL);
INSERT INTO layer VALUES (2, NULL, 'Modest', 'modest', NULL, 'http://c.tiles.mapbox.com/v3/examples.map-szwdot65/${z}/${x}/${y}.png', 'OSM', 3857, NULL, NULL, true, false, false, false, '© OpenStreetMap contributors, © Stamen Design', NULL, '2016-01-31 15:51:51.667226+00', '2016-01-31 15:51:51.667226+00', NULL, 10, 1, NULL, false, NULL);
INSERT INTO layer VALUES (4, NULL, 'Plano Educativo', 'ide_local:ppgis_peema', 'GWC 1', 'http://softwarelivre.cm-agueda.pt/geoserver/gwc/service/wms', 'GWC-CMA', 3763, NULL, NULL, false, false, true, true, '<img src="/resources/images/legenda/Legenda_Escolas_Simbolos1.png"/>', NULL, '2016-01-31 15:56:53.860198+00', '2016-01-31 15:56:53.860198+00', NULL, 10, 1, NULL, false, NULL);
INSERT INTO layer VALUES (5, NULL, 'Parque Urbano', 'ide_local:ppgis_pu', 'GWC 1', 'http://softwarelivre.cm-agueda.pt/geoserver/gwc/service/wms', 'GWC-CMA', 3763, NULL, NULL, false, false, true, false, 'UT-SIG - Câmara Municipal de Águeda', NULL, '2016-01-31 15:59:01.648102+00', '2016-01-31 15:59:01.648102+00', NULL, 10, 1, NULL, false, NULL);
INSERT INTO layer VALUES (6, NULL, 'Ortofotomapa', 'cm-agueda:orto2012', 'GWC 2', 'http://cloud01.geomaster.pt:8080/geoserver/gwc/service/wms', 'GWC-Geomaster', 3763, NULL, NULL, true, false, true, false, 'Direção-geral do Território, 2012', NULL, '2016-01-31 16:00:56.374848+00', '2016-01-31 16:00:56.374848+00', NULL, 10, 1, NULL, false, NULL);
INSERT INTO layer VALUES (14, NULL, 'OpenStreetMap 3763', 'osm', NULL, 'http://{a-d}.geomaster.pt/mapproxy/wmts/osm/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png', 'MapProxy', 3763, NULL, NULL, true, false, true, true, '© OpenStreetMap contributors', NULL, '2016-02-02 15:36:29.311577+00', '2016-02-02 15:36:29.311577+00', NULL, 60, 1, 'http://wiki.openstreetmap.org/w/images/thumb/7/79/Public-images-osm_logo.svg/256px-Public-images-osm_logo.svg.png', false, NULL);
INSERT INTO layer VALUES (1, NULL, 'OpenStreetMap', NULL, NULL, 'http://a.tile.openstreetmap.org/${z}/${x}/${y}.png,http://b.tile.openstreetmap.org/${z}/${x}/${y}.png,http://c.tile.openstreetmap.org/${z}/${x}/${y}.png', 'OSM', 3857, NULL, NULL, true, false, false, true, '© OpenStreetMap contributors', NULL, '2016-01-31 15:49:41.535694+00', '2016-01-31 15:49:41.535694+00', NULL, 10, 1, NULL, false, NULL);
INSERT INTO layer VALUES (19, NULL, 'Ortofotomapa', 'cm-agueda:orto2012', 'GWC 2', 'http://cloud01.geomaster.pt:8080/geoserver/gwc/service/wms', 'GWC-Geomaster', 3763, NULL, NULL, true, false, true, false, 'Direção-geral do Território, 2012', NULL, '2016-01-31 16:00:56.374848+00', '2016-01-31 16:00:56.374848+00', NULL, 30, 1, NULL, false, NULL);
INSERT INTO layer VALUES (21, NULL, 'Ortofotomapa', 'cm-agueda:orto2012', 'GWC 2', 'http://cloud01.geomaster.pt:8080/geoserver/gwc/service/wms', 'GWC-Geomaster', 3763, NULL, NULL, true, false, true, false, 'Direção-geral do Território, 2012', NULL, '2016-01-31 16:00:56.374848+00', '2016-01-31 16:00:56.374848+00', NULL, 50, 1, NULL, false, NULL);
INSERT INTO layer VALUES (22, NULL, 'Ortofotomapa', 'cm-agueda:orto2012', 'GWC 2', 'http://cloud01.geomaster.pt:8080/geoserver/gwc/service/wms', 'GWC-Geomaster', 3763, NULL, NULL, true, false, true, false, 'Direção-geral do Território, 2012', NULL, '2016-01-31 16:00:56.374848+00', '2016-01-31 16:00:56.374848+00', NULL, 60, 1, NULL, false, NULL);
INSERT INTO layer VALUES (24, 20, 'Carto 2k', 'softwarelivre:carto2_5k', '', 'http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms', 'GWC-Geomaster', 3763, NULL, NULL, true, false, true, false, 'UT-SIG -Câmara Municial de Águeda', '', '2016-02-01 00:00:00+00', '2016-02-01 00:00:00+00', NULL, 40, 1, NULL, true, '');
INSERT INTO layer VALUES (25, 10, 'Carto 10k', 'softwarelivre:carto10k', '', 'http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms', 'GWC-Geomaster', 3763, NULL, NULL, true, false, true, true, 'DGT - CAOP, 2015', NULL, '2016-02-01 00:00:00+00', '2016-02-01 00:00:00+00', NULL, 40, 1, NULL, true, 'dtmn11, fr11, ss11 | Subseção , bgri11, lug11, lug11desig | Lugar');
INSERT INTO layer VALUES (26, 30, 'Ortofotomapa', 'geomaster:orto2012', NULL, 'http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms', 'GWC-Geomaster', 3763, NULL, NULL, true, false, true, false, 'Direção-geral do Território, 2012', NULL, '2016-01-31 00:00:00+00', '2016-01-31 00:00:00+00', NULL, 40, 1, NULL, false, NULL);
INSERT INTO layer VALUES (18, NULL, 'Ortofotomapa', 'geomaster:orto2012', '', 'http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms', 'GWC-Geomaster', 3763, NULL, NULL, true, false, true, false, 'Direção-geral do Território, 2012', NULL, '2016-01-31 16:00:56.374848+00', '2016-01-31 16:00:56.374848+00', NULL, 20, 1, NULL, false, NULL);
INSERT INTO layer VALUES (7, NULL, 'Watercolor', 'watercolor', NULL, NULL, 'Stamen', 3857, NULL, NULL, true, false, false, false, '© OpenStreetMap contributors, © Stamen Design', NULL, '2016-01-31 15:54:32.095136+00', '2016-01-31 15:54:32.095136+00', NULL, 10, 1, 'resources/images/Openstreetmap_logo.svg.png', false, NULL);
INSERT INTO layer VALUES (10, NULL, 'OpenStreetMap 3763', 'osmcontinente', NULL, 'http://{a-d}.geomaster.pt/mapproxy/wmts/osmcontinente/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png', 'MapProxy', 3763, NULL, NULL, true, false, true, true, '© OpenStreetMap contributors', NULL, '2016-02-02 15:36:29.311577+00', '2016-02-02 15:36:29.311577+00', NULL, 20, 1, 'resources/images/Openstreetmap_logo.svg.png', false, NULL);
INSERT INTO layer VALUES (9, NULL, 'OpenStreetMap 3763', 'osm', NULL, 'http://{a-d}.geomaster.pt/mapproxy/wmts/osm/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png', 'MapProxy', 3763, NULL, NULL, true, false, true, true, '© OpenStreetMap contributors', NULL, '2016-02-02 15:36:29.311577+00', '2016-02-02 15:36:29.311577+00', NULL, 10, 1, 'resources/images/Openstreetmap_logo.svg.png', false, NULL);
INSERT INTO layer VALUES (3, NULL, 'Toner', 'toner', NULL, NULL, 'Stamen', 3857, NULL, NULL, true, false, false, false, '© OpenStreetMap contributors, © Stamen Design', NULL, '2016-01-31 15:54:32.095136+00', '2016-01-31 15:54:32.095136+00', NULL, 10, 1, 'resources/images/Openstreetmap_logo.svg.png', false, NULL);
INSERT INTO layer VALUES (11, NULL, 'OpenStreetMap 3763', 'osm', NULL, 'http://{a-d}.geomaster.pt/mapproxy/wmts/osm/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png', 'MapProxy', 3763, NULL, NULL, true, false, true, true, '© OpenStreetMap contributors', NULL, '2016-02-02 15:36:29.311577+00', '2016-02-02 15:36:29.311577+00', NULL, 30, 1, 'resources/images/Openstreetmap_logo.svg.png', false, NULL);
INSERT INTO layer VALUES (12, 40, 'OpenStreetMap 3763', 'osmcontinente', NULL, 'http://{a-d}.geomaster.pt/mapproxy/wmts/osmcontinente/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png', 'MapProxy', 3763, NULL, NULL, true, false, true, true, '© OpenStreetMap contributors', NULL, '2016-02-02 15:36:29.311577+00', '2016-02-02 15:36:29.311577+00', NULL, 40, 1, 'resources/images/Openstreetmap_logo.svg.png', false, NULL);
INSERT INTO layer VALUES (13, NULL, 'OpenStreetMap 3763', 'osm', NULL, 'http://{a-d}.geomaster.pt/mapproxy/wmts/osm/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png', 'MapProxy', 3763, NULL, NULL, true, false, true, true, '© OpenStreetMap contributors', NULL, '2016-02-02 15:36:29.311577+00', '2016-02-02 15:36:29.311577+00', NULL, 50, 1, 'resources/images/Openstreetmap_logo.svg.png', false, NULL);
INSERT INTO layer VALUES (28, 50, 'Edificado Cloud', 'marte:edificado_vti2', '', 'http://geoserver.sig.cm-agueda.pt:8080/geoserver/marte/wms', 'WMS', 3763, '', '', false, false, true, false, 'UT-SIG -Câmara Municial de Águeda', '', '2016-02-02 15:36:29+00', '2016-02-02 15:36:29+00', NULL, 20, 1, '', true, '');
INSERT INTO layer VALUES (29, 55, 'Edificado', 'softwarelivre:edificado_estado', '', 'http://geoserver.sig.cm-agueda.pt/geoserver/gwc/service/wms', 'GWC-Geomaster', 3763, NULL, NULL, false, false, true, true, 'UT-SIG - Câmara Municipal de Águeda', NULL, '2016-02-01 00:00:00+00', '2016-02-01 00:00:00+00', NULL, 20, 1, NULL, true, '');
INSERT INTO layer VALUES (27, 40, 'Edificado Estado', 'ide_local:edificado_estado', NULL, 'http://softwarelivre.cm-agueda.pt/geoserver/ide_local/wms', 'WMS', 3763, '', '', false, false, true, true, 'UT-SIG -Câmara Municial de Águeda', NULL, '2016-02-02 15:36:29.311577+00', '2016-02-02 15:36:29.311577+00', NULL, 20, 1, '', true, NULL);


--
-- TOC entry 3543 (class 0 OID 0)
-- Dependencies: 216
-- Name: layer_id_seq; Type: SEQUENCE SET; Schema: users; Owner: geobox
--

SELECT pg_catalog.setval('layer_id_seq', 29, true);


--
-- TOC entry 3535 (class 0 OID 24037)
-- Dependencies: 217
-- Data for Name: menu; Type: TABLE DATA; Schema: users; Owner: geobox
--

INSERT INTO menu VALUES (27, 'Search results', 'x-fa fa-search', NULL, 'search.Results', 'search');
INSERT INTO menu VALUES (37, 'Widgets', 'x-fa fa-flask', NULL, 'widgets.Widgets', 'widgets');
INSERT INTO menu VALUES (38, 'Forms', 'x-fa fa-edit', NULL, 'forms.Wizards', 'forms');
INSERT INTO menu VALUES (39, 'Charts', 'x-fa fa-pie-chart', NULL, 'charts.Charts', 'charts');
INSERT INTO menu VALUES (30, 'Blank Page', 'x-fa fa-file-o', 29, 'pages.BlankPage', 'pages.blank');
INSERT INTO menu VALUES (31, '404 Error', 'x-fa fa-exclamation-triangle', 29, 'pages.Error404Window', 'pages.404');
INSERT INTO menu VALUES (32, '500 Error', 'x-fa fa-times-circle', 29, 'pages.Error500Window', 'pages.500');
INSERT INTO menu VALUES (33, 'Lock Screen', 'x-fa fa-lock', 29, 'authentication.LockScreen', 'authentication.lockscreen');
INSERT INTO menu VALUES (34, 'Login', 'x-fa fa-check', 29, 'authentication.Login', 'authentication.login');
INSERT INTO menu VALUES (35, 'Register', 'x-fa fa-pencil-square-o', 29, 'authentication.Register', 'authentication.register');
INSERT INTO menu VALUES (40, 'Sensors Básico', 'x-fa fa-line-chart', NULL, 'sync.SyncReadOnly', 'basic');
INSERT INTO menu VALUES (42, 'Medidata', 'x-fa fa-database', NULL, '', 'medidata-parent');
INSERT INTO menu VALUES (43, 'Munícipes', 'x-fa fa-university', 42, 'consulta.Municipe', 'municipe');
INSERT INTO menu VALUES (41, 'Embargos', 'x-fa fa-legal', 42, 'consulta.Embargo', 'embargo');
INSERT INTO menu VALUES (45, 'Infraestruturas', 'x-fa fa-retweet', 44, 'geo.MapPanel', 'mapa10');
INSERT INTO menu VALUES (48, 'Publicidade', 'x-fa fa-flag-o', 44, 'publicidade.Publicidade', 'publicidade');
INSERT INTO menu VALUES (50, 'Rede Viária', 'x-fa fa-file-text-o', 44, 'redeviaria.RedeViaria', 'redeviaria');
INSERT INTO menu VALUES (47, 'IP no minuto', 'x-fa fa-clock-o', 44, 'infprevia.InfPrevia', 'infprevia');
INSERT INTO menu VALUES (24, 'Email', 'right-icon x-fa fa-send ', NULL, 'email.Email', 'email');
INSERT INTO menu VALUES (23, 'Dashboard', 'right-icon x-fa fa-desktop', NULL, 'dashboard.Dashboard', 'dashboard');
INSERT INTO menu VALUES (26, 'Sensors', 'x-fa fa-line-chart', NULL, 'sync.Sync', 'full');
INSERT INTO menu VALUES (25, 'Profile', 'x-fa fa-user', 29, 'profile.UserProfile', 'profile');
INSERT INTO menu VALUES (49, 'Location Plan', 'x-fa fa-map-marker', 44, 'plantas.Plantas', 'plantas');
INSERT INTO menu VALUES (28, 'Help', 'x-fa fa-question', NULL, 'pages.FAQ', 'faq');
INSERT INTO menu VALUES (29, 'Users', 'x-fa fa-users', NULL, '', 'pages-parent');
INSERT INTO menu VALUES (46, 'Urban management', 'x-fa fa-building-o', 44, 'urbanismo.Urbanismo', 'urbanismo');
INSERT INTO menu VALUES (44, 'Applications', 'x-fa fa-umbrella', NULL, '', 'sig-parent');
INSERT INTO menu VALUES (51, 'Password Change', 'x-fa fa-lightbulb-o', 29, 'authentication.PasswordChange', 'authentication.passwordchange');
INSERT INTO menu VALUES (36, 'Password Reset', 'x-fa fa-lightbulb-o', 29, 'authentication.PasswordReset', 'authentication.passwordreset');


--
-- TOC entry 3544 (class 0 OID 0)
-- Dependencies: 218
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: users; Owner: geobox
--

SELECT pg_catalog.setval('menu_id_seq', 51, true);


--
-- TOC entry 3537 (class 0 OID 24042)
-- Dependencies: 219
-- Data for Name: permissao; Type: TABLE DATA; Schema: users; Owner: geobox
--

INSERT INTO permissao VALUES (23, 1);
INSERT INTO permissao VALUES (28, 1);
INSERT INTO permissao VALUES (23, 2);
INSERT INTO permissao VALUES (28, 2);
INSERT INTO permissao VALUES (23, 3);
INSERT INTO permissao VALUES (28, 3);
INSERT INTO permissao VALUES (23, 0);
INSERT INTO permissao VALUES (28, 0);
INSERT INTO permissao VALUES (41, 1);
INSERT INTO permissao VALUES (41, 2);
INSERT INTO permissao VALUES (42, 1);
INSERT INTO permissao VALUES (42, 2);
INSERT INTO permissao VALUES (43, 1);
INSERT INTO permissao VALUES (43, 2);
INSERT INTO permissao VALUES (44, 1);
INSERT INTO permissao VALUES (44, 2);
INSERT INTO permissao VALUES (46, 1);
INSERT INTO permissao VALUES (46, 2);
-- INSERT INTO permissao VALUES (47, 2);
-- INSERT INTO permissao VALUES (47, 1);
INSERT INTO permissao VALUES (48, 2);
INSERT INTO permissao VALUES (48, 1);
INSERT INTO permissao VALUES (49, 1);
INSERT INTO permissao VALUES (49, 2);
INSERT INTO permissao VALUES (50, 1);
INSERT INTO permissao VALUES (50, 2);
--INSERT INTO permissao VALUES (26, 0);
--INSERT INTO permissao VALUES (26, 1);
--INSERT INTO permissao VALUES (26, 2);
--INSERT INTO permissao VALUES (26, 3);
INSERT INTO permissao VALUES (44, 0);
INSERT INTO permissao VALUES (49, 0);
-- INSERT INTO permissao VALUES (47, 0);
-- INSERT INTO permissao VALUES (47, 3);
INSERT INTO permissao VALUES (49, 3);
INSERT INTO permissao VALUES (44, 3);


-- Completed on 2016-06-28 14:00:13 WEST

--
-- PostgreSQL database dump complete
--

