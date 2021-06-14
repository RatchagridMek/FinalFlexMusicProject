
function myfunction(){
    document.getElementById("myDropdown").classList.toggle("show");

}

function closesuccess(){
    document.getElementById("success-bar").style.display = "none";
}

function pathset(){
    document.getElementById('loading').style.display = "flex";
    var delayInMilliseconds = 2500; //2.5 second
    setTimeout(function() {
        location.href = "/logout";
    }, delayInMilliseconds);
}

window.addEventListener("click", function(event) {
    if(!event.target.matches('.userlogo') && !event.target.matches('.dropdownlogo')){
        document.getElementById("myDropdown").classList.remove("show");
    }
});

function previewFile(){
    var preview2 = document.getElementById("image");
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview2.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview2.src = "https://sv1.picz.in.th/images/2021/04/22/AO4jye.png";
    }
}

function opensidenav(){
    var side = document.getElementById("sidenav");
    side.classList.toggle("unshow");
    side.classList.toggle("show");
}

setTimeout(function() {
    var bar = document.getElementById("success-bar");
    bar.style.marginTop = "0";
    bar.style.opacity = "0";
    setTimeout(function(){
        bar.style.display = "none";
    },500)
  }, 1000);

  setTimeout(function() {
    var bar2 = document.getElementById("info-bar");
    bar2.style.marginTop = "0";
    bar2.style.opacity = "0";
    setTimeout(function(){
        bar2.style.display = "none";
    },500)
  }, 1000);

  setTimeout(function() {
    var bar3 = document.getElementById("fav-bar");
    bar3.style.marginTop = "0";
    bar3.style.opacity = "0";
    setTimeout(function(){
        bar3.style.display = "none";
    },500)
  }, 1000);


function closedialog(){
    document.getElementById("email-bar").style.opacity = "0";
    document.getElementById("email-bar").style.marginLeft = "77%";
    setTimeout(function(){
        document.getElementById("email-bar").style.display = "none";
    },1000);
}