if (localStorage.getItem("active_session_user") == undefined) {
    alert("Non puoi accedere a questa pagina!")
    window.location = '/home/melias/Scrivania/GCMO/login.html'
}

document.getElementById("user-wel").innerHTML = localStorage.getItem("active_session_user")

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
    if (localStorage.getItem("active_session_user") != undefined) {
        localStorage.removeItem("active_session_user");
    }
    }
    
    function checkUser() {
        username = document.getElementById("exampleInputUsername1");
        if (username.value.length < 6) {
            return "Username troppo corto! ";
        } else if (userIsPresent(username.value)) {
          return "Username già esistente! ";
        } else {
            return "";
        }
    }
    
    function checkEmail() {
        email = document.getElementById("exampleInputEmail1");
        if (email.value.length < 7) {
            return "Email troppo corta! ";
        } else if (emailIsPresent(email.value)) {
            return "Email già esistente!";
        } else {
            return "";
        }
    }
    
    function checkPassword() {
        pwd = document.getElementById("exampleInputPassword1");
        if (pwd.value.length < 9) {
            return "Password troppo corta! ";
        } else {
            return "";
        }
    }
    
    function userIsPresent(text) {
        users = localStorage.getItem("users");
        utente_attivo = localStorage.getItem("active_session_user")
        if (users != null) { 
          js_users = JSON.parse(users);
          for (i = 0; i < js_users.length; i++) {
              if (js_users[i].username == text && text != utente_attivo) {
                  return true;
              }
          }
        }
      return false;
    }
    
    function emailIsPresent(text) {
        users = localStorage.getItem("users");
        utente_attivo = localStorage.getItem("active_session_user")
        if (users != null) { 
          js_users = JSON.parse(users);
          for (i = 0; i < js_users.length; i++) {
              if (js_users[i].email == text && js_users[i].username != utente_attivo) {
                  return true;
              }
          }
        }
      return false;
    }
    
    function checkAlerts(event) {
        user_a = checkUser();
        email_a = checkEmail();
        pwd_a = checkPassword();
        messaggio_errore = user_a + email_a + pwd_a;
        if (messaggio_errore.length != 0) {
            alert(messaggio_errore)
            event.preventDefault();
        } else {
            pref_utenti = JSON.parse(localStorage.getItem("users_preferences"))
            utenti = JSON.parse(localStorage.getItem("users"))
            utente_attivo = localStorage.getItem("active_session_user")
            for (i = 0; i < utenti.length; i++) {
                if (utenti[i].username == utente_attivo) {
                    // aggiorno negli users
                    utenti[i].username = document.getElementById("exampleInputUsername1").value;
                    utenti[i].email = document.getElementById("exampleInputEmail1").value;
                    utenti[i].password = document.getElementById("exampleInputPassword1").value;
                    localStorage.setItem("users", JSON.stringify(utenti));
                    // aggiorno nell'utente attivo
                    localStorage.setItem("active_session_user", utenti[i].username);
                    // aggiorno nelle preferenze utente
                    pref_utenti[i].user = utenti[i].username;
                    localStorage.setItem("users_preferences", JSON.stringify(pref_utenti))
                }
            }
        }
    }

    function load_account_info() {
        
        utenti = JSON.parse(localStorage.getItem("users"))
        utente_attivo = localStorage.getItem("active_session_user")
        preferenze_utente = JSON.parse(localStorage.getItem("users_preferences"))
        riga = document.getElementById("riga");
        for (i = 0; i < utenti.length; i++) {
            if (utenti[i].username == utente_attivo) {
                document.getElementById("exampleInputUsername1").value = utenti[i].username;
                document.getElementById("exampleInputEmail1").value = utenti[i].email;
                document.getElementById("exampleInputPassword1").value = utenti[i].password;
                for (j = 0; j < preferenze_utente[i].fav_genres.length; j++) {
                    riga.innerHTML += '<td>'+ preferenze_utente[i].fav_genres[j] +'</td>'
                }
                img = utenti[i].picture;
                if (img == undefined) {
                    document.getElementById("profile_picture").src = "img/immagine_profilo.jpg";
                } else {
                    document.getElementById("profile_picture").src = img;
                }
            }
        }
    }
    
    function enable_update() {
        checkbox = document.getElementById("exampleCheck1");
        button = document.getElementById("aggiorna")
        user = document.getElementById("exampleInputUsername1")
        email = document.getElementById("exampleInputEmail1")
        pwd = document.getElementById("exampleInputPassword1")
    
        if (checkbox.checked == true) {
            button.disabled = false;
            user.disabled = false;
            email.disabled = false;
            pwd.disabled = false;
        } else {
            button.disabled = true;
            user.disabled = true;
            email.disabled = true;
            pwd.disabled = true;
        }
    }


 
function set_profile_pic() {
    rel_path = document.getElementById("inputGroupFile02").files[0].name;
    if (rel_path != "") {
        full_path = "img/" + rel_path;
        document.getElementById("profile_picture").src = full_path;
        utenti = JSON.parse(localStorage.getItem("users"))
        utente_attivo = localStorage.getItem("active_session_user")
        for (i = 0; i < utenti.length; i++) {
            if (utenti[i].username == utente_attivo) {
                utenti[i].picture = full_path;
                localStorage.setItem("users", JSON.stringify(utenti))
            }
        }
    }
}

function delete_account() {
    testo = "Cancellare definitivamente l'account?";
    if (confirm(testo)) {
        utenti = JSON.parse(localStorage.getItem("users"));
        utente_attivo = localStorage.getItem("active_session_user");
        preferenze_utente = JSON.parse(localStorage.getItem("users_preferences"));
        for (i = 0; i < utenti.length; i++) {
            if (utenti[i].username == utente_attivo) {
                if (i != 0) {
                utenti.splice(i);
                preferenze_utente.splice(i);
                localStorage.setItem("users", JSON.stringify(utenti));
                localStorage.setItem("users_preferences", JSON.stringify(preferenze_utente));
                window.location = '/home/melias/Scrivania/GCMO/login.html';
                } else {
                    utenti.shift();
                    preferenze_utente.shift();
                    localStorage.setItem("users", JSON.stringify(utenti));
                    localStorage.setItem("users_preferences", JSON.stringify(preferenze_utente));
                    window.location = '/home/melias/Scrivania/GCMO/login.html';
                }
            }
        }
    }
}

function update_genres() {
    window.location = '/home/melias/Scrivania/GCMO/preferences.html'
}