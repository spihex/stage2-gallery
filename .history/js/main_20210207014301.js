// ALBUM LOAD & NAVIGATE
let albumItemsContainer = document.querySelector('.gallery__items');
let galleryTitle = document.querySelector('.gallery__title');

let album;
let currentAlbumID = 1;
let albumStartLoadingOffset = 10;
let galleryItemsToLoad = 10;

let albumButtonLoadMore = document.querySelector('.button__load-more');
let albumButtonNext = document.querySelector('.button__next');
let albumButtonPrev = document.querySelector('.button__prev');

document.addEventListener("DOMContentLoaded", function () {
    getPhotosByAlbumID(currentAlbumID);

    // getAlbumTitleByID(2)
});


albumButtonLoadMore.addEventListener("click", function (e) {
    e.preventDefault();
    addAlbumItemToGallery(album, albumStartLoadingOffset, galleryItemsToLoad);
    albumStartLoadingOffset *= 2;
});

albumButtonNext.addEventListener("click", function (e) {
    e.preventDefault();

    currentAlbumID++;

    getPhotosByAlbumID(currentAlbumID);
});

albumButtonPrev.addEventListener("click", function (e) {
    e.preventDefault();
    if ((currentAlbumID - 1) < 1) {
        return;
    } else {
        currentAlbumID--;
    }
    getPhotosByAlbumID(currentAlbumID);
});


function getPhotosByAlbumID(ID) {
    fetch('https://jsonplaceholder.typicode.com/photos?albumId=' + ID)
        .then(response => response.json())
        .then(albumJSON => {
            if (albumJSON.length > 0) {
                album = albumJSON;
                albumItemsContainer.innerHTML = '';
                albumStartLoadingOffset = 10;
                // console.log(getAlbumTitleByID(2));
                // albumTitle = getAlbumTitleByID(ID);
                // console.log(albumTitle);
                // setGalleryTitle("Заголовок альбома: " + albumTitle);
                // addAlbumItemToGallery(album, 0, galleryItemsToLoad);
            }
        })
}

function addAlbumItemToGallery(album, startAtPos, endAtPos) {

    for (let i = startAtPos; i < startAtPos + endAtPos; i++) {
        if (album[i]) {
            let HTMLtemplate = `
        <div class="gallery__item"> 
            <span>${album[i].id}</span>
            <img class="gallery__item-image" data-full-size="${album[i].url}" src="${album[i].thumbnailUrl}" >
        </div>
         `;
            albumItemsContainer.innerHTML += HTMLtemplate;
        }
    }
}

function getAlbumTitleByID(albumID) {
    fetch('https://jsonplaceholder.typicode.com/albums?id=' + albumID)
        .then(response => response.json())
        .then(album => {

        })
}
function setGalleryTitle(titleString) {
    galleryTitle.innerHTML = titleString;
}

// ALBUM LIGHTBOX
let lightbox = document.createElement('div');
lightbox.id = 'lightbox';
document.body.appendChild(lightbox);

lightbox.addEventListener('click', e => {
    lightbox.classList.remove('active')
})

albumItemsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('gallery__item-image')) {
        lightbox.classList.add('active')
        const img = document.createElement('img')
        img.src = e.target.getAttribute('data-full-size');
        while (lightbox.firstChild) {
            lightbox.removeChild(lightbox.firstChild)
        }
        lightbox.appendChild(img)
    }
});

document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (key === "Escape") {
        lightbox.classList.remove('active');
    }
});

document.onkeypress = function (e) {
    e = e || window.event;
    let isEscape = false;
    if ("key" in e) {
        isEscape = (e.key === "Escape" || e.key === "Esc");
    } else {
        isEscape = (e.keyCode === 27);
    }
    if (isEscape) {
        lightbox.classList.remove('active');
    }
};
