import mongoose, { ConnectOptions } from "mongoose";
import app from "./app";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const dbUrl = process.env.DB_URL;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    // console.log("db connection open!");
  })
  .catch((err: Error) => {
    console.log("oh no!");
    console.log(err);
  });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  // console.log("database connected");
});

let port = process.env.PORT || 3000;
if (process.env.NODE_ENV === "test") {
  port = 0;
}

const serverFunction = app.listen(port, () => {
  console.log(`Running on port ${port}!`);
});

export default serverFunction;
