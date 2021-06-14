function changetype(id,pic){
    var buttontype = document.getElementById(id);
    var photo = document.getElementById(pic);
    if(buttontype.type === "password"){
        buttontype.type = "text";
        photo.src="https://sv1.picz.in.th/images/2021/05/07/AFyWJZ.png";
    }
    else if(buttontype.type === "text"){
        buttontype.type = "password";
        photo.src="https://sv1.picz.in.th/images/2021/05/07/AFy0fI.png";
    }

}