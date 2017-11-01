// citations: https://github.com/fraxen/tectonicplates
// distance function: http://www.geodatasource.com/developers/javascript

// an array for the magnitude
var magnitudes;
// an array for depth
var depths;
// an array for lat & long
var latitudes, longitudes;

// minimum and maximum values for magnitude and depth
var magnitudeMin, magnitudeMax;
var depthMin, depthMax;

// the dots we'll be adding to the map
var circles = [];

// table as the data set
var table, tec;

// my leaflet.js map
var mymap;

    // accessToken = 'pk.eyJ1IjoiYXVjaGVyIiwiYSI6ImNqODd4NnBndzFjZDQyd3FocnM4Njc2NWQifQ.dql4s6oWRANbYGt44i6n9A',
    // options = {
    //     lat: 0,
    //     lng: 0,
    //     zoom: 1,
    //     studio: true, // false to use non studio styles
    //     style: 'mapbox://styles/aucher/cj87xw3fi3z8a2qpbdhsqfcw8'
    // };

// var mappa = new Mappa('Mapbox', accessToken);
// var canvas;


// max distance from techtonic plate- in kl
var maxDist = 100;

function preload() {
    // load the CSV data into our `table` variable and clip out the header row
    tec = loadJSON('assets/tecMapping.json');
    table = loadTable("assets/all_month.csv", "csv", "header", findNearestPlate);
}

function setup() {
    // create your own map
    mymap = L.map('quake-map',)
        .setView([31.505, -0.09], 2); // zoom level 2
    //
    // // load a set of map tiles (you shouldn't need to touch this)
    L.tileLayer('https://api.mapbox.com/styles/v1/aucher/cj9epjgcw7bqg2smo8k9rodfm/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        minZoom: 0,
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYXVjaGVyIiwiYSI6ImNqODd4NnBndzFjZDQyd3FocnM4Njc2NWQifQ.dql4s6oWRANbYGt44i6n9A'
    }).addTo(mymap);

    // call our function (defined below) that populates the maps with markers based on the table contents
    drawDataPoints();

    createCanvas(800, 600);
    drawSummaryStats();
    // console.log(tec);
    // console.log(table);
}


function findNearestPlate(){

    for (t in table.rows){
        thisEvent = table.rows[t].obj;
        thisEvent.boundary = 'no boundary';
        thisEvent.latitude = +thisEvent.latitude;
        thisEvent.longitude = +thisEvent.longitude;

        for (b in tec){
            if (thisEvent.latitude <= tec[b].maxLat && thisEvent.latitude >= tec[b].minLat
                && thisEvent.longitude <= tec[b].maxLon && thisEvent.longitude >= tec[b].minLon){
                thisEvent.boundary = tec[b].Boundary;
            }
        }
    }
}

function drawDataPoints(){
    strokeWeight(2);
    stroke(255,0,0);
    var radius = 10000, // in meters
        rstep = 50000,
        o = 0.25;
    // cycle through the parallel arrays and add a dot for each event
    for(i in table.rows){
        thisEvent = table.rows[i].obj;
        drawCircle(thisEvent, radius, o);

        if (thisEvent.mag > 2){
            drawCircle(thisEvent, radius + 1 * rstep, 0);
        }

        if (thisEvent.mag > 3){
            drawCircle(thisEvent, radius + 2 * rstep, 0);
        }

        if (thisEvent.mag > 4){
            drawCircle(thisEvent, radius + 3 * rstep, 0);
        }

        if (thisEvent.mag > 5){
            drawCircle(thisEvent, radius + 4 * rstep, 0);
        }

        if (thisEvent.mag > 6){
            drawCircle(thisEvent, radius + 5 * rstep, 0);
        }

    }
}

function drawCircle(thisEvent, r, o){
    var circle = L.circle([thisEvent.latitude, thisEvent.longitude], {
        color: getColor(thisEvent.boundary),      // the dot stroke color
        fillColor: getColor(thisEvent.boundary), // the dot fill color
        fillOpacity: o,  // use some transparency so we can see overlaps
        radius: r,
        opacity: 0.6,
        weight: 2
    }).bindPopup(`<p>${(thisEvent.place.toUpperCase())} 
            <br /> lat: ${thisEvent.latitude} lon: ${thisEvent.longitude}
            <br /> ${thisEvent.boundary}
            </p>`);
    circle.addTo(mymap);
    circles.push(circle);
}

function getColor(b){
    switch (b){
        case 'Juan de Fuca - North America':
            return 'pink';
        case 'Nazca - South America':
            return 'orange';
        case 'Cocos Plate - Caribbean':
            return 'purple';
        case 'Eurasian - Filipino':
            return 'green';
        case 'Pacific - Australian':
            return 'powderblue';
        case 'Eurasian - North America':
            return 'royalBlue';
        default:
            return 'lightGray';
    }
}

function drawSummaryStats(){
    let time = table.getColumn("time");

    let maxTime = _.max(time),
        minTime = _.min(time);
        // boundaries = _.uniq(_.map(table.rows, function(d){return d.obj.boundary;}));

    let boundaryCnt = _.countBy(table.rows, function(item) {
        obj = item.obj;
        return obj.boundary;
    });

    let rowH = 50,
        rowS = 0;

    textSize(36);
    noStroke();
    for (b in boundaryCnt){
        fill(getColor(b));
        text(`${b}: ${boundaryCnt[b]}`, rowH, rowH + rowS);
        rowS+=50;
    };

    console.log(boundaryCnt);
}

function removeAllCircles(){
    // remove each circle from the map and empty our array of references
    circles.forEach(function(circle, i){
        mymap.removeLayer(circle);
    });
    circles = [];
}


// function drawingOnCanvas(canvasOverlay, params){
//     var ctx = params.canvas.getContext('2d');
//     ctx.clearRect(0,0,params.canvas.width, params.canvas.height);
//     // ctx.fillStyle = "rgba(255,116,0, 0.2)";
//     ctx.strokeStyle = "rgba(0,0,0, 0.3)";
//     for (i in table.rows){
//         var d = table.rows[i].obj,
//             lat = d.latitude,
//             lon = d.longitude;
//         // if (params.bounds.contains([lat, lon])) {
//             dot = canvasOverlay._map.latLngToContainerPoint([lat, lon]);
//             ctx.beginPath();
//             ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
//             ctx.stroke();
//             ctx.closePath();
//         // console.log(dot);
//         // }
//     }
// }
