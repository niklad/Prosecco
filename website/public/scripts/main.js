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

const dbRefObject = firebase.database().ref('Users')

// Id-variabler til registrering av brukere
var username = document.querySelector("#r_u");
var pin = document.querySelector("#r_p");
var m_ID = document.querySelector("#r_id");

// Id-variabler til registrering av ny tid
var t_username = document.querySelector("#mt_u");
var t_pin = document.querySelector("#mt_p");
var t_time = document.querySelector("#mt_button");

// Id-variabler til registrering av ny standardtid
var st_username = document.querySelector("#st_u");
var st_pin = document.querySelector("#st_p");
var st_time = document.querySelector("#st_button");

// Register ny standard  møtetid
function Register_Standard_Time() {
    var database = firebase.database();
    var usersRef = database.ref('Users');

    // st_username_value = st_username.value;
    st_username_value = localStorage.getItem("username");
    // st_pin_value = st_pin.value;
    st_pin_value = localStorage.getItem("pin");
    st_time_value = st_time.value;

    var date = Get_Date_Str();

    usersRef.once('value', function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            var user = userSnapshot.val();

            if (user['name'] === st_username_value && user['pin'] == st_pin_value) {
                usersRef.child(userSnapshot['key']).child('standard_time').update({ [date]: String(st_time_value) });
                alert("Ny standard møtetid er registrert!")
            }
        });
    });
}

// Register ny møtetid
function Register_Meeting_Time() {
    var database = firebase.database();
    var usersRef = database.ref('Users');

    // t_username_value = t_username.value;
    t_username_value = localStorage.getItem("username");
    // t_pin_value = t_pin.value;
    t_pin_value = localStorage.getItem("pin");
    t_time_value = t_time.value;

    var TomorrowDateString = Get_Date_Tomorrow_Str();

    usersRef.once('value', function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            var user = userSnapshot.val();
            if (user['name'] === t_username_value && user['pin'] == t_pin_value) {
                if (user['absence_dates']) {
                    if (user['absence_dates'][TomorrowDateString]) {
                        usersRef.child(userSnapshot['key'] + '/absence_dates/' + TomorrowDateString).remove()
                    }
                }
                usersRef.child(userSnapshot['key'] + '/meeting_times').update({ [TomorrowDateString]: String(t_time_value) });
                alert("Ny møtetid for i morgen er registrert!")
            }
        });
    });
}

// Registrer fravær i morgen
function Register_absence() {
    var database = firebase.database();
    var usersRef = database.ref('Users');

    // t_username_value = t_username.value;
    t_username_value = localStorage.getItem("username");
    // t_pin_value = t_pin.value;
    t_pin_value = localStorage.getItem("pin");


    var TomorrowDateString = Get_Date_Tomorrow_Str();
    var TodaysDateString = Get_Date_Str();
    var melding;

    if (confirm('Er du sikker på at du vil melde fravær i morgen?')) {

        usersRef.once('value', function (snapshot) {
            snapshot.forEach(function (userSnapshot) {
                var user = userSnapshot.val();
                if (user['name'] === t_username_value && user['pin'] == t_pin_value) {

                    usersRef.child(userSnapshot['key'] + '/absence_dates').update({ [TomorrowDateString]: TodaysDateString });
                    alert("Fravær er registrert!")
                }
            });
        });
    }

    document.getElementById('fravaar_button').style.backgroundColor = '#C52525';
}

// Register ny bruker
function Register_User() {
    var database = firebase.database();
    var usersRef = database.ref('Users');
    var mIDRef = usersRef.child('ID:' + m_ID.value);

    r_username_value = username.value;
    r_pin_value = pin.value;
    m_ID_value = m_ID.value;
    var yesterday_date = Get_Date_Yesterday_Str();

    mIDRef.once('value', function (snapshot) {
        if (snapshot.exists()) {
            alert("Your ID has already been registered!");
        } else {
            alert("Your ID has been registered!");
            var new_user_ref = usersRef.child('ID:' + m_ID_value);
            new_user_ref.set({ 'name': r_username_value, 'pin': r_pin_value, 'prosecco_marks': 0, 'joker_prosecco': 0, 'standard_time': { [yesterday_date]: '09:15' } });
        }
    });
}

// Oppdater tabell
dbRefObject.on('value', function (snapshot) {

    reset_tab();
    tab_info = [];

    snapshot.forEach(function (userSnapshot) {
        var key = userSnapshot['key'];
        var user = userSnapshot.val();

        var date_today = Get_Date_Str();
        var date_tomorrow = Get_Date_Tomorrow_Str();
        var presence_status;
        var todays_meeting_time;
        var tomorrow_meeting_time;

        var todays_standard_time = get_standard_time(user, date_today);
        var tomorrows_standard_time = get_standard_time(user, date_tomorrow);

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
        let tableRow = document.getElementById("status");
        let row = tableRow.insertRow(-1);
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
    var tableRow = document.getElementById("status");

    tableRow.innerHTML = "";

    var header = tableRow.createTHead();

    var row = header.insertRow(-1);
    var name_cell1 = row.insertCell(0);
    var p_mark_cell = row.insertCell(1);
    var meeting_time_cell = row.insertCell(2);
    var tomorrow_meeting_time_cell = row.insertCell(3);
    var status_cell = row.insertCell(4);

    name_cell1.innerHTML = "<th><b>Navn</b></th>";
    p_mark_cell.innerHTML = "<th><b>Antall streker</b></th>";
    meeting_time_cell.innerHTML = "<th><b>Dagens møtetid</b></th>";
    tomorrow_meeting_time_cell.innerHTML = "<th><b>Morgendagens møtetid</b></th>";
    status_cell.innerHTML = "<th><b>Status</b></th>";
}

function Get_Date_Str() {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // months are 0-indexed, so we add 1 to get the correct month
    var day = currentDate.getDate();
    if (String(day).length == 1) {
        day = '0' + day;
    }
    if (String(month).length == 1) {
        month = '0' + month;
    }

    var DateString = year + '-' + month + '-' + day;

    return DateString;
}

function Get_Date_Tomorrow_Str() {
    var currentDate = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() + 1);

    var year = tomorrow.getFullYear();
    var month = tomorrow.getMonth() + 1; // months are 0-indexed, so we add 1 to get the correct month
    var day = tomorrow.getDate();
    if (String(day).length == 1) {
        day = '0' + day;
    }
    if (String(month).length == 1) {
        month = '0' + month;
    }

    var TomorrowDateString = year + '-' + month + '-' + day;

    return TomorrowDateString;
}

function Get_Date_Yesterday_Str() {
    var currentDate = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() - 1);

    var year = tomorrow.getFullYear();
    var month = tomorrow.getMonth() + 1; // months are 0-indexed, so we add 1 to get the correct month
    var day = tomorrow.getDate();
    if (String(day).length == 1) {
        day = '0' + day;
    }
    if (String(month).length == 1) {
        month = '0' + month;
    }

    var TomorrowDateString = year + '-' + month + '-' + day;

    return TomorrowDateString;
}


function get_standard_time(user, date) {
    var standard_times = user['standard_time'];
    var standard_times_dates = Object.keys(standard_times).sort().reverse();
    var standard_time;

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