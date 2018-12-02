//js for generating bar chart and table for the exoplanet dataset
//chrome --allow-file-access-from-files


console.log("Start visualisation");
//Exoplanet data URL
//dataUrl = "https://freddie1129.github.io//dataset";
dataUrl = "dataset.csv";
console.log("Exoplanet Data URL: " + dataUrl);

//25 attributes' name in table
var column = ["ID","Flag","Mass","Radius","Period",
"Semi_major_axis","Eccentricity","Periastron","Longitude","Ascending_node",
"Inclination","Surface_tem","Age","Discovery_method","Discovery_year",
"Last_updated","Right_ascension","Declination","Distance_from_sun","Host_star_mass",
"Host_star_radius","Host_star_metallicity","Host_star_temperature","Host_star_age","Planet_detection_status"];

//discover method
var method=["RV","transit","imaging","microlensing",""];	

//Set bar color, legend style
var barColorMethodRV = "#1f77b4";
var barColorMethodTransit = "#ff7f0e";
var barColorMethodImaging = "#2ca02c";
var barColorMethodMicrolensing = "#d62728";
var barColorMethodNonClear =  "#9467bd";

//Set canvas size
var canvasWidth = 780;
var canvasHeight = 500;

//set barchart background color;
var colorBackground = "#ecf2f9";

//set the exoplanet number used in the barchart, should be less than 3573
var numExoplanets = 3573;

//raw exoplanet data, will be assignd after fetching data from remote url 
var rawData = null;

console.log("Set bar char size." + "width=" + canvasWidth + "," + "height=" + canvasHeight);
d3.select("#barchart").attr("width",canvasWidth);
d3.select("#barchart").attr("width",canvasHeight);
//fetching data from remote url
console.log("Fetching from URL:" + dataUrl);
d3.csv(dataUrl)
.row(convertFormatRaw)
.get(function(error, rows) {
	console.log("Fetch finished.");
	console.log("Assign raw data into rawData");
  //assign data
  rawData = rows;	
  //Data visualisation in dataReady function	
  dataReady();
});

console.log("Set legend color");
d3.select("#MethodRV").style("background-color",barColorMethodRV);
d3.select("#MethodTransit").style("background-color",barColorMethodTransit);;
d3.select("#MethodImaging").style("background-color",barColorMethodImaging);;
d3.select("#MethodMicrolensing").style("background-color",barColorMethodMicrolensing);;
d3.select("#MethodNonClear").style("background-color",barColorMethodNonClear);;


//pick up bar chart legend color
function pickBarColor(index)
{
	switch(index) {
		case 0:
		return barColorMethodRV;
		case 1:
		return barColorMethodTransit;
		case 2:
		return barColorMethodImaging;
		case 3:
		return barColorMethodMicrolensing;
		case 4:
		return barColorMethodNonClear;
		default:
		return barColorMethodRV;
	}
}

//Data visualisation in dataReady function
function dataReady() {
	console.log("Retrieve " + numExoplanets + " exoplanets.");
	tabledata = rawData.slice(1,numExoplanets);
	console.log("Create table");
	createTable(tabledata,column);
	console.log("Start to create bar chart");
	//staFoundMethod(tabledata);
	getMass(tabledata);
}

var discoveryYear = [];		//save data





// Calling refresh repeatedly.
//setInterval(function() {
//  var values = d3.range(1000).map(d3.random.normal(20, 5));
//  refresh(values);
//}, 2000);


function getMass(data)
{
	console.log("Get Mass Data");
	var massdata = [];
	for (i = 0; i < data.length; i++)
	{
		var mass = data[i]["Mass"];
		if (mass != "")
		{
			var massvalue =  parseFloat(mass)
		
		//console.log(mass);
		massdata.push(massvalue)
		console.log(massvalue);
		}
	}
	//refresh(massdata)


var color = "fuchsia";

var tickcount = 200;

// Generate a 1000 data points using normal distribution with mean=20, deviation=5
var values =  massdata; //d3.range(1000).map(d3.random.normal(20, 5));

// A formatter for counts.
var formatCount = d3.format(",.0f");

var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var max = d3.max(values);
var min = d3.min(values);
var x = d3.scaleLinear()
      .domain([min, max])
      .range([0, width]);

// Generate a histogram using ticount uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins(x.ticks(20))
    (values);

var yMax = d3.max(data, function(d){return d.length});
var yMin = d3.min(data, function(d){return d.length});
var colorScale = d3.scale.linear()
            .domain([yMin, yMax])
            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

var y = d3.scale.linear()
    .domain([0, yMax])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
 var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

bar.append("rect")
    .attr("x", 1)
    .attr("width", (x(data[0].dx) - x(0)) - 1)
    .attr("height", function(d) { return height - y(d.y); })
    .attr("fill", function(d) { return colorScale(d.y) });

//bar.append("text")
//    .attr("dy", ".75em")
//    .attr("y", -12)
//    .attr("x", (x(data[0].dx) - x(0)) / 2)
//    .attr("text-anchor", "middle")
//    .text(function(d) { return formatCount(d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

/*
* Adding refresh method to reload new data
*/


var zoom1 = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

    svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom1);





