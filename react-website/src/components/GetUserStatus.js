import GetUserMeetingTime from "./GetUserMeetingTime"

// Take a user ID and today's date as parameters
function GetUserStatus(user, dateToday) {
    // Set presence status
    let presenceStatusBeforeTime = ''; // Workaround to get into if statement later
    let presenceStatus;

    if (user['absence_dates'] && user['absence_dates'][dateToday]) {
        // Leave status field empty
        presenceStatus = '';
    }
    else if (user['departure_times'] && user['departure_times'][dateToday]) {
        presenceStatus = 'Har dratt hjem';
    }
    else if (user['arrival_times'] && user['arrival_times'][dateToday]) {
        presenceStatusBeforeTime = 'Kom på sal kl. '
        presenceStatus = presenceStatusBeforeTime + user['arrival_times'][dateToday];
    }
    else {
        presenceStatus = 'Har ikke kommet på sal';
    }
    // Update status to include "kom for sent" if user was late
    if (presenceStatusBeforeTime === 'Kom på sal kl. ' || presenceStatus === 'Har dratt hjem') {
        if (user['arrival_times'][dateToday] > (GetUserMeetingTime(user, dateToday) + ':59')) {
            // Color the status red

        }
    }
    return presenceStatus;
}


export default GetUserStatus;
