function genTimestamp(hour, minute) {
    var result = "2011:08:0";
    if (hour < 24) {
        result += "3:" + twoDigiFormat(hour) + ":" + twoDigiFormat(minute) + ":00:000:";
    } else if (hour < 48) {
        hour -= 24;
        result += "4:" + twoDigiFormat(hour) + ":" + twoDigiFormat(minute) + ":00:000:";
    } else {
        hour -= 48;
        result += "5:" + twoDigiFormat(hour) + ":" + twoDigiFormat(minute) + ":00:000:";
    }
    return result;
}

function twoDigiFormat(number) {
    if (number < 10) {
        return "0" + number;
    } else {
        return "" + number;
    }
}
