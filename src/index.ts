// Init our express server
import express from "express";
const app = express();
const port = "3000";

app.get("/", (req, res) => {
    res.send("hellow World");
    console.log("Response sent")

})
app.get("/health", (req, res) => {
    res.send("hellow World");
    console.log("Response sent")

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);

});