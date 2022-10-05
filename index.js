var express = require("express");
var cors = require("cors");
var busboy = require("connect-busboy"); //middleware for form/file upload

require("dotenv").config();

var app = express();

app.use(cors());
app.use(busboy());

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", (req, res) => {
  req.pipe(req.busboy);
  req.busboy.on("file", (name, file, info) => {
    const { filename, mimeType } = info;
    let size = 0;
    file
      .on("data", (data) => {
        size = data.length;
      })
      .on("close", () => {
        return res.json({ name: filename, type: mimeType, size: size });
      });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
