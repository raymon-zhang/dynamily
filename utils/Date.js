/**
 *
 * @param {Date} date input date
 * @returns A string with time elapsed
 */
export function timeSince(date) {
    if (typeof date !== "object") {
        return "Just now";
    }

    var seconds = Math.floor((new Date() - date) / 1000);
    var intervalType;

    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = "year";
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = "month";
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = "day";
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "hour";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "minute";
                    } else {
                        interval = seconds;
                        intervalType = "second";
                        if (interval < 30) {
                            return "Just now";
                        }
                    }
                }
            }
        }
    }

    if (interval > 1 || interval === 0) {
        intervalType += "s";
    }

    return interval + " " + intervalType + " ago";
}

export function toMmDdYyyy(date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}
