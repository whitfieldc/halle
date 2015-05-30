  // function initialize() {
  //   var mapProp = {
  //     center:new google.maps.LatLng(37.7833,-122.4167),
  //     zoom:5,
  //     mapTypeId:google.maps.MapTypeId.ROADMAP
  //   };
  //   var map=new google.maps.Map(document.getElemendddtById("googleMap"), mapProp);
  // }
  // google.maps.event.addDomListener(window, 'load', initialize);

  ///// PG Geolocation
  // function DOMLoaded(){
  //   document.addEventListener("deviceready", phonegapLoaded, false);
  // }

  // function phonegapLoaded(){
  //   navigator.geolocation.getCurrentPosition(onSuccess);
  // }

  // function onSuccess(position) {
  //   alert("Timestamp: " + new Date(position.timestamp) );
  // };

  // var setMarker = function(position){
  //   // debugger;
  //   var space = new google.maps.Marker({
  //     position: new google.maps.LatLng(position.lat, position.lon),
  //     map: map,
  //     title: "Space",
  //     animation: google.maps.Animation.DROP
  //   })
  // }

  // var testAjax = $.ajax({
  //   url: "http://localhost:3000"
  // })

  // testAjax.done(function(response){
  //   position.lat = response.spaces[0].latitude
  //   position.lon = response.spaces[0].longitude

  //   setMarker(position);

  // })


/////spanish video version

var map


$(document).on("pageinit", "#pageMap", function(e, data){

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
    var myOptions = {
      zoom: 16,
      disableDefaultUI: true, //disables zoom toggle & other defaultUI clutter
      zoomControl: true,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP //sets overlay
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), myOptions); //don't use Jquery here

    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: "My position",
      animation: google.maps.Animation.DROP
    });

    $('#map-canvas').on('tap', function (){
      // $.ajax({
      //   url: "http://localhost:3000",
      //   type: "get",
      //   }
      // ).done(function(response) {
      //   debugger
      //   console.log(response)
      // })
    });
  };
});

displayMarkers = function() {
  var point = new google.maps.Marker({
    position: new google.maps.LatLng(37.784972, -122.399545),
    map: map,
    title: "My position",
    animation: google.maps.Animation.DROP
  });
};

var ajaxCall = function() {
  $.ajax({
    url: "http://localhost:3000",
    type: "get",
    }
  ).done(function(response) {
    debugger
    console.log(response)
  })
};

