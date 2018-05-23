

//25 attributes' name in table
var attributes = ["ID","Flag","Mass","Radius","Period",
"Semi_major_axis","Eccentricity","Periastron","Longitude","Ascending_node",
"Inclination","Surface_tem","Age","Discovery_method","Discovery_year",
"Last_updated","Right_ascension","Declination","Distance_from_sun","Host_star_mass",
"Host_star_radius","Host_star_metallicity","Host_star_temperature","Host_star_age","Planet_detection_status"];



var margin = {top: 20, right: 20, bottom: 90, left: 50},
    margin2 = {top: 230, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    height2 = 300 - margin2.top - margin2.bottom;

var parseTime = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x).tickSize(0),
    xAxis2 = d3.axisBottom(x2).tickSize(0),
    yAxis = d3.axisLeft(y).tickSize(0);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



// Data Load from CSV
d3.csv("message_history_new.csv", function(error, data) {
  if(error) throw error;

  data.forEach(function(d) {
    d.sent_time = parseTime(d.sent_time);
  });






  var values = getData(data,"messages_sent_in_day");


  var max = d3.max(values);
  var min = d3.min(values);
  var x = d3.scaleLinear()
      .domain([min, max])
      .range([0, width]);

var values = d3.range(1000).map(d3.randomNormal(20, 5));


//var data45 = d3.histogram()
//    .bins(x.ticks(20))
//    (values);


  var histogram = d3.histogram()
                    .value(function(d) { return d; })
                    .domain(x.domain())
                    .thresholds(x.ticks(10));

  var test = x.ticks(10);

  var datanew =  histogram(values);
  var yMax = d3.max(datanew, function(d){return d.length});
  var yMin = d3.min(datanew, function(d){return d.length});
  var y = d3.scaleLinear()
    .domain([0, yMax])
    .range([height, 0]);

var color = "steelblue";
  var colorScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

  //var xAxis = d3.axisBottom(x).tickSize(0);
  
  //var xAxis = d3.svg.axis()
  //            .scale(x)
  //            .orient("bottom");


var svgnew = d3.select("#histogram")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var datanew = d3.histogram()
    .thresholds(x.ticks(20))
    (values);

var binwidth = x(datanew[1].x1) - x(datanew[1].x0) - 1;


var bar = svgnew.selectAll(".bar")
    .data(datanew)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });


// A formatter for counts.
var formatCount = d3.format(",.0f");

bar.append("rect")
    .attr("x", 1)
    .attr("width", binwidth)
    .attr("height", function(d) { return height - y(d.length); })
    .attr("fill", function(d) { return colorScale(d.length) });

    bar.append("text")
    .attr("dy", ".75em")
    .attr("y", -12)
    .attr("x", (x(datanew[0].x0) - x(0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.length); });

svgnew.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);










  

  //var xMin = d3.min(data, function(d) { return d.sent_time; });
  //var yMax = d3.max(data, function(d) { return d.messages_sent_in_day; });




  //x.domain([xMin, new Date()]);
  //y.domain([0, yMax]);


  //var x = d3.scaleTime()
  //        .domain([new Date(2013, 4, 5), new Date(2013, 11, 21)])
  //        .rangeRound([0, width]);


// var yMin = d3.min(datanew, function(d){return d.length});
//  var y = d3.scaleLinear()
 //   .domain([0, yMax])


//var y = d3.scaleLinear()
//          .domain([0,yMax])
//          .range([height, 0]);

  
  x2.domain(x.domain());
  y2.domain(y.domain());

  var num_messages = function(dataArray, domainRange) { return d3.sum(dataArray, function(d) {
    return d.sent_time >= domainRange.domain()[0] && d.sent_time <= domainRange.domain()[1];
    })
  }

  // append scatter plot to main chart area
/*  var messages = focus.append("g");
    messages.attr("clip-path", "url(#clip)");
    messages.selectAll("message")
        .data(data)
        .enter().append("circle")
        .attr('class', 'message')
        .attr("r", 4)
        .style("opacity", 0.4)
        .attr("cx", function(d) { return x(d.sent_time); })
        .attr("cy", function(d) { return y(d.messages_sent_in_day); })

*/
/*svg.selectAll("rect")
      .data(bins)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("transform", function(d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
      .attr("height", function(d) { return height - y(d.length); });
*/





var xBinwidth = 20;//width / data.length  - 1;

