const socket = io();
const playlestBtn = document.getElementById("playlistBtn");
const singelBtn = document.getElementById("singelBtn");
const inputPs = document.getElementById("inputPS");
const fgcoloc = document.getElementById("fgcoloc");
const addbtn = document.getElementById("addBtn");
const subbtn = document.getElementById("subBtn");
const lod = document.getElementById("lod");
const DownloadBtn = document.getElementById("DownloadBtn");
const input1 = document.getElementById("input1");
// One Video
function addChiled() {
  let newE = document.createElement("div");
  newE.className = "fgin";
  const newEI = document.createElement("input");
  newEI.type = "text";
  newEI.className = "form-control inputS";
  newEI.placeholder = "https://www.youtube.com/watch?v=..";
  newE.appendChild(newEI);
  return newE;
}
addbtn.addEventListener("click", () => {
  fgcoloc.appendChild(addChiled());
});
subbtn.addEventListener("click", () => {
  if (fgcoloc.children.length > 1) {
    if (fgcoloc.lastElementChild.firstElementChild.value == "") {
      fgcoloc.lastChild.remove();
    }
  }
});
singelBtn.addEventListener("click", () => {
  let urlsArrey = [];
  for (let index = 0; index < fgcoloc.children.length; index++) {
    const element = fgcoloc.children[index];
    const elementV = String(
      element.getElementsByTagName("input").item(0).value
    );
    if (!elementV.startsWith("https://www.youtube.com/watch?v=")) {
      alert(
        "Warning the URL have to be like this https://www.youtube.com/watch?v=.."
      );
      return;
    }
    $("#DownM").modal("toggle");

    if (elementV != "") {
      urlsArrey.push(elementV.trim());
    }
  }
  socket.emit("urls", urlsArrey);
});
// Playlist
playlestBtn.addEventListener("click", () => {
  if (inputPs.value != "") {
    if (
      !String(inputPs.value).startsWith(
        "https://www.youtube.com/playlist?list="
      )
    ) {
      alert(
        "Warning the URL have to be like this https://www.youtube.com/playlist?list=.."
      );
      return;
    }
    $("#DownM").modal("toggle");
    socket.emit("Purls", inputPs.value);
  }
});
let i = 0;
setInterval(() => {
  const lodstyle = [
    "#7400B8",
    "#6930C3",
    "#5E60CE",
    "#5390D9",
    "#4EA8DE",
    "#48BFE3",
    "#56CFE1",
    "#56CFE1",
    "#72EFDD",
    "#80FFDB"
  ];
  if (i > lodstyle.length - 1) {
    i = 0;
  }
  const color = lodstyle[i];
  lod.style = "color: " + color + ";width: 3rem; height: 3rem;";
  i++;
}, 750);
socket.on("gotofs", gtf => {
  DownloadBtn.classList.remove("disabled");
});

setInterval(() => {
  input1.value == ""
    ? (singelBtn.disabled = true)
    : (singelBtn.disabled = false);
  inputPs.value == ""
    ? (playlestBtn.disabled = true)
    : (playlestBtn.disabled = false);
}, 100);
