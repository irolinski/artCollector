"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const dbUrl = process.env.DB_URL;
const serverFunction = app_1.default.listen(process.env.PORT || 3000, () => {
});
mongoose_1.default
    .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
})
    .catch((err) => {
    console.log("oh no!");
    console.log(err);
});
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
});
module.exports = serverFunction;
//# sourceMappingURL=server.js.map