var messages = focus.append("g");
    messages.attr("clip-path", "url(#clip)");
    messages.selectAll("message")
        .data(datanew)
        .enter().append("rect")
        .attr('class', 'message')
       // .attr('transform',function(d){
       //   return "translate(" + x(d.sent_time) + "," + y(d.messages_sent_in_day) + ")";})
        
 .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });
.attr("height", function(d) { return height - y(d.length); })

        .attr("width", xBinwidth)
     //   .attr("height", function(d) { return height - y(d.messages_sent_in_day); });

//        .attr("cx", function(d) { return x(d.sent_time); })
//        .attr("cy", function(d) { return y(d.messages_sent_in_day); })


  focus.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

 // focus.append("g")
  //      .attr("class", "axis axis--y")
  //      .call(yAxis);

  // Summary Stats
  focus.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Messages (in the day)");

  focus.append("text")
        .attr("x", width - margin.right)
        .attr("dy", "1em")
        .attr("text-anchor", "end")
        .text("Messages: " + num_messages(data, x));

  svg.append("text")
        .attr("transform",
              "translate(" + ((width + margin.right + margin.left)/2) + " ," +
                             (height + margin.top + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Date");

  svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

  // append scatter plot to brush chart area
   var messages = context.append("g");
       messages.attr("clip-path", "url(#clip)");
       messages.selectAll("message")
          .data(data)
          .enter().append("circle")
          .attr('class', 'messageContext')
          .attr("r",3)
          .style("opacity", .6)
          .attr("cx", function(d) { return x2(d.sent_time); })
          .attr("cy", function(d) { return y2(d.messages_sent_in_day); })

  context.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

  context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

  });



//create brush function redraw scatterplot with selection
function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.selectAll(".message")
        .attr("cx", function(d) { return x(d.sent_time); })
        .attr("cy", function(d) { return y(d.messages_sent_in_day); });
  focus.select(".x-axis").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.selectAll(".message")
        .attr("cx", function(d) { return x(d.sent_time); })
        .attr("cy", function(d) { return y(d.messages_sent_in_day); });
  focus.select(".x-axis").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

////////////



var numExoplanets = 3573;
dataUrl = "dataset";
d3.csv(dataUrl)
.row(convertFormat)
.get(function(error, rows) {
  console.log("Fetch finished.");
  console.log("Assign raw data into rawData");
  //assign data
  //rawData = rows; 
  //Data visualisation in dataReady function  
  //dataReady();
  data = getData(rows,"Mass");
  console.log(data);
  //drawHistogram(data);
//drawHistogram(data);


});



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


//get data
function getData(data,key)
{
  console.log("Retrieve " + key + " data." );
  var ret = [];
  for (i = 0; i < data.length; i++)
  {
      var value = data[i][key];
      if (value != "")
      {
        ret.push(parseFloat(value));
      }
  }
  return ret;
}





//draw histogram
function drawHistogram(values)
{

var color = "steelblue";

// Generate a 1000 data points using normal distribution with mean=20, deviation=5
//var values = d3.range(1000).map(d3.random.normal(20, 5));

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


      var histogram = d3.histogram()
    .value(function(d) { return d; })
    .domain(x.domain())
    .thresholds(x.ticks(10));

    var test = x.ticks(10);

var data =  histogram(values);







// Generate a histogram using twenty uniformly-spaced bins.
//var data = d3.layout.histogram()
 //   .bins(x.ticks(20))
 //   (values);

var yMax = d3.max(data, function(d){return d.length});
var yMin = d3.min(data, function(d){return d.length});
var colorScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

var y = d3.scaleLinear()
    .domain([0, yMax])
    .range([height, 0]);

//var xAxis = d3.svga  .svg.axis()
//    .scale(x)
//    .orient("bottom");



var svg = d3.select("#chart2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


// group the data for the bars
  var bins = histogram(values);

  // Scale the range of the data in the y domain
  y.domain([0, d3.max(bins, function(d) { return d.length; })]);

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("transform", function(d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
      .attr("height", function(d) { return height - y(d.length); });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));





var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
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

bar.append("text")
    .attr("dy", ".75em")
    .attr("y", -12)
    .attr("x", (x(data[0].dx) - x(0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
}

/*
* Adding refresh method to reload new data
*/
function refresh(values){
  // var values = d3.range(1000).map(d3.random.normal(20, 5));
  var data = d3.layout.histogram()
    .bins(x.ticks(20))
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

