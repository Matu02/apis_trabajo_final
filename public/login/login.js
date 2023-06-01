
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


//Se crea un js a parte para el login para tener mejor organización y más seguridad
class Login {
    constructor() {  
      const loginForm = document.querySelector('#login-form'); //Selecciona el formulario del HTML
      this._doLogin = this._doLogin.bind(this); //el .bind enlaza la función doLogin al contexto de la clase Login
      loginForm.addEventListener('submit', this._doLogin); //Escucha cuando se da el evento sumbit en el input (que seria apretar el boton)
    }

    _doLogin(event) { //el parametro event hace referencia al submit que debe ocurrir para que se ejecute esta función
        event.preventDefault(); //evita que el form reinicie la pagina web (q es el comportamiento x default del <form>)
        const username = document.querySelector("#username").value; //Selecciona el valor ingresado en el campo username del form
        const password = document.querySelector("#password").value; //Lo mismo pero con la contraseña
        const loginBody = { //Crea un objeto en el que guarda los valores ingresados por el usuario
            username: username,
            password: password
        };

        const fetchOptions = { //Aca se especifica como será la solicitud fetch
            method: 'POST', //Se hará con POST, xq se manda info importante del usuario. Se recomienda para + seguridad
            headers: {
                'Accept': 'application/json', //Indica al servidor q se acepta la respuesta en formato JSON
                'Content-Type': 'application/json' //indica al server q se enviara la solictud en formato JSON
            },
            body: JSON.stringify(loginBody) //El body contiene los datos q se enviaran, en este caso mando el obejto q cree antes q contiene los datos del usuario.
            //Hago JSON.stringify para que los datos se manden en formato JSON
        };
        
        
        return fetch('/login/', fetchOptions) //Hace el fetch al endpoint /login/ y le manda las fetchOptions que cree antes
            .then(user =>  window.location.href = '/'); //Se recibe la respuesta del servidor en el objeto user y luego te redirige al home, que tiene como endpont '/'
    }
}
// Init app
const login = new Login();


