function GetUserMeetingTime(user, dateToday) {
    if (user['absence_dates'] && user['absence_dates'][dateToday]) {
        return 'Meldt fravær';
    }
    if (user['meeting_times'] && user['meeting_times'][dateToday]) {
        return user['meeting_times'][dateToday];
    }
    return user['standard_time'][dateToday];
}

export default GetUserMeetingTime