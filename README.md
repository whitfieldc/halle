# Halle: park it forward

##Description
Halle is an Android & iOS app designed to crowd-source information on parking spaces for drivers in urban areas.

##Technologies Used
  * Backend: Rails-API, ActiveRecord, PostgreSQL, Firebase
  * Frontend: Apache Cordova, Javascript, jQuery & jQuery Mobile, HTML, CSS
  * Others: Google Maps API, Facebook OAuth

  We knew from the outset that for our app to be of practical use, it needed to be on mobile. Apache Cordova allowed us to deliver a mobile app using the front-end web development skills we gained at Dev Bootcamp. We used a Rails-API back-end to store user and parking space data and associate users with spaces they post or claim. This allowed us to implement features like post and claim canceling, the "Carma" rating system to ensure users post spaces about as often as they claim them, and drag-and-drop adjustment of a user's posted space. We used Firebase to add live-updated markers, so users can always see the most recently posted spaces.

##User Stories
  * user can do stuff

##Challenges We Faced
  * Mobile hybridization
  * Managing asynchronous requests & promises
  * jQuery mobile quirks/bugs

##Next Steps
  * facilitate one-to-one communication between our users.
  * improve performance by optimizing geolocation processes

##The Team
  * Team Lead: Sean Sassenrath
  * Team Members: Nico Lazzara, Erica Marroquin, Charles Whitfield