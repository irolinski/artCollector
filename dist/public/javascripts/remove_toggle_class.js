"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
toggleClass = function (className, id1, id2, id3, id4) {
    for (let i = 1; i < arguments.length; i++) {
        let id = arguments[i];
        let el = document.getElementById(id);
        if (el.classList.contains(className)) {
            el.classList.remove(className);
        }
        else {
            el.classList.add(className);
        }
    }
};
removeClass = function (className, id) {
    for (let i = 1; i < arguments.length; i++) {
        let id = arguments[i];
        let el = document.getElementById(id);
        if (el.classList.contains(className)) {
            el.classList.remove(className);
        }
    }
};
//# sourceMappingURL=remove_toggle_class.js.map