/*// then, create the zoom behvavior
      var zoom = d3.behavior.zoom()
        // only scale up, e.g. between 1x and 50x
        .scaleExtent([1, 50])
        .on("zoom", function() {
          // the "zoom" event populates d3.event with an object that has
          // a "translate" property (a 2-element Array in the form [x, y])
          // and a numeric "scale" property
          var e = d3.event,
              // now, constrain the x and y components of the translation by the
              // dimensions of the viewport
              tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale)),
              ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));
          // then, update the zoom behavior's internal translation, so that
          // it knows how to properly manipulate it on the next movement
          zoom.translate([tx, ty]);
          // and finally, update the <g> element's transform attribute with the
          // correct translation and scale (in reverse order)
          g.attr("transform", [
            "translate(" + [tx, ty] + ")",
            "scale(" + e.scale + ")"
          ].join(" "));
        });

      // then, call the zoom behavior on the svg element, which will add
      // all of the necessary mouse and touch event handlers.
      // remember that if you call this on the <g> element, the even handlers
      // will only trigger when the mouse or touch cursor intersects with the
      // <g> elements' children!
      svg.call(zoom);
*/




}


function refresh(values){
  // var values = d3.range(1000).map(d3.random.normal(20, 5));
  var data = d3.layout.histogram()
    .bins(x.ticks(200))
    (values);

  // Reset y domain using new data
  var yMax = d3.max(data, function(d){return d.length});
  var yMin = d3.min(data, function(d){return d.length});
  y.domain([0, yMax]);
  var colorScale = d3.scale.linear()
              .domain([yMin, yMax])
              .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

  var bar = svg.selectAll(".bar").data(data);

  // Remove object with data
  bar.exit().remove();

  bar.transition()
    .duration(1000)
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  bar.select("rect")
      .transition()
      .duration(1000)
      .attr("height", function(d) { return height - y(d.y); })
      .attr("fill", function(d) { return colorScale(d.y) });

  bar.select("text")
      .transition()
      .duration(1000)
      .text(function(d) { return formatCount(d.y); });

}

function staFoundMethod(data) {
	console.log("Pre-process data");
	for (i = 0; i < data.length; i++) {
		var foundYear = data[i]["Discovery_year"];
		var groupIndex =  groupByYear(foundYear,discoveryYear);
		if ("false" == groupIndex)
		{
			discoveryYear.push({foundYear : foundYear,index : []});
		}
		groupIndex =  groupByYear(foundYear,discoveryYear);
		discoveryYear[groupIndex]["index"].push(i);
	}
	discoveryYear.sort(function(a, b){return a["foundYear"] - b["foundYear"]});
	console.log(discoveryYear);
	if (discoveryYear[0]["foundYear"] == "")
	{
		discoveryYear[0]["foundYear"] = "unkonwn";
	}

	var n = 5; // The number of series.
	var m = discoveryYear.length; // The number of values per series.

	len = discoveryYear.length;
	var xz = [];
	var yz = [new Array(len).fill(0),new Array(len).fill(0),new Array(len).fill(0),new Array(len).fill(0),new Array(len).fill(0)];
	var methodList = [];
	for (var i = 0; i < discoveryYear.length; i++)
	{
		xz.push(discoveryYear[i]["foundYear"]);
		discoveryYear[i]["index"].forEach(function(item,index){
			var m = data[item]["Discovery_method"];
			if (m == method[0])
			{
				yz[0][i]++;
			}
			else if (m == method[1])
			{
				yz[1][i]++;
			}
			else if (m == method[2])
			{
				yz[2][i]++;
			}
			else
			{
				yz[3][i]++;
			}
		});
	}
	createBar(xz,yz);
}


