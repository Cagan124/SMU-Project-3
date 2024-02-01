// select the dropdown
let dropdown = d3.select("#dropdown");

// add an event listener for a CHANGE
dropdown.on("change", function () {
  //  console.log("Event Listener heard!! YAY!");

  // on change, do work
  doWork();
});

// get the new data
function doWork() {
  let inp_house_type = dropdown.property("value");

  // grab the data
  let url = `/api/v1.0/${inp_house_type}/9999999999999/999999999/9999999/9999999/999999`;

  // make request
  d3.json(url).then(function (data) {
    console.log(data);

    makeMap(data);
    makeBar(data);
    makeScatter(data);
  });
}

function makeMap(data) {
  // Step 0: recreate the map html
  // Select the map_container div
  let mapContainer = d3.select("#map_container");

  // Empty the map_container div
  mapContainer.html("");

  // Append a div with id "map" inside the map_container div
  mapContainer.append("div").attr("id", "map");

  // Step 1: Define your BASE Layers

  // Define variables for our tile layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Step 2: Create the OVERLAY (DATA) Layers
  // Create a new marker cluster group.
  let markerLayer = L.markerClusterGroup();
  let markers = [];

  // Loop through the data.
  for (let i = 0; i < data.map_data.length; i++){

    // Set the data location property to a variable.
    let row = data.map_data[i];

    // Get Lat/Long
    let latitude = row.LATITUDE;
    let longitude = row.LONGITUDE;
    let location = [latitude, longitude];

    // Add a new marker to the cluster group, and bind a popup.
    let marker = L.marker(location).bindPopup(`<h3>${row.PRICE}</h3>`);
    markerLayer.addLayer(marker);

    // for the heatmap
    markers.push(location);
  }

  let heatLayer = L.heatLayer(markers);

  // Step 3: Create the MAP object

  // Create a map object, and set the default layers.
  let myMap = L.map("map", {
    center: [40.7302, -73.9346],
    zoom: 10.25,
    layers: [street, markerLayer]
  });

  // Step 4: Add the Layer Controls (Legend goes here too)

  // Only one base layer can be shown at a time.
  let baseMaps = {
    Street: street,
    Topography: topo
  };

  // Overlays that can be toggled on or off
  let overlayMaps = {
    Markers: markerLayer,
    HeatMap: heatLayer
  };

  // Pass our map layers into our layer control.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}


function makeBar(data) {

  // Trace for the Data
  let trace = {
    x: data.bar_data.map(row => row.PRICE),
    y: data.bar_data.map(row => row.ADDRESS),
    type: "bar",
    orientation: "h"
  }

  // Data array
  let traces = [trace];

  // Apply a title to the layout
  let layout = {
    title: `10 Most Expensive Houses`,
    margin: { l: 200 }}

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", traces, layout);

}

function makeScatter(data) {
  
  // Step 3: Create a trace for the scatter plot
  let scatter_trace = {
    x: data.scatter_data.map(row => row.Distance),
    y: data.scatter_data.map(row => row.PRICE_BY_SQFT),
    mode: 'markers',
    type: 'scatter'
  };

  // Step 4: Define the layout options
  let scatter_layout = {
    title: 'Distance from NYC Center vs Price by Square Foot',
    xaxis: {
      title: 'Distance from Center of NYC (Miles)'
    },
    yaxis: {
      title: 'Price by Square Foot'
    }
  };

  // Step 5: Create the Plotly plot
  Plotly.newPlot('chart', [scatter_trace], scatter_layout);
  
  }

// INITIALIZE plot on page load
doWork();

