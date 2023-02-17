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
var username = document.querySelector("#name-3b9a");
var pin = document.querySelector("#email-3b9a");
var m_ID = document.querySelector("#text-14ad");

// Id-variabler til registrering av ny tid
var t_username = document.querySelector("#name-3b9a");
var t_pin = document.querySelector("#email-3b9a");
var t_time = document.querySelector("#text-14ad");

// Id-variabler til registrering av ny standardtid
var st_username = document.querySelector("#name-3b9a");
var st_pin = document.querySelector("#email-3b9a");
var st_time = document.querySelector("#text-14ad");

// Register ny møtetid
function Register_Standard_Time() {
  var database = firebase.database();
  var usersRef = database.ref('Users');

  usersRef.once('value', function(snapshot) {
    snapshot.forEach(function(userSnapshot) {
      console.log(userSnapshot['key']);
      var user = userSnapshot.val();
      if (user['name'] === st_username.value && user['pin'] == st_pin.value) {

        usersRef.child(userSnapshot['key']).update({'standard_time':String(st_time.value)});
        
        console.log('The username and pin is correct.');
      } else {
        console.log('The username or pin is incorrect!');
      }
    });
  });
}

// Register ny møtetid
function Register_Meeting_Time() {
  var database = firebase.database();
  var usersRef = database.ref('Users');

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

  usersRef.once('value', function(snapshot) {
    snapshot.forEach(function(userSnapshot) {
      console.log(userSnapshot['key']);
      var user = userSnapshot.val();
      if (user['name'] === t_username.value && user['pin'] == t_pin.value) {

        var dateString = year + '-' + month + '-' + day;
        usersRef.child(userSnapshot['key'] + '/meeting_times').update({[dateString]:String(t_time.value)});

        console.log('The username and pin is correct.');
      } else {
        console.log('The username or pin is incorrect!');
      }
    });
  });
}

// Register ny bruker
function Register_User() {
  var database = firebase.database();
  var usersRef = database.ref('Users');
  var mIDRef = usersRef.child('ID:' + m_ID.value);

  mIDRef.once('value', function(snapshot) {
    if (snapshot.exists()) {
      alert("Your ID has already been registered!");
    } else {
      alert("Your ID has been registered!");
      var new_user_ref = usersRef.child('ID:' + m_ID.value);
      new_user_ref.set({'name':username.value, 'pin':pin.value, 'prosecco_marks':0, 'standard_time':'09:15'});
    }
  });
}
