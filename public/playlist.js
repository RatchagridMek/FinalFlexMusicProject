
var audio = document.getElementById("player");
var control = document.getElementById("player-cover");
var volume = document.querySelector("#volumn-control");
var loop = document.getElementById("loop-cover");
var timer = document.getElementById('time-cover');
var timeslide = document.getElementById("slider");
var durationcover = document.getElementById("duration-cover");
var volumecover = document.getElementById("volume-cover");
var tablename = document.getElementsByClassName('songnamelist');

audio.volume = volume.value/100;


volume.addEventListener("change",function(e){
    console.log(e.currentTarget.value);
    if(e.currentTarget.value <= 50){
        volumecover.className= "fa fa-volume-down";
    }
    else if(e.currentTarget.value > 50){
        volumecover.className = "fa fa-volume-up";
    }
    audio.volume = e.currentTarget.value / 100;
});

audio.onloadedmetadata = function(){
    var mins = Math.floor(audio.duration / 60);
    var secs = Math.floor(audio.duration % 60);
    if (secs < 10) {
      secs = '0' + String(secs);
    }
    var duration = mins + ':' + secs;
    durationcover.innerHTML = duration;
};


function play(){
    control.className = "fa fa-pause";
    audio.play();
    control.onclick = function(){
        pause();
    };
}

function pause(){
    audio.pause();
    control.className = "fa fa-play";
    control.onclick = function(){
        play();
    };
}

function reruntrue(){
    audio.loop = 1
    alert('loop enable');
    audio.play();
    control.className = "fa fa-pause";
    loop.onclick = function(){
        rerunfalse();
    }
}

function rerunfalse(){
    audio.loop = 0
    alert('loop disable');
    loop.onclick = function(){
        reruntrue();
    }
}

var update = setInterval(function() {
    var mins = Math.floor(audio.currentTime / 60);
    var secs = Math.floor(audio.currentTime % 60);
    if (secs < 10) {
      secs = '0' + String(secs);
    }
    timeslide.max = audio.duration;
    timeslide.value = audio.currentTime;
    timer.innerHTML = mins + ':' + secs;
  }, 500);



  function seek(){		 
    audio.currentTime = timeslide.value;
    play();
}

function checkmute(){
    var currentValue = document.getElementById('volumn-control').value;
    if(audio.volume === 0){
        unmute();
    }
    else if(audio.volume !== 0){
        mute(currentValue);
    }
}


function mute(currentValue){
    audio.volume = 0;
    volume.value = audio.volume;
    volumecover.className = "fa fa-volume-off";
    volumecover.onclick = function(){
        unmute(currentValue);
    }
}

function unmute(value){
    if(audio.volume !== 0){
        mute(document.getElementById("volumn-control").value);
    }
    else if(audio.volume === 0){
        audio.volume = value / 100;
        volume.value = value;
        if(value <= 50){
            volumecover.className= "fa fa-volume-down";
        }
        else if(value > 50){
            volumecover.className = "fa fa-volume-up";
        }
        volumecover.onclick = function(){
            checkmute();
        }   
    }   
}

function playfromclick(){
    var adcontrol = document.getElementById("song-container");
    adcontrol.style.opacity = "0.9";
    audio.play();
    control.className = "fa fa-pause";
    control.onclick = function(){
        pause();
    }
}

function next5(){
    audio.currentTime = audio.currentTime + 5;
}

function back5(){
    audio.currentTime = audio.currentTime - 5;
}


async function playfromlist(pid){
    const data = await GetQueue(pid);
    document.getElementById('song-container').style.opacity = "0.9";
    let i=0;
    audio.src = data[i].Audio;
    for(let j=0;j< tablename.length;j++){
        tablename[j].style.color = "#FFFFFF";
    }
    tablename[i].style.color = "#FF86DB";
    audio.load();
    audio.play();
    control.className = "fa fa-pause";
    control.onclick = function(){
        pause();
    };
    audio.addEventListener('ended',function(){
        i++;
        if(i < data.length){
            audio.src = data[i].Audio;
            tablename[i].style.color = "#FF86DB";
            tablename[i-1].style.color = "#FFFFFF";
            audio.load();
            audio.play();
            return;
        }
        i=0;
        audio.pause();
        control.className = "fa fa-play";
    })
}

