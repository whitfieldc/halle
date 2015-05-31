
$(document).on("pagecreate", "#pageMap", function(e, data){

    $(".ui-content", this).css({
       height: $(window).height(),
       width: $(window).width()
   });

  // --------------------------------------

  var mapOptions = {
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: true
        };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  navigator.geolocation.getCurrentPosition(function(position) {
    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    map.setCenter(initialLocation);

      var spaceId
      var marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        icon: "../img/marker.png"
        //doesn't load on mobile
      });

// Add a space to the database -----------------------------------------
    $('#create-space').on('tap', function(e) {
      e.preventDefault();

      // add ability to move marker & add note to parking spot before saving current location as open space

      var longitude = position.coords.longitude;
      var latitude  = position.coords.latitude;
      var data      = {space:{longitude:+longitude,latitude:+latitude}};
      var headers   = '{"Content-Type":"application/json"}';

      $.ajax({
        url: 'http://calm-island-3256.herokuapp.com/spaces',
        // url: 'http://localhost:3000/spaces',
        type: "POST",
        data: data,
        headers: headers
      }).done(function(response) {
        // drop new marker
        $('#successful').popup("open", {
          overlayTheme: "a",
          positionTo: "window",
          // make disappear after 1s
        })
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
      }).fail(function(response) {
        console.log(response);
        alert("shits fucked up");
      });
    });

// Show available spaces from database -----------------------------------------

      var req = $.ajax({
        url: 'http://calm-island-3256.herokuapp.com',
        // url: 'http://localhost:3000',
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
                icon: markerSelect(parkingSpots[i]), //set marker according to age
                id: parkingSpots[i].id,
                creation: parkingSpots[i].converted_time
          });
          google.maps.event.addListener(marker, 'click', spaceDetails);
        };
      });
    var spaceDetails = function() {
      // $('#space-options').text(this.note)
      spaceId = this.id
      $('#space-options').popup("open", {
        overlayTheme: "a",
        positionTo: "window",
      })
    };

    $('#claim').on('click', function(e){
      e.preventDefault();
      var headers = '{"Content-Type":"application/json"}';
      $.ajax({
        url: 'http://calm-island-3256.herokuapp.com/spaces/'+spaceId,
        // url: 'http://localhost:3000/spaces/'+spaceId,
        type: 'PUT',
        headers: headers,
        data: '' //test without this
      }).done(function(response) {
        alert("success!")
        // navigation begins
      }).fail(function(response) {
        alert("fuck you guys")
      })
    });
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


