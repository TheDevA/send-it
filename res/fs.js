const socket = io();
const fst = document.getElementById("fst");
const zipbtn = document.getElementById("zipbtn");
const refrash = document.getElementById("refrash");
const checkAll = document.getElementById("checkAll");
const lod = document.getElementById("lod");
const DownloadBtn = document.getElementById("DownloadBtn");
function newfile(Iid, Ahref) {
  // initlazing
  let tre = document.createElement("tr");
  let the = document.createElement("th");
  the.scope = "row";
  let Tinput = document.createElement("input");
  Tinput.type = "checkbox";
  Tinput.id = Iid;
  let tde = document.createElement("td");
  let Tlink = document.createElement("a");
  Tlink.className = "text-info";
  if (!String(Iid).endsWith(".mp3")) {
    Tlink.href = "fs/files/pl/" + Iid;
  } else {
    Tlink.href = Ahref;
    Tlink.download = Iid;
  }
  Tlink.innerText = Iid;
  // Asmbling
  the.appendChild(Tinput);
  tde.appendChild(Tlink);
  tre.appendChild(the);
  tre.appendChild(tde);
  return tre;
}
document.onreadystatechange = function() {
  if (document.readyState === "interactive") {
    socket.emit("ready", "ready");
  }
};
refrash.addEventListener("click", () => {
  socket.emit("ready", "ready");
});
socket.on("filedata", filedata => {
  fst.innerHTML = "";
  filedata.forEach(filed => {
    if (filed.id == "zips") {
      return;
    }
    fst.appendChild(newfile(filed.id, filed.href));
  });
});
socket.on("DownloadReady", httpLink => {
  DownloadBtn.href = "fs/files/zips/" + httpLink;
  DownloadBtn.download = httpLink;
  lod.hidden = true;
  DownloadBtn.classList.remove("disabled");
});
zipbtn.addEventListener("click", () => {
  DownloadBtn.classList.add("disabled");
  if (zipbtn.classList.contains("disabled")) return;
  let selectedFiles = [];
  let fstc = fst.children;
  if (fstc.length < 1) return;
  for (let i = 0; i < fstc.length; i++) {
    const Icheckbox = fstc[i].children[0].children[0];
    const IcheckboxCh = Icheckbox.checked;
    if (IcheckboxCh == true) {
      if (String(Icheckbox.id).endsWith(".mp3"))
        selectedFiles.push(Icheckbox.id);
    }
  }
  socket.emit("sf", selectedFiles);
});
setInterval(() => {
  let selectedFiles = [];
  let fstc = fst.children;
  for (let i = 0; i < fstc.length; i++) {
    const Icheckbox = fstc[i].children[0].children[0];
    const IcheckboxCh = Icheckbox.checked;
    if (checkAll.checked == true) {
      Icheckbox.checked = true;
    }
    if (IcheckboxCh == true) {
      selectedFiles.push(Icheckbox.id);
    }
  }
  if (selectedFiles.length >= 1) {
    zipbtn.classList.remove("disabled");
    zipbtn.style = "cursor: pointer;";
  } else {
    zipbtn.classList.add("disabled");
    zipbtn.style = "cursor: not-allowed;";
  }
}, 100);
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
