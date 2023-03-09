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

const dbRefObject = firebase.database().ref('/Users/')

// Id-variabler til registrering av brukere
let username = document.querySelector("#r_u");
let pin = document.querySelector("#r_p");
let m_ID = document.querySelector("#r_id");

// Id-variabler til registrering av ny tid
let t_username = document.querySelector("#mt_u");
let t_pin = document.querySelector("#mt_p");
let t_time = document.querySelector("#mt_button");

// Id-variabler til registrering av ny standardtid
let st_username = document.querySelector("#st_u");
let st_pin = document.querySelector("#st_p");
let st_time = document.querySelector("#st_button");


// Register ny standard  møtetid
function Register_Standard_Time() {
    const database = firebase.database();
    const usersRef = database.ref('Users');

    const st_username_value = localStorage.getItem("username");
    const st_pin_value = localStorage.getItem("pin");
    const st_time_value = st_time.value;
    const date = Get_Date_Str();

    usersRef.once('value', function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            const user = userSnapshot.val();
            if (user.name === st_username_value && user.pin === st_pin_value) {
                usersRef.child(userSnapshot.key).child('standard_time').update({ [date]: String(st_time_value) });
                alert("Ny standard møtetid er registrert!");
                return; // exit forEach loop if a match is found
            }
        });
    });
}


// Register ny møtetid
function Register_Meeting_Time() {
    const database = firebase.database();
    const usersRef = database.ref('Users');

    const t_username_value = localStorage.getItem("username");
    const t_pin_value = localStorage.getItem("pin");
    const t_time_value = t_time.value;
    const tomorrowDateString = Get_Date_Tomorrow_Str();

    usersRef.once('value', function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            const user = userSnapshot.val();
            if (user.name === t_username_value && user.pin === t_pin_value) {
                if (user.absence_dates && user.absence_dates[tomorrowDateString]) {
                    usersRef.child(`${userSnapshot.key}/absence_dates/${tomorrowDateString}`).remove();
                }
                usersRef.child(`${userSnapshot.key}/meeting_times`).update({ [tomorrowDateString]: String(t_time_value) });
                alert("Ny møtetid for i morgen er registrert!");
                return; // exit forEach loop if a match is found
            }
        });
    });
}


// Registrer fravær i morgen
function Register_absence() {
    let database = firebase.database();
    let usersRef = database.ref('Users');

    // t_username_value = t_username.value;
    let t_username_value = localStorage.getItem("username");
    // t_pin_value = t_pin.value;
    let t_pin_value = localStorage.getItem("pin");


    let TomorrowDateString = Get_Date_Tomorrow_Str();
    let TodaysDateString = Get_Date_Str();

    if (confirm('Er du sikker på at du vil melde fravær i morgen?')) {

        usersRef.once('value', function (snapshot) {
            snapshot.forEach(function (userSnapshot) {
                let user = userSnapshot.val();
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
    let database = firebase.database();
    let usersRef = database.ref('Users');
    let mIDRef = usersRef.child('ID:' + m_ID.value);

    let r_username_value = username.value;
    let r_pin_value = pin.value;
    let m_ID_value = m_ID.value;
    let yesterday_date = Get_Date_Yesterday_Str();

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
dbRefObject.on('value', function (snapshot) {

    reset_tab();
    tab_info = [];

    snapshot.forEach(function (userSnapshot) {
        let key = userSnapshot['key'];
        let user = userSnapshot.val();

        let date_today = Get_Date_Str();
        let date_tomorrow = Get_Date_Tomorrow_Str();
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
            if (user['arrival_times'][date_today] > todays_meeting_time) {
                presence_status = presence_status + ', kom for sent!';
            }
        }

        data = {
            'name': user['name'],
            'prosecco_marks': user['prosecco_marks'],
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
        let name_cell1 = row.insertCell(0);
        let p_mark_cell = row.insertCell(1);
        let meeting_time_cell = row.insertCell(2);
        let tomorrow_meeting_time_cell = row.insertCell(3);
        let status_cell = row.insertCell(4);

        name_cell1.innerHTML = tab_info[i]['name'];
        p_mark_cell.innerHTML = tab_info[i]['prosecco_marks'];
        meeting_time_cell.innerHTML = tab_info[i]['meeting_time'];
        tomorrow_meeting_time_cell.innerHTML = tab_info[i]['tomorrow_meeting_time'];
        status_cell.innerHTML = tab_info[i]['status'];

    }
});

function reset_tab() {
    const tableRow = document.getElementById("status");
    tableRow.innerHTML = "";

    const header = tableRow.createTHead();
    const row = header.insertRow();

    const cells = [
        { label: "Navn" },
        { label: "Antall streker" },
        { label: "Dagens møtetid" },
        { label: "Morgendagens møtetid" },
        { label: "Status" }
    ];

    cells.forEach((cell) => {
        const th = document.createElement("th");
        th.textContent = cell.label;
        row.appendChild(th);
    });
}


function Get_Date_Str() {
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

    let dateString = year + '-' + month + '-' + day;

    return dateString;
}

function Get_Date_Tomorrow_Str() {
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

function Get_Date_Yesterday_Str() {
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