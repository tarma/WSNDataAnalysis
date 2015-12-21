var path_by_date = {};

function process_path(path) {
    for (var i = 0; i < path.length; i++) {
        if (!path_info[path[i].SourceID]) {
            path_info[path[i].SourceID] = [];
        }
    var tempObj = {};
    tempObj.timestamp = path[i].Timestamp;
    tempObj.sink_id = path[i].SinkID;
    tempObj.path_length = path[i].Pathlength;
    tempObj.path = path[i].PathNodes;
    tempObj.Humidity = path[i].Humidity;
    tempObj.Temperature = path[i].Temperature;
    tempObj.Light = path[i].Light;
    path_info[path[i].SourceID].push(tempObj);
    }
}

function firstPathIndexLarger(nodeID, hour, minute) {
    var i;
    var timestamp = genTimestamp(hour, minute);
    var date = timestamp.slice(0, 10);
    
    for (i = 0; i < path_info[nodeID].length; i++) {
        if (path_info[nodeID][i].timestamp.slice(0, 10) != date || path_info[nodeID][i].timestamp < timestamp) {
            continue;
        }
        break;
    }
    return i;
}

function drawPath(nodeID, hour, minute) {
    if (nodeID < 0) {
        alert("Please select a node.");
        return;
    }
    if (!path_info[nodeID]) {
        alert("Sink node didn't receive any C1 packets from this node.");
        return;
    }

    var i = firstPathIndexLarger(nodeID, hour, minute);
    var count = 0;
    clear();
    
    if (i > 0) {
        i--;
    }
    var k = 0;
    var location_a = location_info[nodeID];
    var location_b;
    
    while (k < path_info[nodeID][i].path_length && !location_info[path_info[nodeID][i].path[k]]) {
        k++;
    }
    while (k < path_info[nodeID][i].path_length) {
        location_b = location_info[path_info[nodeID][i].path[k]];
        svg.append("line")
           .attr("x1", xScale(location_a.x))
           .attr("y1", yScale(location_a.y))
           .attr("x2", xScale(location_a.x))
           .attr("y2", yScale(location_a.y))
           .attr("class", "p_" + nodeID + "_" + i)
           .attr("id", "p_" + nodeID + "_" + path_info[nodeID][i].path[k])
           .transition()
           .duration(500)
           .each("end", function() {
            svg.select("#Node" + this.id.slice(this.id.lastIndexOf("_") + 1))
            .classed("onpath", true)
            .classed("onpath_" + nodeID + "_" + this.className.baseVal.slice(this.className.baseVal.lastIndexOf("_") + 1), true);
           })
           .delay(count * 500)
           .attr("x2", xScale(location_b.x))
           .attr("y2", yScale(location_b.y));
        location_a = location_b;
        k++;
        count++;
        while (k < path_info[nodeID][i].path_length && !location_info[path_info[nodeID][i].path[k]]) {
            k++;
        }
    }
    
    location_b = location_info[path_info[nodeID][i].sink_id];
    svg.append("line")
       .attr("x1", xScale(location_a.x))
       .attr("y1", yScale(location_a.y))
       .attr("x2", xScale(location_a.x))
       .attr("y2", yScale(location_a.y))
       .attr("class", "p_" + nodeID + "_" + i)
       .transition()
       .duration(500)
       .delay(count * 500)
       .attr("x2", xScale(location_b.x))
       .attr("y2", yScale(location_b.y));
       
    return path_info[nodeID][i].timestamp;
}

