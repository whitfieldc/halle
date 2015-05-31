$(document).on("pageinit", "#pageMap", function(e, data){

  // --------------------------------------

  var mapOptions = { zoom: 8 };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  navigator.geolocation.getCurrentPosition(function(position) {
    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    map.setCenter(initialLocation);

    var marker = new google.maps.Marker({
      // change current location marker icon
      position: initialLocation,
      map: map,
    });

// Add a space to the database -----------------------------------------
    $('#create-space').on('tap', function(e) {
      e.preventDefault();
      var longitude = position.coords.longitude;
      var latitude  = position.coords.latitude;
      var data      = {space:{longitude:+longitude,latitude:+latitude}};
      var headers   = '{"Content-Type":"application/json"}';

      $.ajax({
        url: 'http://mysterious-lake-9849.herokuapp.com/spaces',
        type: "POST",
        data: data,
        headers: headers
        }
      ).done(function(response) {
      //   // drop new marker
      //   // notify user of successful or unsuccessful post
        alert(response);
      //   $('#successful').popup("open", {
      //     overlayTheme: "a",
      //     positionTo: "window",
      //   })
      });
    });

// Show available spaces from database -----------------------------------------
    var req = $.ajax({
      url: 'http://mysterious-lake-9849.herokuapp.com',
      type: "GET",
    });

    req.done(function(response){
      parkingSpots = response
      for(i = 0; i < parkingSpots.length; i++){
        console.log(parkingSpots[i]);
        var marker = new google.maps.Marker({
              position: new google.maps.LatLng(parkingSpots[i].latitude,parkingSpots[i].longitude),
              map: map,
              title: 'Hello World!',
              id: parkingSpots[i].id
        });
        google.maps.event.addListener(marker, 'click', spaceDetails);
      };
    });

    var spaceDetails = function() {
      // $('#space-options').text(this.id)
      $('#space-options').popup("open", {
        overlayTheme: "a",
        positionTo: "window",
      })
    };
  });
});
