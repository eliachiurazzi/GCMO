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
    username = document.getElementById("usernameform");
    var alert = document.getElementById('alert_us');
    if (username.value.length < 6) {
        alert.className = "alert alert-danger"
        username.style.backgroundColor = "OrangeRed";
        alert.style.display = "block";
        alert.innerHTML = "<p>Username troppo corto!</p>";
    } else if (userIsPresent(username.value)) {
      alert.className = "alert alert-danger"
        username.style.backgroundColor = "OrangeRed";
        alert.style.display = "block";
        alert.innerHTML = "<p>Username già esistente!</p>";
    } else {
        alert.style.display = "block";
        alert.className = "alert alert-success"
        username.style.backgroundColor = "white";
        alert.innerHTML = "<p>Username ok</p>"
    }
}

function checkEmail() {
    email = document.getElementById("exampleInputEmail1");
    var alert = document.getElementById('alert_email');
    if (email.value.length < 7) {
        alert.className = "alert alert-danger"
        email.style.backgroundColor = "OrangeRed";
        alert.style.display = "block";
        alert.innerHTML = "<p>Email troppo corta!</p>";
    } else if (emailIsPresent(email.value)) {
        alert.className = "alert alert-danger"
        email.style.backgroundColor = "OrangeRed";
        alert.style.display = "block";
        alert.innerHTML = "<p>Email già esistente!</p>";
    }  
    else {
        alert.style.display = "block";
        alert.className = "alert alert-success"
        email.style.backgroundColor = "white";
        alert.innerHTML = "<p>Email ok</p>"
    }
}

function checkPassword() {
    pwd = document.getElementById("exampleInputPassword1");
    var alert = document.getElementById('alert_pwd');
    alert.style.display = "none";
    if (pwd.value.length < 9) {
        alert.className = "alert alert-danger"
        pwd.style.backgroundColor = "OrangeRed";
        alert.style.display = "block";
        alert.innerHTML = "<p>Password troppo corta!</p>";
    } else {
        alert.style.display = "block";
        alert.className = "alert alert-success"
        pwd.style.backgroundColor = "white";
        alert.innerHTML = "<p>Password ok</p>"
    }
}

function userIsPresent(text) {
    users = localStorage.getItem("users");
    if (users != null) { 
      js_users = JSON.parse(users);
      for (i = 0; i < js_users.length; i++) {
          if (js_users[i].username == text) {
              return true;
          }
      }
    }
  return false;
}

function emailIsPresent(text) {
    users = localStorage.getItem("users");
    if (users != null) { 
      js_users = JSON.parse(users);
      for (i = 0; i < js_users.length; i++) {
          if (js_users[i].email == text) {
              return true;
          }
      }
    }
  return false;
}

function checkAlerts(event) {
    alert_us = document.getElementById('alert_us').className;
    alert_email = document.getElementById('alert_email').className;
    alert_pwd = document.getElementById('alert_pwd').className;
    if (alert_us == "alert alert-danger" || alert_email == "alert alert-danger" || alert_pwd == "alert alert-danger") {
        alert("Controlla gli avvertimenti e riprova!")
        event.preventDefault();
    }
}

function save_data() {
    u = document.getElementById("usernameform").value;
    e = document.getElementById("exampleInputEmail1").value;
    p = document.getElementById("exampleInputPassword1").value;
    
    // The next 3 instructions are coded in order to prevent wrong sign-up with already-existing user credentials
    document.getElementById("usernameform").value = "";
    document.getElementById("exampleInputEmail1").value = "";
    document.getElementById("exampleInputPassword1").value = "";
    // end of control

    active_session_user = u;
    user = {"username":u, "email":e, "password":p};
    if (localStorage.getItem("users") == null || localStorage.getItem("users") == undefined) {
        new_users = [];
        new_users.push(user);
        localStorage.setItem("users", JSON.stringify(new_users));
        localStorage.setItem("active_session_user", active_session_user);
    } else {
    users = JSON.parse(localStorage.getItem("users"));
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("active_session_user", active_session_user);
    }
}

function valid_login(event) {
    users = localStorage.getItem("users");
    if (users != null && users != undefined) { 
      email = document.getElementById("exampleInputEmail1").value;
      pwd = document.getElementById("exampleInputPassword1").value;  
      js_users = JSON.parse(users);
      for (i = 0; i < js_users.length; i++) {
          if (js_users[i].email == email && js_users[i].password == pwd) {
              active_session_user = js_users[i].username;
              localStorage.setItem("active_session_user", active_session_user);
              return true;
          }
      }
    }
  alert("Email e/o password errati, per favore riprova");
  event.preventDefault();
  return false;
}