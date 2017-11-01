// Create Map
var map = new L.map('mapid', {
  center: new L.LatLng(33.749, -84.388),
  zoom: 12
});

// Create basemap and Layers
var basemap = new L.StamenTileLayer("toner-background").addTo(map);

// Add Basemap labels
map.createPane('bMapLabels');

map.getPane('bMapLabels').style.zIndex = 650;
map.getPane('bMapLabels').style.pointerEvents = 'none';

var basemapLabels = new L.StamenTileLayer("toner-labels", {
  pane: 'bMapLabels'
}).addTo(map);

// info panel
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = '<center><h3>2015 HEALTH INSURANCE</br>BY CENSUS TRACT</h3>' + (props ? '<h2><b><font color="yellow">' + props.Pct_Pop_wNo_Health_Ins + '%' + '</h2>' + '</font>' + 'DOES NOT' + '</b>' + ' HAVE INSURANCE' + '</center>' : 'Hover over a census tract');
};

info.addTo(map);

// Data Style
function colorScale(d) {
  return d > 80 ? '#a50f15':
         d > 60 ? '#de2d26':
         d > 40 ? '#fb6a4a':
         d > 20 ? '#fc9272':
         d > 0  ? '#fcbba1':
                  '#fee5d9';
}

function healthStyle(feature) {
  return {
    fillColor: colorScale(feature.properties.Pct_Pop_wNo_Health_Ins),
    weight: 1,
    opacity: 1,
    color: '#636363',
    dashArray: '3',
    fillOpacity: 0.6
  };
}

// Map Interaction
var healthData;

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 7,
    color: '#ffff00',
    dashArray: '',
    fillOpacity: 0.6
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}


function resetHighlight(e) {
  healthData.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

// Data Load
healthData = L.geoJson(healthIns, {
  style: healthStyle,
  onEachFeature: onEachFeature,
  attribution: '<a href="http://opendata.atlantaregional.com/datasets/health-insurance-2015/">Atlanta Regional Commission</a>'
}).addTo(map);

// Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 20, 40, 60, 80],
    labels = [],
    from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' + colorScale(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(map);
