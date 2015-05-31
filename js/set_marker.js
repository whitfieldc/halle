
$(document).on("pageinit", "#pageMap", function(e, data){

  // --------------------------------------

  var mapOptions = {
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: true
        };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);

      var marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        icon: "../img/marker.png"
      });

// Add a space to the database -----------------------------------------
    $('#create-space').on('tap', function(e) {
      e.preventDefault();
      var longitude = position.coords.longitude;
      var latitude  = position.coords.latitude;
      var data      = {space:{longitude:+longitude,latitude:+latitude}};
      var headers   = '{"Content-Type":"application/json"}';

      $.ajax({
        url: 'http://calm-island-3256.herokuapp.com/spaces',
        type: "POST",
        data: data,
        headers: headers
        }
      ).done(function(response) {
        console.log(response);
        var marker = new google.maps.Marker({
                position: new google.maps.LatLng(response.latitude,response.longitude),
                map: map,
                title:  response.note,
                icon: markerSelect(response),
                id: response.id,
                creation: response.converted_time,
                animation: google.maps.Animation.DROP,
                zIndex: google.maps.Marker.MAX_ZINDEX + 1
          });
      });
    });



// Show available spaces from database -----------------------------------------
    // $('#map-canvas').on("tap", function(){
      var req = $.ajax({
        url: 'http://calm-island-3256.herokuapp.com',
        type: "GET",
      });

      req.done(function(response){
        parkingSpots = response
        for(i = 0; i < parkingSpots.length; i++){
          console.log(parkingSpots[i].converted_time)
          console.log(Date.now())

          console.log(parkingSpots[i]);
          var marker = new google.maps.Marker({
                position: new google.maps.LatLng(parkingSpots[i].latitude,parkingSpots[i].longitude),
                map: map,
                title:  parkingSpots[i].note,
                icon: markerSelect(parkingSpots[i]),
                id: parkingSpots[i].id,
                creation: parkingSpots[i].converted_time
          });
          google.maps.event.addListener(marker, 'click', spaceDetails);
        };
      });
    // })
    var spaceDetails = function() {
      console.log(this.id)
      // debugger
      // $('#space-options').text(this.id)
      // $('#space-options').panel("open")
      // $(this).show('#space-options')
    };
  });
});

var spaceFresh = "../img/mm_20_green.png"
var spaceStale = "../img/mm_20_blue.png"

var markerSelect = function(spaceObject){
  var creation = spaceObject.converted_time
  if ((Date.now() - creation) <= (5*60000)){
    // console.log(Date.now() - creation)
    return spaceFresh;
  }

  else{
    console.log(Date.now() - creation)
    return spaceStale;
  }
}


