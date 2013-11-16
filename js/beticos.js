/*
 * Variables
 */
var path = "";

var miniPicturePath = "./pictures/balloon/";

var originalPicturePath = "./pictures/lightbox/";

var j = 0;

var infoWindow;

var searchingList = new Array();

var places = new Array();

var markers = new Array();

var pictureIndexByPlaces = new Array();

var currentPlace;

var placesTotalNumber = 0;

var picturesTotalNumber = 0;

var mapOptions;

var map;

function previous() {

    pictureIndexByPlaces[currentPlace.place] = pictureIndexByPlaces[currentPlace.place] - 1;

    renderPicture();

}

function next() {

    pictureIndexByPlaces[currentPlace.place] = pictureIndexByPlaces[currentPlace.place] + 1;

    renderPicture();

}

function setupPicturePagination() {

    if (currentPlace.pictures.length === 1) {

        $("#siguiente").addClass("disabled");

        $("#anterior").addClass("disabled");

        $('#link-previous').unbind('click');
        
        $('#link-next').unbind('click');

    } else {

        if (pictureIndexByPlaces[currentPlace.place] === currentPlace.pictures.length - 1) {

            $("#siguiente").addClass("disabled");

            $("#anterior").removeClass("disabled");

            $('#link-previous').unbind('click');
            
            $('#link-next').unbind('click');

            $("#link-previous").click(function() {
                
                previous();
                
            });

        } else if (pictureIndexByPlaces[currentPlace.place] === 0) {

            $("#anterior").addClass("disabled");

            $("#siguiente").removeClass("disabled");

            $('#link-previous').unbind('click');
            
            $('#link-next').unbind('click');

            $("#link-next").click(function() {
                
                next();
                
            });

        } else {

            $("#siguiente").removeClass("disabled");

            $("#anterior").removeClass("disabled");

            $('#link-previous').unbind('click');
            
            $('#link-next').unbind('click');

            $("#link-previous").click(function() {
                
                previous();
                
            });

            $("#link-next").click(function() {
                
                next();
                
            });

        }

    }

}

function renderPicture() {

    $('#picture-index').text(pictureIndexByPlaces[currentPlace.place] + 1);

    $("#picture-background").css("background-image",'url('+path + miniPicturePath + currentPlace.pictures[pictureIndexByPlaces[currentPlace.place]].file+')');

    setupPicturePagination();

}

function getPictureTitle(index){
    
    var pictureDate =  currentPlace.pictures[index].date;

    var title = currentPlace.place;

    if(pictureDate){

            title = title + ". Agregada el " + pictureDate;

    }

    return title;
    
}

function initializeBalloon(placeName) {

    //InfoWindow initialization
    currentPlace = search(placeName, true);

    pictureIndexByPlaces[currentPlace.place] = 0;

    $('#picture-total').text(currentPlace.pictures.length);

    $('#lugar').text(currentPlace.place);

    var country = searchCountryByPlace(currentPlace.place);

    $('#link-country').text(country.country);

    //Render first picture
    renderPicture();

    $("#link-country").click(function() {

        $("#picture-div").appendTo("#invisible");

        infoWindow.close();

        goToCountry(country);

    });

}

function listSearch() {

    var numCountries = picturesJson.length;

    var numCountriesPlaces = 0;

    var numPlaces = 0;

    var numPitures = 0;

    for (var i = 0; i < numCountries; i++) {

        searchingList[numCountriesPlaces] = picturesJson[i].country;

        numCountriesPlaces++;

        var numCountriesPlacesTemp = picturesJson[i].places.length;

        for (var j = 0; j < numCountriesPlacesTemp; j++) {

            searchingList[numCountriesPlaces] = picturesJson[i].places[j].place;

            places[numPlaces] = picturesJson[i].places[j];

            numPitures = numPitures + picturesJson[i].places[j].pictures.length;

            numCountriesPlaces++;

            numPlaces++;

        }

    }

    searchingList.sort();

    placesTotalNumber = numPlaces;

    picturesTotalNumber = numPitures;

}

function search(text, onlyPlaces) {

    var numCountries = picturesJson.length;

    for (var i = 0; i < numCountries; i++) {

        if (!onlyPlaces && picturesJson[i].country.toUpperCase().trim() === text.toUpperCase().trim()) {

            return picturesJson[i];

        }

        var numCountriesPlacesTemp = picturesJson[i].places.length;

        for (var j = 0; j < numCountriesPlacesTemp; j++) {

            if (picturesJson[i].places[j].place.toUpperCase().trim() === text.toUpperCase().trim()) {

                return picturesJson[i].places[j];

            }

        }

    }

    return null;

}

function searchCountryByPlace(text) {

    var numCountries = picturesJson.length;

    for (var i = 0; i < numCountries; i++) {

        var numCountriesPlacesTemp = picturesJson[i].places.length;

        for (var j = 0; j < numCountriesPlacesTemp; j++) {

            if (picturesJson[i].places[j].place.toUpperCase().trim() === text.toUpperCase().trim()) {

                return picturesJson[i];

            }

        }

    }

}

