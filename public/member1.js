var audio = document.getElementById("player");
var control = document.getElementById("player-cover");
var volume = document.querySelector("#volumn-control");
var loop = document.getElementById("loop-cover");
var timer = document.getElementById('time-cover');
var timeslide = document.getElementById("slider");
var durationcover = document.getElementById("duration-cover");
var volumecover = document.getElementById("volume-cover");

audio.volume = volume.value/100;

audio.onended = function(){
    control.className = "fa fa-play";
    control.onclick = function(){
        play();
    }
};

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

function next5(){
    audio.currentTime = audio.currentTime + 5;
}

function back5(){
    audio.currentTime = audio.currentTime - 5;
}


    
