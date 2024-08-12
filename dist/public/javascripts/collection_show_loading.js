"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const showLoading = () => {
    document.querySelector("main").style.display = "none";
    document.querySelector("#loading-div").style.display = "block";
    document.querySelector("#collection-page-header").style.display = "none";
    document.querySelector(".page-brand").style.display = "none";
};
//# sourceMappingURL=collection_show_loading.js.map