# Location Plan

## Goal

Location Plan is a web based open source application to prepare and print location plans.
These prints are often requested by public authorities for legal purposes.

## Modules

### Client (web app)

The web application is developed in HTML, CSS and Javascript, taking advantage of the well known libraries ExtJS 6, GeoExt 3 and OpenLayers 3.x.

### Server

The server is written in Javascript. node.js is required to run the server code. Several node modules are used.

### Print server

The printing capabilities are supported by MapFish Print 3. The printing layout can be designed using Jaspersoft Studio.
Jaspersoft Studio is the free, open source, eclipse-based report designer for JasperReports and JasperReports Server.

## Deployment on a new instance based on Ubuntu

### Test environment

To test the installation process, a virtual machine was used.

```
login: ubuntu
password: ubuntu
network (bridged): 192.168.1.107
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@192.168.1.107
```

### Preparation

```
echo "127.0.0.1 instance-locplan" | sudo tee -a /etc/hosts
sudo apt-get update
sudo apt-get -y upgrade
sudo locale-gen "en_US.UTF-8"
sudo apt-get install language-pack-en
sudo apt-get -y install redis-server build-essential subversion graphicsmagick imagemagick htop nmap unzip openssh-server
sudo apt-get install libgeos-dev gdal-bin
sudo apt-get install git
```

### Node.js

```
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g forever forever-service
```

### JAVA, Tomcat and MapFish

#### Installing JAVA 8

```
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer
```

#### Installing JAVA JAI

```
cd /tmp
wget http://data.opengeo.org/suite/jai/jai-1_1_3-lib-linux-amd64-jdk.bin
wget http://data.opengeo.org/suite/jai/jai_imageio-1_1-lib-linux-amd64-jdk.bin
sed s/+215/-n+215/ jai_imageio-1_1-lib-linux-amd64-jdk.bin > jai_imageio-1_1-lib-linux-amd64-jdk_fixed.bin

sudo cp jai-1_1_3-lib-linux-amd64-jdk.bin /usr/lib/jvm/java-8-oracle
sudo cp jai_imageio-1_1-lib-linux-amd64-jdk_fixed.bin /usr/lib/jvm/java-8-oracle

cd /usr/lib/jvm/java-8-oracle
sudo sh jai-1_1_3-lib-linux-amd64-jdk.bin
sudo sh jai_imageio-1_1-lib-linux-amd64-jdk_fixed.bin
```

#### Installing Tomcat

```
sudo apt-get install tomcat7 tomcat7-admin tomcat7-common
sudo vi /etc/default/tomcat7
```

Set:

```
JAVA_HOME="/usr/lib/jvm/java-8-oracle"
JAVA_OPTS="-Djava.awt.headless=true -Xmx1536m -XX:+UseConcMarkSweepGC"
```

Set user/password:

```
sudo vi /etc/tomcat7/tomcat-users.xml
```

```
<tomcat-users>
  <role rolename="tomcat"/>
  <user username="tomcat" password="locationplans2k16" roles="manager,manager-gui,manager-script"/>
</tomcat-users>
```

```
sudo service tomcat7 restart

-- Wait until tomcat7 is ready, with:
-- tail -f /var/log/tomcat7/catalina.out
-- Wait until the server reports:
-- INFO: Server startup in xxxxx ms
```

#### Installing Geoserver

```
mkdir -p ~/geoserver/data
sudo chown tomcat7:tomcat7 ~/geoserver/data

cd /tmp
wget http://ncu.dl.sourceforge.net/project/geoserver/GeoServer/2.9.0/geoserver-2.9.0-war.zip
unzip geoserver-2.9.0-war.zip
sudo cp geoserver.war /var/lib/tomcat7/webapps/

-- Wait until geoserver app is deployed, with:
-- tail -f /var/log/tomcat7/catalina.out
-- Wait until the server reports:
-- INFO: Server startup in xxxxx ms

sudo service tomcat7 stop
sudo cp -a /var/lib/tomcat7/webapps/geoserver/data ~/geoserver

sudo vi /var/lib/tomcat7/webapps/geoserver/WEB-INF/web.xml

	<context-param>
	   <param-name>GEOSERVER_DATA_DIR</param-name>
		<param-value>/home/ubuntu/geoserver/data</param-value>
	</context-param>

sudo service tomcat7 start

-- Wait until tomcat7 is ready, with:
-- tail -f /var/log/tomcat7/catalina.out
-- Wait until the server reports:
-- INFO: Server startup in xxxxx ms
```

The default credentials for Geoserver are: admin/geoserver

#### Disable Tomcat CORS (not necessary for cloud deploy)

```
sudo vi /etc/tomcat7/web.xml
```

```
<filter>
  <filter-name>CorsFilter</filter-name>
  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
  <init-param>
	<param-name>cors.allowed.origins</param-name>
	<param-value>*</param-value>
  </init-param>
</filter>
<filter-mapping>
  <filter-name>CorsFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```

```
sudo service tomcat7 restart

-- Wait until tomcat7 is ready, with:
-- tail -f /var/log/tomcat7/catalina.out
-- Wait until the server reports:
-- INFO: Server startup in xxxxx ms
```

#### Installing MapFish

