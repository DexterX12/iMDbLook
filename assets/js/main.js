const searchMag = document.querySelector('.mag');
const searchBox = document.querySelector('#movie-search');

const movieCarouselRight = document.querySelector("#movie-carousel-right");
const movieCarouselLeft = document.querySelector("#movie-carousel-left");
const movieCarousel = document.querySelector("#movie-carousel");
const movieElement = document.querySelector(".movie-element");

searchMag.addEventListener('click', function () {
    searchMag.style.transform = "rotate(250deg)"

    searchBox.style.animation = "none";
    setTimeout(function () {
        searchBox.style.animation = "";
        searchBox.style.visibility = "visible";
        searchBox.focus();
        
        searchMag.style.opacity = "0";
        searchMag.style.visibility = "hidden";
    }, 10);
})

searchBox.addEventListener('focusout', function() {

    searchBox.style.animation = "none";

    setTimeout(function () {
        searchBox.style.animation = "search-box-anim .5s reverse";
    }, 10);

    if (searchBox.value !== "") {
        movieCarousel.scrollIntoView({behavior:"smooth"});
    }

    const bringVisibility = function () {
        searchBox.style.visibility = "hidden";

        searchMag.style.opacity = "1";
        searchMag.style.visibility = "visible";
        searchMag.style.transform = "";

        searchBox.removeEventListener('animationend', bringVisibility);
        searchBox.value = "";
    }

    searchBox.addEventListener('animationend', bringVisibility);
});

movieCarouselRight.addEventListener('click', function () {
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
})

movieCarouselLeft.addEventListener('click', function () {
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
})