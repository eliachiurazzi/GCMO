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

function ricerca_playlist() {
    tabella.innerHTML = ""
    opzione = ""
    tabella = document.getElementById("tabella")
    queryString = location.search.substring(1)
    query = document.getElementById("ricerca").value.trim().toLowerCase();
    if (query == "") {
        tabella.innerHTML = ""
        return;
    }
    select = document.getElementById("tipologia")
    for (i = 0; i < 3; i++) {
       if (select[i].selected == true) {
        opzione = select.value
       }
   }
    tipologia = select[opzione].innerHTML
    pl_pubbliche = JSON.parse(localStorage.getItem("playlist_pubbliche"));
    if (tipologia == "titolo") {
        for (i = 0; i < pl_pubbliche.length; i++) {
            if (pl_pubbliche[i].Titolo.toLowerCase().includes(query)) {
                tabella.innerHTML += "<tr id='"+ i +"'><td>" + pl_pubbliche[i].Autore +"</td><td>"+ pl_pubbliche[i].Titolo +"</td><td>"+ pl_pubbliche[i].Tags +"</td><td>"+ pl_pubbliche[i].Counter +"</td><td><button onclick='view_playlist("+queryString+ "," + i +")' type='button' class='btn btn-success'>&#x1F50D</button></td></tr>"
            }
        }
    } else if (tipologia == "tags") {
        for (i = 0; i < pl_pubbliche.length; i++) {
            low_case = pl_pubbliche[i].Tags.map(tag => tag.toLowerCase())
            hashtag = "#" + query;
            for (j = 0; j < low_case.length; j++) {
                if (low_case[j].includes(hashtag)) {
                tabella.innerHTML += "<tr id='"+ i +"'><td>" + pl_pubbliche[i].Autore +"</td><td>"+ pl_pubbliche[i].Titolo +"</td><td>"+ pl_pubbliche[i].Tags +"</td><td>"+ pl_pubbliche[i].Counter +"</td><td><button onclick='view_playlist("+queryString+ "," + i +")' type='button' class='btn btn-success'>&#x1F50D</button></td></tr>"
                break;
                }
            }
        }
    } else if (tipologia == "canzoni"){
        for (i = 0; i < pl_pubbliche.length; i++) {
            for (j = 0; j < pl_pubbliche[i].Brani.length; j++) {
                titolo = pl_pubbliche[i].Brani[j].Titolo.toLowerCase()
                if (titolo.includes(query)) {
                tabella.innerHTML += "<tr id='"+ i +"'><td>" + pl_pubbliche[i].Autore +"</td><td>"+ pl_pubbliche[i].Titolo +"</td><td>"+ pl_pubbliche[i].Tags +"</td><td>"+ pl_pubbliche[i].Counter +"</td><td><button onclick='view_playlist("+queryString+ "," + i +")' type='button' class='btn btn-success'>&#x1F50D</button></td></tr>"
                break;
                }
            }
        }
    }
}

function logout() {
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}

function view_playlist(indice_utente, indice_playlist) {
    window.location = '/home/melias/Scrivania/GCMO/vista_pl_pubblica.html?' + indice_utente + "&" + indice_playlist;

}