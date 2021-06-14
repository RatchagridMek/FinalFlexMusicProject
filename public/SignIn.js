
  if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    window.history.replaceState( {} , "", "Signin#" );
    window.location = window.location.href;
  } else {
  }

// function changeValue(){
//   var a = document.getElementById("changename").value;
//   var realusername = a.substring(0, a.lastIndexOf("@"));
//   document.getElementById("changename").value = realusername;
//   console.log(document.getElementById("changename").value);
//   document.getElementById("gogosubmit").click();
// }

function myfunction1(){
    var h1 = document.getElementById("01");
    var h2 = document.getElementById("02");
    var h3 = document.getElementById("03");
    var h4 = document.getElementById("04");
    var h5 = document.getElementById("05");
    var term = document.getElementById("term");
    var cover = document.getElementById("cover");
    var back = document.getElementById("goback");
    cover.style.margin = 0;
    back.style.display = "inline-block";
    h1.classList.toggle("display_none");
    h2.classList.toggle("display_none");
    h3.classList.toggle("display_none");
    h4.classList.toggle("display_none");
    h5.classList.toggle("display_none");
    term.classList.toggle("display_none");
    var body = document.getElementById("body");
    var page = document.getElementById("pageWrap");
    body.style.transition = "background 2s";
    page.style.transition = "background 2s";
    body.style.background = "rgba(255, 134, 219, 0.8)";
    page.style.background = "rgb(192, 189, 189)";

}

function myfunction2(){
    var h1 = document.getElementById("01");
    var h2 = document.getElementById("02");
    var h3 = document.getElementById("03");
    var h4 = document.getElementById("04");
    var term = document.getElementById("term");
    var h5 = document.getElementById("05");
    var cover = document.getElementById("cover");
    var back = document.getElementById("goback");
    cover.style.margin = "0 0 0 50%";
    back.style.display = "none";
    h5.classList.toggle("display_none");
    h1.classList.toggle("display_none");
    h2.classList.toggle("display_none");
    h3.classList.toggle("display_none");
    h4.classList.toggle("display_none");
    term.classList.toggle("display_none");
    var body = document.getElementById("body");
    var page = document.getElementById("pageWrap");
    body.style.background = "rgb(192, 189, 189)";
    page.style.background = "rgba(255, 134, 219, 0.8)";
}

function myfunction3(){
  document.getElementById('loading').style.display = "flex";
    var delayInMilliseconds = 1000; //1.0 second
    setTimeout(function() {
      document.getElementById('loading').style.display = "none";
      var register = document.getElementById("register1");
      var login = document.getElementById("login1");
      var body = document.getElementById("body");
      var page = document.getElementById("pageWrap");
      document.getElementById("container").style.background = "rgba(255, 134, 219, 0)";
      body.style.background = "rgba(255, 134, 219,0.8)";
      page.style.background = "rgb(192, 189, 189)";
      register.style.display = "block";
      login.style.display = "none";
    }, delayInMilliseconds);
      
}

function myfunction4(){
  document.getElementById('loading').style.display = "flex";
    var delayInMilliseconds = 1000; //1.0 second
    setTimeout(function() {
      document.getElementById('loading').style.display = "none";
      var register = document.getElementById("register1");
      var login = document.getElementById("login1");
      var body = document.getElementById("body");
      var page = document.getElementById("pageWrap");
      document.getElementById("container").style.background = "rgba(255, 134, 219, 0)";
      body.style.background = "rgb(192, 189, 189)";
    page.style.backgroundColor = "rgba(255, 134, 219,0.8)";
      register.style.display = "none";
      login.style.display = "block";
    }, delayInMilliseconds);
      
  
}

function pathset(){
    document.getElementById('loading').style.display = "flex";
    var delayInMilliseconds = 2500; //2.5 second
    setTimeout(function() {
      document.getElementById('loading').style.display = "none";
      document.getElementById("submita").click();
    }, delayInMilliseconds);
}


var password = document.getElementById("password1-pc");
  var confirm_password = document.getElementById("password2-pc");
function validatePassword(){
  if(password.value != confirm_password.value) {
    console.log("password not match");
    confirm_password.setCustomValidity("Password doesn't match please check your password again");
  } else {
    console.log("password match");
    confirm_password.setCustomValidity('');
  }
}

var mbpassword = document.getElementById("password1-mobile");
var mbconfirm_password = document.getElementById("password2-mobile");
function mobilevalidatePassword(){
  if(mbpassword.value != mbconfirm_password.value) {
    console.log("password not match");
    confirm_password.setCustomValidity("Password doesn't match please check your password again");
  } else {
    console.log("password match");
    confirm_password.setCustomValidity('');
  }
}

setTimeout(function() {
  var bar = document.getElementById("success-bar");
  bar.style.marginLeft = "65%";
  bar.style.opacity = "0";
}, 1000);

setTimeout(function() {
  var bar2 = document.getElementById("fail-bar");
  bar2.style.marginLeft = "65%";
  bar2.style.opacity = "0";
}, 1000);