let musics = [
    {
        name: "Blue Skies",
        artist: "Silent Partner",
        image: "./pochettes/340/1.jpg",
        path: "./media/Blue_Skies.mp3",
    },
    {
        name: "Cartoon Hoedown",
        artist: "Media Right Productions",
        image: "./pochettes/340/2.jpg",
        path: "./media/Cartoon_Hoedown.mp3",
    },
    {
        name: "Earthy Crust",
        artist: "Jingle Punks",
        image: "./pochettes/340/3.jpg",
        path: "./media/Earthy_Crust.mp3",
    },
    {
        name: "Hold On a Minute",
        artist: "Silent Partner",
        image: "./pochettes/340/4.jpg",
        path: "./media/Hold_On_a_Minute.mp3",
    },
    {
        name: "John Dunbar Theme",
        artist: "City of Prague Philharmonic",
        image: "./pochettes/340/5.jpg",
        path: "./media/JohnDunbarTheme.mp3",
    },
    {
        name: "Stay with You",
        artist: "Silent Partner",
        image: "./pochettes/340/6.jpg",
        path: "./media/Stay_With_You.mp3",
    },
    {
        name: "Symphony No. 5",
        artist: "Beethoven",
        image: "./pochettes/340/7.jpg",
        path: "./media/Symphony_No_5_by_Beethoven.mp3",
    },
];

const btnPlay = document.querySelector(".play__control__play");
const btnBack = document.querySelector(".play__control__back");
const btnNext = document.querySelector(".play__control__next");
const btnVolumeMinus = document.querySelector(".play__volume__minus");
const btnVolumePlus = document.querySelector(".play__volume__plus");
const barVolume = document.querySelector(".play__volume__range");
const imgCover = document.querySelector(".play__playing__cover >img");
const textArtist = document.querySelector(".play__playing__infos__artist");
const textTitle = document.querySelector(".play__playing__infos__title");
const textDurationCurrent = document.querySelector(
    ".play__playing__infos__duration__current"
);
const textDurationTotal = document.querySelector(
    ".play__playing__infos__duration__total"
);
const barPlay = document.querySelector(".play__playing__infos__bar");

let musicIndex = 0;
let playing = false;
let music = new Audio(musics[musicIndex].path);
music.load();

displayMusics(musics);

function displayMusics(musicsTable) {
    let template = document.querySelector("#music");
    var musicsList = document.querySelector(".library__music-list");
    for (const musicTable of musicsTable) {
        let clone = document.importNode(template.content, true);
        clone.querySelector(".music__infos__title").textContent =
            musicTable["name"];
        clone.querySelector(".music__infos__artist").textContent =
            musicTable["artist"];
        clone.querySelector(".music__cover").src = musicTable["image"];
        let btn = clone.querySelector(".music__play");
        btn.dataset.index = musicsTable.indexOf(musicTable);
        musicsList.appendChild(clone);

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            music.src = musics[e.target.parentNode.dataset.index].path;
            musicIndex = e.target.parentNode.dataset.index;
            music.load();
            // Sinon lancement de la musiqu
            music.play();
            playing = true;
        });
    }
}

music.addEventListener("loadeddata", () => {
    displayPlayingMusic(musicIndex);
});

function displayPlayingMusic(index) {
    console.log(music);
    let nextMusic = musics[index];
    console.log(nextMusic);
    textArtist.textContent = nextMusic["artist"];
    textTitle.textContent = nextMusic["name"];
    imgCover.src = nextMusic["image"];
    textDurationCurrent.textContent = "0";
    textDurationTotal.textContent = convertSecondToMinute(
        Math.round(music.duration)
    );
    music.currentTime = "0";
    if (playing) {
        music.play();
        btnPlay.children[0].classList.remove("fa-play");
        btnPlay.children[0].classList.add("fa-pause");
    }
}

btnPlay.addEventListener("click", (e) => {
    e.preventDefault();
    // Si déjà en cours de play => pause
    if (playing) {
        music.pause();
        playing = false;
        btnPlay.children[0].classList.remove("fa-pause");
        btnPlay.children[0].classList.add("fa-play");
    }
    // Sinon lancement de la musique
    else {
        music.play();
        playing = true;
        btnPlay.children[0].classList.remove("fa-play");
        btnPlay.children[0].classList.add("fa-pause");
    }
});

barPlay.addEventListener("change", (e) => {
    music.currentTime = (e.target.value / 100) * music.duration;
});

barVolume.addEventListener("change", (e) => {
    music.volume = e.target.value;
});

btnNext.addEventListener("click", (e) => {
    e.preventDefault();
    newMusicIndex = musicIndex + 1;
    if (newMusicIndex == musics.length) {
        musicIndex = 0;
    } else {
        musicIndex += 1;
    }
    music.src = musics[musicIndex].path;
    music.load();
});

btnBack.addEventListener("click", (e) => {
    e.preventDefault();
    newMusicIndex = musicIndex - 1;
    if (newMusicIndex < 0) {
        musicIndex = musics.length - 1;
    } else {
        musicIndex -= 1;
    }
    music.src = musics[musicIndex].path;
    music.load();
});

btnVolumePlus.addEventListener("click", (e) => {
    e.preventDefault();
    newVolume = music.volume + 0.1;
    if (newVolume > 1) {
        music.volume = 1;
        barVolume.value = 1;
    } else {
        music.volume = newVolume;
        barVolume.value = newVolume;
    }
});

btnVolumeMinus.addEventListener("click", (e) => {
    e.preventDefault();
    newVolume = music.volume - 0.1;
    if (newVolume < 0) {
        music.volume = 0;
        barVolume.value = 0;
    } else {
        music.volume = newVolume;
        barVolume.value = newVolume;
    }
});

music.addEventListener("timeupdate", (e) => {
    barPlay.value =
        (Math.round(music.currentTime) / Math.round(music.duration)) * 100;

    textDurationCurrent.textContent = convertSecondToMinute(
        Math.round(music.currentTime)
    );
    if (barPlay.value == Math.round(music.duration)) {
        musicIndex += 1;
        music.src = musics[musicIndex].path;
        music.load();
    }
});

function convertSecondToMinute(time) {
    const totalSeconds = time;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
    return result;
}
function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
}