async function playfromclickin(pid,index){
    var data = await GetQueue(pid);
    document.getElementById('song-container').style.opacity = "0.9";
    audio.src = data[index].Audio;
    for(let j=0;j< tablename.length;j++){
        tablename[j].style.color = "#FFFFFF";
    }
    tablename[index].style.color = "#FF86DB";
    audio.load();
    audio.play();
    control.className = "fa fa-pause";
    control.onclick = function(){
        pause();
    };
    audio.addEventListener('ended',function(){
        index++;
        if(index < data.length){
            audio.src = data[index].Audio;
            tablename[index].style.color = "#FF86DB";
            tablename[index-1].style.color = "#FFFFFF";
            audio.load();
            audio.play();
            return;
        }
        index=0;
        audio.pause();
        control.className = "fa fa-play";
    })
}

async function GetQueue(pid){
    try {
        let response = await fetch('/database/playlistqueue/'+pid);
        return await response.json();
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

function custommenu(){
    if(window.innerWidth <= 1024){
        document.getElementById('custom-bar2').style.display = "block";
        document.getElementById('bar-play').onclick = function(){
            uncustommenu();
        }
    }
    else if(window.innerWidth > 1024){
        document.getElementById('custom-bar').style.display = "block";
        document.getElementById('bar-play').onclick = function(){
            uncustommenu();
        }
    }
}

function uncustommenu(){
    if(window.innerWidth <= 1024){
        document.getElementById('custom-bar2').style.display = "none";
        document.getElementById('bar-play').onclick = function(){
            custommenu();
        }
    }
    else if(window.innerWidth > 1024){
        document.getElementById('custom-bar').style.display = "none";
        document.getElementById('bar-play').onclick = function(){
            custommenu();
        }
    }
}

function removeplaylist(id){
    window.location.href = "/playlist/remove/"+id;
}

function previewFileforPlaylist(oldpic){
    console.log(oldpic);
    var preview2 = document.getElementById("Pimage");
    var file    = document.getElementById("Peditimage").files[0];
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

function openedit(){
    document.getElementById("edit-wrapper").style.display = "block";
    window.addEventListener('click',function(e){
        if(!e.target.matches('#edit-wrapper-inside') && !e.target.matches('.inside-bar') && !e.target.matches('#editform') && !e.target.matches('#tips') && !e.target.matches('#Pimage') && !e.target.matches('#Peditimage') && !e.target.matches('#inpname') && !e.target.matches('#inpforname') && !e.target.matches('#inpfordesc') && !e.target.matches('#inpdesc') && !e.target.matches('#Pedit-btn')){
            document.getElementById("edit-wrapper").style.display = "none";
        }
    })
}

var nosort = document.getElementsByClassName('nosort');
var namesort = document.getElementsByClassName('namesort');
var artistsort = document.getElementsByClassName('artistsort');

function nosortfromname(){
    for(let i=0;i<nosort.length;i++){
        document.getElementById('namesortpic').className = "fa fa-sort-up";
        nosort[i].style.display = "table-row";
        namesort[i].style.display = "none";
        artistsort[i].style.display = "none";
        
    }
    console.log("No sort now");
    document.getElementById('namesortpic').onclick = function(){
        sortbyname();
    }
}

function sortbyname(){
    document.getElementById('namesortpic').className = "fa fa-sort-down";
    for(let i=0;i<nosort.length;i++){
        namesort[i].style.display = "table-row";
        artistsort[i].style.display = "none";
        nosort[i].style.display = "none";
    }
    console.log("Sort Success");
    document.getElementById('namesortpic').onclick = function(){
        nosortfromname();
    }
}

function sortbyartist(){
    for(let i=0;i<nosort.length;i++){
        document.getElementById('artistsortpic').className = "fa fa-sort-down";
        artistsort[i].style.display = "table-row";
        namesort[i].style.display = "none";
        nosort[i].style.display = "none";
    }
    console.log("Sort Success");
    document.getElementById('artistsortpic').onclick = function(){
        nosortfromartist();
    }
}

function nosortfromartist(){
    document.getElementById('artistsortpic').className = "fa fa-sort-up";
    for(let i=0;i<nosort.length;i++){
        nosort[i].style.display = "table-row";
        namesort[i].style.display = "none";
        artistsort[i].style.display = "none";
        
    }
    console.log("No sort now");
    document.getElementById('artistsortpic').onclick = function(){
        sortbyartist();
    }
}
