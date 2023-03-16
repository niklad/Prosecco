const firebaseConfig = {
    apiKey: "AIzaSyC1VHPwn62vcyx_THa8COonJfY1lWEi-l0",
    authDomain: "nettsidev1-76f5e.firebaseapp.com",
    databaseURL: "https://nettsidev1-76f5e.firebaseio.com",
    projectId: "nettsidev1-76f5e",
    storageBucket: "nettsidev1-76f5e.appspot.com",
    messagingSenderId: "700326365934",
    appId: "1:700326365934:web:5c80d4382e10c4869081ff",
    measurementId: "G-E6NXQ9K343"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Id-variabler til registrering av brukere
let username = document.querySelector("#r_u");
let pin = document.querySelector("#r_p");
let m_ID = document.querySelector("#r_id");
// Id-variabler til registrering av ny tid
let t_time = document.querySelector("#mt_button");
// Id-variabler til registrering av ny standardtid
let st_time = document.querySelector("#st_button");


function register_standard_time() {
    let database = firebase.database();
    let users_ref = database.ref('Users');

    st_username_value = localStorage.getItem("username");
    st_pin_value = localStorage.getItem("pin");
    st_time_value = st_time.value;

    let date = get_date_string();

    users_ref.once('value', function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            let user = userSnapshot.val();

            if (user['name'] === st_username_value && user['pin'] == st_pin_value) {
                users_ref.child(userSnapshot['key']).child('standard_time').update({ [date]: String(st_time_value) });
                alert("Ny standard møtetid er registrert!")
            }
        });
    });
}


function register_meeting_time() {
    let database = firebase.database();
    let usersRef = database.ref('Users');
    let t_username_value = localStorage.getItem("username");
    let t_pin_value = localStorage.getItem("pin");
    let t_time_value = t_time.value;
    let tomorrow_date_string = get_date_tomorrow_string();

    usersRef.once('value', function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            let user = userSnapshot.val();
            if (user['name'] === t_username_value && user['pin'] == t_pin_value) {
                if (user['absence_dates']) {
                    if (user['absence_dates'][tomorrow_date_string]) {
                        usersRef.child(userSnapshot['key'] + '/absence_dates/' + tomorrow_date_string).remove()
                    }
                }
                usersRef.child(userSnapshot['key'] + '/meeting_times').update({ [tomorrow_date_string]: String(t_time_value) });
                alert("Ny møtetid for i morgen er registrert!")
            }
        });
    });
}


function register_absence() {
    let database = firebase.database();
    let usersRef = database.ref('Users');
    let t_username_value = localStorage.getItem("username");
    let t_pin_value = localStorage.getItem("pin");
    let tomorrow_date_string = get_date_tomorrow_string();
    let todays_date_string = get_date_string();

    if (confirm('Er du sikker på at du vil melde fravær i morgen?')) {
        usersRef.once('value', function (snapshot) {
            snapshot.forEach(function (userSnapshot) {
                let user = userSnapshot.val();
                if (user['name'] === t_username_value && user['pin'] == t_pin_value) {

                    usersRef.child(userSnapshot['key'] + '/absence_dates').update({ [tomorrow_date_string]: todays_date_string });
                    alert("Fravær er registrert!")
                }
            });
        });
    }
    document.getElementById('fravaar_button').style.backgroundColor = '#C52525';
}


function register_user() {
    let database = firebase.database();
    let usersRef = database.ref('Users');
    let mIDRef = usersRef.child('ID:' + m_ID.value);

    let r_username_value = username.value;
    let r_pin_value = pin.value;
    let m_ID_value = m_ID.value;
    let yesterday_date = get_date_yesterday_string();

    mIDRef.once('value', function (snapshot) {
        if (snapshot.exists()) {
            alert("Your ID has already been registered!");
        } else {
            alert("Your ID has been registered!");
            let new_user_ref = usersRef.child('ID:' + m_ID_value);
            new_user_ref.set({ 'name': r_username_value, 'pin': r_pin_value, 'prosecco_marks': 0, 'joker_prosecco': 0, 'standard_time': { [yesterday_date]: '09:15' } });
        }
    });
}


