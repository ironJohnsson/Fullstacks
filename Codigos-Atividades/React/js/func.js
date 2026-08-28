function verNome(){
    let nm = document.getElementById("nome").value;
    document.getElementById("Resultado").innerHTML="O nome é: "+nm;
}

function calcularMedia(){
    let num1 = parseInt (document.getElementById("num1").value);
    let num2 = parseInt (document.getElementById("num2").value);

    let media = (num1+num2)/2;

    document.getElementById("resultado").innerHTML="A média é: "+media;
   
}
