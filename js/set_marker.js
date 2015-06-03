// $(document).on("pagecreate", "#pageMap", function(e, data){

//   var ref = new Firebase("https://halle.firebaseio.com");

// Firebase Facebook login -----------------------------------------
// Get login to be first page you see with choice between google and facebook

  // if (authData > 0) {
  //   $('#logout').show();
  // } else {
  //   $('#login').show();
  // }

  // var fbAuth = function(){
  //   var promise = new Promise(function(resolve, reject){

  //     ref.authWithOAuthPopup("facebook", function(error, authData) { //return promise - set value of promise to outer ife
  //       if (error) {
  //         alert("login failed!");
  //         reject(error);
  //       } else {
  //         // userId = authData.facebook.id
  //         // var ajaxData = {user:{oauth_id:userId}};
  //         resolve(authData);
  //         // console.log(data);
  //       };
  //     });
  //   })
  //   return promise;
  // };

  // fbAuth().then(function(authData){
  //   console.log(authData);
  //   userId = authData.facebook.id
  //   var ajaxData = {user:{oauth_id:userId}};
  //   $.ajax({
  //     // url: 'http://calm-island-3256.herokuapp.com',
  //     url: 'http://localhost:3000/users/'+userId+'/identify',
  //     type: 'GET',
  //     data: ajaxData
  //   }).done(function(response) {
  //     userData = response;
  //     console.log(response);
  //   }).fail(function() {
  //     alert("YOU'RE A FAILURE")
  //     console.log("FAILURE")
  //   });
  // });

  // var fbLogin = (function(){
  //   var userId;
  //   // var ref = new Firebase("https://halle.firebaseio.com");
  //   ref.authWithOAuthPopup("facebook", function(error, authData) { //return promise - set value of promise to outer ife
  //     if (error) {
  //       alert("login failed!");
  //       console.log("Login Failed!", error);
  //     } else {
  //       userId = authData.facebook.id
  //       console.log("test");
  //       var data = {user:{oauth_id:userId}};
  //     };
  //     return {
  //       userId
  //     }
  //     return
  //   })
  // });
  // var userData;

  // $('#login').on('tap', function(e) {
  //   e.preventDefault();
  //   fbAuth();
  //   console.log(userData)
    // fbSession.test;
    // debugger
    // fbSession(authData)

    // debugger
    // var ref = new Firebase("https://halle.firebaseio.com");
    // ref.authWithOAuthPopup("facebook", function(error, authData) {
    //   if (error) {
    //     alert("login failed!");
    //     console.log("Login Failed!", error);
    //   } else {
    //     userId = authData.facebook.id
    //     var data = {user:{oauth_id:userId}};
        // $.ajax({
        //   // url: 'http://calm-island-3256.herokuapp.com',
        //   url: 'http://localhost:3000/users/'+userId+'/identify',
        //   type: 'GET',
        //   data: data
        // }).done(function(response) {
        //   console.log(response)
        // }).fail(function() {
        //   alert("YOU'RE A FAILURE")
        //   console.log("FAILURE")
        // });
    //   }
    // });
  // });

// Format map  -----------------------------------------
  // $(".ui-content", this).css({
  //    height: $(window).height(),
  //    width: $(window).width()
  // });

  // var mapOptions = {
  //       zoom: 13,
  //       disableDefaultUI: true,
  //       zoomControl: true
  //       };
  // map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  // navigator.geolocation.getCurrentPosition(function(position) {


  //   initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
  //   map.setCenter(initialLocation);

  //     var spaceId //MAKES PARKING SPACE ID AVAILABLE

  //     var marker = new google.maps.Marker({
  //       position: initialLocation,
  //       map: map,
  //       icon: currentLoc
  //     });

//Center Map Button ------------------------
      // var centerControlDiv = document.createElement('div');
      // var centerControl = new CenterControl(centerControlDiv, initialLocation, map);

      // centerControlDiv.index = 1;
      // map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

//Directions ATTEMPT -------------------------------------------
      var directionsDisplay;
      var directionsService = new google.maps.DirectionsService();

      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsDisplay.setMap(map);


      var calcRoute = function(start, finish) {
        var request = {
            origin:start,
            destination:finish,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            // setAllMap(null);
            directionsDisplay.setDirections(response);
          }
          else{alert("Server Error: Directions Unavailable")}
        });
      }

// Add a space to the database -----------------------------------------
// TO DO : Add ability to move marker before saving current location as open space -----------------------------------------
    // $('#create-space').on('tap', function(e) {
    //   e.preventDefault();

    //   $('#post-space').popup("open", {
    //       overlayTheme: "a",
    //       positionTo: "window",
    //     })

    //   $('#add-space').on('tap', function(e) {
    //     var longitude = position.coords.longitude;
    //     var latitude  = position.coords.latitude;
    //     var note      = $(this).siblings('div').children().val()
    //     var data      = {space:{longitude:+longitude,latitude:+latitude,note:note}};
    //     var headers   = '{"Content-Type":"application/json"}';

    //     $.ajax({
    //       // url: 'http://calm-island-3256.herokuapp.com/spaces',
    //       url: 'http://localhost:3000/spaces',
    //       type: "POST",
    //       data: data,
    //       headers: headers
    //     }).done(function(response) {
    //       $('#add-space').remove();
    //       $('#note').remove();
    //       $('#popup-par').text('Added √');
    //       setTimeout(function () {
    //         $('#post-space').popup('close');
    //       }, 1500);
    //       var marker = new google.maps.Marker({
    //               position: new google.maps.LatLng(response.latitude,response.longitude),
    //               map: map,
    //               title:  response.note,
    //               icon: markerSelect(response),
    //               id: response.id,
    //               creation: response.converted_time,
    //               animation: google.maps.Animation.DROP,
    //               zIndex: google.maps.Marker.MAX_ZINDEX + 1
    //       });
    //     }).fail(function(response) {
    //       console.log(response);
    //       alert("shits fucked up");
    //     });
    //   });
    // });

