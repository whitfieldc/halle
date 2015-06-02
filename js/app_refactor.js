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
    console.log("PAGA MAPA!");
    console.log(userData);
    console.log(fbData);
  });

//function definitions only

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