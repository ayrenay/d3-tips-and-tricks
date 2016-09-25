// Key Functions and Variables // ----------------------------------------------
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50}, // allows automatic spacing of chart elements from edges
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set ranges
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height,0]);

// format data
var parseTime = d3.timeParse("%d-%b-%y");

// define the line (specify the x & y coordinates)
var valueLine = d3.line() // <---This is a 'path generator'
                  .x(function(d){ return x(d.date); }) // generates scaled x vals
                  .y(function(d){ return y(d.close); }) // generates scaled y vals
                  ;
// Add the SVG element to the canvas (so that D3 has something to draw on)
var svg = d3.select("body")
            .append("svg") // adds svg element w/height & width attributes
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

            .append("g") // adds grouping element that starts @ [left margin, top margin]
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")")
            ; //* the grouping element can then be used as a point of reference for drawing

// Load, Format, & Draw the Data // --------------------------------------------
d3.csv("data/data.csv", function(error, data){// load the data
    if (error) throw error;

    // extract/format the data
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.close = +d.close; // + forces d to be interpreted as a number
    })

    // scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0,d3.max(data, function(d) { return d.close; })]);

    svg.append("path")
       .data([data])
       .attr("class", "line") // allows for CSS styling
       .attr("d", valueLine)
       ;

    // Add the x-axis
    svg.append("g")
       .attr("transform","translate(0," + height + ")")
       .call(d3.axisBottom(x)) // axisBottom == an axis w/ticks drawn under it
       ;

    // Add the y-axis
    svg.append("g")
       .call(d3.axisLeft(y)) // axisLeft == an axis w/ticks drawn to the left of it
       ;

   });
/*
Additional Resources:
- Basic line chart
https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0

- Q: Why do you have to draw within the csv function? A: Because that function is processed last
http://stackoverflow.com/questions/9491885/csv-to-array-in-d3-js
*/
