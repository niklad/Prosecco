import GetUserStandardTime from './GetUserStandardTime';


function GetUserMeetingTime(user, date) {
    if (user['absence_dates'] && user['absence_dates'][date]) {
        return 'Meldt fravær';
    }
    if (user['meeting_times'] && user['meeting_times'][date]) {
        return user['meeting_times'][date];
    }
    return GetUserStandardTime(user, date);
}

export default GetUserMeetingTime