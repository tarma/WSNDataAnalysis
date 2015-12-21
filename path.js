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

function drawPath(nodeID, hour, minute) {
    if (!path_info[nodeID]) {
        return;
    }

    var i;
    var count = 0;
    var timestamp = genTimestamp(hour, minute);
    var date = timestamp.slice(0, 10);
    clear();
    
    for (i = 0; i < path_info[nodeID].length; i++) {
        if (path_info[nodeID][i].timestamp.slice(0, 10) != date || path_info[nodeID][i].timestamp < timestamp) {
            continue;
        }
        break;
    }
    
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
       
    return neighbor_info[nodeID][i].Timestamp;
}
