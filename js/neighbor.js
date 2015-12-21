function process_neighbor(data) {
    for (var i = 0; i < data.length; i++) {
        if (!neighbor_info[data[i].SourceID]) {
            neighbor_info[data[i].SourceID] = [];
        }
    var tempObj = {};
    tempObj.SinkID = data[i].SinkID;
    tempObj.Timestamp = data[i].Timestamp;
    tempObj.NeighborTableSize = data[i].NeighborTableSize;
    tempObj.NeighborTable = data[i].NeighborTable;
    neighbor_info[data[i].SourceID].push(tempObj);
    }
}

function drawNeighbor(nodeID, hour, minute) {
    if (nodeID < 0) {
        alert("Please select a node.");
        return;
    }
    if (!neighbor_info[nodeID]) {
        return;
    }
    
    clear();
    
    var k = 0;
    var timestamp = genTimestamp(hour, minute);
    var date = timestamp.slice(0, 10);
    for (k = 0; k < neighbor_info[nodeID].length; k++) {
        if (neighbor_info[nodeID][k].Timestamp.slice(0, 10) != date || neighbor_info[nodeID][k].Timestamp < timestamp) {
            continue;
        }
        break;
    }
    
    if (k > 0) {
        k--;
    }
    
    for (var i = 0; i < neighbor_info[nodeID][k].NeighborTableSize; i++) {
        if (!location_info[neighbor_info[nodeID][k].NeighborTable[i].ID]) {
            continue;
        }
        svg.append("line")
           .attr("x1", xScale(location_info[nodeID].x))
           .attr("y1", yScale(location_info[nodeID].y))
           .attr("x2", xScale(location_info[nodeID].x))
           .attr("y2", yScale(location_info[nodeID].y))
           .attr("id", "n_" + nodeID + "_" + neighbor_info[nodeID][k].NeighborTable[i].ID)
           .transition()
           .each("end", function () {
            svg.select("#Node" + this.id.slice(this.id.lastIndexOf("_") + 1))
               .classed("neighbor", true);
           })
           .duration(500)
           .attr("x2", xScale(location_info[neighbor_info[nodeID][k].NeighborTable[i].ID].x))
           .attr("y2", yScale(location_info[neighbor_info[nodeID][k].NeighborTable[i].ID].y));
    }
    return neighbor_info[nodeID][k].Timestamp;
}
