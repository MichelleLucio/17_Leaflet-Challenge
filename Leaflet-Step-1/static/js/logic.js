function createMap(quakes){

// street map
// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: API_KEY
// }).addTo(myMap);

  // Create the tile layer that will be the background of our map
    let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
    let baseMaps = {
        "Light Map": lightmap
    };

  // Create an overlayMaps object to hold the bikeStations layer
    let overlayMaps = {
        "Earthquakes": quakes
    };

  // initialize the map on the "map" div with a given center and zoom
    let myMap = L.map('map', {
    center: [37.0902, -95.7129],
    zoom: 4,
    layers: [lightmap, quakes]
    });

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

function createMarkers(response){
    // pull the places & magnitude info from data
    let qPlaces = response.features.place;
    let qMag = response.features.mag;

  // Initialize an array to hold quake events
    let quakeEvents = [];

  // Loop through the quakes array to pull locations & bind popup
    response.forEach(event => {
        let location = event.geometry.coordinates
        console.log(location);

        let eachEvent = L.marker(location)
            .bindPopup("<h3>" + event.qPlaces + "<h3><br><h3> Magnitude: " + event.qMag + "<h3>");

        // Add the marker to the bikeMarkers array
        quakeEvents.push(eachEvent);
        })

    // Create a layer group made from the array, pass it into the createMap function
    createMap(L.layerGroup(quakeEvents));

  }

