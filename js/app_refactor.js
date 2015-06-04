var ref = new Firebase("https://halle.firebaseio.com");
var fbData;
var userData;

$(document).on("pagecreate", "#landing-screen", function(e, data){

  $('#login').on('click', function(e){
    e.preventDefault();

    fbAuth().then(function(authData){
      fbData = authData;
      ajaxLogin(authData);
      setProfile(authData);
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
  consumeCheck(userData.can_consume);

  $('#create-space').on('click', function(e){
    e.preventDefault();
    $('#post-space').popup("open", {
      overlayTheme: "a",
      positionTo: "window",
    });
    $('#add-space').on('click', function(e){
      e.preventDefault();
      addSpace(e);
    });
  });

  $('#claim').on('click', function(e){
    console.log("claim is working")
    e.preventDefault();
    claimSpace(e);
  });

  $('#center').on('click', function(e){
    e.preventDefault();
    centerMap(map);
  });

  $('#profile').on('click', function(e){
    e.preventDefault();
    $('#user').panel("open", {
      overlayTheme: "a",
      positionTo: "window",
    });
  });

  $('#cancel_post').on('click', function(e){
    e.preventDefault();
    deleteSpace();
  });

  $('#cancel_claim').on('click', function(e){
    e.preventDefault();
    deleteClaim();
    // clear overlay?
    centerMap(map);
  });

  var input = (document.getElementById('pac-input'));
  var searchBox = new google.maps.places.SearchBox((input));

  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input);
  google.maps.event.addListener(searchBox, 'places_changed', function(){
    localSearch(searchBox)
  });

  $(window).on('swiperight', function(e){
    e.preventDefault();
    if ( e.swipestart.coords[0] <10) {
      $('#user').panel("open", {
        overlayTheme: "a",
        positionTo: "window",
      });
    };
  });

  $('#user').on('swipeleft', function(e){
    e.preventDefault();
    $('#user').panel("close", {
      overlayTheme: "a",
      positionTo: "window",
    });
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

var setProfile = function(authData){
  var userId = authData.facebook.id;
  var name = authData.facebook.cachedUserProfile.name;
  var photo = authData.facebook.cachedUserProfile.picture.data.url;
  $('#user h4').text(name);
  $('#user h2').text('Carma:');
  $('#user img').attr('src', photo);
  $('#cancel_post').hide();
  $('#cancel_claim').hide();
};

var ajaxLogin = function(authData){
  userId = authData.facebook.id;
  var ajaxData = {user:{oauth_id:userId}};
  $.ajax({
    url: 'http://calm-island-3256.herokuapp.com/users/'+userId+'/identify',
    // url: 'http://localhost:3000/users/'+userId+'/identify',
    type: 'GET',
    data: ajaxData
  }).done(function(response) {
    userData = response;
    window.location.href = '#page-map';
  }).fail(function() {
    alert("Login Failed");
  });
};

var getLocation = function() {
  var promise = new Promise(function(resolve, reject){
    navigator.geolocation.getCurrentPosition(function(position){
      if (position) {
        resolve(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
      } else {
        reject();
      };
    });
  });
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
      icon: currentLocation
    });
  });
};

var addSpace = function(e){
  getLocation().then(function(response){
    var note = $('#note').val();
    var latitude  = response.A;
    var longitude = response.F;
    var data      = {space:{latitude:+latitude, longitude:+longitude, note:note, poster_id:userData.id}};
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
      // replace with a toast notification
      console.log(response)
      var data = {user:{post: true}};
      $.ajax({
        // url: 'http://localhost:3000/users/'+fbData.facebook.id,
        url: 'http://calm-island-3256.herokuapp.com/users/'+fbData.facebook.id,
        type: 'PUT',
        data: data
      }).done(function(response){
        $('#cancel_post').show();
        userData.recentPost = response.id //needs to go in second .done after merge
        console.log(response);
        consumeCheckAdd(response.can_consume);
        // consumeCheck.off();
      }).fail(function(response){
        console.log('fail posting')
      });
      // var marker = new google.maps.Marker({
      //   position: new google.maps.LatLng(response.latitude,response.longitude),
      //   map: map,
      //   title:  response.note,
      //   icon: markerSelect(response),
      //   id: response.id,
      //   creation: response.converted_time,
      //   animation: google.maps.Animation.DROP,
      //   zIndex: google.maps.Marker.MAX_ZINDEX + 1
      // });
    }).fail(function(response) {
      alert("Could not create space");
    });
  });
};

var deleteSpace = function(e){
  var spaceId = userData.recentPost;
  $.ajax({
    // url: 'http://localhost:3000/spaces/'+spaceId,
    url: 'http://calm-island-3256.herokuapp.com/spaces/'+spaceId,
    type: 'DELETE'
  }).done(function(){
    $('#cancel_post').hide();
    var data = {user:{claim: true}};
    $.ajax({
      url: 'http://calm-island-3256.herokuapp.com/users/'+fbData.facebook.id,
      // url: 'http://localhost:3000/users/'+fbData.facebook.id,
      type: 'PUT',
      data: data
    });
  }).fail(function(){
    alert('could not destroy space');
    console.log('could not destroy space');
  });
};

var claimSpace = function(e){
  var spaceId = e.target.name
  var headers = '{"Content-Type":"application/json"}';
  $.ajax({
    url: 'http://calm-island-3256.herokuapp.com/spaces/'+spaceId,
    // url: 'http://localhost:3000/spaces/'+spaceId,
    type: 'PUT',
    headers: headers
  }).done(function(response) {
    var data = {user:{consume: true}};
    $.ajax({
      url: 'http://calm-island-3256.herokuapp.com/users/'+fbData.facebook.id,
      // url: 'http://localhost:3000/users/'+fbData.facebook.id,
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
      userData.recentClaim = spaceId;
      $('#cancel_claim').show();
      // replace with a toast notification
    }).fail(function(response){
      console.log('claim space user update failed');
    });
    var destination = response.latitude +","+ response.longitude
    calcRoute(destination, map);
  }).fail(function(response) {
    console.log("claim space ajax call failed");
  });
};

var deleteClaim = function(e){
  var spaceId = userData.recentClaim;
  var headers = '{"Content-Type":"application/json"}';
  $.ajax({
    url: 'http://calm-island-3256.herokuapp.com/spaces/'+spaceId,
    // url: 'http://localhost:3000/spaces/'+spaceId,
    type: 'PUT',
    headers: headers
  }).done(function(response) {
    var data = {user:{post: true}};
    $.ajax({
      url: 'http://calm-island-3256.herokuapp.com/users/'+fbData.facebook.id,
      // url: 'http://localhost:3000/users/'+fbData.facebook.id,
      type: 'PUT',
      data: data
    }).done(function(){
      $('#cancel_claim').hide();
    }).fail(function(){
      alert('could not remove claim');
      console.log('could remove claim');
    });
  });
};

var calcRoute = function(finalDestination, map) {
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  getLocation().then(function(currentLocation){
    var request = {
      origin: currentLocation,
      destination: finalDestination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
      else{alert("Server Error: Directions Unavailable")}
    });
  });
};

var loadSpaces = function(){
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
}

var spaceDetails = function() {
  spaceId = this.id;
  $('#claim').attr('name', spaceId);
  $('#space-options').popup("open", {
    overlayTheme: "a",
    positionTo: "window",
  });
  $('#note-display').text('Note: ' + this.title);
  // creation = $(this)
  googleCreate = this.creation
  min = Math.floor((Date.now() - googleCreate) / 60000);
  console.log(min)
  $('#time-display').text('Posted: ' + min + ' minutes ago');
};

var markerSelect = function(spaceObject){
  var creation = spaceObject.converted_time;
  if ((Date.now() - creation) <= (5*60000)){
    return spaceFresh;
  } else {
    return spaceStale;
  };
};

var liveDrop = function(childSnapshot, prevChildName){
  var newChild = childSnapshot.val();
  var newChildKey = Object.keys(newChild)[0];
  var spaceObj = JSON.parse(newChild[newChildKey]);

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(spaceObj.latitude,spaceObj.longitude),
    map: map,
    animation: google.maps.Animation.DROP,
    title:  spaceObj.note,
    icon: markerSelect(spaceObj), //set marker according to age
    id: spaceObj.id,
    creation: spaceObj.converted_time
  });
  google.maps.event.addListener(marker, 'click', spaceDetails);
  console.log("Hit firebase");
}

