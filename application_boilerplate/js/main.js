define([
    "dojo/ready", 
    "dojo/_base/declare",
    "dojo/_base/lang",
    "esri/arcgis/utils",
    "esri/IdentityManager",
    "dojo/on",
    "dojo/dom",
    "application/Drawer",
    "esri/dijit/Legend"
],
function(
    ready, 
    declare,  
    lang,
    arcgisUtils,
    IdentityManager,
    on,
    dom,
    Drawer,
    Legend
) {
    return declare("", null, {
        config: {},
        constructor: function(config) {
            //config will contain application and user defined info for the template such as i18n strings, the web map id
            // and application id
            // any url parameters and any application specific configuration information. 
            this.config = config;
            // responsive drawer
            this._drawer = new Drawer({
                showDrawerSize: 850,
                container: dom.byId('bc_outer'),
                contentCenter: dom.byId('cp_outer_center'),
                contentLeft: dom.byId('cp_outer_left'),
                toggleButton: dom.byId('hamburger_button'),
                direction: this.config.i18n.direction
            });
            // drawer resize event
            // on(this._drawer, 'resize', lang.hitch(this, function () {}));
            // startup drawer
            this._drawer.startup();
            // map ready
            ready(lang.hitch(this, function() {
                this._createWebMap();
            }));
        },
        _mapLoaded: function() {
            // Map is ready
            console.log('map loaded');
            var legend = new Legend({
                map: this.map
            }, "legendDiv");
            legend.startup();
        },
        //create a map based on the input web map id
        _createWebMap: function() {
            arcgisUtils.createMap(this.config.webmap, "mapDiv", {
                mapOptions: {
                    //Optionally define additional map config here for example you can 
                    //turn the slider off, display info windows, disable wraparound 180, slider position and more. 
                },
                bingMapsKey: this.config.bingmapskey
            }).then(lang.hitch(this, function(response) {
                //Once the map is created we get access to the response which provides important info 
                //such as the map, operational layers, popup info and more. This object will also contain
                //any custom options you defined for the template. In this example that is the 'theme' property.
                //Here' we'll use it to update the application to match the specified color theme.  
                console.log(this.config);
                this.map = response.map;
                if (this.map.loaded) {
                    // do something with the map
                    this._mapLoaded();
                } else {
                    on.once(this.map, "load", lang.hitch(this, function() {
                        // do something with the map
                        this._mapLoaded();
                    }));
                }
            }), lang.hitch(this, function(error) {
                //an error occurred - notify the user. In this example we pull the string from the 
                //resource.js file located in the nls folder because we've set the application up 
                //for localization. If you don't need to support mulitple languages you can hardcode the 
                //strings here and comment out the call in index.html to get the localization strings. 
                if (this.config && this.config.i18n) {
                    alert(this.config.i18n.map.error + ": " + error.message);
                } else {
                    alert("Unable to create map: " + error.message);
                }
            }));
        }
    });
});