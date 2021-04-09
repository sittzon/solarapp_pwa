# solarapp_pwa
Show solar usage and home power usage in a PWA using Shinemonitor API (https://github.com/sittzon/shinemonitor_api).

# Usage
First, configure the backend according to Readme in Shinemonitor API (https://github.com/sittzon/shinemonitor_api).

Then, build application for docker using ```docker-compose build```. Run the docker images in detached mode using ```docker-compose up -d```. The app is now reachable at http://localhost:8181, and the Swagger backend at https://localhost:8001/index.html.

You can also build and run with a single command for docker-compose: ```docker-compose up --build -d```.
Stop application with ```docker-compose down```.

The application is a PWA, so it is installable using the share button in your mobile browser. Set it as a bookmark on your home page and the app should have a icon and be usable as a standalone application. Ofcourse, doesn't work so great without an internet connection to get the solar usage from. But it works.
