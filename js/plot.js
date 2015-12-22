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
       .attr("r", 5)
       .attr("id", function(d) {
        return "Node" + d["node id"];
       })
       .on("click", function(d) {
        if (this.className.baseVal == "selected") {
            unselect();
            this.className.baseVal = "";
        } else {
            select(d["node id"]);
            this.className.baseVal = "selected";
        }
       })
       .on("mouseover", function(d) {
        var rect_width = 300;
        var rect_height = 150;
        var x = xScale(d.x) + 10;
        var y = yScale(d.y) + 10;
        if (x + rect_width > w - padding) {
            x -= rect_width + 10;
        }
        if (y + rect_height > h - padding) {
            y -= rect_height + 10;
        }
        var rect = svg.append("g")
                      .attr("id", "info");
        rect.append("rect")
           .attr("x", x)
           .attr("y", y)
           .attr("width", rect_width)
           .attr("height", rect_height)
           .attr("id", "info")
           .attr("fill", "white")
           .attr("stroke", "black")
           .attr("stroke-width", "3px");
        var hour = parseInt(d3.select("#time1").property("value"));
        var minute = parseInt(d3.select("#time2").property("value"));
        var env_data = getEnvData(d["node id"], hour, minute);
        rect.append("text")
            .attr("x", x + 10)
            .attr("y", y + 20)
            .text("Node ID:" + d["node id"]);
        if (!env_data) {
            rect.append("text")
                .attr("x", x + 10)
                .attr("y", y + 40)
                .text("No Data");
            return;
        }
        rect.append("text")
            .attr("x", x + 10)
            .attr("y", y + 40)
            .text("Timestamp: " + env_data.timestamp);
        rect.append("text")
            .attr("x", x + 10)
            .attr("y", y + 60)
            .text("Humidity: " + env_data.humidity.toFixed(2) + "%");
        rect.append("text")
            .attr("x", x + 10)
            .attr("y", y + 80)
            .text("Temperature: " + env_data.temperature.toFixed(2) + "℃");
        rect.append("text")
            .attr("x", x + 10)
            .attr("y", y + 100)
            .text("Light: " + env_data.light.toFixed(2) + "Klux");
        rect.append("text")
            .attr("x", x + 10)
            .attr("y", y + 120)
            .text("Packet loss rate: " + env_data.loss_rate.toFixed(7));
       })
       .on("mouseout", function(d) {
        svg.select("#info")
           .remove();
       });
       
    d3.json("C1-60001-2011-08-03.json", function(error, json) {
        if (!error) {
            path_by_date[3] = json.C1;
            process_path(json.C1);
            updatetime();
        } else {
            alert("Parse C1-60001-2011-08-03.json error or connection error");
        }
    });
    
    d3.json("C1-60001-2011-08-04.json", function(error, json) {
        if (!error) {
            path_by_date[4] = json.C1;
            process_path(json.C1);
        } else {
            alert("Parse C1-60001-2011-08-04.json error or connection error");
        }
    });
    
    d3.json("C1-60001-2011-08-05.json", function(error, json) {
        if (!error) {
            path_by_date[5] = json.C1;
            process_path(json.C1);
        } else {
            alert("Parse C1-60001-2011-08-05.json error or connection error");
        }
    });
    
    d3.json("C2-60001-2011-08-03.json", function(error, json) {
        if (!error) {
            neighbor_by_date[3] = json["C2-60001-2011-08-03"];
            process_neighbor(json["C2-60001-2011-08-03"]);
        } else {
            alert("Parse C2-60001-2011-08-03.json error or connection error");
        }
    });
    
    d3.json("C2-60001-2011-08-04.json", function(error, json) {
        if (!error) {
            neighbor_by_date[4] = json["C2-60001-2011-08-04"];
            process_neighbor(json["C2-60001-2011-08-04"]);
        } else {
            alert("Parse C2-60001-2011-08-04.json error or connection error");
        }
    });
    
    d3.json("C2-60001-2011-08-05.json", function(error, json) {
        if (!error) {
            neighbor_by_date[5] = json["C2-60001-2011-08-05"];
            process_neighbor(json["C2-60001-2011-08-05"]);
        } else {
            alert("Parse C2-60001-2011-08-05.json error or connection error");
        }
    });
}
