


/**
 * This function registers a new prosecco and should be called upon when joker_prosecco.py returns true
 */
var database = firebase.database();
var joker = database.ref('Users');

joker.on('value', function(snapshot) {
    const container = document.getElementById("joker_name");
    container.innerHTML = "";

    snapshot.forEach(function(userSnapshot) {
    var user = userSnapshot.val();
    nr_proseccos = user['joker_prosecco']


    // Append the p element to the container div
    console.log(nr_proseccos)
    if(nr_proseccos>0){
        const user_name = document.createElement("span");
        user_name.textContent = user['name'];
        container.appendChild(user_name);

        const text = document.createElement("span");
        text.textContent = " : ";
        container.appendChild(text);
        nr_joker_prosecco = user["joker_prosecco"]
        for (let i = 0; i < nr_joker_prosecco; i++) {
            const image = document.createElement("img");
            image.setAttribute("src", "./images/goblin.jpg");
            image.setAttribute("width", "10");
            container.appendChild(image);
            // Code to be executed inside the loop
        };


        const br = document.createElement("br");

        // Append the line break element to the container div
        container.appendChild(br);
        }
    
    });
});
  