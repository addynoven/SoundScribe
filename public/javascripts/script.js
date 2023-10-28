let music_Container = document.querySelector(".music-container");
let progressContainer = document.querySelector(".progress-container");
let lyrics_area = document.querySelector(".lyrics-area h1");
let title = document.querySelector("#title");
let audio = document.getElementById("audio");
let curr_Time = document.getElementById("digits");
let playbtn = document.getElementById("play");
let prevbtn = document.getElementById("prev");
let nextbtn = document.getElementById("next");

var lyrics = null;
let ending = null;
listSongs = arr;
console.log(listSongs);
// console.log(listSongs);
let curr_song = listSongs.indexOf(song_names);
load_Songs(listSongs[curr_song]);
function load_Songs(song) {
    title.innerHTML = song;
    audio.src = `/audio/${song}.mp3`;
}

playbtn.addEventListener("click", () => {
    const playing = music_Container.classList.contains("play");
    if (playing) {
        pause();
    } else {
        play();
    }
});

function play() {
    playbtn.innerHTML = `<img src="/images/pause.png" alt="">`;
    music_Container.classList.add("play");
    audio.play();
}

function pause() {
    playbtn.innerHTML = `<img src="/images/play-button-arrowhead.png" alt="">`;
    audio.pause();
    music_Container.classList.remove("play");
}

prevbtn.addEventListener("click", () => {
    prevSong();
});

let segments_id = 0;

function sec_min(total_sec) {
    return `${Math.floor(total_sec / 60)}:${Math.floor(total_sec % 60)}`;
}
function progression_bar(duration, currentTime) {
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = "" + progressPercent + "%";
}

function running_timer(duration, currentTime) {
    curr_Time.innerHTML = `${sec_min(currentTime)}/${sec_min(duration)}`;
}

function updatelyrics(segments_id) {
    lyrics_area.innerHTML = lyrics.segments[segments_id].text;
    // console.log(lyrics.segments[segments_id].text);
}

// updatelyrics(segments_id);

function progression(e) {
    const { duration, currentTime } = e.srcElement;
    progression_bar(duration, currentTime);
    running_timer(duration, currentTime);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

nextbtn.addEventListener("click", () => {
    nextSong();
});

function prevSong() {
    segments_id = 0;
    curr_song--;
    if (curr_song >= 0) {
        load_Songs(listSongs[curr_song]);
    } else {
        curr_song = listSongs.length - 1;
        load_Songs(listSongs[curr_song]);
    }
    play();
}

function nextSong() {
    segments_id = 0;
    curr_song++;
    if (curr_song < listSongs.length) {
        load_Songs(listSongs[curr_song]);
    } else {
        curr_song = 0;
        load_Songs(listSongs[curr_song]);
    }
    play();
}

audio.addEventListener("timeupdate", progression);
progressContainer.addEventListener("click", setProgress);
audio.addEventListener("ended", nextSong);

org_name = listSongs[curr_song].replace(/^\d+_/g, "");

function set_end(seg_id) {
    if (seg_id >= 0 && seg_id < lyrics.segments.length) {
        ending = lyrics.segments[segments_id].end;
    }
    return ending;
}

fetch(`http://localhost:3000/get_lyrics/${org_name}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        if ("done" == data.stat) {
            lyrics = data.ans.lyrics;
            // console.log(lyrics);
            updatelyrics(segments_id);
            audio.addEventListener("timeupdate", function (e) {
                const { duration, currentTime } = e.srcElement;
                console.log(segments_id);
                ending = set_end(segments_id);
                if (ending < currentTime) {
                    if (
                        segments_id >= 0 &&
                        segments_id < lyrics.segments.length - 1
                    ) {
                        segments_id++;
                        updatelyrics(segments_id);
                    }
                }
            });
        }
        progressContainer.addEventListener("click", function () {
            let ending = set_end(segments_id);
            if (ending < audio.currentTime) {
                while (ending < audio.currentTime) {
                    if (
                        segments_id >= 0 &&
                        segments_id < lyrics.segments.length - 1
                    ) {
                        segments_id++;
                    } else {
                        break;
                    }
                    ending = set_end(segments_id);
                }
            } else {
                while (ending > audio.currentTime) {
                    if (
                        segments_id > 0 &&
                        segments_id < lyrics.segments.length
                    ) {
                        segments_id--;
                    } else {
                        break;
                    }
                    ending = set_end(segments_id);
                }
            }
            updatelyrics(segments_id);
        });
    })
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
    });

//
