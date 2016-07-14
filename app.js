var dataUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

var h = 660, w = 900;

var monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var marginLeft = 50, marginRight = 20, marginTop = 20, marginBottom = 40;

var height = h - marginBottom - marginTop;

var width = h - marginLeft - marginRight;

d3.json(dataUrl, function(error, data){
    if(error){
        console.log(error);
    } else {
        var dataset = data.monthlyVariance;
        var svg = d3.select("body").append("svg").attr("width", w).attr("height", h).append("g")
    .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");;
        
        var yScale = d3.scale.ordinal().domain(d3.range(monthsArr.length)).rangeRoundBands([0, height]);
        
        var years = dataset.map(function(item){return item.year;});
        years = years.filter(function(item, index){ return years.indexOf(item) === index; });
        var minYear = d3.min(years);
        var maxYear = d3.max(years);
        
        var minDate = new Date(minYear, 0);
        var maxDate = new Date(maxYear, 0);
        
        var xScale = d3.time.scale().domain([minDate, maxDate]).range([0, width]);
        
        var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5);
        
        var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);
        
        svg.append("g").attr("class", "axis").call(yAxis);
        svg.append("g").attr("class", "axis").attr("transform", "translate(0," + height+ ")").call(xAxis);
        
    }
})