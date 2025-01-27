let winHeight,
  winWidth,
  running = true,
  paused = false,
  mousePosX,
  mousePosY,
  dragged = 0,
  delay,
  rippleClass = 'ripple-new',
  randomAnimDuration = false;
//

rippleRun();

// gets ripple container
const rippleContainer = document.querySelector('.ripple-container');

// start appending ripples to container at random intervels
async function rippleRun() {
  if (running === true && paused === false) {
    setTimeout(() => {
      ripple();
      rippleRun();
    }, await getRandomInt(500, 2000));
  }
}

delay = 150;
// append ripple at cursor position
async function cursorRippleRun(x, y) {
  if (dragged === 1) {
    setTimeout(async () => {
      ripple(x, y);
      delay = 250;
      cursorRippleRun(mousePosX, mousePosY);
    }, delay);
  }
  delay = 150;
}

// function to append ripples
async function ripple(x = null, y = null) {
  if (x === null || y === null) {
    x = await getRandomInt(0, winWidth);
    y = await getRandomInt(0, winHeight);
  }

  let ripple = document.createElement('div');

  ripple.classList.add(rippleClass);

  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';

  let rippleDuration = 5000;

  if (randomAnimDuration === true) {
    rippleDuration = (await getRandomInt(3000, 6000)) + 'ms';
  }

  ripple.style.animationDuration = rippleDuration;

  rippleContainer.appendChild(ripple);

  setTimeout(() => {
    rippleContainer.removeChild(ripple);
  }, rippleDuration);
}

// on mouse down place a ripple
rippleContainer.addEventListener('mousedown', async () => {
  dragged = 1;
  cursorRippleRun(mousePosX, mousePosY);
});
// on mouse up stop mouse ripples
document.addEventListener('mouseup', async () => {
  dragged = 0;
});

// toggles ripples on window focus/unfocus so it doesn't keep running in the background
// and if ripples were paused by user it doesn't start running when focused
window.addEventListener('blur', async () => {
  running = false;
  playPauseIconControls.pause();
});
window.addEventListener('focus', async () => {
  if (paused === false) {
    running = true;
    rippleRun();
    playPauseIconControls.play();
  }
});

// get window width and height on resize
const resizeObserver = new ResizeObserver((entries) => {
  winHeight = entries[0].target.clientHeight;
  winWidth = entries[0].target.clientWidth;
});
resizeObserver.observe(document.body);

// get mouse/touch/pointer location on move
document.addEventListener('pointermove', async (e) => {
  mousePosX = e.clientX;
  mousePosY = e.clientY;
});

// get random number between min and max
async function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// button controls
function ButtonsControl(buttons, onClass, offClass, toggleClass = 'hide') {
  return {
    toggle: async function () {
      buttons.forEach(async (obj) => {
        obj.classList.toggle(toggleClass);
      });
    },
    play: async function () {
      buttons.forEach(async (obj) => {
        if (obj.classList.contains(onClass)) {
          obj.classList.add(toggleClass);
        } else {
          obj.classList.remove(toggleClass);
        }
      });
    },
    pause: async function () {
      buttons.forEach(async (obj) => {
        if (obj.classList.contains(offClass)) {
          obj.classList.add(toggleClass);
        } else {
          obj.classList.remove(toggleClass);
        }
      });
    },
  };
}

//
//* -- Ripple play/pause control section
//

// getting play-pause buttons and their container
const playPauseContainer = document.querySelector('.play-pause');
const playPauseBtn = document.querySelectorAll('.play-pause > .icon');

// change play pause button icons
const playPauseIconControls = ButtonsControl(playPauseBtn, 'play', 'pause');

// pause ripples on pause
playPauseContainer.addEventListener('click', async () => {
  paused = !paused;
  rippleRun();
  playPauseIconControls.toggle();
});

//
//* -- Volume control section
//

// getting volume mute button & container
const volumeContainer = document.querySelector('.volume-control');
const volumeBtn = document.querySelectorAll('.volume-control > .icon');

// function to change volume button icons
const volumeIconControls = ButtonsControl(
  volumeBtn,
  'volume-mute',
  'volume-full'
);

// declare audio
const backgroundMusic = new Audio('audio/After Rain — Zackross.mp3');

// set audio to loop
backgroundMusic.loop = true;
// set audio volume
backgroundMusic.volume = 0.05;
// play audio
backgroundMusic.play();

