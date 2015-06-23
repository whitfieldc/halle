# Halle: Park it forward

##Description
Halle is an Android & iOS app designed to crowd-source information on parking spaces for drivers in urban areas.

Download it from the [Google Play Store](https://play.google.com/store/apps/details?id=com.halle.parkit) or
preview the app in [a mobile emulator](http://mobt.me/BlJo).

##Technologies Used
  * Backend: Rails-API, ActiveRecord, PostgreSQL, Firebase
  * Frontend: Apache Cordova, Javascript, jQuery & jQuery Mobile, HTML, CSS
  * Others: Google Maps API, Facebook OAuth

  We knew from the outset that for our app to be of practical use, it needed to be on mobile. Apache Cordova allowed us to deliver a mobile app using the front-end web development skills we gained at Dev Bootcamp. We used a Rails-API back-end to store user and parking space data and associate users with spaces they post or claim. This allowed us to implement features like post and claim canceling, the "Carma" rating system to ensure users post spaces about as often as they claim them, and drag-and-drop adjustment of a user's posted space. We used Firebase to add live-updated markers, so users can always see the most recently posted spaces.

##User Stories
  * A user can add an open parking space marker
  * A user can add a note to their open space marker
  * A user can remove their most recent open parking space marker
  * A user can claim a parking space marker
  * A user can cancel their parking space claim
  * A user can center the map based on their geolocation
  * A user can search for available parking spaces in a specific location
  * A user can see the number of available spaces within a mile of their search

##Challenges We Faced
  * Mobile hybridization
  * Managing asynchronous requests & promises
  * jQuery mobile quirks/bugs

##Next Steps
  * Facilitate one-to-one communication between our users.
  * Improve performance by optimizing geolocation processes

##The Team
  * Team Lead: Sean Sassenrath
  * Team Members: Nico Lazzara, Erica Marroquin, Charles Whitfield

##Run Halle Locally:
In the CLI:
  1. Clone the repo - enter 'git clone https://github.com/whitfieldc/halle.git'
  2. Spin up a server - enter 'python -m SimpleHTTPServer'

In Google Chrome:
  3. Install the [Ripple Emulator chrome extension](https://chrome.google.com/webstore/detail/ripple-emulator-beta/geelfhphabnejjhdalkjhgipohgpdnoc?hl=en)
  4. Go to localhost:8000
  5. Click the Ripple Emulator icon, select "enable" and choose "Apache Cordova 2.0.0"
  6. Click the Emulator's "settings" menu and set "Cross Domain Proxy" to "Disabled"
