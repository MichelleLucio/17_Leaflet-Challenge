// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
let quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(quakeURL, function(data){
    createMarkers(data.features);
    console.log(data.features(properties.place));
    console.log(data);
});  


function createMarkers(quakeData){
    console.log(quakeData);

    function eachQuake(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place +
         "</h3><br><h3> Magnitude: " + feature.properties.mag + "</h3>");

    }

    let quakeEvents = L.geoJSON(quakeData, {
        eachQuake: eachQuake
    });

    createMap(quakeEvents);
}


function createMap(quakeEvents){


   // Define streetmap and darkmap layers
   let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
    let baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

  // Create an overlayMaps object to hold the quakes layer
    let overlayMaps = {
        Earthquakes: quakeEvents
    };

  // initialize the map on the "map" div with a given center and zoom
    let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetmap, quakeEvents]
    });

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}




  




