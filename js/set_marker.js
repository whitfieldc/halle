$(document).on("pagecreate", "#pageMap", function(e, data){

  var ref = new Firebase("https://halle.firebaseio.com");
  
  ref.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }
  });

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
        icon: currentLoc
        //doesn't load on mobile
      });

// Add a space to the database -----------------------------------------
    $('#create-space').on('tap', function(e) {
      e.preventDefault();

      $('#post-space').popup("open", {
          overlayTheme: "a",
          positionTo: "window",
        })

      // add ability to move marker & add note to parking spot before saving current location as open space

      $('#add-space').on('tap', function(e) {
        var longitude = position.coords.longitude;
        var latitude  = position.coords.latitude;
        var note      = $(this).siblings('div').children().val()
        var data      = {space:{longitude:+longitude,latitude:+latitude,note:note}};
        var headers   = '{"Content-Type":"application/json"}';
        $.ajax({
          url: 'http://calm-island-3256.herokuapp.com/spaces',
          // url: 'http://localhost:3000/spaces',
          type: "POST",
          data: data,
          headers: headers
        }).done(function(response) {
          $('#add-space').remove();
          $('#note').remove();
          $('#popup-par').text('Added √');
          setTimeout(function () {
            $('#post-space').popup('close');
          }, 1500);
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
                title:  parkingSpots[i].note, // should this be something else? What if the note is long?
                // note: parkingSpots[i].note
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
      debugger
      $('#space-options').popup("open", {
        overlayTheme: "a",
        positionTo: "window",
      })
      $('p').text(this.title);

      // debugger
    };

    $('#claim').on('click', function(e){
      debugger
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

var currentLoc = {
        path: fontawesome.markers.EXCLAMATION,
        scale: 0.65,
        strokeWeight: 0.2,
        strokeColor: 'black',
        strokeOpacity: 1,
        fillColor: '#263238',
        fillOpacity: 1
    }

var spaceFresh = {
        path: fontawesome.markers.EXCLAMATION,
        scale: 0.5,
        strokeWeight: 0.2,
        strokeColor: 'black',
        strokeOpacity: 1,
        fillColor: '#76FF03',
        fillOpacity: 1
    }
var spaceStale = {
        path: fontawesome.markers.EXCLAMATION,
        scale: 0.5,
        strokeWeight: 0.2,
        strokeColor: 'black',
        strokeOpacity: 1,
        fillColor: '#AD1457',
        fillOpacity: 1
    }

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


