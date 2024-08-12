"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function userCheckUndefined(req) {
    if (!("user" in req)) {
        throw new Error("Request object without user found unexpectedly");
    }
}
exports.default = userCheckUndefined;
//# sourceMappingURL=userCheckUndefined.js.map