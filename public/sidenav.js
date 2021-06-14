function PListC(){
    document.getElementById("fav").style.display = "flex";
}

window.onclick = function(event){
    if(event.target.matches('.fav-wrapper')){
        document.getElementById("fav").style.display = "none";
    }
}