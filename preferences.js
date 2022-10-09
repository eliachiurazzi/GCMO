if (localStorage.getItem("active_session_user") == undefined) {
    alert("Non puoi accedere a questa pagina!")
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}

function get_genres() {
fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
headers: {
"Content-Type": "application/json",
Authorization: "Bearer " + window.localStorage.getItem(key = "token"),
},
})
    .then((response) => { 
        if (response.ok) {
            response.json()
            .then((genres) => {
                container = document.getElementById("pref"); 
                lista_generi = Object.values(genres)
                for (i = 0; i < lista_generi[0].length; i++) {
                    container.innerHTML = container.innerHTML + '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="inlineCheckbox' + i + '" value="option' + i + '"><label class="form-check-label" for="inlineCheckbox' + i + '">' + lista_generi[0][i] + '</label></div>'
                }
            })
        } else {
            response.json()
            .then((resp) => {
                document.getElementById("buttonCheck").setAttribute("disabled", true);
                document.getElementById("pref").innerHTML = resp.error["message"] + `<br>` + "Please check your credentials"
            })
        }
    })
}
function check_genres(event) {
    utente_attivo = localStorage.getItem("active_session_user");
    counter = 0;
    preferenze = [];
    len = document.getElementById("pref").childNodes.length
    for (i = 0; i < len; i++) {
        id = "inlineCheckbox" + i
        if (document.getElementById(id).checked) {
            preferenze.push(document.getElementById(id).nextSibling.innerHTML)
            counter++;
        }
    }
    if (counter >= 1 && counter <= 5) {
        if (localStorage.getItem("users_preferences") == null || localStorage.getItem("users_preferences") == undefined) {
            preferences = [{"user" :utente_attivo, "fav_genres" : preferenze}];
            localStorage.setItem("users_preferences", JSON.stringify(preferences));
        } else {
            pref = JSON.parse(localStorage.getItem("users_preferences"));
            present = false;
            new_item = {"user" :utente_attivo, "fav_genres" : preferenze};
            for (i = 0; i < pref.length; i++) {
                // se è gia presente lo aggiorno (arrivo dalla pagina my_account.html e sto modificando le preferenze)
                if (pref[i].user == new_item.user) {
                    pref[i] = new_item;
                    present = true;
                }
            }
            // se non è presente invece lo aggiungo 
            if (!present) {
                pref.push(new_item);
            }
            localStorage.setItem("users_preferences", JSON.stringify(pref));
        }
    } else {
        event.preventDefault()
        document.getElementById("alert_genres").style.display = "block"
        document.getElementById("pref").style.border = "3px solid red"
    }
}
