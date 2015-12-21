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

function decTime(hour, minute, dec_hour, dec_minute) {
    var res = {};
    if (hour - dec_hour < 0) {
        res.hour = 0;
        res.minute = 0;
        return res;
    } else {
        res.hour = hour - dec_hour;
    }
    if (minute < dec_minute) {
        if (res.hour < 1) {
            res.hour = 0;
            res.minute = 0;
        } else {
            res.hour--;
            res.minute = minute + 60 - dec_minute;
        }
    } else {
        res.minute = minute - dec_minute;
    }
    return res;
}

function incTime(hour, minute, inc_hour, inc_minute) {
    var res = {};
    if (hour + inc_hour > 71) {
        res.hour = 71;
        res.minute = 59;
        return res;
    } else {
        res.hour = hour + inc_hour;
    }
    if (minute + inc_minute >= 60) {
        if (res.hour >= 71) {
            res.hour = 71;
            res.minute = 59;
        } else {
            res.hour++;
            res.minute = minute + inc_minute - 60;
        }
    } else {
        res.minute = minute + inc_minute;
    }
    return res;
}
