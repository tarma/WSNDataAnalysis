function genTimestamp(hour, minute) {
    var result = "2011:08:0";
    if (hour < 24) {
        result += "3:" + two_digi_format(hour) + ":" + two_digi_format(minute) + ":00:000:";
    } else if (hour < 48) {
        hour -= 24;
        result += "4:" + two_digi_format(hour) + ":" + two_digi_format(minute) + ":00:000:";
    } else {
        hour -= 48;
        result += "5:" + two_digi_format(hour) + ":" + two_digi_format(minute) + ":00:000:";
    }
    return result;
}

function two_digi_format(number) {
    if (number < 10) {
        return "0" + number;
    } else {
        return "" + number;
    }
}
