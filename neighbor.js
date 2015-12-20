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
    
}
