
function myfunction(){
    var pic = document.getElementById("droppic");
    pic.style.src=""
    document.getElementById("myDropdown").classList.toggle("show");
}

function showedit(){
    document.getElementById('loading').style.display = "flex";
    var delayInMilliseconds = 2500; //2.5 second
    setTimeout(function() {
        document.getElementById('loading').style.display = "none";
        document.getElementById("edit").style.display = "block";
        document.getElementById("edit").style.overflow = "none";
        document.getElementById("main").style.display = "none";
        document.getElementById("sidenav").style.height = "120%";
        document.getElementById("sidenav").style.position = "absolute";
        document.getElementsByTagName("body")[0].style.overflowY = "scroll";
    }, delayInMilliseconds);
}

function showmanage(){
    document.getElementById('loading').style.display = "flex";
    var delayInMilliseconds = 2500; //2.5 second
    setTimeout(function() {
        location.href = "/userM";
    }, delayInMilliseconds);
}

function back(){
    document.getElementById('loading').style.display = "flex";
    var delayInMilliseconds = 2500; //2.5 second
    setTimeout(function() {
        document.getElementById('loading').style.display = "none";
        document.getElementById("edit").style.display = "none";
        document.getElementById("main").style.display = "block";
        document.getElementById("sidenav").style.height = "100%";
        document.getElementById("sidenav").style.position = "fixed";
        document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    }, delayInMilliseconds);
}

var oldpic = document.getElementById("image").src;

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
        preview2.src = oldpic;
    }
}

function checkconfirm(){
    var confirm = document.getElementById('confirm-wrapper');
    confirm.style.display = "block";
    window.addEventListener('click',function(event){
        if(!event.target.matches('#confirm-inside-wrapper') && !event.target.matches('.Remove-btn') && !event.target.matches('#confirmlogo') && !event.target.matches('#confirmheader') && !event.target.matches('#confirmmiddle') && !event.target.matches('#cancle') && !event.target.matches('#confirm')){
            document.getElementById('confirm-wrapper').style.display = "none";
        }
    })
}

function cancle(){
    var confirm = document.getElementById('confirm-wrapper');
    confirm.style.display = "none";
}

function confirm(){
    document.getElementById('reallyconfirm').click();
}

