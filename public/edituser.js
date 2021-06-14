
function switchmode(){
    var test = document.getElementById("detail");
    test.style.color = "white";
    var mode = document.getElementById("mode");
    var head = document.getElementById("head");
    var logo = document.getElementById("logo");
    var nav = document.getElementById("sidenav");
    var key = document.getElementById("lock");
    var exit = document.getElementById("signout");
    var cover = document.getElementById("cover");
    var manage = document.getElementById("userM");
    manage.style.background = "white";
    manage.style.color = "black";
    cover.style.background = "#34495E";
    key.style.color = "black";
    exit.style.color = "black";
    nav.style.backgroundColor = "#071A2D";
    head.style.backgroundColor = "#EFE8E8";
    logo.style.color = "black";
    mode.src = "https://sv1.picz.in.th/images/2021/04/15/Aw6FuW.png";
    mode.setAttribute('onclick','switchback()');
}

function switchback(){
    var test = document.getElementById("detail");
    test.style.color = "black";
    var mode = document.getElementById("mode");
    var head = document.getElementById("head");
    var logo = document.getElementById("logo");
    var nav = document.getElementById("sidenav");
    var key = document.getElementById("lock");
    var exit = document.getElementById("signout");
    var cover = document.getElementById("cover");
    var detail = document.getElementById("detail");
    var manage = document.getElementById("userM");
    manage.style.background = "black";
    manage.style.color = "white";
    cover.style.background = "white";
    detail.style.color = "black";
    key.style.color = "white";
    exit.style.color = "white";
    nav.style.backgroundColor = "#385068";
    head.style.backgroundColor = "#34495E";
    logo.style.color = "white";
    mode.src = "https://sv1.picz.in.th/images/2021/04/16/AZxQYu.png";
    mode.setAttribute('onclick','switchmode()');
}