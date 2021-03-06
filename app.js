var dataUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

var h = 660;
var w = 1000;

var monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];

var marginLeft = 80, marginRight = 20, marginTop = 20, marginBottom = 70;

var height = h - marginBottom - marginTop;

var width = w - marginLeft - marginRight;



d3.json(dataUrl, function(error, data){
    if(error){
        console.log(error);
    } else {
        var dataset = data.monthlyVariance;
        var baseTemp = data.baseTemperature;
        
        var temps = dataset.map(function(item){return baseTemp + item.variance;});
        var lowTemp = d3.min(temps);
        var highTemp = d3.max(temps);
        var colorScale = d3.scale.quantile().domain([lowTemp, highTemp]).range(colors);
        
        var toolTip = function(obj){
            return " " + obj.year + " " + monthsArr[obj.month-1] + " " + "Variance: " + obj.variance + "  Temperature: " + (obj.variance + baseTemp);
            };
        
        //console.log(temps);
        
        var svg = d3.select("body").append("svg").attr("width", w).attr("height", h).append("g")
                    .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");;
        
        var yScale = d3.scale.ordinal().domain(monthsArr).rangeRoundBands([0, height]);
        
        var years = dataset.map(function(item){return item.year;});
        
        //eliminate dupplicated years
        years = years.filter(function(item, index){ return years.indexOf(item) === index; });
        
        var minYear = d3.min(years);
        var maxYear = d3.max(years);
        

        
        var minDate = new Date(minYear, 0);
        var maxDate = new Date(maxYear, 0);

        var xScale = d3.time.scale().domain([minDate, maxDate]).range([0, width]);
        
        var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(15);
        
        var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);
        
        svg.append("g").attr("class", "axis").call(yAxis);//yaxis
        svg.append("g").attr("class", "axis").attr("transform", "translate(0," + height+ ")").call(xAxis);//xaxis
        
        var gridWidth = width / years.length;
        var gridHeight = height / monthsArr.length;
        
        var bars = svg.selectAll("rect").data(dataset).enter().append("rect")
                      .attr("x", function(d, i){ return  gridWidth * Math.floor(i / monthsArr.length);})
                      .attr("y", function(d, i){ return gridHeight * (i % monthsArr.length);})
                      .attr("width", gridWidth)
                      .attr("height", gridHeight)
                      .attr("fill", function(d){
                          return colorScale(baseTemp + d.variance);
                      }).append("title").text(function(d){return toolTip(d);})
                      .on("mouseover", function(){});
        
        //x-label        
        svg.append("g")
            .attr("transform", "translate(-50," + height/2 + ")")
            .append("text").attr("text-anchor", "middle")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .text("Months");
        
        //y-label
        svg.append("g")
            .attr("transform", "translate(" + width/2 + ", " + (height + marginBottom/2) + ")")
            .append("text")
            .attr("text-anchor", "middle")
            .attr("class", "label")
            .text("Years");
        
        //legend
        var legend = svg.selectAll("legend")
            .data([0].concat(colorScale.quantiles()), function(d){return d;})
            .enter()
            .append("g");
        
        legend.append("rect")
            .attr("x", function(d, i){ return i * 30 + width / 2 + 30;})//20px wide per rect
            .attr("y", function(d){ return height + marginBottom/2;}).attr("width", 30).attr("height", 20).style("fill", function(d, i){return colors[i];});
        
        legend.append("text").attr("class", "axis")
            .text(function(d){return d.toPrecision(3);})
            .attr("x", function(d, i){ return i * 30 + width / 2 + 30;})//20px wide per rect
            .attr("y", function(d){ return (height + marginBottom/2 + 35);})
            ;
    }
})