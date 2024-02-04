addEventListener("pageshow", () => {
    if (document.body.classList.contains('wait')){
        document.body.classList.remove('wait')
    }
});

const cursorWait = () => document.body.classList.add('wait');

const unlockButton = () => {
    document.querySelector('#image-upload-button').removeAttribute("disabled")
};
