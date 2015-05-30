$(document).on("pagecreate", "#pageMap", function(e, data){
  var map
  // var position = {}

  var defaultPos = new google.maps.LatLng(19.289168, -99.653440); //This is currently set to a location in Mexico

  if (navigator.geolocation) {
    function exit(pos){
      ShowMap( new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    }
    function fail(error){
      alert("Error in service");
        ShowMap(defaultPos);
    };
    var options = {maximumAge: 500000, enableHighAccuracy: true, timeout: 5000};
    navigator.geolocation.getCurrentPosition(exit, fail, options);
  }
  else {
    ShowMap(defaultPos);
  };

  function ShowMap(latlng) {
    debugger;
    var myOptions = {
      zoom: 11,
      disableDefaultUI: true, //disables zoom toggle & other defaultUI clutter
      zoomControl: true,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP //sets overlay
    };

    // map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    //don't use Jquery here
    // alert(position)

    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: "My position",
      animation: google.maps.Animation.DROP
    });
  };

  // var setMarker = function(map, position){
  //   var space = new google.maps.Marker({
  //     position: new google.maps.LatLng(position.lat, position.lon),
  //     map: map,
  //     title: "Space",
  //     animation: google.maps.Animation.DROP
  //   });
  // };

  // var callAjax = function(){
  //   var testAjax = $.ajax({
  //     url: "http://localhost:3000"
  //   });

  //   var onDone = function(map) {
  //     console.log(map)

  //     return function(response){
  //       var position;
  //       position.lat = response.spaces[0].latitude
  //       position.lon = response.spaces[0].longitude
  //       console.log(position);
  //       debugger;
  //       setMarker(map, position);
  //     };
  //   };
  //   // console.log(map);
  //   testAjax.done(onDone(map));
  // }

  // $('#map-canvas').on('tap', callAjax);


});