function log_in_out() {
    var database = firebase.database();
    var usersRef = database.ref('Users');
    var log_button = document.getElementById("log_in_out");
    var log_button2 = document.getElementById("log_in_out_pad");

    var currentHTML = document.location.pathname.split("/").pop();

    // if (currentHTML == 'index.html') {
    //     var classified_mt = document.getElementById("classified_mt");
    //     var classified_st = document.getElementById("classified_st");
    //     var classified_mt2 = document.getElementById("classified_mt2");
    //     var classified_st2 = document.getElementById("classified_st2");
    // }

    var classified_mt = document.getElementById("classified_mt");
    var classified_st = document.getElementById("classified_st");
    var classified_mt2 = document.getElementById("classified_mt2");
    var classified_st2 = document.getElementById("classified_st2");

    if (localStorage.getItem("username")) {
        localStorage.removeItem("username");
        localStorage.removeItem("pin");

        log_button.innerHTML = "Logg inn";
        log_button2.innerHTML = "Logg inn";
        
        // if (currentHTML == 'index.html') {
        //     classified_mt.style.display = 'none';
        //     classified_st.style.display = 'none';
        //     classified_mt2.style.display = 'none';
        //     classified_st2.style.display = 'none';
        // }

        window.location.assign("index.html");

        // alert("Du er logget ut!")
        return;
    } else {
        var username = prompt("Skriv inn navnet ditt.");
        var pin = prompt("Skriv inn din pinkode.");

        usersRef.once('value', function(snapshot) {
            snapshot.forEach(function(userSnapshot) {
                var user = userSnapshot.val();
                if (user['name'] === username && user['pin'] === pin) {

                    console.log("Riktig")
                    localStorage.setItem("username", username);
                    localStorage.setItem("pin", pin);

                    log_button.innerHTML = "Logg ut"
                    log_button2.innerHTML = "Logg ut"
                    classified_mt.style.display = 'block';
                    classified_st.style.display = 'block';
                    classified_mt2.style.display = 'block';
                    classified_st2.style.display = 'block';

                    var reg = document.getElementById("reg");
                    var reg2 = document.getElementById("reg2");
                    reg.style.display = 'none';
                    reg2.style.display = 'none';
                    
                    window.location.assign("index.html");
                    return; // exit the function after successful login check
                }
            });
        }); 
    }
    if (!localStorage.getItem("username")) {
        alert("Feil brukernavn eller passord!")
    }
}
