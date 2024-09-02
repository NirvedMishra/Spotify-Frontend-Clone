let plays = document.getElementById("play");
let next = document.getElementById("next");
let previous = document.getElementById("previous");
let list = document.querySelector(".lisf ul");
let songName = document.querySelector("#SongName");
let currentSong = new Audio();
let circle = document.querySelector(".circle");
let slider = document.querySelector(".slider");
let greenslider = document.querySelector(".greenslider");
function convertToMinutes(seconds) {
  function n(n){
    return n > 9 ? "" + n: "0" + n;
}
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = n(Math.floor(seconds % 60));
  return `${minutes}:${remainingSeconds}`;
}
let state = "pause";
let i = 0;
async function getSongs() {
  let p = await fetch("http://127.0.0.1:5500/songs");
  let s = await p.text();
  let songs = [];
  let div = document.createElement("div");
  div.innerHTML = s;
  let as = div.getElementsByTagName("a");
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
// let i = 0;
// next.addEventListener('click',async()=>{
//     console.log("next");

//     i = i+1;
//     console.log(i);

//  })
//  previous.addEventListener('click',async()=>{

//      i = i-1;

//  })
//  let state = "pause";
function playmusic(track) {
  console.log(track);

  currentSong.src = track;
  currentSong.play();
  plays.src = "pausebutton.svg";
  state = "play";
}

const toggle = () => {
  if (state == "play") {
    currentSong.pause();
    state = "pause";
    plays.src = "playbutton.svg";
  } else if (state == "pause") {
    currentSong.play();
    state = "play";
    plays.src = "pausebutton.svg";
  }
};
plays.addEventListener("click", () => {
  toggle();
});
async function main() {
  let songs = await getSongs();
  for (const song of songs) {
    // list.innerHTML = list.innerHTML + `<li><a>${decodeURIComponent(song)}</a></li>`;
    list.innerHTML =
      list.innerHTML +
      `<li>
        <div class="info">
          <p>${decodeURIComponent(song)}</p>
          <p>Artist Name</p>
        </div>
        <div class="playbutton">
          <img src="playbutton.svg" alt="" style="height: 30px;">
          <p>Play Now</p>
        </div>
      </li>`;
  }
  let songsArray = Array.from(document.querySelectorAll(".lisf ul li"));
  

  songsArray.forEach((e, index) => {
    // let audio = new Audio(`http://127.0.0.1:5500/songs/${decodeURIComponent(e.target.getElementsByTagName("p")[0])}`)});
    // console.log(`http://127.0.0.1:5500/songs/${encodeURIComponent(e.querySelector(".info").firstElementChild.innerHTML)}`)});
    e.addEventListener("click", () => {
        
        
      playmusic(
        `http://127.0.0.1:5500/songs/${encodeURIComponent(
          e.querySelector(".info").firstElementChild.innerHTML
        )}`
      );
      i = index;
      songName.innerHTML = decodeURIComponent(songsArray[i].querySelector(".info").firstElementChild.innerHTML);
    });
  });
  
  currentSong.addEventListener("ended",async()=>{
    
    if(i< songsArray.length-1){
      playmusic(
          `http://127.0.0.1:5500/songs/${encodeURIComponent(
            songsArray[++i].querySelector(".info").firstElementChild.innerHTML
          )}`
        );
        songName.innerHTML = decodeURIComponent(songsArray[i].querySelector(".info").firstElementChild.innerHTML);
  }
  else{
      playmusic(
          `http://127.0.0.1:5500/songs/${encodeURIComponent(
            songsArray[0].querySelector(".info").firstElementChild.innerHTML
          )}`
        );
        i=0;
        songName.innerHTML = decodeURIComponent(songsArray[i].querySelector(".info").firstElementChild.innerHTML);
  }
  })
  next.addEventListener("click", async() => {
   
    if(i< songsArray.length-1){
        playmusic(
            `http://127.0.0.1:5500/songs/${encodeURIComponent(
              songsArray[++i].querySelector(".info").firstElementChild.innerHTML
            )}`
          );
          songName.innerHTML = decodeURIComponent(songsArray[i].querySelector(".info").firstElementChild.innerHTML);
    }
    else{
        playmusic(
            `http://127.0.0.1:5500/songs/${encodeURIComponent(
              songsArray[0].querySelector(".info").firstElementChild.innerHTML
            )}`
          );
          i=0;
          songName.innerHTML = decodeURIComponent(songsArray[i].querySelector(".info").firstElementChild.innerHTML);
    }
  });
  previous.addEventListener("click", async() => {
    
    if(i>0){
  
        playmusic(
            `http://127.0.0.1:5500/songs/${encodeURIComponent(
              songsArray[--i].querySelector(".info").firstElementChild.innerHTML
            )}`
          );
          songName.innerHTML = decodeURIComponent(songsArray[i].querySelector(".info").firstElementChild.innerHTML);
    }
    else{
        playmusic(
            `http://127.0.0.1:5500/songs/${encodeURIComponent(
              songsArray[songsArray.length-1].querySelector(".info").firstElementChild.innerHTML
            )}`
          );
          i=songsArray.length-1;
          songName.innerHTML = decodeURIComponent(songsArray[i].querySelector(".info").firstElementChild.innerHTML);
    }
   
    
       
  });
  
}

currentSong.addEventListener("timeupdate",()=>{
 
  document.querySelector(".currentTime").innerHTML = convertToMinutes(currentSong.currentTime) + " / ";
  document.querySelector(".duration").innerHTML = (convertToMinutes(currentSong.duration))?(convertToMinutes(currentSong.duration)): "0:00";
  let percentage = (currentSong.currentTime / currentSong.duration) * 100;
  circle.style.left = percentage + "%";
  
})
slider.addEventListener("click",(e)=>{
  let percentage = e.offsetX / e.target.clientWidth;
  currentSong.currentTime = currentSong.duration * percentage;
  
  
})
// slider.addEventListener("mouseover",()=>{
//   circle.style.display = "block";
// })
// slider.addEventListener("mouseout",()=>{
//   circle.style.display = "none";
// })

main();

/**
 * List of events for the audio element:
 * - abort: Fires when the loading of an audio/video is aborted.
 * - canplay: Fires when the browser can start playing the audio/video.
 * - canplaythrough: Fires when the browser can play through the audio/video without stopping for buffering.
 * - durationchange: Fires when the duration of the audio/video is changed.
 * - emptied: Fires when the current playlist is empty.
 * - ended: Fires when the current playlist is ended.
 * - error: Fires when an error occurred during the loading of an audio/video.
 * - loadeddata: Fires when the browser has loaded the current frame of the audio/video.
 * - loadedmetadata: Fires when the browser has loaded meta data for the audio/video.
 * - loadstart: Fires when the browser starts looking for the audio/video.
 * - pause: Fires when the audio/video has been paused.
 * - play: Fires when the audio/video has been started or is no longer paused.
 * - playing: Fires when the audio/video is playing after having been paused or stopped for buffering.
 * - progress: Fires when the browser is downloading the audio/video.
 * - ratechange: Fires when the playing speed of the audio/video is changed.
 * - seeked: Fires when the user is finished moving/skipping to a new position in the audio/video.
 * - seeking: Fires when the user starts moving/skipping to a new position in the audio/video.
 * - stalled: Fires when the browser is trying to get media data, but data is not available.
 * - suspend: Fires when the browser is intentionally not getting media data.
 * - timeupdate: Fires when the current playback position has changed.
 * - volumechange: Fires when the volume of the audio/video has changed.
 * - waiting: Fires when the video stops because it needs to buffer the next frame.
 */