```
cd /tmp
# wget http://repo1.maven.org/maven2/org/mapfish/print/print-servlet/3.3.0/print-servlet-3.3.0.war
wget http://repo1.maven.org/maven2/org/mapfish/print/print-servlet/3.5.0/print-servlet-3.5.0.war
sudo mv print-servlet-3.5.0.war /var/lib/tomcat7/webapps/print.war

-- Wait until mapfish app is deployed, with:
-- tail -f /var/log/tomcat7/catalina.out
-- Wait until the server reports:
-- INFO: Server startup in xxxxx ms
```

#### Print test

To make sure that Geoserver and MapFish are running, the following urls should open:

* [Geoserver](http://localhost:8080/geoserver)
* [MapFish](http://localhost:8080/print/)

To make sure that MapFish is running properly, the following print should be request:

Select in the `Print App/Example` combo box: verboseExample

Click on `Create And Get Print` button

#### (Skip) Customize printing templates 

Note: **this is not necessary for cloud deploy.**

The application prints existing contents (the map, attributes, etc) using a template that defines the output layout.
The layout can be edited using [Jaspersoft Studio](http://community.jaspersoft.com/project/jaspersoft-studio/releases). 

Jasper Studio can be installed in two different ways;

[JaspersoftStudio-6.3.0.final-linux-x86_64.tgz](http://netassist.dl.sourceforge.net/project/jasperstudio/JaspersoftStudio-6.3.0/TIBCOJaspersoftStudio-6.3.0.final-linux-x86_64.tgz)

```
cd ~/bin
tar xvzf ~/Transferências/TIBCOJaspersoftStudio-6.3.0.final-linux-x86_64.tgz
~/bin/TIBCOJaspersoftStudio-6.3.0.final/runubuntu.sh
```

[JaspersoftStudio_6.3.0.final_amd64.deb](http://netcologne.dl.sourceforge.net/project/jasperstudio/JaspersoftStudio-6.3.0/TIBCOJaspersoftStudio_6.3.0.final_amd64.deb) for Debain based Linux.

```
sudo dpkg -i TIBCOJaspersoftStudio_6.3.0.final_amd64.deb
```

### Installing PostgreSQL

```
echo "deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install postgresql-9.5 postgresql-9.5-postgis-2.2 postgresql-contrib postgresql-client-9.5
```

### PostgreSQL performance tuning

### OS parameters

```
sudo vi /etc/sysctl.conf
vm.overcommit_memory=1
sudo sysctl vm.overcommit_memory=1
```

### PostgreSQL parameters

```
sudo vi /etc/postgresql/9.5/main/postgresql.conf
```

```
shared_buffers = 256MB
fsync = off
effective_io_concurrency = 2
listen_addresses = '*'
max_connections = 250
```

```
sudo service postgresql restart
```

### Database

```bash
sudo su postgres
-- this role must match the configuration in server-db.js
psql postgres -c "CREATE ROLE geobox LOGIN PASSWORD 'geobox' SUPERUSER INHERIT CREATEDB CREATEROLE REPLICATION;"
createdb -O geobox dashboard
psql dashboard -c "CREATE EXTENSION adminpack;"
psql dashboard -c "CREATE EXTENSION postgis;"
-- psql dashboard -c "CREATE EXTENSION hstore;"
psql dashboard -c "CREATE EXTENSION pgcrypto;"
exit
```

### Application

#### Deploy the application from GitHub

```bash
cd
git clone https://github.com/jgrocha/LocationPlans.git
cd LocationPlans

sudo su postgres
-- create database tables
psql dashboard -f dashboard.sql
-- populate supporting tables
psql dashboard -f dashboard-data.sql
-- initial user; replace the email 'jgr@geomaster.pt' with your own; replace the password 'pa55word' with your own
psql dashboard -c "insert into users.utilizador (idgrupo, email, password, nome, emailconfirmacao) values (1, 'jgr@geomaster.pt', encode(digest('pa55word', 'sha1'), 'hex'), 'Administrator', true);"
exit

mkdir -p ~/public_html/public

cp -rf server/* ~/public_html
cp -rf build/production/Admin/* ~/public_html/public

sudo cp -rf print-apps/plantas /var/lib/tomcat7/webapps/print/print-apps
sudo chown -R tomcat7:tomcat7 /var/lib/tomcat7/webapps/print/print-apps/plantas

cd ~/public_html
npm update

cp server-config-TEMPLATE.json server-config.json

-- port where the server run. Port 80 maybe taken by Apache
sed -i 's/"port": [0-9]\+/"port": 80/' server-config.json
-- full address
sed -i 's/localhost/web.sig.cm-agueda.pt/' server-config.json
-- production DB
sed  -i 's/"dbproduction": "[^"]\+"/"dbproduction": "postgres:\/\/geobox:geobox@localhost\/dashboard"/' server-config.json

sudo forever-service install -e "NODE_ENV=production" dashboard --script server.js

sudo start dashboard
```

#### Update the application from GitHub

```bash
cd ~/LocationPlans
git pull

sudo stop dashboard
cp -rf server/* ~/public_html
cp -rf build/production/Admin/* ~/public_html/public
sudo start dashboard
```

### Application log

The application log is written in /var/log/dashboard.log.

```bash
tail -f /var/log/dashboard.log
```