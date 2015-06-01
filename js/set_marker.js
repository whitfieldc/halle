$(document).on("pagecreate", "#pageMap", function(e, data){

  var ref = new Firebase("https://halle.firebaseio.com");

// Firebase Facebook login -----------------------------------------
  $('#login').on('tap', function(e) {
    e.preventDefault();
    var ref = new Firebase("https://halle.firebaseio.com");
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  });

// Format map  -----------------------------------------
  $(".ui-content", this).css({
     height: $(window).height(),
     width: $(window).width()
  });

  var mapOptions = {
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: true
        };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  navigator.geolocation.getCurrentPosition(function(position) {


    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    map.setCenter(initialLocation);

      var spaceId //MAKES PARKING SPACE ID AVAILABLE

      var marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        icon: currentLoc
      });

// Add a space to the database -----------------------------------------
// TO DO : Add ability to move marker before saving current location as open space -----------------------------------------
    $('#create-space').on('tap', function(e) {
      e.preventDefault();

      $('#post-space').popup("open", {
          overlayTheme: "a",
          positionTo: "window",
        })

      $('#add-space').on('tap', function(e) {
        var longitude = position.coords.longitude;
        var latitude  = position.coords.latitude;
        var note      = $(this).siblings('div').children().val()
        var data      = {space:{longitude:+longitude,latitude:+latitude,note:note}};
        var headers   = '{"Content-Type":"application/json"}';
        var test = new Firebase('https://halle.firebaseio.com/test');

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
          test.push({note: response.note});
        }).fail(function(response) {
          console.log(response);
          alert("shits fucked up");
        });
      });
    });

// Show available spaces from database -----------------------------------------
    $.ajax({
      url: 'http://calm-island-3256.herokuapp.com',
      // url: 'http://localhost:3000',
      type: "GET",
    }).done(function(response){
      parkingSpots = response
      for(i = 0; i < parkingSpots.length; i++){
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
      spaceId = this.id
      $('#space-options').popup("open", {
        overlayTheme: "a",
        positionTo: "window",
      })
      $('p').text(this.title);
    };

// Claim a parking spot  -----------------------------------------
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
        console.log("spot claimed")
        // add claim confirmation popup?
        // navigation begins
      }).fail(function(response) {
        alert("fuck you guys")
      })
    });
  });
});

// Space markers CSS -----------------------------------------
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

// Differentiate between new and stale spaces -----------------------------------------
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


