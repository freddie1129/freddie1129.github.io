//25 attributes' name in table
var attributes = ["ID","Flag","Mass","Radius","Period",
"Semi_major_axis","Eccentricity","Periastron","Longitude","Ascending_node",
"Inclination","Surface_tem","Age","Discovery_method","Discovery_year",
"Last_updated","Right_ascension","Declination","Distance_from_sun","Host_star_mass",
"Host_star_radius","Host_star_metallicity","Host_star_temperature","Host_star_age","Planet_detection_status"];



var attMap = new Map();
attMap.set("ID", ["Primary identifier",""]);
attMap.set("Flag", ["Binary",""]);
attMap.set("Mass", ["Planetary mass","Jupiter messes"]);
attMap.set("Radius", ["Radius","Jupiter radii"]);
attMap.set("Period", ["Period","days"]);
attMap.set("Semi_major_axis", ["Semi-mjor axis","Astronmical Units"]);
attMap.set("Eccentricity", ["Eccentricity",""]);
attMap.set("Periastron", ["Periastron","degree"]);
attMap.set("Longitude", ["Longitude","degree"]);
attMap.set("Ascending_node", ["Ascending node","degree"]);
attMap.set("Inclination", ["Inclination","degree"]);
attMap.set("Surface_tem", ["Surface or equilibrium temperature","K","max"]);
attMap.set("Age", ["Age","Gyr"]);
attMap.set("Discovery_method", ["Discovery method",""]);
attMap.set("Discovery_year", ["Discovery method","yyyy"]);
attMap.set("Last_updated", ["Last updated","yy mm dd"]);
attMap.set("Right_ascension", ["Right ascension","hh mm ss"]);
attMap.set("Declination", ["Declination","dd mm ss"]);
attMap.set("Distance_from_sun", ["Distance from sum","parsec"]);
attMap.set("Host_star_mass", ["Host star mass","Solar masses"]);
attMap.set("Host_star_radius", ["Host star radius","Soloar radii"]);
attMap.set("Host_star_metallicity", ["Host star metallicity","log relative to solar"]);
attMap.set("Host_star_temperature", ["Host star temperature","K"]);
attMap.set("Host_star_age", ["Host star age","Gyr"]);
attMap.set("Planet_detection_status", ["Planet Detection Status List",""]);