function getEnvData(nodeID, hour, minute) {
    if (nodeID < 0) {
        alert("Please select a node.");
        return;
    }
    if (!path_info[nodeID]) {
        return;
    }

    var i = firstPathIndexLarger(nodeID, hour, minute);
    clear();
    if (i > 0) {
        i--;
    }
    
    var srcID = nodeID;
    var destID;
    var rate = 1;
    var k = 0;
    
    while (k < path_info[nodeID][i].path_length && !location_info[path_info[nodeID][i].path[k]]) {
        k++;
    }
    while (k < path_info[nodeID][i].path_length) {
        destID = path_info[nodeID][i].path[k];
        rate *= 1 / getETX(srcID, destID, hour, minute);
        srcID = destID;
        k++;
        while (k < path_info[nodeID][i].path_length && !location_info[path_info[nodeID][i].path[k]]) {
            k++;
        }
    }
    destID = path_info[nodeID][i].sink_id;
    rate *= 1 / getETX(srcID, destID, hour, minute);
    
    var tempObj = {};
    tempObj.timestamp = path_info[nodeID][i].timestamp;
    tempObj.temperature = path_info[nodeID][i].Temperature * 0.01 - 40;
    var H_l = -4 + 0.0405 * path_info[nodeID][i].Humidity - 2.8e-6 * path_info[nodeID][i].Humidity * path_info[nodeID][i].Humidity;
    tempObj.humidity = (tempObj.temperature - 25) * (0.01 + 0.00008 * path_info[nodeID][i].Humidity) + H_l;
    tempObj.light = path_info[nodeID][i].Light * 0.085;
    tempObj.loss_rate = 1 - rate;
    return tempObj;
}

function firstIndexLargerPathByDate(hour, minute, day) {
    var i;
    var timestamp = genTimestamp(hour, minute);
    for (i = 0; i < path_by_date[day].length; i++) {
        if (path_by_date[day][i].Timestamp < timestamp) {
            continue;
        }
        break;
    }
    return i;
}

function autoDrawPath(hour, minute) {
    clear();

    var start_time = decTime(hour, minute, 0, 5);
    var start_day = Math.floor(start_time.hour / 24) + 3;
    var end_time = incTime(hour, minute, 0, 5);
    var end_day = Math.floor(end_time.hour / 24 ) + 3;
    if (start_day == end_day) {
        var start = firstIndexLargerPathByDate(start_time.hour, start_time.minute, start_day);
        var end = firstIndexLargerPathByDate(end_time.hour, end_time.minute, end_day);
        drawPathInPeriod(start, end, start_day);
    } else {
        var start = firstIndexLargerPathByDate(start_time.hour, start_time.minute, start_day);
        drawPathInPeriod(start, path_by_date[start_day].length, start_day);
        var end = firstIndexLargerPathByDate(end_time.hour, end_time.minute, end_day);
        drawPathInPeriod(0, end, end_day);
    }
}

function drawPathInPeriod(start, end, day) {
    for (var i = start; i < end; i++) {
        var count = 0;
        var k = 0;
        var location_a = location_info[path_by_date[day][i].SourceID];
        var location_b;
        
        while (k < path_by_date[day][i].Pathlength && !location_info[path_by_date[day][i].PathNodes[k]]) {
            k++;
        }
        while (k < path_by_date[day][i].Pathlength) {
            location_b = location_info[path_by_date[day][i].PathNodes[k]];
            svg.append("line")
               .attr("x1", xScale(location_a.x))
               .attr("y1", yScale(location_a.y))
               .attr("x2", xScale(location_a.x))
               .attr("y2", yScale(location_a.y))
               .attr("class", "p_" + path_by_date[day][i].SourceID + "_" + i)
               .attr("id", "p_" + path_by_date[day][i].SourceID + "_" + path_by_date[day][i].PathNodes[k])
               .transition()
               .duration(500)
               .each("end", function() {
                svg.select("#Node" + this.id.slice(this.id.lastIndexOf("_") + 1))
                   .classed("onpath", true)
                   .classed("onpath_" + path_by_date[day][i].SourceID + "_" + this.className.baseVal.slice(this.className.baseVal.lastIndexOf("_") + 1), true);
               })
               .delay(count * 500)
               .attr("x2", xScale(location_b.x))
               .attr("y2", yScale(location_b.y));
            location_a = location_b;
            k++;
            count++;
            while (k < path_by_date[day][i].Pathlength && !location_info[path_by_date[day][i].PathNodes[k]]) {
                k++;
            }
        }
        location_b = location_info[path_by_date[day][i].SinkID];
        svg.append("line")
           .attr("x1", xScale(location_a.x))
           .attr("y1", yScale(location_a.y))
           .attr("x2", xScale(location_a.x))
           .attr("y2", yScale(location_a.y))
           .attr("class", "p_" + path_by_date[day][i].SourceID + "_" + i)
           .transition()
           .duration(500)
           .delay(count * 500)
           .attr("x2", xScale(location_b.x))
           .attr("y2", yScale(location_b.y));
    }
}
