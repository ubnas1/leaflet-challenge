// creating URL string for API call
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

    // Define a map object.
    let myMap = L.map("map", {
        center: [31.1231, 70.7790],
        zoom: 3,
    });
    
    
    // making a request to map APIs and put it in variables
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);
    
    

// calling createMap() function to create map 
function createMap(response){
    

    // making an empty list to store markers
    let markers = [];
    
    for (let i = 0; i < response.features.length; i++) {

        // storing magnitudes in a variable
        var magnitude = response.features[i].properties.mag;
       
        // writing string for markers
        var marker = "<strong>Magnitude: </strong>" + magnitude +  "<br><strong>Depth: </strong>" + depth;
        
        // assigning coordinates to a variable to make them easy to use
        var coords = response.features[i].geometry.coordinates;

        // assigning location to a variable to make it easy to use
        var location = response.features[i].properties.place;

        // depth of earthquake
        var depth = coords[2];

        // creating latLng object
        var latlng = L.latLng(coords[1], coords[0]);

        // Conditionals for earthquake depth color selection

        function getColor(d) {
            return d > 50 ? '#f50202' :
                   d > 20  ? '#f73191' :
                   d > 15  ? '#0ee1e8' :
                   d > 10  ? '#0bf207' :
                   d > 5   ? '#FD8D3C' :
                   d > 2   ? '#FEB24C' :
                   d > 1   ? '#FED976' :
                              '#FFEDA0';
          }

        // making circle objects and appending into the markers list 
       
            L.circle(latlng, {
            weight: 2,
            opacity: 0.5,
            color: 'black',
            fillColor: getColor(depth),
            dashArray: '3',
            fillOpacity: 0.7,
            radius: Math.pow(8, magnitude) / 2,
              }).bindTooltip().bindPopup("<strong>Magnitude: </strong>" + magnitude + "<br><strong>Depth: </strong>" + depth + "<br><strong>Location: </strong>" + location).addTo(myMap);
    }

    // creating a legend object
    
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap){
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ['<strong>Depth:</strong>'];
        var grades = [-10, 1, 2, 5, 10, 15, 20, 50];
        div.innerHTML += '<b>Depths:</b><br>'
        for (var i=0; i<grades.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'); 
           
        }
        //    div.innerHTML = labels.join('<br>');
           return div;
        };
        legend.addTo(myMap);

}


// making API call and providing data to the function createMarkers() call 
d3.json(url).then(createMap);