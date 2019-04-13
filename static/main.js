/* Data points defined as an array of LatLng objects */
var current_time = moment();
var ZOOM_LEVEL = 15;
var map, heatmap;
var heatmapData = [
  /*
  new google.maps.LatLng(37.782, -122.447),
  new google.maps.LatLng(37.782, -122.445),
  new google.maps.LatLng(37.782, -122.443),
  new google.maps.LatLng(37.782, -122.441),
  new google.maps.LatLng(37.782, -122.439),
  new google.maps.LatLng(37.782, -122.437),
  new google.maps.LatLng(37.782, -122.435),
  new google.maps.LatLng(37.785, -122.447),
  new google.maps.LatLng(37.785, -122.445),
  new google.maps.LatLng(37.785, -122.443),
  new google.maps.LatLng(37.785, -122.441),
  new google.maps.LatLng(37.785, -122.439),
  new google.maps.LatLng(37.785, -122.437),
  new google.maps.LatLng(37.785, -122.435)
  */
];

function initMap() {
  var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);
  map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    center: sanFrancisco,
    //mapTypeId: 'satellite',
    zoom: ZOOM_LEVEL
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData
  });
  heatmap.setMap(map);

  //// Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var input2 = document.getElementById('pac2-input');
  var searchBox2 = new google.maps.places.SearchBox(input2);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    /*
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    */

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    map.setZoom(ZOOM_LEVEL);
    update_heatmap();
  });
  searchBox2.addListener('places_changed', function() {
    var places = searchBox2.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    /*
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    */

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    map.setZoom(ZOOM_LEVEL);
    update_heatmap();
  });
}

$(function() {
  $('input[name="getdate"]').daterangepicker({
    "singleDatePicker": true,
    "timePicker": true,
    "parentEl": "Pick Date Time to Query",
    "startDate": "04/05/2019",
    "endDate": "08/31/2019",
    "minDate": "04/05/2019",
    "maxDate": "08/31/2019",
    "drops": "down"
  }, function(start, end, label) {
    //console.log('New date selected: ' + start.format('YYYY-MM-DDTHH:mm'));
    current_time = start;
    update_heatmap();
  });
});

function update_heatmap() {
  heatmap.setMap(null);
  var my_pos = map.getCenter();
  console.log(my_pos.lat() + ' ' + my_pos.lng());
  console.log(current_time.format("DD.MM.YYYY HH:mm"));
  heatmapData = []
  for(var i = 0; i < 10000; i++) {
    heatmapData.push(new google.maps.LatLng(my_pos.lat() + (Math.random() - 0.5)*0.04, my_pos.lng() + (Math.random() - 0.5)*0.04));
  }
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData
  });
  heatmap.setMap(map);
  // can put stuff in heatmapData for map.center as origin and for timestamp current_time
}

/*
function update_time() {
  var slider = document.getElementById("myRange");
  update_heatmap(slider.value, map.center);
}
*/
