

function pathset(){
    document.getElementById('loading').style.display = "flex";
    var delayInMilliseconds = 2500; //2.5 second
    setTimeout(function() {
        location.href = "/Signin";
    }, delayInMilliseconds);
}

function letsignin(){
    document.getElementById('loading').style.display = "flex";
    var delayInMilliseconds = 1500; //1.5 second
    setTimeout(function() {
        location.href = "/Signin";
    }, delayInMilliseconds);
}