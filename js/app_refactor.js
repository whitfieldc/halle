var ref = new Firebase("https://halle.firebaseio.com");
var fbData;
var userData;
// var baseUrl = 'http://localhost:3000/'
var baseUrl = 'https://calm-island-3256.herokuapp.com/'

$(document).on("pagecreate", "#landing-screen", function(e, data){

  $('#login').on('click', function(e){
    e.preventDefault();

    fbAuth().then(function(authData){
      fbData = authData;
      var fbString = JSON.stringify(authData);
      window.localStorage.setItem("fbData", fbString);
      ajaxLogin(authData);
      setProfile(authData);
    });
  });
});

$(document).on("pagecreate", "#page-map", function(e, data){
  var directionsDisplay;
  markerArray = [];
  var lastSearch;
  var mapOptions = {
    zoom: 13,
    disableDefaultUI: true
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  ref.on('child_added', function(childSnapshot, prevChildName){
    liveDrop(childSnapshot, prevChildName);
  });

  markCenter(map);
  consumeCheck(userData.can_consume);

  $('#test').on('click', function(e){
    e.preventDefault();

  })

  $('#logout').on('click', function(e){
    e.preventDefault();
    ref.unauth();
    window.location.href = '#landing-screen';
  });

  $('#page-map').on( 'click', '#create-space', function(ev){
    ev.preventDefault();
    centerMap(map);
    $('#create-space').hide();
    $('#center').hide();
    $('#search').hide();
    $('#post-space').popup("open");
    $(':input','#post-space').val('');
    $('#post-space').popup("open", {
      overlayTheme: "a",
      positionTo: "window",
    });
    $('#add-space').on('click', function(e){
      if (e.handled !== true) {
        e.preventDefault();
        // console.log('hitting the click event')
        addSpace(e);
        e.handled = true;
      };
    });
  });

  $('#post-space').bind({
    popupafterclose: function(e) {
      e.preventDefault();
      $('#create-space').show();
      $('#center').show();
      $('#search').show();
    }
  });

  $('#page-map').on('click', '#claim', function(e){
    console.log("claim is working");
    e.preventDefault();
    claimSpace(e);
  });

  $('#page-map').on('click', '#center', function(e){
    e.preventDefault();
    centerMap(map);
    closestSpace()
  });

  $('#page-map').on('click', '#profile', function(e){
    e.preventDefault();
    $('#user').panel("open");
  });

  $('#page-map').on('click', '#cancel_post', function(e){
    e.preventDefault();
    deleteSpace();
  });

  $('#page-map').on('click', '#cancel_claim', function(e){
    e.preventDefault();
    cancelClaim();
    // clear overlay?
    // centerMap(map);
  });

  $('#search-area').hide();

  $('#page-map').on('click', '#search', function(e){
    console.log($('#search-area').attr('name'));
    if($('#search-area').attr('name') === 'false') {
      $('#search-area').show();
      $('#search-area').attr('name','true');
    } else {
      $('#search-area').hide();
      $('#search-area').attr('name','false');
    };
  })

  $('#pac-input').on('keypress', function(e){
    if(e.which == 13) {
      e.preventDefault();
      locationSearch();
    }
  });

  $(window).on('swiperight', function(e){
    e.preventDefault();
    if ( e.swipestart.coords[0] <10) {
      $('#user').panel("open");
    };
  });

  $('#user').on('swipeleft', function(e){
    e.preventDefault();
    $('#user').panel("close");
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
  $('#user h2').text(name);
  $('#user-photo').attr('src', photo);
  $('#cancel_post').hide();
  $('#cancel_claim').hide();
};

var ajaxLogin = function(authData){
  userId = authData.facebook.id;
  var ajaxData = {user:{oauth_id:userId}};
  $.ajax({
    url: baseUrl + 'users/'+userId+'/identify',
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
    map.panTo(response);
    map.setZoom(15);
  });
};

var markCenter = function(map){
  getLocation().then(function(response){
    map.panTo(response);
    var marker = new google.maps.Marker({
      position: response,
      map: map,
      icon: currentLocation,
      name: "currentLocation"
    });
  });
};

var addSpace = function(){
  // console.log('entered add space function')
  getLocation().then(function(response){
    // console.log('got location')
    var note = $('#note').val();
    var latitude  = response.A;
    var longitude = response.F;
    var data      = {space:{latitude:+latitude, longitude:+longitude, note:note, poster_id:userData.id}};
    var headers   = '{"Content-Type":"application/json"}';

    $.ajax({
      url: baseUrl + 'spaces',
      type: "POST",
      data: data,
      headers: headers
    }).done(function(response) {
      console.log('posted with ajax')
      $('#post-space').popup('close');
      if ($(':input','#post-space').val().length > 1) {
        $("#post-space").on("popupafterclose", function () {
          $('#post-space-confirmation').popup('open')
          setTimeout(function () {
            $('#post-space-confirmation').popup('close');
          }, 1500);
        })
      }
//---------------replace with a toast notification---------------

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(response.latitude,response.longitude),
        map: map,
        title:  response.note,
        icon: markerSelect(response),
        id: response.id,
        creation: response.converted_time,
        animation: google.maps.Animation.DROP,
        zIndex: google.maps.Marker.MAX_ZINDEX + 1,
        draggable: true
      });
      // console.log(response);
      userData.recentPost = response.id;

      google.maps.event.addListener(marker, 'click', spaceDetails);
      google.maps.event.addListener(marker, "dragend", function() {
        geocodePosition(marker.getPosition());
      });

      var data = {user:{post: true}};
      $.ajax({
        url: baseUrl + 'users/'+fbData.facebook.id,
        type: 'PUT',
        data: data
      }).done(function(response){
        $('#cancel_post').show();
        // userData.recentPost = response.id //needs to go in second .done after merge
        // console.log(response);
        consumeCheckAdd(response.can_consume);
        // consumeCheck.off();
      }).fail(function(response){
        console.log('failed to update user data')
      });
    }).fail(function(response) {
      alert("Could not create space");
//---------------replace with a toast notification---------------
    });
  });
};

var geocodePosition = function(pos){
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({latLng: pos}, function(results, status){
    if (status == google.maps.GeocoderStatus.OK) {
      var spaceId = userData.recentPost;
      var headers = '{"Content-Type":"application/json"}';
      var latitude = results[0].geometry.location.A;
      var longitude = results[0].geometry.location.F;
      var data = {space:{latitude: latitude, longitude: longitude, change_location: true}};
      $.ajax({
        url: baseUrl + 'spaces/'+spaceId,
        type: 'PUT',
        headers: headers,
        data: data
      }).done(function(){console.log('space location updated')
      }).fail(function(){console.log('space location could not be updated')})
    }else{
      console.log('Cannot determine new location. Status:'+status);
    };
  });
};

var deleteSpace = function(){
  var spaceId = userData.recentPost;
  $.ajax({
    url: baseUrl + 'spaces/'+spaceId,
    type: 'DELETE'
  }).done(function(){
    $('#cancel_post').hide();
    $('#user').panel("close");
    $('#remove-space-confirmation').popup('open')
    setTimeout(function () {
      $('#remove-space-confirmation').popup('close');
    }, 1500);
    var data = {user:{claim: true}};
    $.ajax({
      url: baseUrl + 'users/'+fbData.facebook.id,
      type: 'PUT',
      data: data
    });
  }).fail(function(){
    alert('could not destroy space');
    console.log('could not destroy space');
//---------------replace with a toast notification---------------
  });
};

var claimSpace = function(e){
  var spaceId = e.target.name
  var headers = '{"Content-Type":"application/json"}';
  var spaceInfo
  var data = {space:{change_location: false}};
  $.ajax({
    url: baseUrl + 'spaces/'+spaceId,
    type: 'PUT',
    headers: headers,
    data: data
  }).done(function(response) {
    var data = {user:{consume: true}};
    $.ajax({
      url: baseUrl + 'users/'+fbData.facebook.id,
      type: 'PUT',
      data: data
    }).done(function(response){
      $('#space-options').popup('close');
      $('#space-options').on('popupafterclose', function(){
      $('#claim-space-confirmation').popup('open')
      setTimeout(function(){
        $('#claim-space-confirmation').popup('close');
        }, 1500);
      })
//---------------replace with a toast notification---------------
      userData.recentClaim = spaceId;
      $('#cancel_claim').show();
      // replace with a toast notification
    }).fail(function(response){
      console.log('claim space user update failed');
    });
    console.log(response)
    var destination = response.latitude +","+ response.longitude;
    clearMarkers();
    calcRoute(destination, map);
    countdownTimer(response.latitude, response.longitude);
  }).fail(function(response) {
    console.log("claim space ajax call failed");
//---------------replace with a toast notification---------------
  });
};

var countdownTimer = function(latitude, longitude){
  $('#countdown-start').popup("open");

  getLocation().then(function(response){
    var from = response;
    var to = new google.maps.LatLng(latitude, longitude);
    var distance = getDistance(to, from);

    setTimeout( function(distance){
      if (distance > 0.4) { //distance in miles
        cancelClaim();
        $('#countdown-end').popup("open");
      };
    }, 60000); //1 minute
  })
};

var cancelClaim = function(e){
  var spaceId = userData.recentClaim;
  var headers = '{"Content-Type":"application/json"}';
  var data = {space:{change_location: false}};
  $.ajax({
    url: baseUrl + 'spaces/'+spaceId,
    type: 'PUT',
    headers: headers,
    data: data
  }).done(function(response) {
    var userData = {user:{post: true}};
    $('#cancel-space-confirmation').popup('open')
    setTimeout(function () {
      $('#cancel-space-confirmation').popup('close');
    }, 1500);
    $.ajax({
      url: baseUrl + 'users/'+fbData.facebook.id,
      type: 'PUT',
      data: userData
    }).done(function(){
      $('#cancel_claim').hide();
      // clear countdown function
//---------------add a toast notification---------------
      directionsDisplay.setMap(null)
      clearMarkers();
      $('#user').panel("close");
      loadSpaces();
    }).fail(function(){
      alert('could not remove claim');
      console.log('could remove claim');
//---------------replace with a toast notification---------------
    });
  });
};

var calcRoute = function(finalDestination, map) {
  var directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({});
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
    url: baseUrl,
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
      markerArray.push(marker)
      google.maps.event.addListener(marker, 'click', spaceDetails);
    };
  });
};