//create bar chart
function createBar(xz,yz)
{
	var x_tick = xz;	//x-alis tick
	var xzt = d3.range(xz.length);
	var xz =  xzt;  
	var n = 5; // The number of series.
	var y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz));
	var yMax = d3.max(yz, function(y) { return d3.max(y); });
	var y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });

	var svg = d3.select("svg");
	svg.attr("width",canvasWidth).attr("height",canvasHeight).style("background-color",colorBackground);
	var margin = {top: 40, right: 10, bottom: 20, left: 10},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var x = d3.scaleBand()
	.domain(xz)
	.rangeRound([0, width])
	.padding(0.08);

	var y = d3.scaleLinear()
	.domain([0, y1Max])
	.range([height, 0]);

	var series = g.selectAll(".series")
	.data(y01z)
	.enter().append("g")
	.attr("fill", function(d, i) {return pickBarColor(i);});

    //set bar shape
    var rect = series.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d, i) { return x(i); })
    .attr("y", height)
    .attr("width", x.bandwidth())
    .attr("height", 0);

    //set animation
    rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); });

    //add bar
    g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
    	.tickFormat(function(d){ return x_tick[d]})
    	.tickSize(0)
    	.tickPadding(6));

    d3.selectAll("input")
    .on("change", changed);

    var timeout = d3.timeout(function() {
    	d3.select("input[value=\"grouped\"]")
    	.property("checked", true)
    	.dispatch("change");
    }, 2000);

    function changed() {
    	timeout.stop();
    	if (this.value === "grouped") transitionGrouped();
    	else transitionStacked();
    }

	//switch to grouped bar chart
	function transitionGrouped() {
		y.domain([0, yMax]);
		rect.transition()
		.duration(500)
		.delay(function(d, i) { return i * 10; })
		.attr("x", function(d, i) { return x(i) + x.bandwidth() / n * this.parentNode.__data__.key; })
		.attr("width", x.bandwidth() / n)
		.transition()
		.attr("y", function(d) { return y(d[1] - d[0]); })
		.attr("height", function(d) { return y(0) - y(d[1] - d[0]); });
	}

	//switch to grouped stacked chart
	function transitionStacked() {
		y.domain([0, y1Max]);
		rect.transition()
		.duration(500)
		.delay(function(d, i) { return i * 10; })
		.attr("y", function(d) { return y(d[1]); })
		.attr("height", function(d) { return y(d[0]) - y(d[1]); })
		.transition()
		.attr("x", function(d, i) { return x(i); })
		.attr("width", x.bandwidth());
	}
}


//group data by found year
function groupByYear(year,group) {
	for (var i = 0; i < group.length; i++)
	{
		if (year.localeCompare(group[i]["foundYear"]) == 0)
		{
			return i;
		}
	}
	return "false";
}

//Conver raw data type, string --> string; string --> number
function convertFormat(d){
	return {
		ID : d.ID,
		Flag : +d["Binary flag"],
		Mass : +d.Mass,
		Radius : +d.Radius,
		Period : +d.Period,
		Semi_major_axis : +d["Semi major axis"],
		Eccentricity : +d.Eccentricity,
		Periastron : +d.Periastron,
		Longitude : +d.Longitude,
		Ascending_node : +d["Ascending node"],
		Inclination : +d.Inclination,
		Surface_tem : +d["Surface temperature"],
		Age : +d.Age,
		Discovery_method : d["Discovery method"],
		Discovery_year : +d["Discovery year"],
		Last_updated : d["Last updated"],
		Right_ascension : d["Right ascension"],
		Declination : d.Declination,
		Distance_from_sun : +d["Distance from Sun"],
		Host_star_mass : +d["Distance from Sun"],
		Host_star_radius : +d["Host star radius"],
		Host_star_metallicity : +d["Host star radius"],
		Host_star_temperature : +d["Host star temperature"],
		Host_star_age : +d["Host star radius"],
		Planet_detection_status : d["Planet Detection Status List"] 
	}
}

//Conver raw data type, string --> string; string --> number
function convertFormatRaw(d){
	return {
		ID : d.ID,
		Flag : d["Binary flag"],
		Mass : d.Mass,
		Radius : d.Radius,
		Period : d.Period,
		Semi_major_axis : d["Semi major axis"],
		Eccentricity : d.Eccentricity,
		Periastron : d.Periastron,
		Longitude : d.Longitude,
		Ascending_node : d["Ascending node"],
		Inclination : d.Inclination,
		Surface_tem : d["Surface temperature"],
		Age : d.Age,
		Discovery_method : d["Discovery method"],
		Discovery_year : d["Discovery year"],
		Last_updated : d["Last updated"],
		Right_ascension : d["Right ascension"],
		Declination : d.Declination,
		Distance_from_sun : d["Distance from Sun"],
		Host_star_mass : d["Distance from Sun"],
		Host_star_radius : d["Host star radius"],
		Host_star_metallicity : d["Host star radius"],
		Host_star_temperature : d["Host star temperature"],
		Host_star_age : d["Host star radius"],
		Planet_detection_status : d["Planet Detection Status List"] 
	}
}


//Create a table
function createTable(data,columns)
{
	var table = d3.select("#table").append("table").classed("table table-bordered table-hover",true);
	var header = table.append("thead").append("tr");
	//Create table header 
	header.selectAll("th")
	.data(columns)
	.enter()
	.append("th")
	.text(function(d) { return d; });
	var tablebody = table.append("tbody");
	rows = tablebody
	.selectAll("tr")
	.data(data)
	.enter()
	.append("tr");
    //Create table row, Connect each exoplanet to row.
    cells = rows.selectAll("td")
    .data(function(row) {
    	return columns.map(function(column) {
    		return {column: column, value: row[column]};
    	});
    })
    .enter()
    .append("td")
    .html(function(d) { return d.value; });
}



