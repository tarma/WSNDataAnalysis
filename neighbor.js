function process_neighbor(data) {
    for (var i = 0; i < data.length; i++) {
        if (!neighbor_info[data[i].SourceID]) {
            neighbor_info[data[i].SourceID] = [];
        }
    var tempObj = {};
    tempObj.SinkID = data[i].SinkID;
    tempObj.NeighborTableSize = data[i].NeighborTableSize;
    tempObj.NeighborTable = data[i].NeighborTable;
    neighbor_info[data[i].SourceID].push(tempObj);
    }
}

function drawNeighbor(nodeID) {
    if (!neighbor_info[nodeID]) {
        return;
    }
    for (var i = 0; i < neighbor_info[nodeID][0].NeighborTableSize; i++) {
        if (!location_info[neighbor_info[nodeID][0].NeighborTable[i].ID]) {
            continue;
        }
        svg.append("line")
           .attr("x1", xScale(location_info[nodeID].x))
           .attr("y1", yScale(location_info[nodeID].y))
           .attr("x2", xScale(location_info[nodeID].x))
           .attr("y2", yScale(location_info[nodeID].y))
           .attr("id", "n_" + nodeID + "_" + neighbor_info[nodeID][0].NeighborTable[i].ID)
           .transition()
           .each("end", function () {
            svg.select("#Node" + this.id.slice(this.id.lastIndexOf("_") + 1))
               .classed("neighbor", true);
           })
           .duration(500)
           .attr("x2", xScale(location_info[neighbor_info[nodeID][0].NeighborTable[i].ID].x))
           .attr("y2", yScale(location_info[neighbor_info[nodeID][0].NeighborTable[i].ID].y));
    }
}
