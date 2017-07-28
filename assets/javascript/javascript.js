//initializing default car data and other diriving-related variables before user enters car information
 var MPG = 30;  
 var year = 2016;
 var make = 'Honda';
 var model = 'Accord';
 var closestGasPrice = 0;
 var convertedDistance = 0;
 var carInfo = [];
 
 //initializing google Map variables
var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};
var endCoordLat = ""; 
var endCoordLng = ""; 
var startCoordLat = ""; 
var startCoordLng = ""; 
var directionsService;
var directionsDisplay;
var directionDisplay2; 

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete-2')),
      {types: ['geocode']});
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

//we need to establish the directinsService and directionsDisplay as a global variable so that the other functions can read it 
//we establish this variable at initMap --> redefines the value at a global scale and it will stay 
//we have to put his two variable in the initMap() function because this is what the Google Map script from the HTML is reading

function initMap() {
        // Create a map object and specify the DOM element for display.
           directionsService = new google.maps.DirectionsService();
           directionsDisplay = new google.maps.DirectionsRenderer;
           
            var map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: -34.397, lng: 150.644},
              scrollwheel: false,
              zoom: 8
            });
            initAutocomplete(); 
};

function initMapAgain() {
  var location1 = new google.maps.LatLng(startCoordLat, startCoordLng);
  var location2 = new google.maps.LatLng(endCoordLat, endCoordLng);

  var location3 = new google.maps.LatLng(startCoordLat, startCoordLng);
  var location4 = new google.maps.LatLng(endCoordLat, endCoordLng);

  var map;

  var mapOptions = { center: new google.maps.LatLng(42.5584308, -70.8597732), zoom: 3,
  mapTypeId: google.maps.MapTypeId.ROADMAP };


  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: false,
    suppressInfoWindows: true
  });
  directionsDisplay.setMap(map);

  var request = {
    origin: location1, 
    destination: location2,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });

  directionsDisplay2 = new google.maps.DirectionsRenderer({
    suppressMarkers: false,
    suppressInfoWindows: true
  });

  
  directionsDisplay2.setMap(map);
  
  directionsDisplay2.setOptions({
    polylineOptions: {
      strokeColor: 'green', 
      strokeWeight: 6, 
      strokeOpacity: 0.6
    }
  });
 
  var request2 = {
    origin: location3, 
    destination: location4,
    travelMode: google.maps.DirectionsTravelMode.TRANSIT
  };

  directionsService.route(request2, function(response, status) {

    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay2.setDirections(response);
    }
  });
}

