//25 attributes' name in array
var attributes = ["ID","Flag","Mass","Radius","Period",
"Semi_major_axis","Eccentricity","Periastron","Longitude","Ascending_node",
"Inclination","Surface_tem","Age","Discovery_method","Discovery_year",
"Last_updated","Right_ascension","Declination","Distance_from_sun","Host_star_mass",
"Host_star_radius","Host_star_metallicity","Host_star_temperature","Host_star_age","Planet_detection_status"];


//25 attributers' name in map
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
attMap.set("Surface_tem", ["Surface temperature","K","max"]);
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

//pick up 19 attributes which are suitable for drawing histogramm graph
var plotAttributes = ["Mass","Radius","Period",
"Semi_major_axis","Eccentricity","Periastron","Longitude","Ascending_node",
"Inclination","Surface_tem","Age","Right_ascension","Declination","Distance_from_sun","Host_star_mass",
"Host_star_radius","Host_star_metallicity","Host_star_temperature","Host_star_age"];

//bar color
var colorWell;
var defaultColor = "#0000ff"; //default bar color

var scatter_height = 300;

//start up color picker listener
window.addEventListener("load", startup, false)

//start up window size changed listener
window.addEventListener("resize", redraw);

//current drawing attribute
var currentAttribute;

//Add attribute selecting button  
d3.select("#attrPicker").selectAll("button")
  .data(plotAttributes).enter()
  .append("button")
  .attr("type","button")
  .attr("class","btn btn-success btn-block btn-xs")
  .attr("margin","10px")
  .text(function(d) {return attMap.get(d)[0];})
  .on('click',function(d) {
    clearPlot();
    currentAttribute = d;
    drawHistogram(planetData,d);
  });

//hide plot canvas before data is downloaded.
d3.select("#plotCanvas").attr("hidden",true);
d3.select("#loading").attr("hidden",null);

//plot area width and control area width
var graphAreaWidth =  d3.select("#viewArea").node().getBoundingClientRect().width;
var controlAreaWidth =  d3.select("#controlArea").node().getBoundingClientRect().width;

//histogram plot attribute
var margin = {top: 20, right: 20, bottom: 90, left: 50},
    margin2 = {top: 330, right: 20, bottom: 35, left: 50},
    width = graphAreaWidth - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    height2 = 400 - margin2.top - margin2.bottom;

var x = d3.scaleLinear().range([0, width]),
    x2 = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2 , 0]);

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

