$(document).ready(function(){
	
	d3.json("../map/mi-oh-merge-data-topo.json", function(error, mi) {

	    if (error) return console.error(error);

	    d3.csv("../data/bingo-zip.csv", function(er, bingo){

	    	if (error) return console.error(error);

	    	var bingoDict = {}
	    	console.log(bingo);
	    	for (var i = 0; i < bingo.length; i++) {
	    		bingoDict[bingo["ZCTA5CE10"]] = parseInt(bingo["amount"]);
	    	};

	        var width = 960,
  			height = 560;


		    // (40.755775, -73.982620) center for Manhattan island
		    // this sets the scale that we can see all of the zip-code area with 
		    var smallZoomScale = 5200;
		    var smallZoomCenter = [-83.869629, 41.777457];
		    // this sets the scale that we focus on the area where people play.
		    var mediumZoomScale = 16000;
		    var mediumZoomCenter = [-83.117065, 42.430299];

		    var projection = d3.geo.mercator()
		            .center(mediumZoomCenter)
		            .scale(mediumZoomScale)
		            .translate([(width) / 2, (height)/2]);

		      var path = d3.geo.path()
		      .projection(projection);

		    /*svg.append("path")
		        .datum( topojson.feature( nyc, nyc.objects.boroughs ))
		        .attr("d", path);
		    */

		    var miMap = d3.select("body").select("#map-chart").append("svg")
		    	.attr("width", width)
		    	.attr("height", height);

			miMap.selectAll(".zip")
		        .data(topojson.feature(mi, mi.objects["mi-oh-rmpr"]).features)
		      .enter().append("path")
		        .attr("class", function(d) { 
		          // console.log(d);
		          return "zip"; })
		        .attr("d", path)
		        .attr("fill", function(d){

		        	if ("donation" in d.properties){
		        		// return "blue";
		        		return "rgba(44,48,221,1)";
		        	}
		       		else{
						// return "rgba(51,51,51,0.9)";
						return "rgba(227,226,158,1)";
		        	}
		        })
		        .style("stroke", "rgba(255,255,255,0.1)")
		        .attr("stroke-width", 1);


		    // place pin on the map
		    // 1. (42.520795, -83.049812)
		    // 2. (42.241616, -83.263993)

		    // data saving where people play bingo
		    var bingoPlaceData = [
		    {
		    	"name": "Green Acres Bingo Hall",
		     	"address": "5653 E 13 Mile Rd Warren, MI",
		     	"lat":42.520795,
		     	"lng": -83.049812
			}
			/*,
			{"name": "Democratic Club Bingo",
		     "address": "23400 Wick Rd Taylor, Michigan 48180",
		     "lat": 42.241616,
		     "lng": -83.263993
			}*/
		    ];

		    var bingoPlaces = miMap.selectAll(".bingo-place")
		       .data(bingoPlaceData)
		    	.enter().append("g")
		    	.attr("class", "bingo-place")
		    	.attr("transform", function(d){

		    		console.log(d);

			    	return "translate(" + projection([
				              d.lng,
				              d.lat
				            ]) + ")";
			    });

			bingoPlaces.append("circle")
		    	.attr("r", 8)
		    	.attr("class", "bingo-circle")
			    // .style("fill", "red");
			    .style("fill", "rgba(190, 67, 47, 1)")

			bingoPlaces.append("text")
				.text(function(d){
					return d.name;
				})
				.attr("transform", function(d){
					return "translate(" + 18 + "," + 9 + ")";
				})
				.style("font-size", 15);

			// these cities are shown to give audience an overview of where that is.
			var citiesData = [
			 {
			 	"name": "Detroit",
			 	"lat": 42.331427,
			 	"lng": -83.045754
			 }
			]

			var cities = miMap.selectAll(".city-g")
			   .data(citiesData)
				.enter().append("g")
		    	.attr("class", "city-g")
		    	.attr("transform", function(d){

			    	return "translate(" + projection([
				              d.lng,
				              d.lat
				            ]) + ")";
			    });

		    cities.append("circle")
		    	.attr("r", 5)
		    	.attr("class", "city-circle")
			    .style("fill", "rgba(84, 82, 68, 1)");

			cities.append("text")
				.text(function(d){
					return d.name;
				})
				.attr("transform", function(d){
					return "translate(" + 18 + "," + 9 + ")";
				})
				.style("font-size", 15);


			// append the thumbnail here
			miMap.append("svg:image")
				.attr("transform", function(d){
					return "translate(" + 650 + "," + 360 + ")";
				})
				.attr("width", 322*0.8)
				.attr("height", 233*0.8)
				.attr("src", "img/map-thumbnail.png")
				.attr("xlink:href", "img/map-thumbnail.png");

			// append legend
			miMap.append("rect")
				.attr("width", 25)
				.attr("height", 25)
				.attr("transform", function(d){
					return "translate(" + 720 + "," + 10 + ")";
				})
				.attr("fill", "red");




	    });


    });

});