var margin = {top: 20, right: 20, bottom: 90, left: 50},
    margin2 = {top: 230, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    height2 = 300 - margin2.top - margin2.bottom;

var parseTime = d3.timeParse("%Y-%m-%d");

var x = d3.scaleLinear().range([0, width]),
    x2 = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var color = "steelblue";
    var colorScale = d3.scaleLinear()
            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

//x = d3.scaleLinear().range([0,width]);
//x2 = d3.scaleLinear().range([0,width]);

var xAxis = d3.axisBottom(x).tickSize(2),
    xAxis2 = d3.axisBottom(x2).tickSize(2),
    yAxis = d3.axisLeft(y).tickSize(0);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var svg = d3.select("#demo").append("svg")
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

//d3.csv("message_history.csv", function(error, data) {
//fetching data from remote url
//console.log("Fetching from URL:" + dataUrl);
d3.csv("dataset")
.row(convertFormatRaw)
.get(function(error, rows) {

  if(error) throw error;
  var attributeName = "Host_star_radius";

  var yAxisLegent = attMap.get(attributeName)[0] + "   (" + attMap.get(attributeName)[1] + ")";

  var randomvalues =  getAttributeArray(rows,attributeName);



//var randomvalues = d3.range(1000).map(d3.randomNormal(20, 5));

x.domain([d3.min(randomvalues), d3.max(randomvalues)]);
// set the parameters for the histogram
var histogram = d3.histogram()
    //.value(function(d) { return d.date; })
    .domain(x.domain())
    .thresholds(x.ticks(100));

var histogramvalue = histogram(randomvalues);

var standardwith = histogramvalue[1].x1 - histogramvalue[1].x0;

histogramvalue[0].x0 = histogramvalue[0].x1 - standardwith;
histogramvalue[histogramvalue.length - 1].x1 = histogramvalue[histogramvalue.length - 1].x0 + standardwith;

  /*data.forEach(function(d) {
    d.sent_time = parseTime(d.sent_time);
  });*/

  /*var datanew = [];
  datanew.push(data[0]);
  for (var i = 0; i < data.length; i++)
  {
    var a = datanew[datanew.length - 1];
    var b = data[i];
    //console.log("+++++++")
    //console.log(a.sent_time);
    //console.log(b.sent_time);
    if (a.sent_time.getTime() === b.sent_time.getTime())
    {
      datanew[datanew.length - 1] = data[i];
    }
    else
    {
      datanew.push(data[i]);
    }
  }
  data = datanew;
*/

  data = histogramvalue;


  //var xMin = d3.min(data, function(d) { return d.sent_time; });
  //var xMax = d3.max(data, function(d) { return d.sent_time; });
  //var yMin = d3.min(data, function(d) { return d.messages_sent_in_day; });
  //var yMax = d3.max(data, function(d) { return d.messages_sent_in_day; });
  
  var xMin = d3.min(randomvalues);
  var xMax = d3.max(randomvalues);
  var yMin = d3.min(data,function(d) {
    return d.length});
  var yMax = d3.max(data,function(d) {return d.length});
  //xMin = 0;
  //xMax = data.length;

  x.domain([histogramvalue[0].x0, histogramvalue[histogramvalue.length - 1].x1]);
  x2.domain(x.domain());


  y.domain([yMin, yMax]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  colorScale.domain([yMin, yMax])
            .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

  var binWidth = width / data.length - 1;

  /*var num_messages = function(dataArray, domainRange) { return d3.sum(dataArray, function(d) {
    return d.sent_time >= domainRange.domain()[0] && d.sent_time <= domainRange.domain()[1];
    })
  }*/

  // append scatter plot to main chart area
  var messages = focus.append("g");
    messages.attr("clip-path", "url(#clip)");
    messages.selectAll("message")
        .data(data)
        .enter().append("rect")
        .attr('class', 'message')
        .attr("transform", function(d,i) {
        /*  console.log("transform: i = " + i);
          console.log("transform" + height);
          var l = d3.min(d);
          l = 0;
          var len = d.length;
          len = 78;
          var x0 = d.x0;
          var x1 = d.x1;
          len = 90;

          var test  = x(d.x0);
*/
          //console.log(y(d.messages_sent_in_day));
      return "translate(" + x(d.x0) + "," + (y(d.length) - 10) + ")"; })
        .attr("width",function(d) {return x(d.x1) - x(d.x0) - 2 })
        .attr("height", function(d) {return height - y(d.length) + 10;  })

        //.attr("r", 4)
        .style("opacity", 0.4)
         .attr("fill", function(d) { return colorScale(d.length) });
        //.attr("cx", function(d) { return x(d.sent_time); })
        //.attr("cy", function(d) { return y(d.messages_sent_in_day); })

    xAxis = d3.axisBottom().scale(x).tickSize(2);
    xAxis2 = d3.axisBottom(x2).tickSize(2);

  focus.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

  focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

  // Summary Stats
  focus.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        //.text(yAxisLegent);

  /*focus.append("text")
        .attr("x", width - margin.right)
        .attr("dy", "1em")
        .attr("text-anchor", "end")
        .text("Messages: " + num_messages(data, x));
*/

  svg.append("text")
        .attr("transform",
              "translate(" + ((width + margin.right + margin.left)/2) + " ," +
                             (height + margin.top + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text(yAxisLegent);

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
          .enter().append("rect")
          .attr('class', 'messageContext')
          //.attr("r",3)
          .style("opacity", .6)
          .attr("transform", function(d,i) {
          
      return "translate(" + x2(d.x0) + "," + (y2(d.length) - 10) + ")"; })
        .attr("width",function(d) {return x2(d.x1) - x2(d.x0) - 2 })
        .attr("height", function(d) {return height2 - y2(d.length) + 10;  })

        //.attr("r", 4)
        .style("opacity", 0.4)
         .attr("fill", function(d) { return colorScale(d.length) });
          //.attr("cx", function(d) { return x2(d.sent_time); })
          //.attr("cy", function(d) { return y2(d.messages_sent_in_day); })

  context.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

  context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());




///////////below scatter 

// set the ranges

var margin_sc = {top: 20, right: 20, bottom: 30, left: 50},
    width_sc = 960 - margin_sc.left - margin_sc.right,
    height_sc = 500 - margin_sc.top - margin_sc.bottom;

var x_sc = d3.scaleLinear().range([0, width_sc]);
var y_sc = d3.scaleLinear().range([height_sc, 0]);


var svg_sc = d3.select("#scatter").append("svg")
    .attr("width", width_sc + margin_sc.left + margin_sc.right)
    .attr("height", height_sc + margin_sc.top + margin_sc.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_sc.left + "," + margin_sc.top + ")");
// define the line
var valueline = d3.line()
    .x(function(d,i) { return x(i); })
    .y(function(d) { return y(d); });

    // Scale the range of the data
  x_sc.domain([0,randomvalues.length]);
  y_sc.domain([d3.min(randomvalues),d3.max(randomvalues)]);
  // Add the valueline path.
  /*svg_sc.append("path")
      .data([randomvalues])
      .attr("class", "line")
      .attr("d", valueline);
    */  
  // Add the scatterplot
  svg_sc.selectAll("dot")
      .data(randomvalues)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d,i) { return x_sc(i); })
      .attr("cy", function(d) { return y_sc(d); });

  // Add the X Axis
  svg_sc.append("g")
      .attr("transform", "translate(0," + height_sc + ")")
      .call(d3.axisBottom(x_sc));

  // Add the Y Axis
  svg_sc.append("g")
      .call(d3.axisLeft(y_sc));



  });

//create brush function redraw scatterplot with selection
function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.selectAll(".message")
        //.attr("cx", function(d) { return x(d.sent_time); })
        //.attr("cy", function(d) { return y(d.messages_sent_in_day); });
        .attr("transform", function(d,i) {
          
      return "translate(" + x(d.x0) + "," + (y(d.length) - 10) + ")"; })
        .attr("width",function(d) {return x(d.x1) - x(d.x0) - 2 })
        .attr("height", function(d) {return height - y(d.length) + 10;  })
         .attr("fill", function(d) { return colorScale(d.length) });
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
  .attr("transform", function(d,i) {
        
      return "translate(" + x(d.x0) + "," + (y(d.length) - 10) + ")"; })
        .attr("width",function(d) {return x(d.x1) - x(d.x0) - 2 })
        .attr("height", function(d) {return height - y(d.length) + 10;  })
         .attr("fill", function(d) { return colorScale(d.length) });
  focus.select(".x-axis").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}


////////
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

//Query data by attribute name
function getAttributeArray(data,key)
{
  console.log("Retrieve " + key +  "...")
  var value = [];
  for (i = 0; i < data.length; i++)
  {
    var a = data[i][key];
    if (a != "")
    {
      value.push(parseFloat(a));
    }
  }
  console.log("Done. Valid: " + value.length + " Invalid: " + (data.length - value.length));
  return value;
}