// Oppdater tabell
const db_ref_object = firebase.database().ref('Users')
db_ref_object.on('value', function (snapshot) {
    reset_tab();
    tab_info = [];
    snapshot.forEach(function (userSnapshot) {
        let user = userSnapshot.val();

        let date_today = get_date_string();
        let date_tomorrow = get_date_tomorrow_string();
        let presence_status;
        let todays_meeting_time;
        let tomorrow_meeting_time;

        let todays_standard_time = get_standard_time(user, date_today);
        let tomorrows_standard_time = get_standard_time(user, date_tomorrow);

        if (user['meeting_times']) {
            if (user['meeting_times'][date_today]) {
                todays_meeting_time = user['meeting_times'][date_today];
            } else {
                todays_meeting_time = todays_standard_time;
            }
            if (user['meeting_times'][date_tomorrow]) {
                tomorrow_meeting_time = user['meeting_times'][date_tomorrow];
            } else {
                tomorrow_meeting_time = tomorrows_standard_time;
            }
        } else {
            todays_meeting_time = todays_standard_time;
            tomorrow_meeting_time = tomorrows_standard_time;
        }

        if (user['absence_dates']) {
            if (user['absence_dates'][date_today]) {
                todays_meeting_time = 'Meldt fravær'
            }
            if (user['absence_dates'][date_tomorrow]) {
                tomorrow_meeting_time = 'Meldt fravær';
            }
        }

        // Set presence status
        presence_status_before_time = ''; // Workaround to get into if statement later
        if (user['absence_dates'] && user['absence_dates'][date_today]) {
            // Leave status field empty
            presence_status = '';
        }
        else if (user['departure_times'] && user['departure_times'][date_today]) {
            presence_status = 'Har dratt hjem';
        }
        else if (user['arrival_times'] && user['arrival_times'][date_today]) {
            presence_status_before_time = 'Kom på sal kl. '
            presence_status = presence_status_before_time + user['arrival_times'][date_today];
        }
        else {
            presence_status = 'Har ikke kommet på sal';
        }
        // Update status to include "kom for sent" if user was late
        if (presence_status_before_time == 'Kom på sal kl. ' || presence_status == 'Har dratt hjem') {
            if (user['arrival_times'][date_today] > (todays_meeting_time + ':59')) {
                presence_status = '<span style="color: #FF0000; font-weight: bold;">' + presence_status + '</span>';
            }
        }

        data = {
            'name': user['name'],
            'prosecco_marks': user['prosecco_marks'],
            'joker_prosecco': user['joker_prosecco'],
            'meeting_time': todays_meeting_time,
            'tomorrow_meeting_time': tomorrow_meeting_time,
            'status': presence_status
        };

        tab_info.push(data);
    });

    tab_info.sort(function (a, b) {
        return a.prosecco_marks - b.prosecco_marks
    })
    tab_info.reverse();

    for (let i = 0; i < tab_info.length; i++) {
        let table_row = document.getElementById("status");
        let row = table_row.insertRow(-1);
        let name_cell = row.insertCell(0);
        let prosecco_mark_cell = row.insertCell(1);
        let meeting_time_cell = row.insertCell(2);
        let tomorrow_meeting_time_cell = row.insertCell(3);
        let status_cell = row.insertCell(4);

        name_cell.innerHTML = tab_info[i]['name'];
        meeting_time_cell.innerHTML = tab_info[i]['meeting_time'];
        tomorrow_meeting_time_cell.innerHTML = tab_info[i]['tomorrow_meeting_time'];
        status_cell.innerHTML = tab_info[i]['status'];
        prosecco_mark_cell.innerHTML += tab_info[i]['prosecco_marks'];
        prosecco_mark_cell.innerHTML += ' ';

        let number_of_jokerproseccos = tab_info[i]['joker_prosecco'];
        for (let j = 0; j < number_of_jokerproseccos; j++) {
            let goblin_image = document.createElement("img");
            goblin_image.setAttribute("src", "./images/transparent-goblin.png");
            goblin_image.setAttribute("width", "12");
            prosecco_mark_cell.appendChild(goblin_image);
        }
    }
});


function reset_tab() {
    let table_row = document.getElementById("status");
    table_row.innerHTML = "";
    let header = table_row.createTHead();
    let row = header.insertRow(-1);
    let name_cell = row.insertCell(0);
    let prosecco_mark_cell = row.insertCell(1);
    let meeting_time_cell = row.insertCell(2);
    let tomorrow_meeting_time_cell = row.insertCell(3);
    let status_cell = row.insertCell(4);

    name_cell.innerHTML = "<th><b>Navn</b></th>";
    prosecco_mark_cell.innerHTML = "<th><b>Antall streker</b></th>";
    meeting_time_cell.innerHTML = "<th><b>Dagens møtetid</b></th>";
    tomorrow_meeting_time_cell.innerHTML = "<th><b>Morgendagens møtetid</b></th>";
    status_cell.innerHTML = "<th><b>Status</b></th>";
}


function get_date_string() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // months are 0-indexed, so we add 1 to get the correct month
    let day = currentDate.getDate();
    if (String(day).length == 1) {
        day = '0' + day;
    }
    if (String(month).length == 1) {
        month = '0' + month;
    }
    let date_string = year + '-' + month + '-' + day;
    return date_string;
}


function get_date_tomorrow_string() {
    let currentDate = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() + 1);

    let year = tomorrow.getFullYear();
    let month = tomorrow.getMonth() + 1; // months are 0-indexed, so we add 1 to get the correct month
    let day = tomorrow.getDate();
    if (String(day).length == 1) {
        day = '0' + day;
    }
    if (String(month).length == 1) {
        month = '0' + month;
    }

    let TomorrowDateString = year + '-' + month + '-' + day;

    return TomorrowDateString;
}


function get_date_yesterday_string() {
    let currentDate = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() - 1);

    let year = tomorrow.getFullYear();
    let month = tomorrow.getMonth() + 1; // months are 0-indexed, so we add 1 to get the correct month
    let day = tomorrow.getDate();
    if (String(day).length == 1) {
        day = '0' + day;
    }
    if (String(month).length == 1) {
        month = '0' + month;
    }

    let TomorrowDateString = year + '-' + month + '-' + day;

    return TomorrowDateString;
}


function get_standard_time(user, date) {
    let standard_times = user['standard_time'];
    let standard_times_dates = Object.keys(standard_times).sort().reverse();
    let standard_time;

    if (standard_times_dates[0] == date) {
        if (standard_times_dates[1]) {
            standard_time = user['standard_time'][standard_times_dates[1]];
        } else {
            standard_time = "09:15";
        }
    } else {
        standard_time = user['standard_time'][standard_times_dates[0]];
    }

    return standard_time;
}