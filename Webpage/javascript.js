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

var username = document.querySelector("#inp-username");
var m_ID = document.querySelector("#inp-M-ID");

var users = firebase.database().ref().child('Users');

function Register_User() {
  console.log(username.value);
  var database = firebase.database();
  var usersRef = database.ref('Users');
  var mIDRef = usersRef.child('ID:' + m_ID.value);

  mIDRef.once('value', function(snapshot) {
    if (snapshot.exists()) {
      alert("Your ID has already been registered!");
    } else {
      alert("Your ID has been registered!");
      var new_user_ref = usersRef.child('ID:' + m_ID.value);
      new_user_ref.set({'name':username.value, 'prosecco_marks':0, 'meeting_time_tomorrow':'09:15'});
    }
  });
}