// change volume icon and play/pause audio
volumeContainer.addEventListener('click', async () => {
  volumeIconControls.toggle();
  if (backgroundMusic.paused === false) {
    backgroundMusic.pause();
    musicEnableSetting.checked = false;
  } else {
    backgroundMusic.play();
    musicEnableSetting.checked = true;
  }
});

//
//* -- Settings menu section
//

// getting settings, settings-close btn and settings-menu elements
const cogwheelBtn = document.querySelector('.cogwheel');
const optionCloseBtn = document.querySelector('.option-close');
const optionsMenu = document.querySelector('.options');

// open/close settings menu function
async function optionsMenuToggle() {
  optionsMenu.classList.toggle('hide');
}

// open/close settings menu when clicked
cogwheelBtn.addEventListener('click', optionsMenuToggle);
optionCloseBtn.addEventListener('click', optionsMenuToggle);

// getting menu headers
const settingsHeader = document.querySelector('.settings-header');
const audioHeader = document.querySelector('.audio-header');
const optionMenus = document.querySelectorAll('.options-container > *');

// toggle .option-selected class when clicked on settings in menu header
settingsHeader.addEventListener('click', async () => {
  settingsHeader.classList.add('option-selected');
  audioHeader.classList.remove('option-selected');
  optionMenus.forEach(async (optionMenu) => {
    optionMenu.style.translate = '0%';
  });
});

// toggle .option-selected class when clicked on audio in menu header
audioHeader.addEventListener('click', async () => {
  audioHeader.classList.add('option-selected');
  settingsHeader.classList.remove('option-selected');
  optionMenus.forEach(async (optionMenu) => {
    optionMenu.style.translate = '-100%';
  });
});

//
//* -- general settings
//

// setting to change ripple animation style ( new or old )
const rippleStyleSetting = document.querySelector('#ripple-style');

// check if new or old ripple style is selected
rippleStyleSetting.addEventListener('change', async () => {
  let style = rippleStyleSetting.value;

  if (style === 'new') {
    rippleClass = 'ripple-new';
  } else {
    rippleClass = 'ripple-old';
  }
});

// setting to stop/start random ripple animation duration
const rippleAnimationDuration = document.querySelector('#anim-duration');

// check if random duration is enabled
rippleAnimationDuration.addEventListener('change', async () => {
  let checked = rippleAnimationDuration.checked;

  if (checked === true) {
    randomAnimDuration = true;
  } else {
    randomAnimDuration = false;
  }
});

//
//* -- audio settings
//

// enable/disable music setting
const musicEnableSetting = document.querySelector('#music-play');

// check if audio is playing then change icon
if (backgroundMusic.paused === true) {
  volumeIconControls.toggle();
  musicEnableSetting.checked = false;
} else {
  musicEnableSetting.checked = true;
}

musicEnableSetting.addEventListener('change', async () => {
  let checked = musicEnableSetting.checked;

  if (checked === true) {
    backgroundMusic.play();
    volumeIconControls.play();
  } else {
    backgroundMusic.pause();
    volumeIconControls.pause();
  }
});

// music volume setting
const volumeSetting = document.querySelectorAll('.music-volume');

// set volume on change
volumeSetting.forEach(async (x) => {
  x.addEventListener('change', async () => {
    let volume = parseInt(x.value);
    if (volume !== NaN && volume >= 0 && volume <= 100) {
      volumeSetting[0].value = volumeSetting[1].value = x.value;
      let volumePercent = x.value / 100;
      backgroundMusic.volume = volumePercent;
    } else {
      backgroundMusic.volume =
        volumeSetting[0].value =
        volumeSetting[1].value =
          50;
    }
  });
});

//
//* -- Theme change
//

// getting theme button & container
const themeContainer = document.querySelector('.theme-control');
const themeBtn = document.querySelectorAll('.theme-control > .icon');

// function to change theme button icons
const themeIconControls = ButtonsControl(themeBtn, 'sun', 'moon');

// change theme on button click
themeContainer.addEventListener('click', async () => {
  themeIconControls.toggle();
  toggleTheme();
});

// function to set a given theme/color-scheme
function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.className = themeName;
}
// function to toggle between light and dark theme
function toggleTheme() {
  if (localStorage.getItem('theme') === 'dark-theme') {
    setTheme('light-theme');
  } else {
    setTheme('dark-theme');
  }
}
// Immediately invoked function to set the theme on initial load
(function () {
  if (localStorage.getItem('theme') === 'dark-theme') {
    setTheme('dark-theme');
    themeIconControls.toggle();
  } else {
    setTheme('light-theme');
  }
})();
