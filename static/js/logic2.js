// Perform an API call to the USGS Earthquake API. Call createFeatures when complete
//put in options for different timeframes for interest only
let quakeday = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
let quakeweek = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let quakemonth = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
let quakehour = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
let faults = "static/data/PB2002_boundaries.json";


d3.json(quakeday, function(data){
    createFeatures(data.features);
    });  

//colors for circle markers
function circleColor(mag){
    if (mag > 5){
        return "rgb(228, 15, 57)"
    }
    else if (mag>=4){
        return "rgba(176, 19, 197, 0.952)  "
    }
    else if (mag>=3){
        return "rgb(69, 161, 223)"
    }
    else if (mag>=2){
        return "rgb(226, 193, 45)"
    }
    else if (mag>=1){
        return "rgb(223, 115, 199)"
    }
    else{
        return "rgb(108, 206, 28)"
    }
}

//size for circle markers
function circleSize(mag){
    return mag*5;
}
    
// function to create features/markers for earthquakes
function createFeatures(quakeData){
    console.log(quakeData);

    //create popup info & bind to layers & marker design
    let quakeEvents = L.geoJSON(quakeData, {
        onEachFeature : function (feature, layer){
            layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p> Time: " + new Date(feature.properties.time) + "<br> Magnitude: " +  feature.properties.mag +"</p>")
        },
        pointToLayer: function(feature, latlng){
            return new L.CircleMarker(latlng, {
                radius: circleSize(feature.properties.mag),
                color: "gray",
                fillColor: circleColor(feature.properties.mag),
                weight: 1,
                fillOpacity: 0.9,
            })
        }  
    });
    createMap(quakeEvents);
}

//function to create the map 
function createMap(quakeEvents){


   // Define streetmap, darkmap, lightmap & satellite layers
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

  let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  let satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the map layers
    let baseMaps = {
        "Street Map": streetmap,
        "Satellite": satellite,
        "Dark Map": darkmap,
        "Light Map": lightmap,
    };


  // initialize the map on the "map" div with a given center (center of USA) and zoom
    let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, quakeEvents]
    });

    //add new layer for fault lines & draw lines
    let faultLayer = new L.layerGroup();

    d3.json(faults, function (lineData) {
        let drawFault = (feature) => {
            return{
                weight: 2,
                color: "orange",
            };
        }
        L.geoJSON(lineData, {
            style: drawFault
        })
        .addTo(faultLayer);
        faultLayer.addTo(myMap)
        });

  // Create an overlayMaps object to hold the quakes layer & fault lines layer
  let overlayMaps = {
    Earthquakes: quakeEvents,
    "Fault Lines": faultLayer,
    };
        
// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //


// create the Legend
    let legend = L.control({position: 'bottomright'});

        legend.onAdd = function (myMap) {

            let div = L.DomUtil.create('div', 'info legend'),
                magnitudes = [0.5, 1, 2, 3, 4, 5.5],
                labels = ['<h3> Map Info: USGS <br>All Earthquakes<br> in Past Day</h3><br><strong>Legend: <br> Magnitude </strong>'],
                categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

    // loop through each magnitude and generate a label with a colored square for each interval
            for (let i = 0; i < magnitudes.length; i++) {
                div.innerHTML +=
                labels.push(
                '<i style="background:' + circleColor(magnitudes[i]) + '"></i> ' +
                (categories[i] ? categories[i] : '+'));

            }
            div.innerHTML = labels.join('<br>');
        

        return div;
    }
  
    legend.addTo(myMap);

}
  




