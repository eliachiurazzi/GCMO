if (localStorage.getItem("active_session_user") == undefined) {
    alert("Non puoi accedere a questa pagina!")
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}

function create_playlist() {
    titolo = document.getElementById("titolo").value;
    array_tags = (document.getElementById("tags_form").value).split("#");
    tags = []
    for (i = 0; i < array_tags.length; i++) {
        tag = "#" + array_tags[i].trim()
        tags.push(tag)
    }
    tags.shift();
    descr = document.getElementById("floatingTextarea2").value;

    utenti = JSON.parse(localStorage.getItem("users"))
    utente_attivo = localStorage.getItem("active_session_user")
    for (i = 0; i < utenti.length; i++) {
        if (utenti[i].username == utente_attivo) {
            if (utenti[i].private_playlists == undefined) {
                private_playlists = []
                playlist = {
                    "Titolo": titolo,
                    "Tags": tags,
                    "Descrizione": descr,
                    "Counter" : 0
                }
                private_playlists.push(playlist);
                utenti[i]["private_playlists"] = private_playlists;
                localStorage.setItem("users", JSON.stringify(utenti));

            } else {
                private_playlists = utenti[i].private_playlists;
                playlist = {
                    "Titolo": titolo,
                    "Tags": tags,
                    "Descrizione": descr,
                    "Counter" : 0
                }
                private_playlists.push(playlist);
                utenti[i]["private_playlists"] = private_playlists;
                localStorage.setItem("users", JSON.stringify(utenti));
            }
        }
    }

}

function load_playlist() {
    utente_attivo = localStorage.getItem("active_session_user")
    users = JSON.parse(localStorage.getItem("users"))
    indice = 0;
    for (j = 0; j < users.length; j++) {
        if (users[j].username == utente_attivo) {
            indice = j;
        }
    }
    if (JSON.parse(localStorage.getItem("users"))[indice].private_playlists != undefined) {
        playlists = JSON.parse(localStorage.getItem("users"))[indice].private_playlists;
        tabella = document.getElementById("tabella")
        for (i = 0; i < playlists.length; i++) {
            tabella.innerHTML += '<tr id="'+ i +'" onmouseup="normal_font('+ i +')" onmousedown="bolding_font('+ i +')" onclick="get_playlist('+ indice + ',' + i +')" class="normal-row"><th scope="row">'+ i +'</th><td>'+ playlists[i].Titolo + '</td><td>'+ playlists[i].Tags+'</td><td>'+ playlists[i].Counter +'</td></tr>'
        }
    }
}

function check_inputs(event) {
    document.getElementById("error_alert").innerHTML = ""
    titolo = document.getElementById("titolo").value;
    tags = document.getElementById("tags_form").value;
    descr = document.getElementById("floatingTextarea2").value;
    
    checkTitolo(event, titolo)
    checkTags(event, tags)
    checkDescr(event, descr) 
}

function checkTitolo(event, titolo) {
    if (titolo.length < 3 || titolo.length > 15) {
        document.getElementById("error_alert").style.display = "block"
        document.getElementById("error_alert").innerHTML += "Titolo non valido! (da 3 a 15 caratteri) "
        event.preventDefault();
    }
}

function checkDescr(event, descr) {
    if (descr.length < 7 || descr.length > 50) {
        document.getElementById("error_alert").style.display = "block"
        document.getElementById("error_alert").innerHTML += "Descrizione non valida! (da 7 a 50 caratteri) "
        event.preventDefault();
    }
}

function checkTags(event, tags) {
    if (tags.length < 4) {
        document.getElementById("error_alert").style.display = "block"
        document.getElementById("error_alert").innerHTML += "Hastags non validi! "
        event.preventDefault();
    }
}

function bolding_font(i) {
    document.getElementById(i).style = "font-weight: bold"
}
function normal_font(i) {
    document.getElementById(i).style = "font-weight: normal"
}

function get_playlist(indice_utente, indice_playlist) {
    pl_url = "/home/melias/Scrivania/GCMO/playlist_view.html?" + indice_utente + "&" + indice_playlist
    window.location.href = pl_url;
}

function get_pl_info() {
    queryString = location.search.substring(1)
    indici = queryString.split("&");
    indice_utente = indici[0];
    indice_pl = indici[1];
    playlist = JSON.parse(localStorage.getItem("users"))[indice_utente].private_playlists[indice_pl];
    document.getElementById("playlist_title").innerHTML = playlist.Titolo;
    document.getElementById("tags").innerHTML += playlist.Tags;
    document.getElementById("descr").innerHTML += playlist.Descrizione;

    document.getElementById("titolo").value = playlist.Titolo;
    document.getElementById("tags_form").value += playlist.Tags;
    document.getElementById("floatingTextarea2").innerHTML += playlist.Descrizione;
    tabella = document.getElementById("tabella");
    canzoni = JSON.parse(localStorage.getItem("users"))[indice_utente].private_playlists[indice_pl].Brani
    if (canzoni != undefined) {
    for (i = 0; i < canzoni.length; i++) {
        tabella.innerHTML += '<tr id="'+ i +'" class="normal-row"><th scope="row">'+ i +'</th><td><img src="'+ canzoni[i].Copertina + '"></td><td>'+ canzoni[i].Titolo+'</td><td>'+ canzoni[i].Artisti +'</td><td>'+ canzoni[i].Anno +'</td><td>'+ canzoni[i].Durata +'</td><td><button onclick="delete_song('+ i +')" type="button" class="btn btn-danger">&#128465</button></td></tr>'
    }
}
}

