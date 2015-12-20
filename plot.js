function plot(location_data) {
    for (var i = 0; i < location_data.length; i++) {
        location_info[location_data[i]["node id"]] = {};
        location_info[location_data[i]["node id"]].x = location_data[i].x;
        location_info[location_data[i]["node id"]].y = location_data[i].y;
    }

    xScale = d3.scale.linear()
								       .domain([d3.min(location_data, function(d) { return d.x; }), d3.max(location_data, function(d) { return d.x; })])
								       .range([padding, w - padding]);

    yScale = d3.scale.linear()
								       .domain([d3.min(location_data, function(d) { return d.y; }), d3.max(location_data, function(d) { return d.y; })])
								       .range([h - padding, padding]);

    svg.selectAll("circle")
       .data(location_data)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
        return xScale(d.x);
       })
       .attr("cy", function(d) {
        return yScale(d.y);
        })
       .attr("r", 3)
       .attr("id", function(d) {
        return "Node" + d["node id"];
       })
       .on("click", function(d) {
        if (this.className.baseVal == "selected") {
            unselect(d["node id"]);
            this.className.baseVal = "";
        } else {
            select(d["node id"]);
            this.className.baseVal = "selected";
        }
       });
       
    d3.json("C1-60001-2011-08-03.json", function(error, json) {
        if (!error) {
            process_path(json.C1);
        } else {
            alert("Parse C1-60001-2011-08-03.json error or connection error");
        }
    });
    
    d3.json("C2-60001-2011-08-03.json", function(error, json) {
        if (!error) {
            process_neighbor(json["C2-60001-2011-08-03"]);
        } else {
        }
    });
}
