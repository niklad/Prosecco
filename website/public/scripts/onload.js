window.addEventListener('load', function() {
    let log_button = document.getElementById("log_in_out");
    let log_button_pad = document.getElementById("log_in_out_pad");
    let current_HTML = document.location.pathname.split("/").pop();

    if (localStorage.getItem("username")) {
        log_button.innerHTML = "Logg ut"
        log_button_pad.innerHTML = "Logg ut"
        // let currentHTML = document.location.pathname.split("/").pop();
        // if (currentHTML == 'index.html' || currentHTML == 'memes.html' || currentHTML == 'regler.html' || currentHTML == 'registrer.html') {
        let classified_mt = document.getElementById("classified_mt");
        let classified_st = document.getElementById("classified_st");
        let classified_mt2 = document.getElementById("classified_mt2");
        let classified_st2 = document.getElementById("classified_st2");

        classified_mt.style.display = 'block';
        classified_st.style.display = 'block';
        classified_mt2.style.display = 'block';
        classified_st2.style.display = 'block';
        // }

        if (current_HTML != 'registrer.html') {
            let reg = document.getElementById("reg");
            let reg2 = document.getElementById("reg2");
            reg.style.display = 'none';
            reg2.style.display = 'none';
        }

    }
    log_button.disabled = false;
    log_button_pad.disabled = false;
    log_button.style.display = 'block';

    if (current_HTML == 'meeting_time_tomorrow.html') {
        let mt_button = document.getElementById("mt_button");
        mt_button.value = "09:15";
    } else if (current_HTML == 'standard_meeting_time.html') {
        let st_button = document.getElementById("st_button");
        st_button.value = "09:15";
    }

  });