var neighbor_by_date = {};

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

function getETX(srcID, destID, hour, minute) {
    var i = firstNeighborIndexLarger(srcID, hour, minute);
    if (i > 0) {
        i--;
    }
    while (i >= 0) {
        for (var k = 0; k < neighbor_info[srcID][i].NeighborTableSize; k++) {
            if (neighbor_info[srcID][i].NeighborTable[k].ID == destID) {
                return neighbor_info[srcID][i].NeighborTable[k].PathETX;
            }
        }
        i--;
    }
    return 1;
}

function firstNeighborIndexLarger(nodeID, hour, minute) {
    var i;
    var timestamp = genTimestamp(hour, minute);
    var date = timestamp.slice(0, 10);
    
    for (i = 0; i < path_info[nodeID].length; i++) {
        if (neighbor_info[nodeID][i].Timestamp.slice(0, 10) != date || neighbor_info[nodeID][i].Timestamp < timestamp) {
            continue;
        }
        break;
    }
    return i;
}

function drawNeighbor(nodeID, hour, minute) {
    if (nodeID < 0) {
        alert("Please select a node.");
        return;
    }
    if (!neighbor_info[nodeID]) {
        alert("Sink node didn't receive any C2 packets from this node.");
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

function firstIndexLargerNeighborByDate(hour, minute, day) {
    var i;
    var timestamp = genTimestamp(hour, minute);
    for (i = 0; i < neighbor_by_date[day].length; i++) {
        if (neighbor_by_date[day][i].Timestamp < timestamp) {
            continue;
        }
        break;
    }
    return i;
}

function autoDrawNeighbor(hour, minute) {
    clear();
    
    var start_time = decTime(hour, minute, 0, 1);
    var start_day = Math.floor(start_time.hour / 24) + 3;
    var end_time = incTime(hour, minute, 0, 1);
    var end_day = Math.floor(end_time.hour / 24 ) + 3;
    
    if (start_day == end_day) {
        var start = firstIndexLargerPathByDate(start_time.hour, start_time.minute, start_day);
        var end = firstIndexLargerPathByDate(end_time.hour, end_time.minute, end_day);
        drawNeighborInPeriod(start, end, start_day);
    } else {
        var start = firstIndexLargerPathByDate(start_time.hour, start_time.minute, start_day);
        drawNeighborInPeriod(start, path_by_date[start_day].length, start_day);
        var end = firstIndexLargerPathByDate(end_time.hour, end_time.minute, end_day);
        drawNeighborInPeriod(0, end, end_day);
    }
}

function drawNeighborInPeriod(start, end, day) {
    for (var k = start; k < end; k++) {
        var nodeID = neighbor_by_date[day][k].SourceID;
        if (!location_info[nodeID]) {
            continue;
        }
        for (var i = 0; i < neighbor_by_date[day][k].NeighborTableSize; i++) {
            if (!location_info[neighbor_by_date[day][k].NeighborTable[i].ID]) {
                continue;
            }
            svg.insert("line", ":first-child")
               .attr("x1", xScale(location_info[nodeID].x))
               .attr("y1", yScale(location_info[nodeID].y))
               .attr("x2", xScale(location_info[nodeID].x))
               .attr("y2", yScale(location_info[nodeID].y))
               .attr("id", "n_" + nodeID + "_" + neighbor_by_date[day][k].NeighborTable[i].ID)
               .attr("class", "n_" + nodeID + "_" + k)
               .transition()
               .each("end", function () {
                svg.select("#Node" + this.id.slice(this.id.lastIndexOf("_") + 1))
                   .classed("neighbor", true);
               })
               .duration(500)
               .attr("x2", xScale(location_info[neighbor_by_date[day][k].NeighborTable[i].ID].x))
               .attr("y2", yScale(location_info[neighbor_by_date[day][k].NeighborTable[i].ID].y));
        }
    }
}
