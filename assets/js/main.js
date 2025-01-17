const searchMag = document.querySelector('.mag');
const searchBox = document.querySelector('#movie-search');

const movieCarouselRight = document.querySelector("#movie-carousel-right");
const movieCarouselLeft = document.querySelector("#movie-carousel-left");
const movieCarousel = document.querySelector("#movie-carousel");
let movieElement = document.querySelector(".movie-element");

const bigScreenVideo = document.querySelector("#background-video");
const bigScreenTitle = document.querySelector(".movie-big-title");
const bigScreenDescription = document.querySelector(".movie-big-description");

const imdbAPIbaseURL = "https://imdb.iamidiotareyoutoo.com/";

async function getMedia(query) {
    const response = await fetch(`${imdbAPIbaseURL}search?q=${query}`);
    return (await response.json()).description;
}

async function getMediaDetails(movieID) {
    const response = await fetch(`${imdbAPIbaseURL}/search?tt=${movieID}`);
    return await response.json();
}

async function hasMediaTrailer(movieID) {
    try {
        const response = await fetch(`${imdbAPIbaseURL}media/${movieID}`);
        return true;
    } catch {
        return false;
    }
}

function setMainMedia(mediaObj) {
    const videoSource = bigScreenVideo.querySelector("source");

    bigScreenTitle.textContent = mediaObj["short"].name;
    bigScreenDescription.textContent = mediaObj["short"].description;

    if (hasMediaTrailer(mediaObj["imdbId"])) {
        videoSource.src = `${imdbAPIbaseURL}media/${mediaObj["imdbId"]}`;
        bigScreenVideo.load();
    }
    else {
        bigScreenVideo.backgroundImage = `url(${mediaObj["short"].image})`;
    }
}

function populateMedia(movieList) {
    movieCarousel.innerHTML = "";
    for (let movie of movieList) {

        if (!movie["#IMG_POSTER"])
            continue;

        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-element");
        movieContainer.style.backgroundImage = `url(${movie["#IMG_POSTER"]})`;

        movieContainer.onclick = async function () {
            const detailedMedia = await getMediaDetails(movie["#IMDB_ID"]);
            setMainMedia(detailedMedia);    
        }

        movieContainer.innerHTML = `
        <div class="movie-element-title">
            <p class="movie-title-text">${movie["#TITLE"]} (${movie["#YEAR"]})</p>
        </div>
        `;

        movieCarousel.appendChild(movieContainer);
    }
}

searchMag.addEventListener('click', function () {
    searchMag.style.transform = "rotate(250deg)";

    searchBox.style.animation = "none";
    setTimeout(function () {
        searchBox.style.animation = "";
        searchBox.style.visibility = "visible";
        searchBox.focus();
        
        searchMag.style.opacity = "0";
        searchMag.style.visibility = "hidden";
    }, 10);
})

searchBox.addEventListener('focusout', async function() {

    searchBox.style.animation = "none";

    setTimeout(function () {
        searchBox.style.animation = "search-box-anim .5s reverse";
    }, 10);

    const bringVisibility = function () {
        searchBox.style.visibility = "hidden";

        searchMag.style.opacity = "1";
        searchMag.style.visibility = "visible";
        searchMag.style.transform = "";

        searchBox.removeEventListener('animationend', bringVisibility);
        searchBox.value = "";
    }

    searchBox.addEventListener('animationend', bringVisibility);

    if (searchBox.value !== "") {
        movieCarousel.scrollIntoView({behavior:"smooth"});
        populateMedia(await getMedia(searchBox.value));
    }
});

movieCarouselRight.addEventListener('click', function () {
    movieElement = document.querySelector(".movie-element");

    const scrollLimit = movieCarousel.scrollWidth - movieCarousel.clientWidth;
    const scrollMovement = movieElement.scrollWidth * 2;

    if (movieCarousel.scrollLeft < scrollLimit) {
        movieCarousel.scrollTo({
            left: movieCarousel.scrollLeft + scrollMovement,
            top: 0,
            behavior: "smooth"
        });
    } else {
        movieCarousel.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth"
        });
    }
});

movieCarouselLeft.addEventListener('click', function () {
    movieElement = document.querySelector(".movie-element");

    const scrollLimit = 0
    const scrollMovement = movieElement.scrollWidth * 2;

    if (movieCarousel.scrollLeft > scrollLimit) {
        movieCarousel.scrollTo({
            left: movieCarousel.scrollLeft - scrollMovement,
            top: 0,
            behavior: "smooth"
        });
    } else {
        movieCarousel.scrollTo({
            left: movieCarousel.scrollWidth,
            top: 0,
            behavior: "smooth"
        });
    }
});


window.onload = function() {

    getMedia("a")
    .then(async data => {
        populateMedia(data);

        const mediaDetails = await getMediaDetails(data[0]["#IMDB_ID"]);
        setMainMedia(mediaDetails);
    });
}

