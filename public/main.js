
var input = document.getElementById("searchinp");

input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("search-btn").click();
    }
});

function gogo(){
    var a = document.getElementById("viewall");
    window.location.href = "/newrelease";
}