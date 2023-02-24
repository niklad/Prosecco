window.addEventListener('load', function() {
    var log_button = document.getElementById("log_in_out");
    var log_button_pad = document.getElementById("log_in_out_pad");
    var currentHTML = document.location.pathname.split("/").pop();

    if (localStorage.getItem("username")) {
        log_button.innerHTML = "Logg ut"
        log_button_pad.innerHTML = "Logg ut"
        // var currentHTML = document.location.pathname.split("/").pop();
        // if (currentHTML == 'index.html' || currentHTML == 'memes.html' || currentHTML == 'regler.html' || currentHTML == 'registrer.html') {
        var classified_mt = document.getElementById("classified_mt");
        var classified_st = document.getElementById("classified_st");
        var classified_mt2 = document.getElementById("classified_mt2");
        var classified_st2 = document.getElementById("classified_st2");

        classified_mt.style.display = 'block';
        classified_st.style.display = 'block';
        classified_mt2.style.display = 'block';
        classified_st2.style.display = 'block';
        // }

        if (currentHTML != 'registrer.html') {
            var reg = document.getElementById("reg");
            var reg2 = document.getElementById("reg2");
            reg.style.display = 'none';
            reg2.style.display = 'none';
        }
        
    }
    log_button.disabled = false;
    log_button_pad.disabled = false;
    log_button.style.display = 'block';

    if (currentHTML == 'meeting_time_tomorrow.html') {
        var mt_button = document.getElementById("mt_button");
        mt_button.value = "09:15";
    } else if (currentHTML == 'standard_meeting_time.html') {
        var st_button = document.getElementById("st_button");
        st_button.value = "09:15";
    }

  });