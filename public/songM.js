
var searchValue = "";
var testarr = ["a", "b", "c"];
var input = document.getElementById("myInput");


input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("sub-btn").click();
  }
});

function closesuccess(){
    document.getElementById("success-bar").style.display = "none";
  }

  setTimeout(function() {
    var bar = document.getElementById("success-bar");
    bar.style.marginTop = "0";
    bar.style.opacity = "0";
  }, 2000);

function startsort(){
    var value = document.getElementById("sort").value;
    var namesort = document.getElementsByClassName("sort-name");
    var artistsort = document.getElementsByClassName("sort-artist");
    var normal = document.getElementsByClassName("sort-default");
    var viewsort = document.getElementsByClassName("sort-view");
    if(value === "name"){
        for(let i=0;i<namesort.length;i++){
            namesort[i].style.display = "table-row";
            normal[i].style.display = "none";
            artistsort[i].style.display = "none";
            viewsort[i].style.display = "none";
        }
    }
    else if(value === "artist"){
        for(let i=0;i<artistsort.length;i++){
            artistsort[i].style.display = "table-row";
            normal[i].style.display = "none";
            namesort[i].style.display = "none";
            viewsort[i].style.display = "none";
        }
    }
    else if(value === "default"){
        for(let i=0;i<normal.length;i++){
            normal[i].style.display = "table-row";
            namesort[i].style.display = "none";
            artistsort[i].style.display = "none";
            viewsort[i].style.display = "none";
        }
    }
    else if(value === "view"){
        for(let i=0;i<viewsort.length;i++){
            viewsort[i].style.display = "table-row";
            normal[i].style.display = "none";
            namesort[i].style.display = "none";
            artistsort[i].style.display = "none";
        }
    }
}


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
    var manage = document.getElementById("songM");
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
    var manage = document.getElementById("songM");
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

function add(){
    document.getElementById("cover").style.display = "none";
    document.getElementById("addnew").style.display = "block";
}

function unadd(){
    document.getElementById("cover").style.display = "block";
    document.getElementById("addnew").style.display = "none";
}


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
        preview2.src = "/photo/gallery.png";
    }
}

var song_id = "";

function confirmcheck(id){
    document.getElementById('confirm-wrapper').style.display = "block";
    song_id = id;
}

function cancle(){
    document.getElementById('confirm-wrapper').style.display = "none";
}

function confirm(){
    window.location.href = "/songM/remove/"+song_id;
}



// function test(searchValue,data){
//     var testlist = document.getElementById("testlist");
//     var showlist = testarr.map((item) => {
//         return `
//         <tr>
//         <td>${item}</td>
//         </tr>
//         `;
//     })
//     testlist.innerHTML = showlist;
//     console.log(data);
//     console.log(searchValue);
// }

// function onChangeSearch(value){
//     searchValue = value;
// }

// function testmap(){
//     return testarr;
// }

// function testprint(){
//     console.log("aaaa");
// }
