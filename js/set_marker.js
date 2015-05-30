$(document).on("pageinit", "#pageMap", function(e, data){

  // --------------------------------------

  var mapOptions = {
    zoom: 8,
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);

      var marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
      });

    $('#map-canvas').on("tap", function(){

      console.log("WHAT THE FUCK")

      var req = $.ajax({
        url: 'http://mysterious-lake-9849.herokuapp.com',
        type: "get",
      });

      req.done(function(response){
        alert(response);
        parkingSpots = response
        for(i = 0; i < parkingSpots.length; i++){
          console.log(parkingSpots[i]);
          var marker = new google.maps.Marker({
              position: new google.maps.LatLng(parkingSpots[i].latitude,parkingSpots[i].longitude),
              map: map,
              title: 'Hello World!'
              // id: parkingSpots[i].id
          });
        }
      })
    })
  })
});

  // ---------------------------------------

  // var defaultPos = new google.maps.LatLng(19.289168, -99.653440); //This is currently set to a location in Mexico

  // if (navigator.geolocation) {
  //   function exit(pos){
  //     ShowMap( new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
  //   }
  //   function fail(error){
  //     alert("Error in service");
  //       ShowMap(defaultPos);
  //   };
  //   var options = {maximumAge: 500000, enableHighAccuracy: true, timeout: 5000};
  //   navigator.geolocation.getCurrentPosition(exit, fail, options);
  // }
  // else {
  //   ShowMap(defaultPos);
  // };

  // function ShowMap(latlng) {
  //   var myOptions = {
  //     zoom: 16,
  //     disableDefaultUI: true, //disables zoom toggle & other defaultUI clutter
  //     zoomControl: true,
  //     center: latlng,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP //sets overlay
  //   };

  //   map = new google.maps.Map(document.getElementById("map-canvas"), myOptions); //don't use Jquery here

  //   var marker = new google.maps.Marker({
  //     position: latlng,
  //     map: map,
  //     title: "My position",
  //     animation: google.maps.Animation.DROP
  //   });
  // };

//   var setMarker = function(position){
//     // debugger;
//     var space = new google.maps.Marker({
//       position: new google.maps.LatLng(position.lat, position.lon),
//       map: map,
//       title: "Space",
//       animation: google.maps.Animation.DROP
//     })
//   }

//   var testAjax = $.ajax({
//     url: "http://localhost:3000"
//   })

//   testAjax.done(function(response){
//     console.log(response)
//     position.lat = response.spaces[0].latitude
//     position.lon = response.spaces[0].longitude

//     setMarker(position);

//   })


// });

