
function myfunction(){
    var pic = document.getElementById("droppic");
    pic.style.src=""
    document.getElementById("myDropdown").classList.toggle("show");
}

function myfunction2(){
        document.getElementById('loading').style.display = "flex";
        var delayInMilliseconds = 2000; //2 second
        setTimeout(function() {
            document.getElementById("changepasswordsubmit").click();
        }, delayInMilliseconds);
    
}