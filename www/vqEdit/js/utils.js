function arraySum(arr) {
    var sum = 0;
    for (var i in arr) {
        sum += arr[i];
    }
    return sum;
}

function contains(arr, el) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i] == el) {
            return true;
        }
    }
    return false;
}

function parseTime(timeStr) {
    var parts = timeStr.split(":");
    for (var i=0; i<parts.length; i++) {
        parts[i] = parseInt(parts[i]);
        if (!Number.isInteger(parts[i])) {
            return "ERROR";
        }
    }
    if (parts.length == 2) {
        return 60 * parts[0] + parts[1];
    }
    else if (parts.length == 3) {
        return 3600 * parts[0] + 60 * parts[1] + parts[2];
    }
    return "ERROR";
}

// Better than parseInt() in that it detects the first integer in a string even if it starts with something that is not a number.  Still returns NaN if no integers are found.
function betterParseInt(s) {
    var str = s + "";
    while (isNaN(parseInt(str)) && str.length > 0) {
        str = str.substring(1, str.length);
    }
    return parseInt(str);
}

function print(str) {
    if (isDev) {
        console.log(str);
    }
}