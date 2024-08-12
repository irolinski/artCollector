"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toggleCollapse = (inputClass) => {
    for (el of document.querySelectorAll(inputClass)) {
        if (!el.classList.contains("show")) {
            el.classList.add("show");
        }
        else {
            el.classList.remove("show");
        }
    }
};
//# sourceMappingURL=toggleCollapse.js.map