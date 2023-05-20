
//Funcion para que se mueva el form de login al de registro
/*const formsignup = document.getElementById("signup");
formsignup.addEventListener('submit', signup);

var x = document.getElementById("login")
var y = document.getElementById("signup")
var z = document.getElementById("elegir")

function login_des(){
    x.style.left = "50px"
    y.style.left = "450px"
    z.style.left = "0px"
}
function signup_des(){
    x.style.left = "-400px"
    y.style.left = "50px"
    z.style.left = "130px"
}

*/
class Login {
    constructor() {  
      const loginForm = document.querySelector('#login-form');
      this._doLogin = this._doLogin.bind(this);
      loginForm.addEventListener('submit', this._doLogin);
    }

    _doLogin(event) {
        event.preventDefault();
        const username = document.querySelector("#usename");
        const password = document.querySelector("#password");
        const loginBody = {
            username: user,
            password: pass
        };

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginBody)
        };
        
        
        return fetch('/login/', fetchOptions)
            .then(user =>   window.location.href = '/');
    }
}
// Init app
const login = new Login();