//Add a svg element to plot histogram
var svg = d3.select("#histogram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

//Exoplanet dataset data
var planetData;

//set the bar height when value equals 0
var  minHeight = 0;

//loading data from remote storage
var dataUrl = "https://freddie1129.github.io//dataset";

console.log("Fetching from URL:" + dataUrl);

d3.csv(dataUrl)
.row(convertFormatRaw)
.get(function(error, rows) {
  console.log("Fetch finished.");
  
  if(error) throw error;
  
  planetData = rows;

  //hide loading bar, and show canvas
  d3.select("#plotCanvas").attr("hidden",null);
  d3.select("#loading").attr("hidden",true);
 
  allCount = planetData.length;
  clearPlot();

  currentAttribute = "Mass";
  drawHistogram(planetData,currentAttribute);
});

//clear old plot every thime when refreshing plot
function clearPlot()
{
  svg.selectAll("*").remove();
  svg_sc_plot.selectAll("*").remove();
}

// histogram parameter
var focus,context;
var randomvalues;

//retrieve data with the range from min to max
function getRangeData(arr,minValue,maxValue)
{
  var len = arr.length;
  var newArr = [];
  while (len--) {
    if (arr[len] > minValue && arr[len] < maxValue){
        newArr.push(arr[len]);
    }
  }
  return newArr;
}

//draw histogram plot
function drawHistogram(rows,attributeName)
{

  var graphAreaWidth =  d3.select("#viewArea").node().getBoundingClientRect().width;
  var controlAreaWidth =  d3.select("#controlArea").node().getBoundingClientRect().width;

  // adjuxt plot size according to the window size 
  margin = {top: 20, right: 20, bottom: 90, left: 50},
  margin2 = {top: 330, right: 20, bottom: 35, left: 50},
  width = graphAreaWidth - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom,
  height2 = 400 - margin2.top - margin2.bottom;

  x = d3.scaleLinear().range([0, width]),
  x2 = d3.scaleLinear().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  y2 = d3.scaleLinear().range([height2 , 0]);

  xAxis = d3.axisBottom(x).tickSize(2),
  xAxis2 = d3.axisBottom(x2).tickSize(2),
  yAxis = d3.axisLeft(y).tickSize(0);

  //brush for picking up
  brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush", brushed);

  //zoom out and zoom in
  zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

  svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  randomvalues =  getAttributeArray(rows,attributeName);
  validCount = randomvalues.length;

  var yAxisLegent = attMap.get(attributeName)[0] + "   (" + attMap.get(attributeName)[1] + ")";
  yAxisLegent = yAxisLegent + "   ( Valid : " + validCount + ",Total : " + allCount + ")";

  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //zoom out and zoom in
  context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  x.domain([d3.min(randomvalues), d3.max(randomvalues)]);
 
  // set the parameters for the histogram
  var histogram = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(100));

  var histogramvalue = histogram(randomvalues);

  var standardwith = histogramvalue[1].x1 - histogramvalue[1].x0;

  histogramvalue[0].x0 = histogramvalue[0].x1 - standardwith;
  histogramvalue[histogramvalue.length - 1].x1 = histogramvalue[histogramvalue.length - 1].x0 + standardwith;

  data = histogramvalue;
  var xMin = d3.min(randomvalues);
  var xMax = d3.max(randomvalues);
  var yMin = d3.min(data,function(d) {
    return d.length});
  var yMax = d3.max(data,function(d) {return d.length});


  x.domain([histogramvalue[0].x0, histogramvalue[histogramvalue.length - 1].x1]);
  x2.domain(x.domain());
  y.domain([yMin, yMax]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  //bar width
  var binWidth = width / data.length - 1;

  // append scatter plot to main chart area
  var messages = focus.append("g");
    messages.attr("clip-path", "url(#clip)");
    messages.selectAll("message")
        .data(data)
        .enter().append("rect")
        .attr('class', 'message')
        .attr("transform", function(d,i) {
      return "translate(" + x(d.x0) + "," + (y(d.length) - 10) + ")"; })
        .attr("width",function(d) {return x(d.x1) - x(d.x0) - 2 })
        .attr("height", function(d) {return height - y(d.length) + 10;  })
        .attr("fill", colorWell.value);
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

  svg.append("text")
        .attr("transform",
              "translate(" + ((width + margin.right + margin.left)/2) + " ," +
                             (height + margin.top + margin.bottom - 5) + ")")
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
          
      return "translate(" + x2(d.x0) + "," + (y2(d.length) - minHeight) + ")"; })
        .attr("width",function(d) {return x2(d.x1) - x2(d.x0) - 2 })
        .attr("height", function(d) {return height2 - y2(d.length) + minHeight;  })
        .attr("fill", colorWell.value);
        //.style("opacity", 0.4)
        // .attr("fill", function(d) { return colorScale(d.length) });

  context.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

  context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

  //draw scatter plot 
  drawScatter(randomvalues);

}


//scatter plot attribute
var graphAreaWidth =  d3.select("#viewArea").node().getBoundingClientRect().width;
var controlAreaWidth =  d3.select("#controlArea").node().getBoundingClientRect().width;

var margin_sc = {top: 20, right: 20, bottom: 30, left: 50},
      width_sc = graphAreaWidth - margin_sc.left - margin_sc.right,
      height_sc = scatter_height - margin_sc.top - margin_sc.bottom;

var svg_sc = d3.select("#scatter").append("svg");
var svg_sc_plot = svg_sc.append("g");
var x_sc = d3.scaleLinear().range([0, width_sc]);
var  y_sc = d3.scaleLinear().range([height_sc, 0]);


