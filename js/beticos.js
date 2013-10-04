/*
 * Variables
 */
var ruta = "http://www.porelbetisestoyloco.com/web";

var rutaminiaturas = "/images/galeria/miniaturas/";

var rutaoriginales = "/images/galeria/imagenes/";

var j = 0;

var infowindow;

var listaParaBusqueda = new Array();

var lugares = new Array();

var marcas = new Array();

var indiceFotoLugar = new Array();

var totalLugares = 0;

var totalFotos = 0;

var mapaOpciones;

var mapa;

function anterior(lugar) {

    indiceFotoLugar[lugar.lugar] = indiceFotoLugar[lugar.lugar] - 1;

    pasarFoto(lugar);

}

function siguiente(lugar) {

    indiceFotoLugar[lugar.lugar] = indiceFotoLugar[lugar.lugar] + 1;

    pasarFoto(lugar);

}

function configurarPaginacionFotos(lugar) {

    if (lugar.fotos.length === 1) {

        $("#siguiente").addClass("disabled");

        $("#anterior").addClass("disabled");

        $('#enlace-anterior').unbind('click');
        
        $('#enlace-siguiente').unbind('click');

    } else {

        if (indiceFotoLugar[lugar.lugar] === lugar.fotos.length - 1) {

            $("#siguiente").addClass("disabled");

            $("#anterior").removeClass("disabled");

            $('#enlace-anterior').unbind('click');
            
            $('#enlace-siguiente').unbind('click');

            $("#enlace-anterior").click(function() {
                
                anterior(lugar);
                
            });

        } else if (indiceFotoLugar[lugar.lugar] === 0) {

            $("#anterior").addClass("disabled");

            $("#siguiente").removeClass("disabled");

            $('#enlace-anterior').unbind('click');
            
            $('#enlace-siguiente').unbind('click');

            $("#enlace-siguiente").click(function() {
                
                siguiente(lugar);
                
            });

        } else {

            $("#siguiente").removeClass("disabled");

            $("#anterior").removeClass("disabled");

            $('#enlace-anterior').unbind('click');
            
            $('#enlace-siguiente').unbind('click');

            $("#enlace-anterior").click(function() {
                
                anterior(lugar);
                
            });

            $("#enlace-siguiente").click(function() {
                
                siguiente(lugar);
                
            });

        }

    }

}

function pasarFoto(lugar) {

    $('#indice-foto').text(indiceFotoLugar[lugar.lugar] + 1);

    $("#foto-bocadillo").attr("src", ruta + rutaminiaturas + lugar.fotos[indiceFotoLugar[lugar.lugar]]);

    $("#enlace-foto").attr("href", ruta + rutaoriginales + lugar.fotos[indiceFotoLugar[lugar.lugar]]);

    configurarPaginacionFotos(lugar);

}

function rellenarBocadillo(lugarTexto) {

    var lugar = buscar(lugarTexto, true);

    indiceFotoLugar[lugar.lugar] = 0;

    $('#indice-foto').text(1);

    $('#total-foto').text(lugar.fotos.length);

    $('#lugar').text(lugar.lugar);

    var pais = buscarPaisPorLugar(lugar.lugar);

    $('#enlace-pais').text(pais.pais);

    $("#foto-bocadillo").attr("src", ruta + rutaminiaturas + lugar.fotos[0]);

    $("#enlace-foto").attr("href", ruta + rutaoriginales + lugar.fotos[0]);

    if (lugar.fotos.length > 1) {

        $("#siguiente").removeClass("disabled");

    }

    configurarPaginacionFotos(lugar);

    $("#enlace-pais").click(function() {

        $("#verfotos").appendTo("#invisible");

        infowindow.close();

        irAPais(pais);

    });

}

function listarBusqueda() {

    var numPaises = fotos.length;

    var numPaisesLugares = 0;

    var numLugares = 0;

    var numFotos = 0;

    for (var i = 0; i < numPaises; i++) {

        listaParaBusqueda[numPaisesLugares] = fotos[i].pais;

        numPaisesLugares++;

        var numPaisesLugaresTemp = fotos[i].lugares.length;

        for (var j = 0; j < numPaisesLugaresTemp; j++) {

            listaParaBusqueda[numPaisesLugares] = fotos[i].lugares[j].lugar;

            lugares[numLugares] = fotos[i].lugares[j];

            numFotos = numFotos + fotos[i].lugares[j].fotos.length;

            numPaisesLugares++;

            numLugares++;

        }

    }

    listaParaBusqueda.sort();

    totalLugares = numLugares;

    totalFotos = numFotos;

}

function buscar(texto, soloLugares) {

    var numPaises = fotos.length;

    for (var i = 0; i < numPaises; i++) {

        if (!soloLugares && fotos[i].pais.toUpperCase().trim() === texto.toUpperCase().trim()) {

            return fotos[i];

        }

        var numPaisesLugaresTemp = fotos[i].lugares.length;

        for (var j = 0; j < numPaisesLugaresTemp; j++) {

            if (fotos[i].lugares[j].lugar.toUpperCase().trim() === texto.toUpperCase().trim()) {

                return fotos[i].lugares[j];

            }

        }

    }

    return null;

}

