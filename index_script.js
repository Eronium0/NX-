
const processor = {};

// Chroma-key functions

processor.doLoad = function doLoad(){

    const video1 = document.getElementById("vid1");
    this.video1 = video1;
    video1.muted = true;

    if(video1.readyState >= 1){
        this.width1 = video1.videoWidth / 2;
        this.height1 = video1.videoHeight / 2;
    }else{
    video1.addEventListener("loadedmetadata", () =>{
        this.width1 = video1.videoWidth / 2;
        this.height1 = video1.videoHeight / 2;
    });
    }
    video1.play()
    .then(() => { this.timerCallback1(); })
    .catch((err) => { console.log("vid1 play failed:", err); });

    const video2 = document.getElementById("vid2");
    this.video2 = video2;
    video2.muted = true;
    
    if(video2.readyState >= 1){
        this.width2 = video2.videoWidth / 2;
        this.height2 = video2.videoHeight / 2;
    }else{
    video2.addEventListener("loadedmetadata", () =>{
        this.width2 = video2.videoWidth / 2;
        this.height2 = video2.videoHeight / 2;      
    });
    }
    video2.play()
    .then(() => { this.timerCallback2(); })
    .catch((err) => { console.log("vid2 play failed:", err); });


    this.MiiChar1 = document.getElementById("MiiChar1");
    this.ctx1 = this.MiiChar1.getContext("2d", {
      willReadFrequently: true
    });

    this.MiiChar2 = document.getElementById("MiiChar2");
    this.ctx2 = this.MiiChar2.getContext("2d", {
      willReadFrequently: true
    });
    video1.addEventListener("play", () => {
        this.timerCallback1();
    });

    video2.addEventListener("play", () => {
        this.timerCallback2();
    });
};

processor.timerCallback1 = function timerCallback1() {
  if (this.video1.paused || this.video1.ended) {
    return;
  }

  this.computeFrame1();
  setTimeout(() => {
    this.timerCallback1();
  }, 0);
};

processor.timerCallback2 = function timerCallback2() {
  if (this.video2.paused || this.video2.ended) {
    return;
  }

  this.computeFrame2();
  setTimeout(() => {
    this.timerCallback2();
  }, 0);
};

processor.computeFrame1 = function () {
  if(!this.width1){
    return;
  }
  this.ctx1.drawImage(this.video1, 0, 0, this.width1, this.height1);
  const frame = this.ctx1.getImageData(0, 0, this.width1, this.height1);
  const data = frame.data;

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i + 0];
    const green = data[i + 1];
    const blue = data[i + 2];
    if (green > 30 && green > red * 1.25 && green > blue * 1.25) {
      data[i + 3] = 0;
    }
  }
  this.ctx1.putImageData(frame, 0, 0);
};

processor.computeFrame2 = function () {
  if(!this.width2){
    return;
  }
  this.ctx2.drawImage(this.video2, 0, 0, this.width2, this.height2);
  const frame2 = this.ctx2.getImageData(0, 0, this.width2, this.height2);
  const data2 = frame2.data;

  for (let i = 0; i < data2.length; i += 4) {
    const red = data2[i + 0];
    const green = data2[i + 1];
    const blue = data2[i + 2];
    if (green > 30 && green > red * 1.25 && green > blue * 1.25) {
      data2[i + 3] = 0;
    }
  }
  this.ctx2.putImageData(frame2, 0, 0);
};


processor.doLoad();

// typing effect work

const screen = document.getElementById('screen-text');
const msg = document.querySelectorAll('.selections a');
let intervalid;
let selectedButton = null;

const selectOption = (event) => {
      if(event.currentTarget === selectedButton){
      return;
    } else{
      clearInterval(intervalid);
      if(selectedButton != null){
          selectedButton.classList.remove('active');   
      }
      selectedButton = event.currentTarget;
      event.currentTarget.classList.add('active');
      screen.textContent = "";
    }
    const message = event.currentTarget.dataset.message;
    let i = 0;
     intervalid = setInterval(() => {
      screen.textContent = message.slice(0,i);
      i++;
      if(i > message.length){
        clearInterval(intervalid);
      }
    },15);
};

const canHover = window.matchMedia('(hover: hover)').matches;

if (canHover) {
  // Desktop: hover or keyboard focus types; a click follows the link normally.
  msg.forEach(element => {
    element.addEventListener("mouseenter", selectOption);
    element.addEventListener("focus", selectOption);
  });
} else {
  // Touch: first tap types the message; a second tap on the same option navigates.
  msg.forEach(element => {
    element.addEventListener("click", (event) => {
      if (selectedButton === event.currentTarget) {
        return; // second tap on the same option → let the link navigate
      }
      event.preventDefault(); // first tap → preview instead of navigating
      selectOption(event);
    });
  });
}

// light dark toggle

const mode = document.documentElement;
const toggle = document.getElementById('LDToggle');
const LogoLight = document.getElementById('logo_light');
const LogoDark = document.getElementById('logo_dark');
const modo = document.getElementById('modo');



function applyTheme(theme){
  if(theme === "dark"){
    document.documentElement.dataset.theme = "dark"
    LogoLight.classList.remove('hidden');
    LogoDark.classList.add('hidden');
    modo.classList.replace('fa-sun', 'fa-moon');
  } else{
    document.documentElement.dataset.theme = "light"
    LogoDark.classList.remove('hidden');
    LogoLight.classList.add('hidden');
    modo.classList.replace('fa-moon', 'fa-sun');
  }
}

toggle.addEventListener("click", (e) => {
  if(document.documentElement.dataset.theme === "dark"){
    applyTheme("light");
    localStorage.setItem("theme", "light");
  } else{
    applyTheme("dark");
    localStorage.setItem("theme", "dark");
  }
})

applyTheme(localStorage.getItem("theme") || "dark");