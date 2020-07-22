const logarea = document.getElementById("logs");
const clearbtn = document.getElementById("cbtn");
const Cmdinput = document.getElementById("CMDInput");
const CmdIbtn = document.getElementById("cmdbtn");
const Cmdlogarea = document.getElementById("CMDlogs");
const CmdClearbtn = document.getElementById("ccmdbtn");
const clearDLbtn = document.getElementById("clearDLbtn");
const stpbtn = document.getElementById("stpbtn");
const rstbtn = document.getElementById("rstbtn");
const socket = io();
//logs
socket.on("log", log => {
  logarea.value = log;
});
clearbtn.addEventListener("click", () => {
  socket.emit("clear", "clearTheLog");
});
//CMD
socket.on("CmdLog", log => {
  Cmdlogarea.value = log;
});
CmdIbtn.addEventListener("click", () => {
  socket.emit("command", String(Cmdinput.value));
});
CmdClearbtn.addEventListener("click", () => {
  socket.emit("cmdclear", "clearTheLog");
});
//CP
clearDLbtn.addEventListener("click", () => {
  socket.emit("DLclear", "clearTheDL");
});
stpbtn.addEventListener("click", () => {
  socket.emit("stop", "stopeserver");
});
