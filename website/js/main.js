var osmUrl='http://tiles.seminar.io/nantes/{z}/{x}/{y}.jpeg';
var osm = new L.TileLayer(osmUrl, {tms:true, minZoom: 14, maxZoom: 15});       

var heatmapLayer = null;
var heatmapLayerLatest = L.TileLayer.heatMap({
    radius: {value: 180, absolute: true},
    opacity: 0.75,
    gradient: {
        0.25: "rgb(0,0,255)",
        0.45: "rgb(0,255,255)",
        0.65: "rgb(0,255,0)",
        0.95: "yellow",
        1.0: "rgb(255,0,0)"
    }
});

function updateHeatmap(heatmapLayer) {
    console.log("Updating heatmap...");
    var stations = [];
    var totalAvailableBikes = 0;

    heatmapLayer = L.TileLayer.heatMap({
        radius: {value: 180, absolute: true},
        opacity: 0.75,
        gradient: {
            0.25: "rgb(0,0,255)",
            0.45: "rgb(0,255,255)",
            0.65: "rgb(0,255,0)",
            0.95: "yellow",
            1.0: "rgb(255,0,0)"
        }
    });
    $.get("js/stations.js", function(data) {
        var lastUpdate = new Date(data.timestamp * 1000);

        data.stations.forEach(function(station) {
            point = {lat:station.position.lat, lon:station.position.lng, value:station.available_bikes};
            stations.push(point);
            totalAvailableBikes += station.available_bikes;
        });

        $('#total-bikes').text(totalAvailableBikes);
        $('#total-stations').text(stations.length);
        $('#last-update').text(lastUpdate.toLocaleDateString() + " " + lastUpdate.toLocaleTimeString());

        heatmapLayer.setData(stations);
        map.addLayer(heatmapLayer);
        map.removeLayer(heatmapLayerLatest);
        heatmapLayerLatest = heatmapLayer;

    }, "json");
}


var map = L.map('map', {
    center: new L.LatLng(47.215, -1.5515),
    zoom: 14,
    layers: [osm, heatmapLayerLatest],
    attributionControl: false,
    zoomControl: false,
    touchZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    scrollWheelZoom: false,
});

var  southWest = L.latLng(47.162, -1.705),
     northEast = L.latLng(47.274, -1.395),
     bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);
updateHeatmap(heatmapLayer);

setInterval(updateHeatmap, 3 * 1000, heatmapLayer);
