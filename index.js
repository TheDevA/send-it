const express = require("express");
const app = express();
const http = require("http").createServer(app);
const fs = require("fs");
const socket = require("socket.io");
const port = 3000;
const cmd = require("node-cmd");
const archiver = require("archiver");
const rimraf = require("rimraf");
const { v4: uuidv4 } = require("uuid");
let plname;
// mane app
app.use(express.static(__dirname + "/res"));
app.use("/fs/files", express.static(__dirname + "/app/downloads"));
app.use("/fs/files/zips", express.static(__dirname + "/app/downloads/zips"));
app.use("/fs/files/pl/", express.static(__dirname + "/res"));
app.get("/", (req, res) => res.sendFile(__dirname + "/res/home.html"));

app.get("/cpanel", (req, res) => {
  res.sendFile(__dirname + "/res/cpanel.html");
});
app.get("/fs", (req, res) => {
  res.sendFile(__dirname + "/res/fs.html");
});
app.get("/fs/files/pl/:plname", (req, res) => {
  res.sendFile(__dirname + "/res/fsPl.html");
  plname = req.params.plname;
});
app.get("/About", (req, res) => {
  res.sendFile(__dirname + "/res/about.html");
});
http.listen(port, () => console.log(`Example app listening on port ${port}!`));
// init
function initS() {
  if (fs.existsSync("app/done.txt")) fs.unlinkSync("app/done.txt");
  const files = fs.readdirSync(__dirname + "/app/downloads", "utf8");
  const Zfiles = fs.readdirSync(__dirname + "/app/downloads/zips", "utf8");
  if (Zfiles.length > 1) initS2(Zfiles);
  if (files.length < 2) return;
  let date = new Date();
  let fileNameTime = `zip_${date.getDate()}-${parseInt(
    date.getMonth() + 1
  )}-${date.getFullYear()}-${parseInt(
    date.getHours() - 1
  )}_${date.getMinutes()}`;
  let output = fs.createWriteStream(
    __dirname + `/app/downloads/zips/archive/${fileNameTime}.zip`
  );
  let archive = archiver("zip", {
    zlib: { level: 9 } // Sets the compression level.
  });
  archive.pipe(output);
  files.forEach(file => {
    if (file == "zips") return;
    if (String(file).endsWith(".mp3")) {
      archive.file("app/downloads/" + file, { name: file });
    } else archive.directory("app/downloads/" + file + "/", String(file));
  });
  archive.finalize();
  output.on("close", () => {
    files.forEach(file => {
      if (file == "zips") return;
      if (String(file).endsWith(".mp3")) {
        fs.unlinkSync("app/downloads/" + file);
      } else rimraf.sync("app/downloads/" + file);
    });
  });
}
function initS2(Zfiles) {
  Zfiles.forEach(file => {
    if (file == "archive") return;
    fs.unlink("app/downloads/zips/" + file, err => {
      if (err) console.log(err);
    });
  });
}
initS();
// init END
/*
Sockets
*/
let io = socket(http);
io.on("connection", socket => {
  console.log(`${socket.id} has connected`);
  // Home Page Socket
  setInterval(() => {
    const logs = fs.readFileSync("app/log.txt");
    io.emit("log", String(logs));
  }, 1000);
  socket.on("urls", urls => {
    let date = new Date();
    let urlsArry = String(urls).split(",");
    fs.writeFileSync("app/U.txt", "");
    for (let i = 0; i < urlsArry.length; i++) {
      const url = urlsArry[i];
      fs.appendFileSync("app/U.txt", String(url).trim() + "\r\n", "UTF-8");
    }
    cmd.get(
      "app\\youtube-dl -a app\\U.txt -f mp3/bestaudio",
      (err, data, stdt) => {
        fs.appendFileSync(
          "app/log.txt",
          "\r\n" +
            "|" +
            parseInt(date.getHours() - 1) +
            ":" +
            date.getMinutes() +
            ":" +
            date.getSeconds() +
            "| " +
            String(data).trim() +
            "\r\n" +
            "|Error|" +
            "\r\n" +
            String(err) +
            "\r\n" +
            "|Extra|" +
            "\r\n" +
            String(stdt) +
            "\r\n",
          "UTF-8"
        );
        io.emit("gotofs", "gtfs");
      }
    );
  });
  socket.on("Purls", Purls => {
    let date = new Date();
    cmd.get(
      `app\\youtube-dl -o "C:/Users/user/Desktop/DONTOPEN/web/node/send it/app/downloads/%(playlist_title)s/%(title)s-%(id)s.%(ext)s" ${String(
        Purls
      )}`,
      (err, data, stdt) => {
        fs.appendFileSync(
          "app/log.txt",
          "\r\n" +
            "|" +
            parseInt(date.getHours() - 1) +
            ":" +
            date.getMinutes() +
            ":" +
            date.getSeconds() +
            "| " +
            String(data).trim() +
            "\r\n" +
            "|Error|" +
            "\r\n" +
            String(err) +
            "\r\n" +
            "|Extra|" +
            "\r\n" +
            String(stdt) +
            "\r\n",
          "UTF-8"
        );
        io.emit("gotofs", "gtfs");
      }
    );
  });
  socket.on("clear", clear => {
    fs.writeFileSync("app/log.txt", "");
  });
  // Cpanel Sockets
  socket.on("command", command => {
    if (command == "") {
      return;
    }
    cmd.get(String(command), (err, data, sdata) => {
      let date = new Date();
      fs.appendFileSync(
        "app/CmdLog.txt",
        "\r\n" +
          "$" +
          parseInt(date.getHours() - 1) +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds() +
          "$ " +
          "|Output| " +
          "\r\n" +
          String(data).replace(/\uFFFD/g, "") +
          "\r\n" +
          "|Error| " +
          "\r\n" +
          String(err).replace(/\uFFFD/g, "") +
          "\r\n" +
          "|Extra| " +
          "\r\n" +
          String(sdata).replace(/\uFFFD/g, "") +
          "\r\n",
        "utf-8"
      );
    });
  });
  socket.on("cmdclear", c => {
    fs.writeFileSync("app/CmdLog.txt", "");
  });
  socket.on("DLclear", clearTheDL => {
    if (fs.existsSync("app/done.txt")) fs.unlinkSync("app/done.txt");
  });
  socket.on("stop", ss => {
    process.exit(0);
  });
  setInterval(() => {
    const logs = fs.readFileSync("app/CmdLog.txt");
    io.emit("CmdLog", String(logs));
  }, 1000);
  // File System
  socket.on("ready", ready => {
    let filedata = [];
    fs.readdir("app/downloads", (err, files) => {
      if (err) return console.log(err);
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        filedata.push({
          id: String(element),
          href: "fs/files/" + String(element)
        });
      }
      io.emit("filedata", filedata);
    });
  });
  socket.on("sf", selectedFiles => {
    if (selectedFiles.length < 1) return;
    let date = new Date();
    let v4 = uuidv4();
    let fileNameTime = `${parseInt(
      date.getHours() - 1
    )}-${date.getMinutes()}_${date.getSeconds()}_${date.getMilliseconds()}`;
    const httpfilename = `${v4}_${fileNameTime}.zip`;
    let output = fs.createWriteStream(
      __dirname + `/app/downloads/zips/${v4}_${fileNameTime}.zip`
    );
    let archive = archiver("zip", {
      zlib: { level: 9 } // Sets the compression level.
    });
    archive.pipe(output);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      archive.file("app/downloads/" + file, { name: file });
    }
    archive.finalize();
    io.emit("DownloadReady", httpfilename);
  });

  // File SYStem PL pt

  socket.on("Plready", ready => {
    let filedata = [];
    fs.readdir("app/downloads/" + plname, (err, files) => {
      if (err) return console.log(err);
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        filedata.push({
          id: String(element),
          href: "/fs/files/" + plname + "/" + String(element)
        });
      }
      io.emit("plfiledata", filedata);
    });
  });
  socket.on("Plsf", selectedFiles => {
    if (selectedFiles.length < 1) return;
    let date = new Date();
    let v4 = uuidv4();
    let fileNameTime = `${parseInt(
      date.getHours() - 1
    )}-${date.getMinutes()}_${date.getSeconds()}_${date.getMilliseconds()}`;
    const httpfilename = `${v4}_${fileNameTime}.zip`;
    let output = fs.createWriteStream(
      __dirname + `/app/downloads/zips/${v4}_${fileNameTime}.zip`
    );
    let archive = archiver("zip", {
      zlib: { level: 9 } // Sets the compression level.
    });
    archive.pipe(output);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      archive.file("app/downloads/" + plname + "/" + file, { name: file });
    }
    archive.finalize();
    io.emit("PlDownloadReady", httpfilename);
  });
});
