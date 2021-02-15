class Gallery {

    constructor(options) {

        this.itemsContainer = document.querySelector(options.container + ' .gallery__items');
        this.galleryTitle = document.querySelector(options.container + ' .gallery__title');
        this.buttonLoadMore = document.querySelector(options.container + ' .button__load-more');
        this.buttonPrev = document.querySelector(options.container + ' .button__prev');
        this.buttonNext = document.querySelector(options.container + ' .button__next');

        this.photos;

        this.currentAlbumID = options.id ? options.id : 1;

        this.photosStartLoadingOffset = 10;
        this.galleryItemsToLoad = 10;

        this.buttonPrev.addEventListener('click', this.prev.bind(this));
        this.buttonNext.addEventListener('click', this.next.bind(this));
        this.buttonLoadMore.addEventListener('click', this.loadMore.bind(this));

        this.init();

    }

    init() {
        this.getPhotosByAlbumID(this.currentAlbumID);
    }

    changeGalleryTitleByAlbumID(str, albumID) {
        fetch('https://jsonplaceholder.typicode.com/albums?id=' + albumID)
            .then(response => response.json())
            .then(album => {
                this.galleryTitle.innerHTML = str + album[0].title;
            })
    }

    addAlbumItemToGallery(photos, startAtPos, endAtPos) {
        for (let i = startAtPos; i < startAtPos + endAtPos; i++) {
            if (photos[i]) {
                let HTMLtemplate = `
            <div class="gallery__item"> 
                <span>${photos[i].id}</span>
                <img class="gallery__item-image" data-full-size="${photos[i].url}" src="${photos[i].thumbnailUrl}" >
            </div>
             `;
                this.itemsContainer.innerHTML += HTMLtemplate;
            }
        }
    }

    getPhotosByAlbumID(ID) {
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

                    this.photos = albumJSON;
                    this.itemsContainer.innerHTML = '';
                    this.photosStartLoadingOffset = 10;

                    this.changeGalleryTitleByAlbumID(`Заголовок альбома №${ID}: `, ID);
                    this.addAlbumItemToGallery(this.photos, 0, this.galleryItemsToLoad);

                } else {
                    this.currentAlbumID = 1;
                    throw new Error('Альбом не найден');
                }

            })
            .catch((error) => {
                alert(error);
            });
    }


    loadMore() {
        this.addAlbumItemToGallery(this.photos, this.photosStartLoadingOffset, this.galleryItemsToLoad);
        this.photosStartLoadingOffset *= 2;
    }

    prev() {
        this.getPhotosByAlbumID(--this.currentAlbumID);
    }

    next() {

        this.getPhotosByAlbumID(++this.currentAlbumID);
    }

}

// ALBUM LIGHTBOX


let lightbox = document.createElement('div');
lightbox.classList.add('lightbox');

document.body.appendChild(lightbox);
lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active')
})

let allGalleriesItems = document.querySelectorAll('.gallery__items');

allGalleriesItems.forEach(item => {

    item.addEventListener('click', e => {
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
});


document.addEventListener("keydown", function(event) {
    let key = event.key;
    if (key === "Escape") {
        lightbox.classList.remove('active');
    }
});