// select the dropdown
let houseType_dropdown = d3.select("#houseType_dropdown");
let price_filter = d3.select("#price_filter");
let beds_filter = d3.select("#beds_filter");
let baths_filter = d3.select("#baths_filter");
let distance_filter = d3.select("#distance_filter");

let button = d3.select("#filter")
// let beds_dropdown = d3.select("#beds_dropdown");
// let baths_dropdown = d3.select("#baths_dropdown");
// let priceSQFT_dropdown = d3.select("#priceSQFT_dropdown");
// let dropdown = d3.select("#dropdown");

// add an event listener for a CHANGE
button.on("click", function () {
  //  console.log("Event Listener heard!! YAY!");

  // on change, do work
  doWork();
});

// get the new data
function doWork() {
  let inp_house_type = houseType_dropdown.property("value");
  let inp_price = price_filter.property("value");
  let inp_beds = beds_filter.property("value");
  let inp_baths = baths_filter.property("value");
  let inp_distance = distance_filter.property("value");
  
  // grab the data
  let url = `/api/v1.0/${inp_house_type}/${inp_price}/${inp_beds}/${inp_baths}/999999/${inp_distance}`;

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

  // Append the title element
  mapContainer.append("h2").text("New York Houses Available").style("text-align", "center");

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
    let marker = L.marker(location).bindPopup(`<h3>$${row.PRICE}</h3><p>${row.ADDRESS}</p>`);

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
    x: data.bar_data.map(row => row.PRICE).reverse(),
    y: data.bar_data.map(row => row.ADDRESS).reverse(), 
    type: "bar",
    orientation: "h",
    order: 'ascending',
    marker: {
      color: '#45C070' 
    }
  }

  // Data array
  let traces = [trace];

  // Apply a title to the layout
  let layout = {
    title: `The 10 Most Expensive Houses`,
    yaxis1: {
      title: 'Address'},
    xaxis: {
      title: 'Price'
    },
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
    type: 'scatter',
    marker: {
      color: '#45C070' // Use the 'color' variable from your JSON data
    }
  };

  // Step 4: Define the layout options
  let scatter_layout = {
    title: 'Distance from NYC Center vs Price by Square Foot',
    xaxis: {
      title: 'Distance (Miles)'
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

