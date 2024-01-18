check_imgOrientation = function () {

    const images = document.querySelectorAll('img');

    for (let i = 0; i < images.length; i++) {
        if (images[i].width > images[i].height) {
            images[i].parentElement.classList.add('landscape')
        } else {
            images[i].parentElement.classList.add('portrait')
        }
    }
};



const carousel = document.querySelector('#carousel');


transform_imgOrientation = function () {
    let activeItem = document.querySelector('.carousel-item.active');


    check_imgOrientation();

    activeItem.classList.add('first-img');
    document.querySelector('.carousel-inner').lastElementChild.classList.add('last-img')

    if (activeItem.classList.contains('landscape')) {
        carousel.classList.add('drop');
    } else {
        carousel.classList.remove('drop')
    }
}


let btn_check_landscape_next = () => {

    const firstImg = document.querySelector('.first-img');
    let activeItem = document.querySelector('.carousel-item.active');

    if (activeItem.nextElementSibling !== null) {

        if (activeItem.nextElementSibling.classList.contains('landscape')) {
            carousel.classList.add('drop');
        } else {
            carousel.classList.remove('drop');
        }
    } else {
        if (firstImg.classList.contains('landscape')) {
            carousel.classList.add('drop')
        } else {
            carousel.classList.remove('drop');
        }
    }


};

let btn_check_landscape_prev = () => {

    const lastImg = document.querySelector('.last-img');
    let activeItem = document.querySelector('.carousel-item.active');

    if (activeItem.previousElementSibling !== null) {

        if (activeItem.previousElementSibling.classList.contains('landscape')) {
            carousel.classList.add('drop');
        } else {
            carousel.classList.remove('drop');
        }
    } else {
        if (lastImg.classList.contains('landscape')) {
            carousel.classList.add('drop');
        } else {
            carousel.classList.remove('drop');
        }
    }


};