function delete_playlist() {
    queryString = location.search.substring(1)
    indici = queryString.split("&");
    indice_utente = indici[0];
    indice_pl = indici[1];
    utenti = JSON.parse(localStorage.getItem("users"));
    playlists = JSON.parse(localStorage.getItem("users"))[indice_utente].private_playlists;
    playlists.splice(indice_pl, 1);
    utenti[indice_utente].private_playlists = playlists

    localStorage.setItem("users", JSON.stringify(utenti));
    pl_url = "/home/melias/Scrivania/GCMO/private_playlists.html"
    window.location.href = pl_url;
}

function edit_playlist() {
    titolo = document.getElementById("titolo").value;
    array_tags = (document.getElementById("tags_form").value).split("#");
    tags = []
    for (i = 0; i < array_tags.length; i++) {
        tag = "#" + array_tags[i].trim()
        tags.push(tag)
    }
    tags.shift();
    descr = document.getElementById("floatingTextarea2").value;
    queryString = location.search.substring(1)
    indici = queryString.split("&");
    indice_utente = indici[0];
    indice_pl = indici[1];
    utenti = JSON.parse(localStorage.getItem("users"));
    playlist = JSON.parse(localStorage.getItem("users"))[indice_utente].private_playlists[indice_pl];
    playlist.Titolo = titolo;
    playlist.Tags = tags;
    playlist.Descrizione = descr;
    utenti[indice_utente].private_playlists[indice_pl] = playlist;
    localStorage.setItem("users", JSON.stringify(utenti));
}

function add_song_pl() {
    queryString = location.search.substring(1)
    indici = queryString.split("&");
    indice_utente = indici[0];
    indice_pl = indici[1];
    pl_url = "/home/melias/Scrivania/GCMO/search_song.html" + "?" + indice_utente + "&" + indice_pl;
    window.location.href = pl_url;
}

function delete_song(index) {
    queryString = location.search.substring(1)
    indici = queryString.split("&");
    indice_utente = indici[0];
    indice_pl = indici[1];
    utenti = JSON.parse(localStorage.getItem("users"));
    playlist = JSON.parse(localStorage.getItem("users"))[indice_utente].private_playlists[indice_pl];
    playlist.Counter = playlist.Counter - 1
    if (index != 0) {
        playlist.Brani.splice(index, 1)
    } else {
        playlist.Brani.shift()
    }
    utenti[indice_utente].private_playlists[indice_pl] = playlist;
    localStorage.setItem("users", JSON.stringify(utenti));
    pl_url = "/home/melias/Scrivania/GCMO/playlist_view.html" + "?" + indice_utente + "&" + indice_pl;
    window.location.href = pl_url
}
function logout() {
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}

function share() {
    queryString = location.search.substring(1)
    indici = queryString.split("&");
    indice_utente = indici[0];
    indice_pl = indici[1];
    autore = JSON.parse(localStorage.getItem("users"))[indice_utente].username;
    playlist = JSON.parse(localStorage.getItem("users"))[indice_utente].private_playlists[indice_pl];
    // Aggiorno le playlist pubbliche universali
    playlist_pubbliche = JSON.parse(localStorage.getItem('playlist_pubbliche'));
    if (playlist_pubbliche == undefined || playlist_pubbliche == null) {
        public_playlist = [{"Autore": autore,"Titolo": playlist.Titolo, "Tags": playlist.Tags, "Brani": playlist.Brani, "Counter": playlist.Counter, "Descrizione": playlist.Descrizione}];
        localStorage.setItem("playlist_pubbliche", JSON.stringify(public_playlist));
    } else {
        new_pub_playlist = {"Autore": autore,"Titolo": playlist.Titolo, "Tags": playlist.Tags, "Brani": playlist.Brani, "Counter": playlist.Counter, "Descrizione": playlist.Descrizione};
        playlist_pubbliche.push(new_pub_playlist);
        localStorage.setItem("playlist_pubbliche", JSON.stringify(playlist_pubbliche));
    }
    private_playlists = JSON.parse(localStorage.getItem("users"))[indice_utente].private_playlists.splice(indice_pl, 1);
    utenti = JSON.parse(localStorage.getItem("users"))
    // istruzione seguente forse è di troppo!!
    utenti[indice_utente].private_playlists.splice(indice_pl, 1);
    localStorage.setItem("users", JSON.stringify(utenti));
    // Aggiorno le playlist pubbliche del relativo autore
    pl_pubbliche_personali = JSON.parse(localStorage.getItem("users"))[indice_utente].public_playlists;
    if (pl_pubbliche_personali == undefined || pl_pubbliche_personali == null) {
        pl_pubbliche_personali = [{"Titolo": playlist.Titolo, "Tags": playlist.Tags, "Brani": playlist.Brani, "Counter": playlist.Counter, "Descrizione": playlist.Descrizione}];
        utenti[indice_utente].public_playlists = pl_pubbliche_personali;
        localStorage.setItem("users", JSON.stringify(utenti));
    } else {
        new_personal_p_playlist = {"Titolo": playlist.Titolo, "Tags": playlist.Tags, "Brani": playlist.Brani, "Counter": playlist.Counter, "Descrizione": playlist.Descrizione};
        pl_pubbliche_personali.push(new_personal_p_playlist);
        utenti[indice_utente].public_playlists = pl_pubbliche_personali;
        localStorage.setItem("users", JSON.stringify(utenti));
    }
    window.location = '/home/melias/Scrivania/GCMO/public_playlists.html'
}