var spaceDetails = function() {
  spaceId = this.id;
  $('#claim').attr('name', spaceId);
  $('#space-options').popup("open");
  $('#note-display').text('Note: ' + this.title);
  // creation = $(this)
  googleCreate = this.creation
  min = Math.floor((Date.now() - googleCreate) / 60000);
  // console.log(min)
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
  // console.log(spaceObj.poster_id);
  // console.log(userData.id);
  if (spaceObj.poster_id != userData.id){
    console.log('this shouldnt happen');
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(spaceObj.latitude,spaceObj.longitude),
      map: map,
      animation: google.maps.Animation.DROP,
      title:  spaceObj.note,
      icon: markerSelect(spaceObj), //set marker according to age
      id: spaceObj.id,
      creation: spaceObj.converted_time
    });
    markerArray.push(marker)
    google.maps.event.addListener(marker, 'click', spaceDetails);
  }
  console.log("Hit firebase");
  // console.log(prevChildName)
}

//Search
var locationSearch = function(){
var geocoder = new google.maps.Geocoder();

  var address = $('#pac-input').val();
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK)
    {
      if (typeof searchMarker !== 'undefined') {
        searchMarker.setMap(null)
        deleteSearchMarker();
      };

      lastSearch = results[0].geometry.location
      console.log("LAST: " + lastSearch) //Test Line, remove when ready to DEPLOY to the public and take all their money
      map.panTo(results[0].geometry.location);
      searchMarker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
        icon: searchLocation,
        name: "searchMarker"
      // animation: google.maps.Animation.DROP
      });
    markerArray.push(searchMarker)
    map.setZoom(18);
    closestSpaceList(1); //Find # of spaces within X miles
    }
    else
    {
      alert("Location was not found");
    }
  });
}


