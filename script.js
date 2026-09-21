
const level1=document.getElementById("level1");
const level2=document.getElementById("level2");
const level3=document.getElementById("level3");
const redFlash=document.getElementById("redFlash");
const terminal=document.getElementById("terminal");
const desktop=document.getElementById("desktop");
const win=document.getElementById("window");
const light=document.getElementById("flashlight");
const canvas=document.getElementById("matrix");
const ctx=canvas.getContext("2d");

let seconds=0;
let mistakes=0;
let running=false;
let inventory=[];
let typed="";
let aiIndex=0;
let omegaSequence=[];

//================ TIMER ================

setInterval(()=>{

seconds++;

const timer=document.getElementById("timer");

if(timer){

timer.innerText=`Time: ${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;

}

},1000);

//================ SOUND ================

function beep(freq=500,duration=120){

const audio=new(window.AudioContext||window.webkitAudioContext)();

const osc=audio.createOscillator();
const gain=audio.createGain();

osc.connect(gain);
gain.connect(audio.destination);

osc.frequency.value=freq;
gain.gain.value=.05;

osc.start();
osc.stop(audio.currentTime+duration/1000);

}

//================ SHAKE ================

function shake(el){

el.classList.add("shake");

setTimeout(()=>{

el.classList.remove("shake");

},300);

}

function addMistake(){

mistakes++;

if(mistakes>=3){

document.getElementById("crack").classList.add("show");

}

}

//================ LEVEL 1 ================

function checkCode(){

if(document.getElementById("code").value==="0008"){

document.getElementById("message").innerText="ACCESS GRANTED";

beep(800);

setTimeout(()=>{

level1.classList.add("hidden");
level2.classList.remove("hidden");

},700);

}

else{

document.getElementById("message").innerText="ACCESS DENIED";

beep(200);

shake(level1);

addMistake();

}

}

//================ LEVEL 2 ================

function checkBinary(){

const ans=document.getElementById("binaryAnswer").value.trim().toUpperCase();

if(ans==="HI"){

document.getElementById("binaryMessage").innerText="MESSAGE DECODED";

beep(900);

setTimeout(()=>{

level2.classList.add("hidden");
level3.classList.remove("hidden");

},700);

}

else{

document.getElementById("binaryMessage").innerText="WRONG TRANSLATION";

beep(250);

shake(level2);

addMistake();

}

}

//================ LEVEL 3 ================

function wrongButton(){

if(running)return;

running=true;

redFlash.classList.add("flash");

let count=10;

const text=document.getElementById("countdown");

const timer=setInterval(()=>{

text.innerText=`SELF-DESTRUCT IN ${count}`;

beep(300+count*20);

count--;

if(count<0){

clearInterval(timer);

text.innerText="SYSTEM RESET";

redFlash.classList.remove("flash");

running=false;

addMistake();

}

},1000);

}

function escapeButton(){

beep(1200,300);

const vault=document.getElementById("vault");

vault.classList.remove("hidden");

setTimeout(()=>{

vault.classList.add("open");

document.getElementById("finalTime").innerText=`Escape Time: ${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;

},300);

}

//================ MATRIX RAIN ================

canvas.width=innerWidth;
canvas.height=innerHeight;

const letters="01BLACKOUT";
const size=18;
const cols=Math.floor(canvas.width/size);
const drops=Array(cols).fill(1);

setInterval(()=>{

ctx.fillStyle="rgba(0,0,0,.08)";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="#00ff66";
ctx.font=size+"px monospace";

for(let i=0;i<drops.length;i++){

const t=letters[Math.floor(Math.random()*letters.length)];

ctx.fillText(t,i*size,drops[i]*size);

if(drops[i]*size>canvas.height&&Math.random()>.975){

drops[i]=0;

}

drops[i]++;

}

},40);

//================ FLASHLIGHT + CCTV ================

document.addEventListener("mousemove",e=>{

light.style.left=e.clientX+"px";
light.style.top=e.clientY+"px";

const camera=document.getElementById("camera");

camera.style.transform=`rotate(${Math.atan2(e.clientY-40,e.clientX-40)*180/Math.PI+90}deg)`;

});

//================ SECRET TERMINAL ================

document.addEventListener("keydown",e=>{

typed=(typed+e.key).slice(-3).toLowerCase();

if(typed==="sam"){

terminal.classList.add("show");

}

});

//================ INVENTORY ================

function updateInventory(){

document.getElementById("items").innerText=inventory.length?inventory.join(", "):"Empty";

}

//================ OMEGA ENDING ================

function omegaEnding(){

redFlash.classList.add("flash");

beep(1500,500);

canvas.style.filter="hue-rotate(160deg) saturate(3)";

const out=document.getElementById("output");

const lines=[
"ACCESS LEVEL OMEGA",
"AI CORE AWAKENING",
"MEMORY TRANSFER STARTED",
"YOU WERE NEVER ESCAPING",
"GOODBYE."
];

lines.forEach((line,i)=>{

setTimeout(()=>{

out.innerHTML+=`<p style="color:red">${line}</p>`;
out.scrollTop=out.scrollHeight;

},i*700);

});

setTimeout(()=>{

redFlash.classList.remove("flash");

const vault=document.getElementById("vault");

vault.classList.remove("hidden");
vault.classList.add("open");

document.getElementById("light").innerHTML=`
<h1>ACCESS LEVEL OMEGA</h1>
<p>You were never escaping.</p>
<p>The bunker chose you.</p>
<button onclick="location.reload()">Restart Reality</button>
`;

},4500);

}

//================ TERMINAL COMMANDS ================

function runCommand(){

const input=document.getElementById("cmd");
const cmd=input.value.trim().toLowerCase();
const out=document.getElementById("output");

omegaSequence.push(cmd);

if(omegaSequence.length>3){

omegaSequence.shift();

}

function say(text){

out.innerHTML+=`<p>${text}</p>`;

}

switch(cmd){

case"help":

say("Commands: help, scan, unlock, override, omega, guard, ghost, desktop, status, clear, exit");

break;

case"scan":

if(!inventory.includes("USB"))inventory.push("USB");

say("Hidden USB found.");

break;

case"unlock":

if(!inventory.includes("Keycard"))inventory.push("Keycard");

say("Keycard acquired.");

break;

case"override":

say("Security overridden.");

break;

case"status":

say("Power:12%");
say("Security:ONLINE");
say("Vault:LOCKED");

break;

case"desktop":

desktop.classList.add("show");

say("BLACKOUT OS LOADED.");

break;

case"omega":

say("ACCESS LEVEL OMEGA DETECTED.");

redFlash.classList.add("flash");

beep(1200,400);

setTimeout(()=>redFlash.classList.remove("flash"),2000);

break;

case"ghost":

document.body.style.filter="invert(1)";

setTimeout(()=>{

document.body.style.filter="invert(0)";

},2000);

break;

case"guard":

["GUARD AI ONLINE","Who are you?","You shouldn't be here.","I am watching you.","Run while you can."].forEach((line,i)=>{

setTimeout(()=>{

say(line);

},i*900);

});

break;

case"clear":

out.innerHTML="";

break;

case"exit":

closeTerminal();

break;

default:

say("Unknown command.");

}

//===== SECRET OMEGA SEQUENCE =====

if(omegaSequence.join("-")==="omega-override-ghost"){

setTimeout(omegaEnding,800);

}

updateInventory();

input.value="";

out.scrollTop=out.scrollHeight;

}

function closeTerminal(){

terminal.classList.remove("show");

}

//================ BLACKOUT OS ================

function openFolder(type){

win.classList.add("show");

const title=document.getElementById("windowTitle");
const content=document.getElementById("windowContent");

if(type==="docs"){

title.innerText="Documents";

content.innerHTML=`
<h3>CLASSIFIED FILE</h3>
<p>Vault Password: ████</p>
<p>Protocol Ω was deleted.</p>
`;

}

else if(type==="bin"){

title.innerText="Recycle Bin";

content.innerHTML=`
<h3>Deleted Files</h3>
<p>🔑 Keycard recovered.</p>
`;

if(!inventory.includes("Keycard")){

inventory.push("Keycard");

updateInventory();

}

}

else if(type==="notes"){

title.innerText="Notepad";

content.innerHTML=`
<pre>VGhlIGtleSBpcyBub3QgaGVyZS4=</pre>
<p>Hint: It's Base64.</p>
`;

}

else{

title.innerText="CCTV";

content.innerHTML=`
<h3>CAMERA 01 ACTIVE</h3>
<p style="color:red;">● REC</p>
<p>Target Detected...</p>
`;

}

}

function closeWindow(){

win.classList.remove("show");

}

//================ AFK DETECTION ================

let afk;

function resetAFK(){

clearTimeout(afk);

afk=setTimeout(()=>{

redFlash.classList.add("flash");

beep(150);

alert("⚠ Motion Detected Outside The Bunker.");

redFlash.classList.remove("flash");

},30000);

}

document.addEventListener("mousemove",resetAFK);
document.addEventListener("keydown",resetAFK);

resetAFK();

//================ LASERS ================

setInterval(()=>{

const l1=document.getElementById("laser1").getBoundingClientRect();
const l2=document.getElementById("laser2").getBoundingClientRect();

const x=parseInt(light.style.left)||0;
const y=parseInt(light.style.top)||0;

const hit=box=>x>box.left&&x<box.right&&y>box.top&&y<box.bottom;

if(hit(l1)||hit(l2)){

redFlash.classList.add("flash");

beep(120);

setTimeout(()=>{

redFlash.classList.remove("flash");

},300);

}

},100);

//================ AI MESSAGES ================

const aiMessages=[
"Someone is accessing the bunker...",
"I know you're still here.",
"Don't open Camera 03.",
"Too late."
];

setInterval(()=>{

const out=document.getElementById("output");

if(terminal.classList.contains("show")){

out.innerHTML+=`<p style="color:red">${aiMessages[aiIndex%aiMessages.length]}</p>`;

out.scrollTop=out.scrollHeight;

aiIndex++;

}

},12000);

updateInventory();