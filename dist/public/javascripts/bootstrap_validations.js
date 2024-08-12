"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
addEventListener("pageshow", () => {
    if (document.body.classList.contains("wait")) {
        document.body.classList.remove("wait");
    }
});
const cursorWait = () => document.body.classList.add("wait");
(function () {
    let forms = document.querySelectorAll(".needs-validation");
    let prevButtonNewForm = document.getElementById("new-prev-button");
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener("submit", function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                if (prevButtonNewForm) {
                    prevButtonNewForm.click();
                }
            }
            else {
                cursorWait();
            }
            form.classList.add("was-validated");
        }, false);
    });
})();
//# sourceMappingURL=bootstrap_validations.js.map