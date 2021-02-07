// ALBUM LOAD & NAVIGATE
let galleryItemsContainer = document.querySelector('.gallery__items');
let galleryTitle = document.querySelector('.gallery__title');

let photos;
let currentAlbumID = 99;
let albumStartLoadingOffset = 10;
let galleryItemsToLoad = 10;

let albumButtonLoadMore = document.querySelector('.button__load-more');
let albumButtonNext = document.querySelector('.button__next');
let albumButtonPrev = document.querySelector('.button__prev');

document.addEventListener("DOMContentLoaded", function () {
    getPhotosByAlbumID(currentAlbumID);

});


albumButtonLoadMore.addEventListener("click", function (e) {
    e.preventDefault();
    addAlbumItemToGallery(photos, albumStartLoadingOffset, galleryItemsToLoad);
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
        .then(response => {

            if (response.ok) {
                return response.json();
            } else {
                throw new Error('С запросом что-то не так');
            }

        })
        .then(albumJSON => {

            if (albumJSON.length > 0) {
                photos = albumJSON;
                galleryItemsContainer.innerHTML = '';
                albumStartLoadingOffset = 10;

                changeGalleryTitleByAlbumID(`Заголовок альбома №${ID}: `, ID);
                addAlbumItemToGallery(photos, 0, galleryItemsToLoad);
            } else {
                throw new Error('Альбом не найден');
            }

        }).catch((error) => {
            alert(error);
        });
}

function addAlbumItemToGallery(photos, startAtPos, endAtPos) {

    for (let i = startAtPos; i < startAtPos + endAtPos; i++) {
        if (photos[i]) {
            let HTMLtemplate = `
        <div class="gallery__item"> 
            <span>${photos[i].id}</span>
            <img class="gallery__item-image" data-full-size="${photos[i].url}" src="${photos[i].thumbnailUrl}" >
        </div>
         `;
            galleryItemsContainer.innerHTML += HTMLtemplate;
        }
    }
}

function changeGalleryTitleByAlbumID(str, albumID) {
    fetch('https://jsonplaceholder.typicode.com/albums?id=' + albumID)
        .then(response => response.json())
        .then(album => {
            galleryTitle.innerHTML = str + album[0].title;
        })
}



// ALBUM LIGHTBOX
let lightbox = document.createElement('div');
lightbox.classList.add('lightbox');

document.body.appendChild(lightbox);
lightbox.addEventListener('click', e => {
    lightbox.classList.remove('active')
})

galleryItemsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('gallery__item-image')) {
        lightbox.classList.add('active')
        let img = document.createElement('img')
        img.src = e.target.getAttribute('data-full-size');
        while (lightbox.firstChild) {
            lightbox.removeChild(lightbox.firstChild)
        }
        lightbox.appendChild(img)
    }
});

document.addEventListener("keydown", function (event) {
    let key = event.key;
    if (key === "Escape") {
        lightbox.classList.remove('active');
    }
});
