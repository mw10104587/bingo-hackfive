
$(document).ready(function(){

	// var width = 960,
	var width = 520,
	    height = 200,
	    cellSize = 25; // cell size

	var percent = d3.format(".1%"),
	    format = d3.time.format("%Y-%m-%d");

	var color = d3.scale.quantize()
	    // .domain([-.05, .05])
	    .range(d3.range(4).map(function(d) { return "q" + d + "-4"; }));

	var svg = d3.select("#calendar-chart")
	  .append("svg")
	 	.data([2015])
		.attr("id", "calendar-svg")
	    .attr("width", width)
	    .attr("height", height)
	    // .attr("class", "YlGn")
	    .attr("class", "Greens")
	  .append("g")
	    .attr("transform", "translate(" + ((width - cellSize * 17) / 2) + "," + (height - cellSize * 7 - 1) + ")");

	svg.append("text")
	    .attr("transform", "translate(-26," + cellSize * 3.5 + ")")
	    .style("text-anchor", "middle")
	    .text(function(d) { return d; })
	    .style("font-size", 20);

	var monthTextY = -10;

	svg.append("text")
		.attr("transform", "translate(50," + monthTextY + ")")
		.text("Jan")
		.style("font-size", 14);

	svg.append("text")
		.attr("transform", "translate(160," + monthTextY + ")")
		.text("Feb")
		.style("font-size", 14);

	svg.append("text")
		.attr("transform", "translate(270," + monthTextY + ")")
		.text("Mar")
		.style("font-size", 14);

	svg.append("text")
		.attr("transform", "translate(380," + monthTextY + ")")
		.text("Apr")
		.style("font-size", 14);

	var rect = svg.selectAll(".day")
	    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d , 4, 1)); })
	  .enter().append("rect")
	    .attr("class", "day")
	    .attr("width", cellSize)
	    .attr("height", cellSize)
	    .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
	    .attr("y", function(d) { return d.getDay() * cellSize; })
	    .datum(format);

	rect.append("title")
	    .text(function(d) { return d; });

	svg.selectAll(".month")
	    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d, 4, 1)); })
	  .enter().append("path")
	    .attr("class", "month")
	    .attr("d", monthPath);

	d3.csv("data/bingo-date.csv", function(error, csv) {
	  if (error) throw error;

	  color.domain([3960, 11000]);

	  var data = d3.nest()
	    .key(function(d) { 

	    	// console.log(d.date);
	    	dateString = d.date.toString();
	    	year = dateString.substring(dateString.length-4);
	    	dateString = dateString.substring(0, dateString.length-4 )
	    	day = dateString.substring(dateString.length-2);

	    	day = (day.length > 1)? day : "0" + day

	    	month = dateString.substring(0, dateString.length-2);
	    	// console.log(year + "-0" + month + "-" + day);
	    	return year + "-0" + month + "-" + day ; 

	    })
	    .rollup(function(d) { 
	    	console.log(d[0].amount);
	    	return parseInt(d[0].amount); 
	    })
	    .map(csv);

	  console.log(data);

	  rect.filter(function(d) { 
	  	// console.log(d);
	  	return d in data; })
	      .attr("class", function(d) { 
	      	// console.log(data[d]);
	      	return "day " + color(data[d]) ; });

	  
	  var calendarTip = d3.tip().attr("class", "calendar-tip")
		.html(function(d){

			if (typeof d["amount"] === "undefined" ) {
				return;
			};

			// console.log(d);
			return '<div class="tip-content">' 
				+ '<div>Donation: ' + d["amount"] + '</div>' 
				+ '<div>' + "Date: " + d["date"] + '</div>'
				+ '</div>';
		
		});

	  svg.call(calendarTip);

	  rect.on("mouseover", function(d){

	  	// console.log(data[d]); 	// amount
	  	// console.log(d);			// date

		// calendarTip.show(data[d]);
		calendarTip.show({
			"date": d,
			"amount": data[d]
		});
	  }).on("mouseout", function(d){
		calendarTip.hide(data[d]);
	  });



	    // .select("title")
	      // .text(function(d) { return d + ": " + percent(data[d]); });
	});


	function monthPath(t0) {
	  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
	      d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
	      d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
	  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
	      + "H" + w0 * cellSize + "V" + 7 * cellSize
	      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
	      + "H" + (w1 + 1) * cellSize + "V" + 0
	      + "H" + (w0 + 1) * cellSize + "Z";
	}

	d3.select(self.frameElement).style("height", "2910px");


});
