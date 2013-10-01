var ruta = "http://localhost";

var rutaminiaturas = "/images/galeria/miniaturas/";

var rutaoriginales = "/images/galeria/imagenes/";

var j = 0;

var infowindow;

var listaParaBusqueda = new Array();

var lugares = new Array();

var marcas = new Array();

var indiceFotoLugar = new Array();

 function anterior(lugar){
 
	indiceFotoLugar[lugar.lugar] = indiceFotoLugar[lugar.lugar] - 1;
	
	pasarFoto(lugar);
	
 }
	  
 function siguiente(lugar){
 
	 indiceFotoLugar[lugar.lugar] = indiceFotoLugar[lugar.lugar] + 1;
	 
	 pasarFoto(lugar);
	 
 }
 
 function configurarPaginacionFotos(lugar){
	
	if (lugar.fotos.length == 1){
		
			$("#siguiente").addClass( "disabled" );
		
			$("#anterior").addClass( "disabled" );
			
			$('#enlace-anterior').unbind('click');
			$('#enlace-siguiente').unbind('click');
	
	}else{
 
		if (indiceFotoLugar[lugar.lugar] == lugar.fotos.length - 1) {
		
			$("#siguiente").addClass( "disabled" );
		
			$("#anterior").removeClass( "disabled" );
			
			$('#enlace-anterior').unbind('click');
			$('#enlace-siguiente').unbind('click');
			
			$( "#enlace-anterior" ).click(function() {
			  anterior(lugar);
			});
			
		}else if (indiceFotoLugar[lugar.lugar] == 0) {
		
			$("#anterior").addClass( "disabled" );
			
			$("#siguiente").removeClass( "disabled" );
			
			$('#enlace-anterior').unbind('click');
			$('#enlace-siguiente').unbind('click');

			$( "#enlace-siguiente" ).click(function() {
			  siguiente(lugar);
			});
			
		}else{
		
			$("#siguiente").removeClass( "disabled" );
		
			$("#anterior").removeClass( "disabled" );
			
			$('#enlace-anterior').unbind('click');
			$('#enlace-siguiente').unbind('click');
			
			$( "#enlace-anterior" ).click(function() {
			  anterior(lugar);
			});

			$( "#enlace-siguiente" ).click(function() {
			  siguiente(lugar);
			});
			
		}
	
	}
 
 }
 
 function pasarFoto(lugar){
	
	$('#indice-foto').text(indiceFotoLugar[lugar.lugar]+1);
	
	$("#foto-bocadillo").attr("src",ruta + rutaminiaturas + lugar.fotos[indiceFotoLugar[lugar.lugar]]);
	
	$("#enlace-foto").attr("href",ruta + rutaoriginales + lugar.fotos[indiceFotoLugar[lugar.lugar]]);
	 
	 configurarPaginacionFotos(lugar);
	 
 }

function rellenarBocadillo(lugarTexto){

	var lugar = buscar(lugarTexto,true);
	
	indiceFotoLugar[lugar.lugar] = 0;
	
	$('#indice-foto').text(1);
	
	$('#total-foto').text(lugar.fotos.length);
	
	$('#lugar').text(lugar.lugar);
	
	var pais = buscarPaisPorLugar(lugar.lugar);
	
	$('#enlace-pais').text(pais.pais);
	
	$("#foto-bocadillo").attr("src",ruta + rutaminiaturas + lugar.fotos[0]);
	
	$("#enlace-foto").attr("href",ruta + rutaoriginales + lugar.fotos[0]);
	
	if (lugar.fotos.length > 1) {
	
		$("#siguiente").removeClass( "disabled" );
		
	}
	
	configurarPaginacionFotos(lugar);

	$( "#enlace-pais" ).click(function() {
		
	  $("#verfotos").appendTo("#invisible");
	
	  infowindow.close();
	  
	  irAPais(pais,marcas[lugarTexto].get('map'));
	  
	});

}

function listarBusqueda(fotos){

	var numPaises = fotos.length;

	var numPaisesLugares = 0;

	var numLugares = 0;

	for(var i=0; i<numPaises; i++){

		listaParaBusqueda[numPaisesLugares] = fotos[i].pais;

		numPaisesLugares++;

		var numPaisesLugaresTemp = fotos[i].lugares.length;

		for(var j=0; j<numPaisesLugaresTemp; j++){

			listaParaBusqueda[numPaisesLugares] = fotos[i].lugares[j].lugar;

			lugares[numLugares] = fotos[i].lugares[j];

			numPaisesLugares++;

			numLugares++;

		}

	}
	
	listaParaBusqueda.sort();
	
	lugares.sort();

}

function buscar(texto,soloLugares){

	var numPaises = fotos.length;

	var numPaisesLugares = 0;

	var numLugares = 0;

	for(var i=0; i<numPaises; i++){

		if(!soloLugares && fotos[i].pais.toUpperCase().trim()==texto.toUpperCase().trim()){

			return fotos[i];

		}

		var numPaisesLugaresTemp = fotos[i].lugares.length;

		for(var j=0; j<numPaisesLugaresTemp; j++){

			if(fotos[i].lugares[j].lugar.toUpperCase().trim()==texto.toUpperCase().trim()){

				return fotos[i].lugares[j];

			}

		}

	}
	
	return null;

}

