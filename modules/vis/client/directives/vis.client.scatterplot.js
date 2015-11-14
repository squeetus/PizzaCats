'use strict';

angular.module('vis')
  .directive('scatterplot', function($window) {
    return{
        restrict: "EA",
        template: "<svg width='600' height='200'></svg>",
        link: function(scope, elem, attrs){
          scope.$on("Data_Ready", function  (){

            var notes=scope.notes;
            var d3 = $window.d3;
            var rawSvg = elem.find("svg")[0];
            var svg = d3.select(rawSvg);
            var data = [];

            // Define the div for the tooltip
            var div = d3.select('.tooltip');
            console.log(div);

            // obtain note data from Promise
            for (var property in notes) {
                if (notes.hasOwnProperty(property)) {
                    if(notes[property].constructor.name === "Resource"){
                      data.push(notes[property]);
                    }
                }
            }

            var margin = {top: 20, right: 20, bottom: 30, left: 60},
               width = 800 - margin.left - margin.right,
               height = 200 - margin.top - margin.bottom;

             var parseDate = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ').parse;

             var r = d3.scale.linear()
              .range([3,8]);

             var x = d3.time.scale()
               .range([30, width]);

             var y = d3.scale.linear()
               .range([height, 0]);

             var xAxis = d3.svg.axis()
               .scale(x)
               .orient('bottom')
               .tickFormat(d3.time.format("%a %d %I%p"));

             var yAxis = d3.svg.axis()
               .scale(y)
               .orient('left');

             var line = d3.svg.line()
               .x(function(d) { return x(d.date); })
               .y(function(d) { return y(d.close); });

             svg
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom)
              .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

             data.forEach(function(d) {
               d.date = parseDate(d.created);
             });

             x.domain(d3.extent(data, function(d) { return d.date; }));
             //  y.domain(d3.extent(data, function(d) { return d.close; }));
             y.domain([0,10]);
             r.domain(d3.extent(data, function(d) { return d.content.length; }));

             // Add the scatterplot
             svg.selectAll("note")
                 .data(data)
               .enter().append("svg:circle")
                 .attr("r", function(d) { return r(d.content.length); })
                 .attr("cx", function(d) { return x(d.date); })
                 .attr("cy", function(d) { return y(3); })
                 .on("click", function(d) {
                   d3.select(this).transition()
                          .duration(250)
                          .style("color", "white");
                   div.transition()
                          .duration(200)
                          .style("opacity", 0.9);
                      div	.html("mood: " + d.mood + "<br/>"  + d.content + "<br />" + d.date)
                          .style("left", (d3.event.pageX) + "px")
                          .style("top", (d3.event.pageY - 100) + "px");
                      })
                  .on("mouseout", function(d) {
                    d3.select(this).transition()
                           .duration(250)
                           .style("color", "black");
                      div.transition()
                          .duration(500)
                          .style("opacity", 0)
                          .style("pointer-events", "none");
                  });

             // Add the X Axis
             svg.append("g")
                 .attr("class", "x axis")
                 .attr("transform", "translate(0," + height + ")")
                 .call(xAxis);

             // Add the Y Axis
             svg.append("g")
                 .attr("class", "y axis")
                 .call(yAxis);
             });
        }
      };
    });