// Show available spaces from database -----------------------------------------
    // $.ajax({
    //   // url: 'http://calm-island-3256.herokuapp.com',
    //   url: 'http://localhost:3000',
    //   type: "GET",
    // }).done(function(response){
    //   parkingSpots = response
    //   for(i = 0; i < parkingSpots.length; i++){
    //     var marker = new google.maps.Marker({
    //           position: new google.maps.LatLng(parkingSpots[i].latitude,parkingSpots[i].longitude),
    //           map: map,
    //           title:  parkingSpots[i].note,
    //           icon: markerSelect(parkingSpots[i]), //set marker according to age
    //           id: parkingSpots[i].id,
    //           creation: parkingSpots[i].converted_time
    //     });
    //     google.maps.event.addListener(marker, 'click', spaceDetails);
    //   };
    // });

    // var spaceDetails = function() {
    //   spaceId = this.id
    //   $('#space-options').popup("open", {
    //     overlayTheme: "a",
    //     positionTo: "window",
    //   })
    //   $('p').text(this.title);
    // };

// Claim a parking spot  -----------------------------------------
//     $('#claim').on('click', function(e){
//       e.preventDefault();
//       var headers = '{"Content-Type":"application/json"}';
//       var button = $(this)
//       $.ajax({
//         // url: 'http://calm-island-3256.herokuapp.com/spaces/'+spaceId,
//         url: 'http://localhost:3000/spaces/'+spaceId,
//         type: 'PUT',
//         headers: headers,
//         data: '' //test without this
//       }).done(function(response) {
//         // var data = {user:{consume}};
//         $.ajax({
//           url: 'http://localhost:3000/users/'+fbLogin.userId,
//           type: 'PUT',
//           data: data
//         }).done(function(response){
//           alert('FUCK YEAH BOI');
//         }).fail(function(response){
//           alert('FAIL AFILS FILA');
//         })
//         $('#space-options p').remove();
//         $('#space-options a').remove();
//         $('#space-options button').remove();
//         $('#space-options h4').text('Claimed √');
//         setTimeout(function () {
//           $('#space-options').popup('close');
//         }, 1500);
//         // navigation begins
//         calcRoute(initialLocation, response.latitude +","+ response.longitude)
//       }).fail(function(response) {
//         alert("fuck you guys")
//       })
//     });
//   });
// });

// Space markers CSS -----------------------------------------
// var currentLoc = {
//         path: fontawesome.markers.EXCLAMATION,
//         scale: 0.65,
//         strokeWeight: 0.2,
//         strokeColor: 'black',
//         strokeOpacity: 1,
//         fillColor: '#263238',
//         fillOpacity: 1
//     }

// var spaceFresh = {
//         path: fontawesome.markers.EXCLAMATION,
//         scale: 0.5,
//         strokeWeight: 0.2,
//         strokeColor: 'black',
//         strokeOpacity: 1,
//         fillColor: '#76FF03',
//         fillOpacity: 1
//     }
// var spaceStale = {
//         path: fontawesome.markers.EXCLAMATION,
//         scale: 0.5,
//         strokeWeight: 0.2,
//         strokeColor: 'black',
//         strokeOpacity: 1,
//         fillColor: '#AD1457',
//         fillOpacity: 1
//     }

// Differentiate between new and stale spaces -----------------------------------------
// var markerSelect = function(spaceObject){
//   var creation = spaceObject.converted_time
//   if ((Date.now() - creation) <= (5*60000)){
//     return spaceFresh;
//   }

//   else{
//     console.log(Date.now() - creation)
//     return spaceStale;
//   }
// }
// var CenterControl = function(controlDiv, centerLocation, map) {

//   // Set CSS for the control border
//   var controlUI = document.createElement('div');
//   controlUI.style.backgroundColor = 'red';
//   controlUI.style.border = '2px solid #fff';
//   controlUI.style.borderRadius = '35px';
//   controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
//   controlUI.style.cursor = 'pointer';
//   controlUI.style.marginBottom = '22px';
//   controlUI.style.textAlign = 'center';
//   controlUI.title = 'Click to recenter the map';
//   controlDiv.appendChild(controlUI);

//   // Set CSS for the control interior
//   var controlText = document.createElement('div');
//   controlText.style.color = 'rgb(25,25,25)';
//   controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
//   controlText.style.fontSize = '4px';
//   controlText.style.lineHeight = '38px';
//   controlText.style.paddingLeft = '5px';
//   controlText.style.paddingRight = '5px';
//   controlText.innerHTML = 'Center';
//   controlUI.appendChild(controlText);

//   // Setup the click event listeners: simply set the map to
//   // Chicago
//   google.maps.event.addDomListener(controlUI, 'click', function() {
//     map.setCenter(centerLocation)
//   });
// }