function searchMarker(text) {

    var numMarkers = markers.length;

    for (var i = 0; i < numMarkers; i++) {

        markers[i].place;

        if (markers[i].place.toUpperCase().trim() === text.toUpperCase().trim()) {

            return markers[i];

        }

    }

    return null;

}

function searchCountryByName(text) {

    var numCountries = picturesJson.length;

    for (var i = 0; i < numCountries; i++) {

        if (picturesJson[i].country.toUpperCase().trim() === text.toUpperCase().trim()) {

            return picturesJson[i];

        }

    }

    return null;

}

function goToCountry(country) {

    map.setCenter(new google.maps.LatLng(country.latitud, country.longitud));

    var zoom = 5;

    map.setZoom(zoom);

    selectList(country.country);

}

function linkBalloon(marker) {

    google.maps.event.addListener(marker, 'click', function() {

        if (infoWindow) {

            $("#picture-div").appendTo("#invisible");

            infoWindow.close();

        }

        initializeBalloon(marker.title);

        selectList(marker.title);

        map.setCenter(marker.getPosition());

        map.setZoom(7);

        infoWindow = new google.maps.InfoWindow({
            
            content: document.getElementById("picture-div")
            
        });

        infoWindow.open(map, marker);

        google.maps.event.addListener(infoWindow, 'closeclick', function() {

            $("#picture-div").appendTo("#invisible");

        });

    });
}

function selectList(name) {

    $("#search-list option").filter(function() {

        return $(this).text() === name;

    }).attr('selected', true);

    $("#search-list option").filter(function() {

        return $(this).text() !== name;

    }).attr('selected', false);
}

function initializeMap(mapCanvas) {

    try {

        mapOptions = {
            center: new google.maps.LatLng(37.356511, -5.982002),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP //google.maps.MapTypeId.ROADMAP SATELLITE 
        };

        map = new google.maps.Map(mapCanvas, mapOptions);

    } catch (e) {
				
        $('.bottom-custom').notify({
                message: { text: 'Imposible cargar mapa, error de conexión con Google Map' },
                type: 'danger'
        }).show();
        
        return null;

    }

    listSearch();

    $("#total-number-pictures").text(picturesTotalNumber);

    $("#total-number-places").text(placesTotalNumber);

    $("#total-number-countries").text(picturesJson.length);

    var $subType = $("#search-list");

    $subType.empty();

    $.each(searchingList, function() {

            $subType.append($('<option></option>').text(this));

    });

    $("#search-list").change(function() {

            var text = $(this).val();

            var country = searchCountryByName(text);

            if (country) {

                    goToCountry(country);

            } else {

                    var marker = searchMarker(text);

                    if (marker) {

                            google.maps.event.trigger(marker.marker, 'click');

                    }

            }

    });

    $("#search-button").click(function() {

            var text = $("#search-input").val();

            $("#search-input").val("");

            var country = searchCountryByName(text);

            if (country) {

                    goToCountry(country);

            } else {

                    var marker = searchMarker(text);

                    if (marker) {

                            google.maps.event.trigger(marker.marker, 'click');

                    } else {

                            $('.bottom-custom').notify({
                                    message: { text: 'Imposible encontrar un lugar o pais con ese nombre, intente buscar en la lista' },
                                    type: 'danger'
                            }).show();

                            return null;

                    }

            }

    });

    $("form").bind("keypress", function(e) {
            if (e.keyCode === 13) {
                    return false;
            }
    });        

    $("#search-input").focus();

    $("#search-input").keyup(function(event){

            if(event.keyCode === 13){

                    $("#search-button").click();

            }

    });

    $("#centrado-link").click(function() {

            map.setCenter(new google.maps.LatLng(20, 0));

            map.setZoom(2);

    });

    //centrado aleatorio
    
    try {

        var randomName = searchingList[Math.floor(Math.random() * searchingList.length)];

        selectList(randomName);

        var searchResult = search(randomName, false);

        map.setCenter(new google.maps.LatLng(searchResult.latitud, searchResult.longitud));

        var zoom = (typeof searchResult.place === "undefined") ? 5 : 7;

        map.setZoom(zoom);

    } catch (e) {

        map.setCenter(new google.maps.LatLng(20, 0));

        map.setZoom(2);

    }

    //Crea las marcas de las fotos por todo el mapa
    
    for (var i = 0; i < places.length; i++) {
        
        var position = new google.maps.LatLng(places[i].latitud, places[i].longitud);

        var marker = new google.maps.Marker({
            icon: "img/logo.png",
            position: position,
            anchor: new google.maps.Point(15, 15),
            title: places[i].place,
            map: map
        });

        markers[i] = {'place': places[i].place, 'marker': marker};

        linkBalloon(marker);

    }

}