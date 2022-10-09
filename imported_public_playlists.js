if (localStorage.getItem("active_session_user") == undefined) {
    alert("Non puoi accedere a questa pagina!")
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}

function get_pl_info() {
    queryString = location.search.substring(1);
    indici = queryString.split("&");
    indice_utente = indici[0];
    indice_pl = indici[1];
    playlist = JSON.parse(localStorage.getItem("playlist_pubbliche"))[indice_pl];
    document.getElementById("playlist_title").innerHTML = playlist.Titolo;
    document.getElementById("tags").innerHTML += playlist.Tags;
    document.getElementById("descr").innerHTML += playlist.Descrizione;

    tabella = document.getElementById("tabella");
    canzoni = JSON.parse(localStorage.getItem("playlist_pubbliche"))[indice_pl].Brani
    if (canzoni != undefined) {
    for (i = 0; i < canzoni.length; i++) {
        tabella.innerHTML += '<tr id="'+ i +'" class="normal-row"><th scope="row">'+ i +'</th><td><img src="'+ canzoni[i].Copertina + '"></td><td>'+ canzoni[i].Titolo+'</td><td>'+ canzoni[i].Artisti +'</td><td>'+ canzoni[i].Anno +'</td><td>'+ canzoni[i].Durata +'</td></tr>'
    }
}
}

function delete_playlist() {
    queryString = location.search.substring(1)
    indici = queryString.split("&");
    indice_utente = indici[0];
    indice_pl = indici[1];
    utenti = JSON.parse(localStorage.getItem("users"));
    playlists = JSON.parse(localStorage.getItem("users"))[indice_utente].imported_playlists;
    if (indice_pl != 0) {
        playlists.splice(indice_pl, 1);
    } else {
        playlists.shift();
    }
    utenti[indice_utente].imported_playlists = playlists;

    localStorage.setItem("users", JSON.stringify(utenti));
    pl_url = "/home/melias/Scrivania/GCMO/public_playlists.html"
    window.location.href = pl_url;
}

function logout() {
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}