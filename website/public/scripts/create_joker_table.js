


/**
 * This function registers a new prosecco and should be called upon when joker_prosecco.py returns true
 */
var database = firebase.database();
var joker = database.ref('Users');

joker.on('value', function(snapshot) {
    const container = document.getElementById("joker_name");
    container.style.display = "block";
    container.innerHTML = "";
    const title = document.createElement("div");
    title.innerHTML = "<h5><b>Joker Prosecco</b></h5>";
    
    container.appendChild(title);
    container.style.display = "none";

    snapshot.forEach(function(userSnapshot) {
    var user = userSnapshot.val();

    

    nr_proseccos = user['joker_prosecco']
    joker_tab = []

    // Append the p element to the container div
    console.log(nr_proseccos)
    if(nr_proseccos>0){
        container.style.display = "block";
        const user_name = document.createElement("span");
        nr_joker_prosecco = user["joker_prosecco"]
        user_name.textContent = user['name'] + " : "; 
        container.appendChild(user_name);
        
        for (let i = 0; i < nr_joker_prosecco; i++) {
            const image = document.createElement("img");
            image.setAttribute("src", "./images/goblin.jpg");
            image.setAttribute("width", "12");
            container.appendChild(image);
            // Code to be executed inside the loop
        };


        const br = document.createElement("br");
        const ar = document.createElement("br");
        const t = document.createElement("span");
        t.textContent = "   ";
        // Append the line break element to the container div
        container.appendChild(br);
        container.appendChild(t);
        container.appendChild(ar);
        }
    
    });
});
  