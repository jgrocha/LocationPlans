# Printing maps

To print maps, there are two options:
* free printing
* select a profile to use

Free printing works with a generic template.
The user just navigates and at any resolution or scale he can do a print request.
The visible layers are included in the printed map.

The print profile allows the usage of:
* custom templates;
* fixed scales to be used on print
* fixed layers

## Free printing

Done (almost...).

## Printing profiles


### Printing math

1m/2000m = x/100m

x = 100/2000 = 0.05m = 5cm

Paper A4 vertical

1m/2000m = 0.001m/x

##### A4 horizontal

297,0389 mm → 842 px
209,9028 mm → 595 px

7,0556 mm → 20 px (margem)

1 px = 0.3527778 mm

Área de impressão:

      map2k: !map
        maxDpi: 400
        width: 555
        height: 802

555 * 0.3527778 x 802 * 0.3527778

195.79 mm x 282.93 mm

##### Escala 1:2000

1 mm no mapa = 0.001 * 2000 = 2 metros no terreno

194.02 * 2 = 388.04 metros no terreno

232.83 * 2 = 465.65 metros no terreno

OpenLayers

Scale = 1:2000, Resolution = 0,5599999999999999

##### Escala 1:10000

1 mm no mapa = 0.001 * 10000 = 10 metros no terreno

Área de impressão:

194.02 * 10 = 1940.2 metros no terreno

232.83 * 10 = 2328.3 metros no terreno

OpenLayers

Scale = 1:10000, Resolution = 2,8

Se o centro for: [-26000, 100800]

As coordenadas do polígono serão:

## MapFish print server examples

[MapFish documentation](http://mapfish.github.io/mapfish-print-doc/)

Two possibilities to have multiple maps on the same report:

* /var/lib/tomcat7/webapps/print/print-apps/datasource_multiple_maps/config.yaml
* [Multiple maps on same report](https://groups.google.com/forum/#!topic/mapfish-print-users/jWW_4AMlXBI)

```
cd /var/lib/tomcat7/webapps/print/print-apps
```

### Based on bounding box

### Based on center + scale