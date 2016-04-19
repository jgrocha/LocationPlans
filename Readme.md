# Location Plan

## Goal

Location Plan is a web based open source application to prepare and print location plans.
These prints are often requested by public authorities for legal purposes.

## Modules

### Client (web app)

The web application is developed in HTML, CSS and Javascript,
taking advantage of the well known libraries ExtJS 6, GeoExt 3 and OpenLayers 3.x.

### Server

The server is written in Javascript, using node.js. Several node modules are used.

### Print server

The printing capabilities are supported by MapFish Print 3. The printing layout can be designed using Jaspersoft Studio.
Jaspersoft Studio is the free, open source, eclipse-based report designer for JasperReports and JasperReports Server.

## Deploy

### Common tables and data

```bash
sudo su postgres
-- this role must match the configuration in server-db.js
psql postgres -c "CREATE ROLE geobox LOGIN PASSWORD 'geobox' SUPERUSER INHERIT CREATEDB CREATEROLE REPLICATION;"
createdb -O geobox dashboard
psql dashboard -c "CREATE EXTENSION adminpack;"
psql dashboard -c "CREATE EXTENSION postgis;"
psql dashboard -c "CREATE EXTENSION hstore;"
psql dashboard -c "CREATE EXTENSION pgcrypto;"
-- populate supporting tables
psql dashboard -f dashboard.sql
psql dashboard -f dashboard-data.sql
-- initial user; replace the email 'jgr@geomaster.pt' with your own; replace the password 'pa55word' with your own
psql dashboard -c "insert into users.utilizador (idgrupo, email, password, nome, emailconfirmacao) values (1, 'jgr@geomaster.pt', encode(digest('pa55word', 'sha1'), 'hex'), 'Administrator', true);"
exit
```

### Tables and data for specific apps

### Application

#### Deploy the application

Note: A key pair is needed to check out the code this way. Can be improved [this way](http://jonathannicol.com/blog/2013/11/19/automated-git-deployments-from-bitbucket/).

```bash
cd public_html
mkdir -p ~/public_html/dashboard
git clone https://jgrocha@bitbucket.org/jgrocha/mydashboard-server.git
cd mydashboard-server
GIT_WORK_TREE=~/public_html/dashboard git checkout -f master
cd ~/public_html/dashboard
svn checkout https://github.com/jgrocha/MyDashBoard/trunk/build/production/Admin public
-- port where the server run. Port 80 maybe taken by Apache
sed -i 's/"port": [0-9]\+/"port": 3007/' server-config.json
-- full address
sed -i 's/localhost/labs.activeng.pt/' server-config.json
-- production DB
sed  -i 's/"dbproduction": "[^"]\+"/"dbproduction": "postgres:\/\/geobox:geomaster2k14@localhost\/dashboard"/' server-config.json
npm update
mkdir -p uploads
mkdir -p public/uploaded_images

-- cd public/resources/languages/
-- ln -s pt-PT.js pt.js
-- ln -s pt-PT.js pt-BR.js

sudo forever-service install -e "NODE_ENV=production" dashboard --script server.js
```

```
Start   - "sudo start dashboard"
Stop    - "sudo stop dashboard"
Status  - "sudo status dashboard"
Restart - "sudo restart dashboard"
```

#### Customization

##### Interface

server-config.json

###### Examples

```
  "ClientConfig": {
    "title": "Unidade Técnica de SIG, Câmara Municipal de Águeda",
    "author": "Geomaster, Lda",
    "description": "Impressão de Plantas de Localização",
    "keywords": "Palntas de localização, impressão, 2000, 10000",
    "headertitle": "UT SIG",
    "headerlogo": "resources/images/dadosagueda_sem.png",
    "headerlogowidth": "56",
    "headerlogoheight": "26",
    "helpbasefolder": "resources/help/"
  }
```

```
  "ClientConfig": {
    "title": "Municipality of Valladolid",
    "author": "Municipality of Valladolid",
    "description": "Municipality of Valladolid Location Plans printing",
    "keywords": "location plans, Valladolid",
    "headertitle": "Municipality of Valladolid",
    "headerlogo": "resources/images/valladolid.png",
    "headerlogowidth": "48",
    "headerlogoheight": "51",
    "helpbasefolder": "resources/help/"
  }
```

```
  "ClientConfig": {
    "title": "ActivEng",
    "author": "ActivEng, Lda",
    "description": "Spatially distributed network of autonomous sensors to monitor physical or environmental conditions",
    "keywords": "sensors, temperature, humidity",
    "headertitle": "ActivEng, Lda",
    "headerlogo": "resources/images/ic_launcher.png",
    "headerlogowidth": "48",
    "headerlogoheight": "51",
    "helpbasefolder": "resources/help/sync/"
  }
```

##### Background images

classic/resources/images/error-page-background.jpg

classic/resources/images/lock-screen-background.jpg

#### Update

```
--server
cd public_html/mydashboard-server/
git pull
-- not necessary
-- GIT_WORK_TREE=~/public_html/dashboard git checkout -f master
-- port where the server run. Port 80 maybe taken by Apache
sed -i 's/"port": [0-9]\+/"port": 3007/' server-config.json
-- full address
sed -i 's/localhost/labs.activeng.pt/' server-config.json
-- production DB
sed  -i 's/"dbproduction": "[^"]\+"/"dbproduction": "postgres:\/\/geobox:geomaster2k14@localhost\/dashboard"/' server-config.json
npm update

--client
cd ~/public_html/dashboard
svn checkout https://github.com/jgrocha/MyDashBoard/trunk/build/production/Admin public

--restart
sudo stop dashboard
sudo start dashboard
```

#### Deploy under Apache

```
sudo a2ensite labs.activeng.pt
sudo apachectl graceful
```

=== Lock screen background

Used on the login panel, etc.

```
classic/resources/images/lock-screen-background.jpg
```




