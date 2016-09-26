// Key Functions and Variables // ----------------------------------------------
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 50}, // allows automatic spacing of chart elements from edges
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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

function horizGridlines() {
    return d3.axisRight(y)
             .ticks((y.ticks().length)/2) //<--add a gridline every two ticks
             ;
} ;

// Load, Format, & Draw the Data // --------------------------------------------
d3.csv("data.csv", function(error, data){// load the data
    if (error) throw error;

    // extract/format the data
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.close = +d.close; // + forces d to be interpreted as a number
    })

    // scale the data (map to an appropriate point given the size of the screen
    x.domain(d3.extent(data, function(d) { return d.date; })); // d3.extent grabs the min and max of the data
    /*x.domain([d3.min(data, function(d) { return d.date; }),
              d3.max(data, function(d) { return d.date; })+d3.timeMonth(4)
          ); // d3.extent grabs the min and max of the data*/
    y.domain([0,d3.max(data, function(d) { return d.close; })]);

    svg.append("path")
       .data([data])
       .attr("class", "line") // allows for CSS styling
       .attr("d", valueLine)
       ;

    // Add the x-axis
    svg.append("g")
       .attr("transform","translate(0," + height + ")")
       .attr("class","primary-axis x-axis")
       .call(d3.axisBottom(x) // axisBottom == an axis w/ticks drawn under it
               .tickFormat(d3.timeFormat("%B"))
               .ticks(d3.timeMonth.every(6))
               .tickSizeOuter([0]) // hides end ticks
               .tickSizeInner([0]) // hides minor ticks
               .tickPadding([7])
           )
       ;

    // Add the secondary x-axis (for years)
    svg.append("g")
        .attr("transform","translate(0," + (height + 20) + ")") // moves to bottom of chart
        .attr("class","secondary-axis x-axis")
        .call(d3.axisBottom(x) // axisBottom == an axis w/ticks drawn under it
                .tickFormat(d3.timeFormat("%Y"))
             )
       ;

    // Add the y-axis
    svg.append("g")
       .call(d3.axisLeft(y) // axisLeft == an axis w/ticks drawn to the left of it
                .ticks((y.ticks().length)/2) //<--show half as many ticks as suggested
                .tickSizeOuter([0]) // hides end ticks
                .tickSizeInner([0]) // hides minor ticks
                /*.tickFormat(function(d, i) {
                    if(i == 0) {
                        return "";
                    }
                    return d;
                })*/ // use commented out section to hide first tick text
                .tickPadding([5])
            )
       .attr("class","primary-axis y-axis")
       ;

    // Add the y-axis gridlines
    svg.append("g")
       .attr("class", "grid")
       .call(horizGridlines()
        .tickSize(width)
        .tickFormat("")
        )
       ;

    /* Add a single tick mark
    svg.append("line")
       .attr("x1", .5)
       .attr("y1", height)
       .attr("x2", .5)
       .attr("y2", height + 5)
       .attr("class","y-cross")
        ;
    */
   });

/*
Additional Resources:
- Basic line chart
https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0

- Q: Why do you have to draw within the csv function? A: Because that function is processed last
http://stackoverflow.com/questions/9491885/csv-to-array-in-d3-js

- How to draw a line (because I wanted no outer ticks but to show the axes crossing at zero):
https://www.dashingd3js.com/svg-basic-shapes-and-d3js
*/