//Search
var localSearch = function(searchObject){
  var places = searchObject.getPlaces();
    if (typeof searchMarker !== 'undefined') {
      searchMarker.setMap(null)
    };

  for (var i = 0, place; place = places[i]; i++) {
    searchMarker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      icon: searchLocation
      // animation: google.maps.Animation.DROP
    });
    map.setZoom(16);
    map.panTo(place.geometry.location);
  }
}

var consumeCheck = function(can_consume){
  if (can_consume === true){
    $('#carma-false').hide();
    loadSpaces();
    ref.on('child_added', function(childSnapshot, prevChildName){
      liveDrop(childSnapshot, prevChildName);
    });
    console.log('can_consume = true')
  } else {
    console.log('can_consume = false')
  };
};

var consumeCheckAdd = function(can_consume){
  if (can_consume === true){
    $('#carma-false').hide();
    loadSpaces();
    console.log('can_consume = true')
  } else {
    console.log('can_consume = false')
  };
};

// Map format???
  // $(".ui-content", this).css({
   // height: $(window).height(),
   // width: $(window).width()
// });

// Space markers CSS -----------------------------------------
var currentLocation = {
  path: fontawesome.markers.LOCATION_ARROW,
  scale: 0.55,
  strokeWeight: 0.2,
  strokeColor: 'black',
  strokeOpacity: 1,
  fillColor: '#263238',
  fillOpacity: 1
};
var spaceFresh = {
  path: fontawesome.markers.MAP_MARKER,
  scale: 0.55,
  strokeWeight: 0.2,
  strokeColor: 'black',
  strokeOpacity: 1,
  fillColor: '#ED273E',
  fillOpacity: 1
};
var spaceStale = {
  path: fontawesome.markers.MAP_MARKER,
  scale: 0.55,
  strokeWeight: 0.2,
  strokeColor: 'black',
  strokeOpacity: 1,
  fillColor: '#A282F9',
  fillOpacity: 1
};
var searchLocation = {
  path: fontawesome.markers.UNIVERSITY,
  scale: 0.25,
  strokeWeight: 0.2,
  strokeColor: 'black',
  strokeOpacity: 1,
  fillColor: 'black',
  fillOpacity: 1
}