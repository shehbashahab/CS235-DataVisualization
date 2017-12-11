// Play championship music
var audio = new Audio('res/audio/champions.mp3');
audio.loop = true;
audio.play();

var svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

tooltip.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

d3.csv("res/data/data.csv", function (d) {
    d.Games_Played = +d.Games_Played;
    d.Points = +d.Points;
    d.Field_Goals_Made = +d.Field_Goals_Made;
    d.Field_Goal_Percentage = +d.Field_Goal_Percentage;
    d.Three_Point_Percentage = +d.Three_Point_Percentage;
    d.Free_Throw_Percentage = +d.Free_Throw_Percentage;
    d.Offensive_Rebounds = +d.Offensive_Rebounds;
    d.Defensive_Rebounds = +d.Defensive_Rebounds;
    d.Rebounds = +d.Rebounds;
    d.Assists = +d.Assists;
    d.Steals = +d.Steals;
    d.Turn_Overs = +d.Turn_Overs;
    d.Fouls = +d.Fouls;
    return d;

}, function (error, data) {
    if (error) throw error;

    // Get column headers for filter dropdown
    var filter = getFilterDropdownData(data);

    // Chart is re-drawn when filter is changed 
    var select = d3.select('body')
        .append('select')
        .attr('class', 'select')
        .on('change', onchange)

    var options = select
        .selectAll('option')
        .data(filter).enter()
        .append('option')
        .text(function (d) { return d; });

    function onchange() {
        selectedFilter = d3.select('select').property('value')
        draw(data, selectedFilter)
    };

    // Init rendering
    draw(data, filter[0]);

    function draw(data, selectedFilter) {
        g.selectAll("*").remove(); // remove old data

        x.domain(data.map(function (d) { return d.Player; }));
        y.domain([0, d3.max(data, function (d) { return getPlayerData(d, selectedFilter); })]);
        y.nice();

        g.append("g") // draw x-axis
            .classed('x axis', true)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        g.append("g") // draw y-axis
            .classed('y axis', true)
            .call(d3.axisLeft(y))
            .append("text") // draw y-axis label
            .attr("transform", "rotate(-90)")
            .style('text-anchor', 'end')
            .style('fill', 'black')
            .attr("y", 6)
            .attr("dy", ".71em")
            .style('font-size', 10)
            .text(selectedFilter);

        // Draw chart
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.Player);
            })
            .attr("y", function (d) { return y(getPlayerData(d, selectedFilter)); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(getPlayerData(d, selectedFilter)); })

            .on("mouseover", function () { tooltip.style("display", null); })
            .on("mouseout", function () {
                tooltip.selectAll("image").remove()
                tooltip.style("display", "none");
            })
            .on("mousemove", function (d) {
                var xPosition = d3.mouse(this)[0];
                var yPosition = d3.mouse(this)[1];
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(getPlayerData(d, selectedFilter));
                tooltip.append("image")
                    .attr('x', 30)
                    .attr('y', 30)
                    .attr('width', 70)
                    .attr('height', 70)
                    .attr("xlink:href", "res/images/" + d.Image);
            });
    }

    function getFilterDropdownData(data) {
        var filter = d3.keys(data[0]);
        filter.splice(filter.indexOf('Player'), 1);
        filter.splice(filter.indexOf('Image'), 1);
        return filter.toString().replace(/[_-]/g, " ").split(",");
    }

    function getPlayerData(d, s) {
        if (s == "Games Played") {
            return d.Games_Played;
        }
        else if (s == "Points") {
            return d.Points;
        }
        else if (s == "Field Goals Made") {
            return d.Field_Goals_Made;
        }
        else if (s == "Field Goal Percentage") {
            return d.Field_Goal_Percentage;
        }
        else if (s == "Three Point Percentage") {
            return d.Three_Point_Percentage;
        }
        else if (s == "Free Throw Percentage") {
            return d.Free_Throw_Percentage;
        }
        else if (s == "Offensive Rebounds") {
            return d.Offensive_Rebounds;
        }
        else if (s == "Defensive Rebounds") {
            return d.Defensive_Rebounds;
        }
        else if (s == "Rebounds") {
            return d.Rebounds;
        }
        else if (s == "Assists") {
            return d.Assists;
        }
        else if (s == "Steals") {
            return d.Steals;
        }
        else if (s == "Turn Overs") {
            return d.Turn_Overs;
        }
        else if (s == "Fouls") {
            return d.Fouls;
        }
        else {
            Log.console("Unknown s: " + s);
        }

    }
});