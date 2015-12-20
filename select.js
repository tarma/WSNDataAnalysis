function select(node_id) {
    svg.select(".selected").attr("class", "");
    selected_node_id = node_id;
}

function unselect(node_id) {
    selected_node_id = -1;
}