function buscarPaisPorLugar(texto) {

    var numPaises = fotos.length;

    for (var i = 0; i < numPaises; i++) {

        var numPaisesLugaresTemp = fotos[i].lugares.length;

        for (var j = 0; j < numPaisesLugaresTemp; j++) {

            if (fotos[i].lugares[j].lugar.toUpperCase().trim() === texto.toUpperCase().trim()) {

                return fotos[i];

            }

        }

    }

}

function buscarMarca(texto) {

    var numMarcas = marcas.length;

    for (var i = 0; i < numMarcas; i++) {

        marcas[i].lugar;

        if (marcas[i].lugar.toUpperCase().trim() === texto.toUpperCase().trim()) {

            return marcas[i];

        }

    }

    return null;

}

function buscarPaisPorNombre(texto) {

    var numPaises = fotos.length;

    for (var i = 0; i < numPaises; i++) {

        if (fotos[i].pais.toUpperCase().trim() === texto.toUpperCase().trim()) {

            return fotos[i];

        }

    }

    return null;

}

function irAPais(pais) {

    mapa.setCenter(new google.maps.LatLng(pais.latitud, pais.longitud));

    var zoom = 5;

    mapa.setZoom(zoom);

    seleccionarLista(pais.pais);

}

function unirBocadillo(marca) {

    google.maps.event.addListener(marca, 'click', function() {

        if (infowindow) {

            $("#verfotos").appendTo("#invisible");

            infowindow.close();

        }

        rellenarBocadillo(marca.title);

        seleccionarLista(marca.title);

        mapa.setCenter(marca.getPosition());

        mapa.setZoom(7);

        infowindow = new google.maps.InfoWindow({
            
            content: document.getElementById("verfotos")
            
        });

        infowindow.open(mapa, marca);

        google.maps.event.addListener(infowindow, 'closeclick', function() {

            $("#verfotos").appendTo("#invisible");

        });

    });
}

function seleccionarLista(nombre) {

    $("#lista-busqueda option").filter(function() {

        return $(this).text() === nombre;

    }).attr('selected', true);

    $("#lista-busqueda option").filter(function() {

        return $(this).text() !== nombre;

    }).attr('selected', false);
}

function inicializarMapa(mapa_canvas) {

    try {

        mapaOpciones = {
            center: new google.maps.LatLng(37.356511, -5.982002),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP //google.maps.MapTypeId.ROADMAP SATELLITE 
        };

        mapa = new google.maps.Map(mapa_canvas, mapaOpciones);

        listarBusqueda();

        $("#total-fotos").text(totalFotos);
        
        $("#total-lugares").text(totalLugares);
        
        $("#total-paises").text(fotos.length);

        var $subType = $("#lista-busqueda");
        
        $subType.empty();
        
        $.each(listaParaBusqueda, function() {
            
            $subType.append($('<option></option>').text(this));
            
        });

        $("#lista-busqueda").change(function() {

            var texto = $(this).val();

            var pais = buscarPaisPorNombre(texto);

            if (pais) {

                irAPais(pais);

            } else {

                var marca = buscarMarca(texto);

                if (marca) {

                    google.maps.event.trigger(marca.marca, 'click');

                }

            }

        });

        $("#buscar-button").click(function() {

            var texto = $("#buscar-input").val();
            
            $("#buscar-input").val("");

            var pais = buscarPaisPorNombre(texto);

            if (pais) {

                irAPais(pais);

            } else {

                var marca = buscarMarca(texto);

                if (marca) {

                    google.maps.event.trigger(marca.marca, 'click');

                } else {

                    alert("Imposible encontrar un lugar o pais con ese nombre, busque en la lista");

                    return null;

                }

            }

        });
        
        $("form").bind("keypress", function(e) {
            if (e.keyCode === 13) {
                return false;
            }
        });        

        $("#buscar-input").focus();
        
        $("#buscar-input").keyup(function(event){
            
            if(event.keyCode === 13){
                
                $("#buscar-button").click();
                
            }
            
        });

        $("#centrado-link").click(function() {

            mapa.setCenter(new google.maps.LatLng(20, 0));

            mapa.setZoom(2);

        });

    } catch (e) {

        alert("Imposible listar lugares y paises, intentelo en otro momento:\n" + e);

        return null;

    }

    //centrado aleatorio
    
    try {

        var nombreAleatorio = listaParaBusqueda[Math.floor(Math.random() * listaParaBusqueda.length)];

        seleccionarLista(nombreAleatorio);

        var busqueda = buscar(nombreAleatorio, false);

        mapa.setCenter(new google.maps.LatLng(busqueda.latitud, busqueda.longitud));

        var zoom = (typeof busqueda.lugar === "undefined") ? 5 : 7;

        mapa.setZoom(zoom);

    } catch (e) {

        mapa.setCenter(new google.maps.LatLng(20, 0));

        mapa.setZoom(2);

    }

    //Crea las marcas de las fotos por todo el mapa
    
    for (var i = 0; i < lugares.length; i++) {
        
        var punto = new google.maps.LatLng(lugares[i].latitud, lugares[i].longitud);

        var marca = new google.maps.Marker({
            icon: "img/logo.png",
            position: punto,
            anchor: new google.maps.Point(15, 15),
            title: lugares[i].lugar,
            map: mapa
        });

        marcas[i] = {'lugar': lugares[i].lugar, 'marca': marca};

        unirBocadillo(marca);

    }

}