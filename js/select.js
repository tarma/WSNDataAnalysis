function select(node_id) {
    unselect();
    selected_node_id = node_id;
}

function unselect() {
    selected_node_id = -1;
    svg.select(".selected").attr("class", "");
    clear();
}

function clear() {
    svg.selectAll(".onpath").attr("class", "");
    svg.selectAll(".neighbor").attr("class", "");
    svg.selectAll("line").remove();
}