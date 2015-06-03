var ref = new Firebase("https://halle.firebaseio.com");
var fbData;
var userData;

$(document).on("pagecreate", "#landing-screen", function(e, data){

  $('#login').on('click', function(e){
    e.preventDefault();

    fbAuth().then(function(authData){
      fbData = authData;
      ajaxLogin(authData);
    });
  });
});

$(document).on("pagecreate", "#page-map", function(e, data){

  var mapOptions = {
    zoom: 13,
    disableDefaultUI: true,
    zoomControl: true
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  markCenter(map);
  loadSpaces();

  $('#create-space').on('tap', function(e){
    e.preventDefault();
    $('#post-space').popup("open", {
      overlayTheme: "a",
      positionTo: "window",
    });
    $('#add-space').on('tap', function(e){
      addSpace(e);
    });
  });

  $('#claim').on('click', function(e){
    e.preventDefault();
    claimSpace(e);
  });

  $('#center').on('tap', function(e){
    e.preventDefault();
    centerMap(map);
  });
});

//function definitions only ++++++++++++++++++++++++++++++++++++++++++++++++++++++

var fbAuth = function(){
  var promise = new Promise(function(resolve, reject){
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        alert("login failed!");
        reject(error);
      } else {
        resolve(authData);
      };
    });
  })
  return promise;
};

var ajaxLogin = function(authData){
  userId = authData.facebook.id
  var ajaxData = {user:{oauth_id:userId}};
  $.ajax({
    // url: 'http://calm-island-3256.herokuapp.com',
    url: 'http://localhost:3000/users/'+userId+'/identify',
    type: 'GET',
    data: ajaxData
  }).done(function(response) {
    userData = response;
    window.location.href = '#page-map';
  }).fail(function() {
    alert("YOU'RE A FAILURE")
    console.log("FAILURE")
  });
}

var getLocation = function() {
  var promise = new Promise(function(resolve, reject){
    navigator.geolocation.getCurrentPosition(function(position){
      if (position) {
        resolve(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
      } else {
        reject();
      }
    });
  })
  return promise;
};

var centerMap = function(map){
  getLocation().then(function(response){
    map.setCenter(response);
  });
};

var markCenter = function(map){
  getLocation().then(function(response){
    map.setCenter(response);
    var marker = new google.maps.Marker({
      position: response,
      map: map,
      icon: currentLoc
    });
  })
};

var addSpace = function(e){
  getLocation().then(function(response){
    var note = $('#note').val()
    var latitude  = response.A;
    var longitude = response.F;
    var data      = {space:{latitude:+latitude, longitude:+longitude, note:note}};
    var headers   = '{"Content-Type":"application/json"}';

    $.ajax({
      // url: 'http://calm-island-3256.herokuapp.com/spaces',
      url: 'http://localhost:3000/spaces',
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
        // replace with a toast notification
      console.log(response)
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
}

var claimSpace = function(e){
  var spaceId = e.target.name
  var headers = '{"Content-Type":"application/json"}';
  $.ajax({
    // url: 'http://calm-island-3256.herokuapp.com/spaces/'+spaceId,
    url: 'http://localhost:3000/spaces/'+spaceId,
    type: 'PUT',
    headers: headers,
    data: '' //test without this
  }).done(function(response) {
    var data = {user:{consume: true}};
    $.ajax({
      url: 'http://localhost:3000/users/'+fbData.facebook.id,
      type: 'PUT',
      data: data
    }).done(function(response){
      $('#space-options p').remove();
      $('#space-options a').remove();
      $('#space-options button').remove();
      $('#space-options h4').text('Claimed √');
      setTimeout(function () {
        $('#space-options').popup('close');
      }, 1500);
      // replace with a toast notification
      calcRoute(initialLocation, response.latitude +","+ response.longitude)
    }).fail(function(response){
      console.log('claim space user update failed');
    })
  }).fail(function(response) {
    console.log("claim space ajax call failed")
  });
};

// Show Markers Request

var loadSpaces = function(){
  $.ajax({
    // url: 'http://calm-island-3256.herokuapp.com',
    url: 'http://localhost:3000',
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
}

var spaceDetails = function() {
  spaceId = this.id;
  $('#claim').attr('name', spaceId);
  $('#space-options').popup("open", {
    overlayTheme: "a",
    positionTo: "window",
  });
  $('p').text(this.title);
};

var markerSelect = function(spaceObject){
  var creation = spaceObject.converted_time;
  if ((Date.now() - creation) <= (5*60000)){
    return spaceFresh;
  } else {
    console.log(Date.now() - creation)
    return spaceStale;
  };
};

// Map format???
  // $(".ui-content", this).css({
   // height: $(window).height(),
   // width: $(window).width()
// });

// Space markers CSS -----------------------------------------
var currentLoc = {
  path: fontawesome.markers.EXCLAMATION,
  scale: 0.65,
  strokeWeight: 0.2,
  strokeColor: 'black',
  strokeOpacity: 1,
  fillColor: '#263238',
  fillOpacity: 1
};
var spaceFresh = {
  path: fontawesome.markers.EXCLAMATION,
  scale: 0.5,
  strokeWeight: 0.2,
  strokeColor: 'black',
  strokeOpacity: 1,
  fillColor: '#76FF03',
  fillOpacity: 1
};
var spaceStale = {
  path: fontawesome.markers.EXCLAMATION,
  scale: 0.5,
  strokeWeight: 0.2,
  strokeColor: 'black',
  strokeOpacity: 1,
  fillColor: '#AD1457',
  fillOpacity: 1
};