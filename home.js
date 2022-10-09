document.getElementById("user-wel").innerHTML = localStorage.getItem("active_session_user");

if (localStorage.getItem("active_session_user") == undefined) {
    alert("Non puoi accedere a questa pagina!")
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}

function reccomendations() {
query = ""
utente_attivo = localStorage.getItem("active_session_user")
users_preferences = JSON.parse(localStorage.getItem("users_preferences"))
for (i = 0; i < users_preferences.length; i++) {
    if (users_preferences[i].user == utente_attivo) {
        for (j = 0; j < users_preferences[i].fav_genres.length; j++) {
            query = query + users_preferences[i].fav_genres[j] + ","
        }
    }
}
liked_genres = query.slice(0, query.length - 1)
fetch("https://api.spotify.com/v1/recommendations?seed_genres=" + liked_genres , {
headers: {
"Content-Type": "application/json",
Authorization: "Bearer " + window.localStorage.getItem(key = "token"),
},
})
    .then((response) => { 
    if (response.ok) {
    response.json()
    .then((rec) => {
        var suggerimenti = []
        
        for (i = 0; i < 20; i++) {
            artist_id = rec.tracks[i].artists[0].id
            fetch("https://api.spotify.com/v1/artists/" + artist_id, {
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.localStorage.getItem(key = "token"),
            },
            })
                .then((response) => {
                if (response.ok) {
                response.json()
                .then((artist) => {
                    nome = artist.name
                    img = artist.images[1].url
                    artista = {"name": nome, "id": artist_id, "img": img} 
                    suggerimenti.push(artista)
                    add_user_property("reccomendations", suggerimenti);
                })
            } else {
               response.json()
               .then((risposta) => {
                   window.location = '/home/melias/Scrivania/GCMO/login.html'
                   alert(risposta.error.message)})
            }})
        }
        load_images();
        })
    } else {
        response.json()
        .then((risposta) => {
            window.location = '/home/melias/Scrivania/GCMO/login.html'
            alert(risposta.error.message)})
    }
})
}

function add_user_property(key, value) {
    utenti = JSON.parse(localStorage.getItem("users"))
    utente_attivo = localStorage.getItem("active_session_user")
    for (i = 0; i < utenti.length; i++) {
        if (utenti[i].username == utente_attivo) {
            utenti[i][key] = value;
        }
    }
    localStorage.setItem("users", JSON.stringify(utenti))
}

function logout() {
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}


function enable_update() {
    checkbox = document.getElementById("exampleCheck1");
    button = document.getElementById("aggiorna")

    if (checkbox.checked == true) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

function load_images() {
    utenti = JSON.parse(localStorage.getItem("users"))
    utente_attivo = localStorage.getItem("active_session_user")
    for (i = 0; i < utenti.length; i++) {
        if (utenti[i].username == utente_attivo) {
            for (j = 1; j < 6; j++) {
                document.getElementById(j).src = utenti[i].reccomendations[j-1].img;
                document.getElementById(j * 10).innerHTML = utenti[i].reccomendations[j-1].name;
            }
        }
    }
}

function explore_playlists() {
    indice = 0;
    utenti = JSON.parse(localStorage.getItem("users"))
    utente_attivo = localStorage.getItem("active_session_user")
    for (i = 0; i < utenti.length; i++) {
        if (utenti[i].username == utente_attivo) { 
            indice = i;
        }
    }
    window.location = '/home/melias/Scrivania/GCMO/explore.html?' + indice;
}