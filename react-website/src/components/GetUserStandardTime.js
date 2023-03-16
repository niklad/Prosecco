function GetUserStandardTime(user, date) {
    let standardTimes = user['standard_time'];
    let sortedStandardTimes = Object.keys(standardTimes).sort().reverse();

    if (sortedStandardTimes[0] === date) {
        if (sortedStandardTimes[1]) {
            return user['standard_time'][sortedStandardTimes[1]];
        } else {
            return "09:15";
        }
    }
    return user['standard_time'][sortedStandardTimes[0]];
}

export default GetUserStandardTime