function buscarPaisPorLugar(texto){

	var numPaises = fotos.length;

	var numPaisesLugares = 0;

	var numLugares = 0;

	for(var i=0; i<numPaises; i++){

		var numPaisesLugaresTemp = fotos[i].lugares.length;

		for(var j=0; j<numPaisesLugaresTemp; j++){

			if(fotos[i].lugares[j].lugar.toUpperCase().trim()==texto.toUpperCase().trim()){

				return fotos[i];

			}

		}

	}

}

function buscarPaisPorNombre(texto){

	var numPaises = fotos.length;

	var numPaisesLugares = 0;

	var numLugares = 0;

	for(var i=0; i<numPaises; i++){

		if(fotos[i].pais.toUpperCase().trim()==texto.toUpperCase().trim()){

			return fotos[i];

		}

	}
	
	return null;

}

function irAPais(pais,mapa) {
			
	mapa.setCenter( new google.maps.LatLng(pais.latitud , pais.longitud));
	
	var zoom = 5;
	
	mapa.setZoom(zoom);
	
	 seleccionarLista(pais.pais);

}
 
 function unirBocadillo(marca){

	google.maps.event.addListener(marca, 'click', function(){
		
		if(infowindow){
		
			$("#verfotos").appendTo("#invisible");
				
			infowindow.close();
				
		}
		
		rellenarBocadillo(marca.title);
		
		seleccionarLista(marca.title);
			
		marca.get('map').setCenter( marca.getPosition());
		
		marca.get('map').setZoom(7);
		
		infowindow = new google.maps.InfoWindow({
			content: document.getElementById("verfotos")
		  });
		  
		infowindow.open(marca.get('map'), marca);
		
		google.maps.event.addListener(infowindow, 'closeclick', function(){
		
			$("#verfotos").appendTo("#invisible");
		
		});
		
	});
}

function seleccionarLista(nombre){

  $("#lista-busqueda option").filter(function() {
  
		return $(this).text() == nombre;
		
	}).attr('selected', true);
	
  $("#lista-busqueda option").filter(function() {
  
		return $(this).text() != nombre;
		
	}).attr('selected', false);
}

function inicializarMapa(mapa) {

		try{
			listarBusqueda(fotos);
			
			/*$( "#lista-busqueda" ).autocomplete({
			  source: listaParaBusqueda
			});*/
			
			var $subType = $("#lista-busqueda");
			  $subType.empty();
			  $.each(listaParaBusqueda, function () {
				$subType.append($('<option></option>').text(this));
			  });
			  
			  $( "#lista-busqueda" ).change(function() {
			  
				var texto = $( this ).val();
				
				var pais = buscarPaisPorNombre(texto);
				
				if(pais){
				
					irAPais(pais,mapa);

				}else{
				
					var marca = marcas[texto];
					
					if(marca){
					
						google.maps.event.trigger(marcas[texto], 'click');
					
					}
				
				}
			  
				});
			
			/*$( "#form-busqueda" ).submit(function( event ) {
				console.info('Buscando '+$("#lista-busqueda").val());
				buscar($("#lista-busqueda").val(),false);
			  event.preventDefault();
			});*/
			
		} catch(e) {
		
			alert("Imposible listar lugares y paises, intentelo en otro momento");
			
			return null;
			
		}
		
		//---- centrado aleatorio	----
		try{
		
			var nombreAleatorio = listaParaBusqueda[Math.floor(Math.random()*listaParaBusqueda.length )];
						
			//Para selectpicker plugin
			//$("#lista-busqueda.selectpicker").selectpicker();
			
			  //$("#lista-busqueda.selectpicker").selectpicker('val', nombreAleatorio);
			  
			  //$("#lista-busqueda.selectpicker").selectpicker('refresh');
			  
			 seleccionarLista(nombreAleatorio);
			
			var busqueda = buscar(nombreAleatorio,false);
			
			mapa.setCenter( new google.maps.LatLng(busqueda.latitud , busqueda.longitud));
			
			var zoom =  (typeof busqueda.lugar === "undefined") ? 5 : 7;
			
			mapa.setZoom(zoom);
			
		}catch(e) {
		
			mapa.setCenter(new google.maps.LatLng(20, 0));
			
			mapa.setZoom(2);
			
		}
		
        //---- Crea las marcas de las fotos por todo el mapa ----
        for (var i = 0; i < lugares.length; i++) {
			var punto = new google.maps.LatLng(lugares[i].latitud,lugares[i].longitud);
						
			var marca = new google.maps.Marker({
				icon :"img/logo2.png",
				position: punto,
				anchor: new google.maps.Point(15, 15),
				title: lugares[i].lugar,
				map: mapa
			});
			
			marcas[lugares[i].lugar] = marca;
			
			unirBocadillo(marca);
			
        }	
    
 }