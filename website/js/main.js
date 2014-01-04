var tilesUrl='http://tiles.seminar.io/nantes/{z}/{x}/{y}.jpeg';
var tiles = new L.TileLayer(tilesUrl, {tms:true, minZoom: 14, maxZoom: 15});

var heatmapLayer = null;
var heatmapLayerLatest = L.TileLayer.heatMap({
    attribution: 'Images &copy; <a href="http://vuduciel.loire-atlantique.fr/utiliser-les-photos.html" target="_blank">D&eacute;partement de Loire-Atlantique</a>',
    radius: {value: 200, absolute: true},
    opacity: 0.8,
    gradient: {
        0.10: "rgb(0,0,255)",
        0.30: "rgb(0,255,255)",
        0.55: "rgb(0,255,0)",
        0.80: "rgb(255,255,0)",
        1.00: "rgb(255,0,0)"
    }
});

function updateHeatmap(heatmapLayer) {
    var stations = [];
    var totalAvailableBikes = 0;

    heatmapLayer = L.TileLayer.heatMap({
        attribution: 'Images &copy; <a href="http://vuduciel.loire-atlantique.fr/utiliser-les-photos.html" target="_blank">D&eacute;partement de Loire-Atlantique</a>',
        radius: {value: 200, absolute: true},
        opacity: 0.8,
        gradient: {
            0.10: "rgb(0,0,255)",
            0.30: "rgb(0,255,255)",
            0.55: "rgb(0,255,0)",
            0.80: "rgb(255,255,0)",
            1.00: "rgb(255,0,0)"
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
        dateOptions = {weekday: "long", year: "numeric", month: "short", day: "numeric"};
        $('#last-update-date').text(lastUpdate.toLocaleDateString("fr-FR", dateOptions));
        $('#last-update-time').text("à " + lastUpdate.toLocaleTimeString("fr-FR") + " UTC+1");
        heatmapLayer.setData(stations);
        map.addLayer(heatmapLayer);
        map.removeLayer(heatmapLayerLatest);
        heatmapLayerLatest = heatmapLayer;

    }, "json");
}


var map = L.map('map', {
    center: new L.LatLng(47.218, -1.5515),
    zoom: 14,
    layers: [tiles],
    zoomControl: false,
    touchZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    scrollWheelZoom: false,
});
map.attributionControl.setPrefix("");

var  southWest = L.latLng(47.162, -1.705),
     northEast = L.latLng(47.274, -1.395),
     bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);
updateHeatmap(heatmapLayer);

setInterval(updateHeatmap, 60 * 1000, heatmapLayer);
