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


/////spanish video version

$(document).on("pageinit", "#pageMap", function(e, data){

  var testAjax = $.ajax({
    url: "http://localhost:3000/posts"
  })
  testAjax.done(function(response){
    alert("Dabbed in ajax");
  })

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
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP //sets overlay
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions); //don't use Jquery here

    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: "My position",
      animation: google.maps.Animation.DROP
    });
  };


});