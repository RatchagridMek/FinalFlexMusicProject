
var input = document.getElementById("myInput");


function startsort(){
  var value = document.getElementById("sort").value;
  var namesort = document.getElementsByClassName("sort-name");
  var surnamesort = document.getElementsByClassName("sort-surname");
  var emailsort = document.getElementsByClassName("sort-email");
  var ranksort = document.getElementsByClassName("sort-rank");
  var normal = document.getElementsByClassName("sort-default");
  if(value === "name"){
      for(let i=0;i<namesort.length;i++){
          namesort[i].style.display = "table-row";
          normal[i].style.display = "none";
          surnamesort[i].style.display = "none";
          emailsort[i].style.display="none";
          ranksort[i].style.display = "none";
      }
  }
  else if(value === "surname"){
      for(let i=0;i<surnamesort.length;i++){
          surnamesort[i].style.display = "table-row";
          normal[i].style.display = "none";
          namesort[i].style.display = "none";
          emailsort[i].style.display="none";
          ranksort[i].style.display="none";
      }
  }
  else if(value === "email"){
    for(let i=0;i<normal.length;i++){
      normal[i].style.display = "none";
      namesort[i].style.display = "none";
      surnamesort[i].style.display = "none";
      emailsort[i].style.display="table-row";
      ranksort[i].style.display="none";
  }
  }
  else if(value === "rank"){
    for(let i=0;i<normal.length;i++){
      normal[i].style.display = "none";
      namesort[i].style.display = "none";
      surnamesort[i].style.display = "none";
      emailsort[i].style.display="none";
      ranksort[i].style.display="table-row";
  }
  }
  else if(value === "default"){
      for(let i=0;i<normal.length;i++){
          normal[i].style.display = "table-row";
          namesort[i].style.display = "none";
          surnamesort[i].style.display = "none";
          emailsort[i].style.display="none";
          ranksort[i].style.display="none";
      }
  }
}


input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("sub-btn").click();
  }
});

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

setTimeout(function() {
  var bar = document.getElementById("success-bar");
  bar.style.marginTop = "0";
  bar.style.opacity = "0";
}, 2000);

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

function closesuccess(){
  document.getElementById("success-bar").style.display = "none";
}