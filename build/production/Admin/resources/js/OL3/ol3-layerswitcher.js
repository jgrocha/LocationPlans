ol.control.LayerSwitcher=function(d){var a=d||{};var f=a.tipLabel?a.tipLabel:"Legend";this.mapListeners=[];this.hiddenClassName="ol-unselectable ol-control layer-switcher";this.shownClassName=this.hiddenClassName+" shown";var c=document.createElement("div");c.className=this.hiddenClassName;var b=document.createElement("button");b.setAttribute("title",f);c.appendChild(b);this.panel=document.createElement("div");this.panel.className="panel";c.appendChild(this.panel);var e=this;c.onmouseover=function(g){e.showPanel()};b.onclick=function(g){e.showPanel()};c.onmouseout=function(g){g=g||window.event;if(!c.contains(g.toElement)){e.hidePanel()}};ol.control.Control.call(this,{element:c,target:a.target})};ol.inherits(ol.control.LayerSwitcher,ol.control.Control);ol.control.LayerSwitcher.prototype.showPanel=function(){if(this.element.className!=this.shownClassName){this.element.className=this.shownClassName;this.renderPanel()}};ol.control.LayerSwitcher.prototype.hidePanel=function(){if(this.element.className!=this.hiddenClassName){this.element.className=this.hiddenClassName}};ol.control.LayerSwitcher.prototype.renderPanel=function(){this.ensureTopVisibleBaseLayerShown_();while(this.panel.firstChild){this.panel.removeChild(this.panel.firstChild)}var a=document.createElement("ul");this.panel.appendChild(a);this.renderLayers_(this.getMap(),a)};ol.control.LayerSwitcher.prototype.setMap=function(c){for(var b=0,a;b<this.mapListeners.length;b++){this.getMap().unByKey(this.mapListeners[b])}this.mapListeners.length=0;ol.control.Control.prototype.setMap.call(this,c);if(c){var d=this;this.mapListeners.push(c.on("pointerdown",function(){d.hidePanel()}));this.renderPanel()}};ol.control.LayerSwitcher.prototype.ensureTopVisibleBaseLayerShown_=function(){var a;ol.control.LayerSwitcher.forEachRecursive(this.getMap(),function(d,b,c){if(d.get("type")==="base"&&d.getVisible()){a=d}});if(a){this.setVisible_(a,true)}};ol.control.LayerSwitcher.prototype.setVisible_=function(a,c){var b=this.getMap();a.setVisible(c);if(c&&a.get("type")==="base"){ol.control.LayerSwitcher.forEachRecursive(b,function(f,d,e){if(f!=a&&f.get("type")==="base"){f.setVisible(false)}})}};ol.control.LayerSwitcher.prototype.renderLayer_=function(b,g){var c=this;var i=document.createElement("li");var h=b.get("title");var a=b.get("title").replace(" ","-")+"_"+g;var f=document.createElement("label");if(b.getLayers){i.className="group";f.innerHTML=h;i.appendChild(f);var d=document.createElement("ul");i.appendChild(d);this.renderLayers_(b,d)}else{var e=document.createElement("input");if(b.get("type")==="base"){e.type="radio";e.name="base"}else{e.type="checkbox"}e.id=a;e.checked=b.get("visible");e.onchange=function(j){c.setVisible_(b,j.target.checked)};i.appendChild(e);f.htmlFor=a;f.innerHTML=h;i.appendChild(f)}return i};ol.control.LayerSwitcher.prototype.renderLayers_=function(b,e){var d=b.getLayers().getArray().slice().reverse();for(var c=0,a;c<d.length;c++){a=d[c];if(a.get("title")){e.appendChild(this.renderLayer_(a,c))}}};ol.control.LayerSwitcher.forEachRecursive=function(a,b){a.getLayers().forEach(function(e,c,d){b(e,c,d);if(e.getLayers){ol.control.LayerSwitcher.forEachRecursive(e,b)}})};