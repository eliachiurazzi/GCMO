if (localStorage.getItem("active_session_user") == undefined) {
    alert("Non puoi accedere a questa pagina!")
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}

function get_pl_info() {
    queryString = location.search.substring(1)
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

function logout() {
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}

function add_pub_playlist(event) {
    utenti = JSON.parse(localStorage.getItem("users"));
    queryString = location.search.substring(1)
    indici = queryString.split("&");
    indice_utente = indici[0];
    indice_pl = indici[1];
    utente = JSON.parse(localStorage.getItem("users"))[indice_utente].username;
    autore = JSON.parse(localStorage.getItem("playlist_pubbliche"))[indice_pl].Autore;
    playlist = indice_pl;
    if (utente ==  autore) {
        event.preventDefault;
        alert("Sei gia proprietario di questa playlist!")
    } else {
        playlist_importate = JSON.parse(localStorage.getItem("users"))[indice_utente].imported_playlists;
        if (playlist_importate == undefined || playlist_importate.length == 0) {
            pl_importate = []
            pl_importate.push(playlist)
            utenti[indice_utente]["imported_playlists"] =  pl_importate;
            localStorage.setItem("users", JSON.stringify(utenti))
            window.location = '/home/melias/Scrivania/GCMO/public_playlists.html'
        } else {
            for (i = 0; i < playlist_importate.length; i++) {
                if (playlist_importate[i] == playlist) {
                    event.preventDefault;
                    alert("Playlist già importata!")
                } else {
                    utenti[indice_utente].imported_playlists.push(playlist);
                    localStorage.setItem("users", JSON.stringify(utenti))
                    window.location = '/home/melias/Scrivania/GCMO/public_playlists.html'
                }
            }
        }
    }
}