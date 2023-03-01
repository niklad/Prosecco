import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import "firebase/database";


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DATABASEURL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
};

const app = initializeApp(firebaseConfig);
const dbRefObject = app.database().ref('Users')

// Id-letiabler til registrering av brukere
let username = document.querySelector("#r_u");
let pin = document.querySelector("#r_p");
let m_ID = document.querySelector("#r_id");

// Id-letiabler til registrering av ny tid
let t_username = document.querySelector("#mt_u");
let t_pin = document.querySelector("#mt_p");
let t_time = document.querySelector("#mt_button");

// Id-letiabler til registrering av ny standardtid
let st_username = document.querySelector("#st_u");
let st_pin = document.querySelector("#st_p");
let st_time = document.querySelector("#st_button");


// Oppdater tabell
dbRefObject.on('value', function (snapshot) {

  reset_tab();
  let tab_info = [];

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
    let presence_status_before_time = ''; // Workaround to get into if statement later
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
        if (presence_status_before_time === 'Kom på sal kl. ' || presence_status === 'Har dratt hjem') {
      if (user['arrival_times'][date_today] > todays_meeting_time) {
                presence_status = presence_status + ', kom for sent!';
      }
    }

    let data = {
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
  let tableRow = document.getElementById("status");

  tableRow.innerHTML = "";

  let header = tableRow.createTHead();

  let row = header.insertRow(-1);
  let name_cell1 = row.insertCell(0);
  let p_mark_cell = row.insertCell(1);
  let meeting_time_cell = row.insertCell(2);
  let tomorrow_meeting_time_cell = row.insertCell(3);
  let status_cell = row.insertCell(4);

  name_cell1.innerHTML = "<th><b>Navn</b></th>";
  p_mark_cell.innerHTML = "<th><b>Antall streker</b></th>";
  meeting_time_cell.innerHTML = "<th><b>Dagens møtetid</b></th>";
  tomorrow_meeting_time_cell.innerHTML = "<th><b>Morgendagens møtetid</b></th>";
  status_cell.innerHTML = "<th><b>Status</b></th>";
}

function Get_Date_Str() {
  let currentDate = new Date();

  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1; // months are 0-indexed, so we add 1 to get the correct month
  let day = currentDate.getDate();
  if (String(day).length === 1) {
    day = '0' + day;
  }
  if (String(month).length === 1) {
    month = '0' + month;
  }

  let DateString = year + '-' + month + '-' + day;

  return DateString;
}

function Get_Date_Tomorrow_Str() {
  let currentDate = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(currentDate.getDate() + 1);

  let year = tomorrow.getFullYear();
  let month = tomorrow.getMonth() + 1; // months are 0-indexed, so we add 1 to get the correct month
  let day = tomorrow.getDate();
  if (String(day).length === 1) {
    day = '0' + day;
  }
  if (String(month).length === 1) {
    month = '0' + month;
  }

  let TomorrowDateString = year + '-' + month + '-' + day;

  return TomorrowDateString;
}


function get_standard_time(user, date) {
  let standard_times = user['standard_time'];
  let standard_times_dates = Object.keys(standard_times).sort().reverse();
  let standard_time;

  if (standard_times_dates[0] === date) {
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



function Home() {
    // Generate the table
    return (
        <div className="App">
            <header className="App-header">
                <h1>Prosecco status</h1>
                <p>Her kan du se status på alle som har drukket prosecco</p>
                <button onClick={reset_tab}>Oppdater</button>
                <table id="status">
                </table>
            </header>
        </div>
    );
  }

export default Home;
