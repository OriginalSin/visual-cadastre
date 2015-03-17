/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var parsedData = {
		"type": "FeatureCollection",
		//"crs": null,
		"features": []
		
};

function run () {
    // https://bitbucket.org/surenrao/xml2json
	//var map = L.map('map');
    //var myLayer = L.geoJson().addTo(map);
	 
    $.get('data/doc2773027.xml', 
        function(xml){ 
            var json = $.xml2json(xml).CadastralBlocks;
            //$("#data").html('<code>'+JSON.stringify(json)+'</code>'); 
            //console.log(json);
            parseParcels(json.CadastralBlock.Parcels);
            //myLayer.addData(parsedData);

     });
    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.GeoJSON({
            projection: 'EPSG:3857',
            object: parsedData
        })
    });
    var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }), vectorLayer
        ],
        view: new ol.View({
          center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
          zoom: 4
        })
      });
}

// надо помнить, у сраного XML Росреестра первый крнтур не обязательно внешний!!!

function parseParcels(parcels) {
	for(var i=0; i<parcels.Parcel.length; i++){
		//console.log(parcels.Parcel[i]);
		//Пока только полигоны
		var p = parcels.Parcel[i];
		if (p === undefined){
			continue
		} else{
			var feature = {
					"type": "Feature",
					"properties": {"cadnumber": p.CadastralNumber},
					"geometry": {
						"type": "Polygon",
						"coordinates": []
					}
			};
			if(p.EntitySpatial === undefined){
				//console.log(p.CadastralNumber + " геометрия пустая");
				continue;
			}
			// утинная типизация для проверки наличия дырок в полигоне
			if(p.EntitySpatial.SpatialElement.splice){
//				for (var k = 0; k < p.EntitySpatial.SpatialElement.length; k++) {
//					var contour = p.EntitySpatial.SpatialElement[k];
//					for (var j = 0; j < contour.SpelementUnit.length; j++) {
//						var point = contour.SpelementUnit[j];
//						//console.log("array " + point.Ordinate.X);
//					}
//				}
			}
			else {
				var contour = p.EntitySpatial.SpatialElement;
				var geoContour = [];
				for (var j = 0; j < contour.SpelementUnit.length; j++) {
					var point = contour.SpelementUnit[j];
					//console.log("object " + point.Ordinate.X);
					var coords = [];
					coords.push(point.Ordinate.Y);
					coords.push(point.Ordinate.X);
					geoContour.push(coords);
				}
				feature.geometry.coordinates.push(geoContour);
			}
			
		}
		parsedData.features.push(feature);
		
	}
	//console.log(parsedData);
}