//draw scatter plot
function drawScatter(data)
{
  
  svg_sc_plot.selectAll("*").remove();

  var graphAreaWidth =  d3.select("#viewArea").node().getBoundingClientRect().width;
  var controlAreaWidth =  d3.select("#controlArea").node().getBoundingClientRect().width;

  margin_sc = {top: 20, right: 20, bottom: 30, left: 50};
  width_sc = graphAreaWidth - margin_sc.left - margin_sc.right;
  height_sc = scatter_height - margin_sc.top - margin_sc.bottom;

  svg_sc.attr("width", width_sc + margin_sc.left + margin_sc.right)
    .attr("height", height_sc + margin_sc.top + margin_sc.bottom)
    
  svg_sc_plot.attr("transform", "translate(" + margin_sc.left + "," + margin_sc.top + ")");

  x_sc = d3.scaleLinear().range([0, width_sc]);
  y_sc = d3.scaleLinear().range([height_sc, 0]);
 
  // Scale the range of the data
  x_sc.domain([0,data.length]);
  y_sc.domain([d3.min(data),d3.max(data)]);
    
  // Add the scatterplot
  svg_sc_plot.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d,i) { return x_sc(i); })
        .attr("cy", function(d) { return y_sc(d); })
        .style("fill", colorWell.value);

  // Add the X Axis
  svg_sc_plot.append("g")
      .attr("transform", "translate(0," + height_sc + ")")
      .call(d3.axisBottom(x_sc));

  // Add the Y Axis
  svg_sc_plot.append("g").call(d3.axisLeft(y_sc));
}


//create brush function redraw scatterplot with selection
function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));

 var xscatterMin = x.domain()[0];
  var xscatterMax = x.domain()[1];

  var newArr = getRangeData(randomvalues,xscatterMin,xscatterMax);
  drawScatter(newArr);


  focus.selectAll(".message")
        .attr("transform", function(d,i) {
      return "translate(" + x(d.x0) + "," + (y(d.length) - minHeight) + ")"; })
        .attr("width",function(d) {return x(d.x1) - x(d.x0) - 2 })
        .attr("height", function(d) {return height - y(d.length) + minHeight;  })
        .attr("fill", colorWell.value);
         //.attr("fill", function(d) { return colorScale(d.length) });
  focus.select(".x-axis").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}



function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  var xscatterMin = x.domain()[0];
  var xscatterMax = x.domain()[1];

  var newArr = getRangeData(randomvalues,xscatterMin,xscatterMax);
  drawScatter(newArr);

  focus.selectAll(".message")
  .attr("transform", function(d,i) {
        
      return "translate(" + x(d.x0) + "," + (y(d.length) - minHeight) + ")"; })
        .attr("width",function(d) {return x(d.x1) - x(d.x0) - 2 })
        .attr("height", function(d) {return height - y(d.length) + minHeight;  })
         .attr("fill", colorWell.value);
         //.attr("fill", function(d) { return colorScale(d.length) });
  focus.select(".x-axis").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
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

var allCount;   //exoplanet number
var validCount;  //invalid number

//Query data by attribute name
function getAttributeArray(data,key)
{
  console.log("...Retrieve " + attMap.get(key)[0] +  "...");
  var value = [];
  for (i = 0; i < data.length; i++)
  {
    var a = data[i][key];
    if (a != "")
    {
      value.push(parseFloat(a));
    }
  }
  allCount =  data.length;
  validCount = value.length;
  console.log("Done. Valid: " + value.length + " Invalid: " + (data.length - value.length));
  return value;
}

//setup default colour
function startup() {
  colorWell = document.querySelector("#colorWell");
  colorWell.value = defaultColor;
  colorWell.addEventListener("input", updateFirst, false);
  colorWell.addEventListener("change", updateAll, false);
  colorWell.select();
}

//color checked Listener 
function updateFirst(event) {
  console.log("change color");
  d3.selectAll(".message")
        .attr("fill", event.target.value);

  d3.selectAll(".messageContext")
        .attr("fill", event.target.value);

  d3.selectAll("circle")
        .style("fill", event.target.value);
}

//closed color panel listener
function updateAll(event) {
  console.log("change color");
  d3.selectAll(".message")
        .attr("fill", event.target.value);

  d3.selectAll(".messageContext")
        .attr("fill", event.target.value);

   d3.selectAll("circle")
        .style("fill", event.target.value);
}

//redraw when window size changed
function redraw()
{
    clearPlot();
  drawHistogram(planetData,currentAttribute);
}
