function process_path(path) {
    for (var i = 0; i < path.length; i++) {
        if (!path_info[path[i].SourceID]) {
            path_info[path[i].SourceID] = [];
        }
    var tempObj = {};
    tempObj.sink_id = path[i].SinkID;
    tempObj.path_length = path[i].Pathlength;
    tempObj.path = path[i].PathNodes;
    path_info[path[i].SourceID].push(tempObj);
    }
}

function drawPath(nodeID) {
    if (!path_info[nodeID]) {
        return;
    }

    var count = 0;
    for (var i = 0; i < path_info[nodeID].length; i++) {
        var k = 0;
        var location_a = location_info[nodeID];
        var location_b;
        
        while (k < path_info[nodeID][i].path_length && !location_info[path_info[nodeID][i].path[k]]) {
            k++;
        }
        while (k < path_info[nodeID][i].path_length) {
            location_b = location_info[path_info[nodeID][i].path[k]];
            //svg.insert("line", ":first-child")
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
        //svg.insert("line", ":first-child")
        svg.append("line")
           .attr("x1", xScale(location_a.x))
           .attr("y1", yScale(location_a.y))
           .attr("x2", xScale(location_a.x))
           .attr("y2", yScale(location_a.y))
           .attr("class", "p_" + nodeID + "_" + i)
           .transition()
           .duration(500)
           .delay(count * 500)
           .each("end", function() {
            svg.selectAll(".onpath_" + nodeID + "_" + this.className.baseVal.slice(this.className.baseVal.lastIndexOf("_") + 1))
               .attr("class", "");
            svg.selectAll("." + this.className.baseVal)
               .remove();
           })
           .attr("x2", xScale(location_b.x))
           .attr("y2", yScale(location_b.y));
        count++;
  }
}
