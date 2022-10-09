if (localStorage.getItem("active_session_user") == undefined) {
    alert("Non puoi accedere a questa pagina!")
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}

function get_token() {
    const client_id = "99aa65598ffb42fba105ccd0ce796015"
    const client_secret = "4c7ed685ad1c45fa826f53923bca3cbc"
    var url = "https://accounts.spotify.com/api/token"
    fetch(url, {
        method: "POST",
        headers: {
        Authorization: "Basic " +
        btoa(`${client_id}:${client_secret}`),
        "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
        })
        .then((response) => {
        if (response.ok) {
            response.json()
            .then((tokenResponse) =>
            window.localStorage.setItem(key = "token", value = tokenResponse.access_token))
        } else {
            response.json()
            .then(resp => alert(resp.error))
        }
    })
}

function ricerca_canzone() {
opzione = "";
q = document.getElementById("ricerca").value.trim().toLowerCase();
if (q == "") {
    tab = document.getElementById("tabella")
    tab.innerHTML = "";
    return
}
query = encodeURI(q)
select = document.getElementById("tipologia")
   for (i = 0; i < 4; i++) {
       if (select[i].selected == true) {
        opzione = select.value
       }
   }
   tipologia = select[opzione].innerHTML
   fetch("https://api.spotify.com/v1/search?q=" + tipologia + ":" + query + "&type=track&limit=21", {
    headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + window.localStorage.getItem(key = "token"),
    },
    })
        .then((response) => { 
            if (response.ok) {
                response.json()
                .then((tracks) => {
                    tab = document.getElementById("tabella")
                    tab.innerHTML = "";
                    results = Object.values(tracks)[0].items;
                    for (i = 0; i < results.length; i++) {
                        artists = results[i].artists;
                        artisti_init = "";
                        for (j = 0; j < artists.length; j++) {
                            artisti_init += artists[j].name + " - "
                        }
                        artista = artisti_init.slice(0, (artisti_init.length - 2)).trim().toString();
                        artisti = artista.replace(/'/g, ' ')
                        secondi = Math.round(results[i].duration_ms / 60000)
                        minutes = results[i].duration_ms % 60000
                        minuti = minutes.toString().slice(0,2)
                        durata = (secondi + ":" + minuti).toString();

                        year =  results[i].album.release_date;
                        anno = (year.slice(0,4)).toString();

                        copertina = (results[i].album.images[2].url).toString()

                        title = (results[i].name).toString()
                        title2 = title.replace(/'/g , ' ')
                        titolo = title2.replace(/,/g , ' ')
                        brano = [copertina, titolo, artisti, anno, durata];
                        tab.innerHTML = tab.innerHTML + "<tr id='"+ i +"'><th scope='row'>" + i + "</th><td><img src='"+ copertina +"'></td><td>"+ titolo +"</td><td>"+ artisti +"</td><td>"+ anno +"</td><td>"+ durata +"</td><td><button onclick='add_song(\""+brano+"\")' type='button' class='btn btn-primary'>&#8853</button></td></tr>"
                    }
                })
            } else {
                response.json()
                .then((resp) => {
                    tab = document.getElementById("tabella");
                    tab.innerHTML = resp.error["message"];
                })
            }
        })
}


function add_song(song) {
    brano = song.split(",");
    canzone = {
        "Copertina" : brano[0],
        "Titolo" : brano[1],
        "Artisti" : brano[2],
        "Anno" : brano[3],
        "Durata" : brano[4]
    }
    queryString = location.search.substring(1)
    indici = queryString.split("&");
    indice_utente = indici[0];
    indice_pl = indici[1];
    utenti = JSON.parse(localStorage.getItem("users"));
    playlist = utenti[indice_utente].public_playlists[indice_pl];
    if (playlist['Brani'] == undefined) {
        brani = []
        brani.push(canzone)
        playlist['Brani'] = brani;
        playlist['Counter'] = 1
        localStorage.setItem("users", JSON.stringify(utenti))
    } else {
        brani = playlist['Brani'];
        if (brani.some(element => element.Titolo == brano[1])) {
            alert("Brano già presente in playlist!");
            return;
        }
        brani.push(canzone);
        playlist['Brani'] = brani
        playlist['Counter'] += 1;
        localStorage.setItem("users", JSON.stringify(utenti))
    }
    add_public_song(indice_utente, indice_pl, brano[0], brano[1], brano[2], brano[3], brano[4]);
    pl_url = "/home/melias/Scrivania/GCMO/public_playlist_view.html" + "?" + indice_utente + "&" + indice_pl;
    window.location.href = pl_url
}

function add_public_song(indice_utente, indice_pl, copertina, titolo, artisti, anno, durata) {
    // funzione che aggiorna le canzoni nelle playlist pubbliche, dopo aver aggiornato quella dell'autore
    // con la funzione add_song(), ovvero la chiamante di questa
    pl_pubbliche = JSON.parse(localStorage.getItem("playlist_pubbliche"))
    playlist = JSON.parse(localStorage.getItem("users"))[indice_utente].public_playlists[indice_pl];
    for (i = 0; i < pl_pubbliche.length; i++) {
        if (pl_pubbliche[i].Titolo == playlist.Titolo && pl_pubbliche[i].Descrizione == playlist.Descrizione) {
            if (pl_pubbliche[i].Brani == undefined || pl_pubbliche[i].Brani == null) {
                pl_pubbliche[i].Counter = 1
                pl_pubbliche[i]["Brani"] = [{"Copertina" : copertina,"Titolo" : titolo,"Artisti" : artisti,"Anno" : anno,"Durata" : durata}]
                localStorage.setItem("playlist_pubbliche", JSON.stringify(pl_pubbliche))
            } else {
                canzone = {
                    "Copertina" : copertina,
                    "Titolo" : titolo,
                    "Artisti" : artisti,
                    "Anno" : anno,
                    "Durata" : durata
                }
            pl_pubbliche[i].Counter += 1
            pl_pubbliche[i].Brani.push(canzone)
            localStorage.setItem("playlist_pubbliche", JSON.stringify(pl_pubbliche));
            }
        }
    }
}