var deleteSearchMarker = function (){
  for (var i = 0; i < markerArray.length; i++) {
    if (markerArray[i].name === "searchMarker"){
      markerArray.splice(i, 1);
    }
  };
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
    if (markerArray.length < 1) {
      loadSpaces();
      console.log(markerArray);
      console.log('carma fucking us again');
      console.log('can_consume = true')
    };
  } else {
    console.log('can_consume = false');
  };
};

var clearMarkers = function() {
  for (var i = 0; i < markerArray.length; i++ ) {
    markerArray[i].setMap(null);
  };
  markerArray = [];
};

var onLoad = function() {
  // alert('load')
  document.addEventListener("deviceready", onDeviceReady, false);
};

var onDeviceReady = function() {
  // alert('ready')
  bindPause();
  bindResume();
};

var bindPause = function() {
  document.addEventListener('pause', onPause, false);
};

var onPause = function(){
  // alert('pause')
  Firebase.goOffline();
};

var bindResume = function(){
  document.addEventListener('resume', onResume, false);
};

var onResume = function(){
  clearMarkers();
  Firebase.goOnline();
  loadSpaces();
  // alert("resume works")
};

// Map format???
$(".ui-content", this).css({
 height: $(window).height(),
 width: $(window).width()
});

// Distance Calculations
var closestSpace = function(){
  var closest = markerArray[0].position;
  var distance;
  getLocation().then(function(currentLocation){
    var from = currentLocation
    for(var i = 1; i < markerArray.length; i++){
      if(getDistance(currentLocation, markerArray[i].position) < getDistance(currentLocation, closest)){
        closest = markerArray[i].position
      };
    };
  var distance = getDistance(currentLocation, closest);
//-------------------------------Popup Refactor TEST-----------------------
  var measureUnit = "miles"
  if (distance <= .2){
    distance *= 5280;
    distance = Math.round(1.0*distance)/1.0; //round to nearest foot
    measureUnit = "feet";
  };
//-------------------------------------
    $('#closest-space').popup('open')
    $('#close').html("Closest Space is " + distance + " " + measureUnit + " away")
    setTimeout(function () {
      $('#closest-space').popup('close');
    }, 2500);
  });
  return closest;
};

var closestSpaceList = function(radius){
  var closestArray = [ ]
  // getLocation().then(function(currentLocation){
    for(var i = 1; i < markerArray.length; i++){
      if(getDistance(lastSearch, markerArray[i].position) <= radius) {
        if(markerArray[i].name !== "searchMarker")
        closestArray.push(markerArray[i])
      };
    };
  console.log("Spaces within " +radius+ " mile: " + closestArray.length) //Subtract searchMaker
  $('#search-radius').popup('open')
  $('#radius').html("Spaces within " +radius+" miles: " + closestArray.length)
  setTimeout(function () {
    $('#search-radius').popup('close');
  }, 2500);
  return closestArray; // Call .length to get the number of spaces, OBVI
  // });
};

var getDistance = function(to, from){
  var dist = google.maps.geometry.spherical.computeDistanceBetween(to, from);
  dist *= 0.00062137 // return distance in miles
  dist = Math.round(100.0*dist)/100.0; //round to nearest 100th of a mile
  return dist
}

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

var openSpace = {
  path: fontawesome.markers.ARROW_DOWN,
  scale: 0.5,
  strokeWeight: 0.2,
  strokeColor: 'blue',
  strokeOpacity: 1,
  fillColor: 'black',
  fillOpacity: 1
}