$("#submit").on("click", function(event) {

  event.preventDefault(); 
  //only run logic if both inputs have been filled out
  if ($('.start-address').val() && $('.end-address').val()) {
    $('#page-1').toggle();
    $('#page-2').toggle();

    var startInput = $(".start-address").val().trim(); 
    startInput = startInput.replace(/ /g,"");
    //RegExp or Regular Expression, the / / means blank spaces, the g means on a global scale, and the "" means replace with no space. 
    //Essentially this takes the string look for all the blank spaces(global) and replace it without a space. 
    //This is not necessary because Google takes the spaces into account when sending queryURL, but this is just a fail safe. 
    console.log(startInput);
    var endInput = $(".end-address").val().trim();  
    endInput = endInput.replace(/ /g,"");
      console.log(endInput); 
    var cors = "https://cors-anywhere.herokuapp.com/"
    var queryURL = cors + "https://maps.googleapis.com/maps/api/directions/json?origin=" + startInput + "&destination=" + endInput + "&key=AIzaSyA3zxPOYEjaZFkWhGi4WRjUVWXXXF7GRUA"
      console.log(queryURL); 
    var queryTransitURL = cors + "https://maps.googleapis.com/maps/api/directions/json?origin=" + startInput + "&destination=" + endInput + "&mode=transit&key=AIzaSyA3zxPOYEjaZFkWhGi4WRjUVWXXXF7GRUA"
    
    var val = $("#mode option:selected").text();
      console.log(val)
    //Ajax call for transit 
    $.ajax({
          url: queryTransitURL,
          method: "GET"       
        })
        .done(function(response) {
          endCoordLat = response.routes[0].legs[0].end_location.lat;
            console.log(endCoordLat); 
          endCoordLng = response.routes[0].legs[0].end_location.lng;
            console.log(endCoordLng); 
          startCoordLat = response.routes[0].legs[0].start_location.lat;
            console.log(startCoordLat); 
          startCoordLng = response.routes[0].legs[0].start_location.lng;
            console.log(startCoordLng);  
          initMapAgain(); 

        var departureTime = $("#departure-time").text(response.routes[0].legs[0].departure_time.text);
          console.log(departureTime)
        var arrivalTime = $("#arrival-time").text(response.routes[0].legs[0].arrival_time.text);
          console.log(arrivalTime)
        var transitTime = $("#transit-time").text(response.routes[0].legs[0].duration.text);
          console.log(transitTime); 
        var farePrice = $("#fare-price").text(response.routes[0].fare.text);
          console.log(farePrice); 

        });
    
    //Ajax call for driving
    $.ajax({
            url: queryURL,
            method: "GET"       
          })
          .done(function(response) {
            endCoordLat = response.routes[0].legs[0].end_location.lat;
              console.log(endCoordLat); 
            endCoordLng = response.routes[0].legs[0].end_location.lng;
              console.log(endCoordLng); 
            startCoordLat = response.routes[0].legs[0].start_location.lat;
              console.log(startCoordLat); 
            startCoordLng = response.routes[0].legs[0].start_location.lng;
              console.log(startCoordLng);  
            initMapAgain(); 

            var travelDistance = $("#travel-distance").text(response.routes[0].legs[0].distance.text);
              console.log(travelDistance)
            var travelTime = $("#travel-time").text(response.routes[0].legs[0].duration.text);
              console.log(travelTime); 

            //<myGasFeed stuff NEW>

            var ajaxCBFunc = function (res){
              closestGasPrice = JSON.parse(res).stations[0].reg_price;
              convertedDistance = parseInt(travelDistance[0].innerText.slice(0, -3))
              console.log('travelDistance', convertedDistance)
              console.log('closestGasPrice is ', closestGasPrice)
              console.log(`Estimated fuel cost is ${convertedDistance / MPG * closestGasPrice}`)
              var updatedCost = convertedDistance / MPG * closestGasPrice;
              $('#fuel-cost').html(`$${updatedCost.toFixed(2)} (rough estimate)`)
            }
            var ajaxCall = function (){
              $.ajax({
                url:MGF,
                method: 'get'
              }).done(function(res) {ajaxCBFunc(res)})
                .fail(function (){
                  $('#fuel-cost').html('Calculating');
                  console.log('calling myGasFeed API again')
                  setTimeout(ajaxCall, 1000);
                })
            }
            var cors = "https://cors-anywhere.herokuapp.com/"
            var milesRadius = 5; 
            var MGF = `${cors}http://devapi.mygasfeed.com/stations/radius/${startCoordLat}/${startCoordLng}/${milesRadius}/reg/distance/rfej9napna.json`;
            ajaxCall();
    });
  }
})
        
$('#add-car').on('click', function(e) {
  e.preventDefault();

   // Changes XML to JSON
  function xmlToJson(xml) {
    // Create the return object
    var obj = {};
    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }
    // do children
    if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };
  //pull user inputs of car info
  model = $('#car-model').val().trim();
  make = $('#car-make').val().trim();
  if ($('#car-year').val()) {
    year = $('#car-year').val().trim();
  }
  $('#fuel-cost').html('');
  var cors = "https://cors-anywhere.herokuapp.com/"
  $.ajax({
    url: `${cors}http://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`,
    method: 'get'
  }).done(function (res) {
    var resJSON = xmlToJson(res);
    // console.log(resJSON);
    var carArr = resJSON.menuItems.menuItem;
    for (var i = 0; i < carArr.length; i++) {
      var configID = {};
      configID[carArr[i].value['#text']] = carArr[i].text['#text'];
      carInfo.push(configID);
    }
    var str = '';  
    // console.log(carInfo);
    _.each(carInfo, function (val) {
      // console.log(Object.keys(val))
      $.ajax({
        url:`${cors}http://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/${Object.keys(val)[0]}`,
        method: 'get'
      }).done(function(response) {
        // console.log(response)
        if (response){
          var dataJSON = xmlToJson(response);
          // console.log('vehicle info', dataJSON.yourMpgVehicle.avgMpg['#text'])
          MPG = dataJSON.yourMpgVehicle.avgMpg['#text'];
          var updatedPrice = convertedDistance / MPG * closestGasPrice;
          console.log(`Config: ${Object.values(val)}'s calculated fuel cost is $${updatedPrice.toFixed(2)}`);
          str = '[ ' + Object.values(val) + '] -> $' + updatedPrice.toFixed(2) + '. ';
          $('#fuel-cost').append('<br>' + str)
        }
      })
    })
  })
})

