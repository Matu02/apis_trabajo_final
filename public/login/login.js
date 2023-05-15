
//Funcion para que se mueva el form de login al de registro
const formsignup = document.getElementById("signup");
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