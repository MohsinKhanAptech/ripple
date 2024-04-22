let winHeight,
	winWidth,
	running,
	paused,
	mousePosX,
	mousePosY,
	rippleClass = "ripple-new",
	randomAnimDuration = false;
//

// get  window width and height
const resizeObserver = new ResizeObserver((entries) => {
	winHeight = entries[0].target.clientHeight;
	winWidth = entries[0].target.clientWidth;
});

resizeObserver.observe(document.body);

// get mouse/touch/pointer location
document.addEventListener("pointermove", (e) => {
	mousePosX = e.clientX;
	mousePosY = e.clientY;
	// console.log(mousePosX + " " + mousePosY);
});

// get random number
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// execute function at random intervals
function setRangedInterval(intervalFunction, minDelay, maxDelay) {
	let timeout, delay;

	const runInterval = () => {
		const timeoutFunction = () => {
			intervalFunction();
			runInterval();
		};

		if (minDelay === maxDelay) {
			delay = minDelay;
		} else {
			delay = getRandomInt(minDelay, maxDelay);
		}

		timeout = setTimeout(timeoutFunction, delay);
	};

	return {
		start() {
			runInterval();
		},
		stop() {
			clearTimeout(timeout);
		},
	};
}

// place ripples in ripple container
let rippleContainer = document.querySelector(".ripple-container");

function placeRippleNode() {
	let o1 = document.createElement("div");
	o1.classList.add(rippleClass);

	let x = getRandomInt(0, winWidth);
	let y = getRandomInt(0, winHeight);

	o1.style.left = x + "px";
	o1.style.top = y + "px";

	if (randomAnimDuration === true) {
		o1.style.animationDuration = getRandomInt(2500, 5000) + "ms";
	}

	rippleContainer.appendChild(o1);
}

// remove extra ripple objects from dom so its not cluttered
function removeRippleNode() {
	if (rippleContainer.childElementCount > 5) {
		rippleContainer.removeChild(rippleContainer.firstChild);
	}
}

// declare ripple add function
const addRipple = setRangedInterval(placeRippleNode, 500, 1500);
addRipple.start();
running = true;
paused = false;

// declare ripple remove function
const removeRipple = setRangedInterval(removeRippleNode, 500, 500);
removeRipple.start();

// getting play-pause buttons and their container
let playPauseContainer = document.querySelector(".play-pause");
let playPauseBtn = document.querySelectorAll(".play-pause > .icon");

// toggle class from array
function arrayClassNameToggle(array, className) {
	return () => {
		array.forEach((obj) => {
			obj.classList.toggle(className);
		});
	};
}

// change play pause button icons
const playPauseIconChange = arrayClassNameToggle(playPauseBtn, "hide");

// pause ripples on click
playPauseContainer.addEventListener("click", () => {
	Ripples.toggle();
	paused === false ? (paused = true) : (paused = false);
});

// function to control ripples playback
let Ripples = {
	toggle: function () {
		if (running === true) {
			addRipple.stop();
			running = false;
			// removeRipple.stop();
			playPauseIconChange();
		} else {
			addRipple.start();
			running = true;
			// removeRipple.start();
			playPauseIconChange();
		}
	},
	// function for start ripples
	start: function () {
		if (running === false) {
			addRipple.start();
			running = true;
			// removeRipple.start();
			playPauseIconChange();
		}
	},
	// function for stop ripples
	stop: function () {
		if (running === true) {
			addRipple.stop();
			running = false;
			// removeRipple.stop();
			playPauseIconChange();
		}
	},
};

// toggles ripples on window focus/unfocus so it doesn't keep running in the background
// and if ripples were paused by user it doesn't start running when focused
window.addEventListener("blur", () => {
	Ripples.stop();
	running = false;
});
window.addEventListener("focus", () => {
	if (paused === false) {
		Ripples.start();
		running = true;
	}
});

// add ripple on mouse when clicked and dragged
let dragged = 0;

// function to place ripples where mouse is
function placeRippleNodeOnMouse() {
	let o1 = document.createElement("div");
	o1.classList.add(rippleClass);

	o1.style.left = mousePosX + "px";
	o1.style.top = mousePosY + "px";

	if (randomAnimDuration === true) {
		o1.style.animationDuration = getRandomInt(2500, 5000) + "ms";
	}

	rippleContainer.appendChild(o1);
}

// make function to place ripples on mouse at a 200ms~ interval
const placeRippleNodeOnDrag = setRangedInterval(
	placeRippleNodeOnMouse,
	200,
	200
);

// on mouse down place a ripple
rippleContainer.addEventListener("mousedown", () => {
	placeRippleNodeOnMouse();
	dragged = 1;
});
// on mouse down and drag make ripples appear on mouse with intervals
rippleContainer.addEventListener("mousemove", () => {
	if (dragged === 1) {
		placeRippleNodeOnDrag.start();
		dragged++;
	}
});
// on mouse up stop mouse ripples
document.addEventListener("mouseup", () => {
	placeRippleNodeOnDrag.stop();
	dragged = 0;
});

// getting volume mute button & container
let volumeContainer = document.querySelector(".volume-control");
let volumeBtn = document.querySelectorAll(".volume-control > .icon");

// function to change volume button icons
const volumeIconChange = arrayClassNameToggle(volumeBtn, "hide");

// declare audio
const myAudio = new Audio("audio/After Rain — Zackross.mp3");

// play audio
myAudio.loop = true;
myAudio.play();
// set audio volume
myAudio.volume = 0.05;

// change volume icon and play/pause audio
volumeContainer.addEventListener("click", () => {
	volumeIconChange();
	if (myAudio.paused === false) {
		myAudio.pause();
		musicEnableSetting.checked = false;
	} else {
		myAudio.play();
		musicEnableSetting.checked = true;
	}
});

// getting settings, settings-close btn and settings-menu elements
let cogwheelBtn = document.querySelector(".cogwheel");
let optionCloseBtn = document.querySelector(".option-close");
let optionsMenu = document.querySelector(".options");

// open/close settings menu function
function optionsMenuToggle() {
	optionsMenu.classList.toggle("hide");
}

// open/close settings menu when clicked
cogwheelBtn.addEventListener("click", optionsMenuToggle);
optionCloseBtn.addEventListener("click", optionsMenuToggle);

// getting menu headers
let settingsHeader = document.querySelector(".settings-header");
let audioHeader = document.querySelector(".audio-header");
let optionMenus = document.querySelectorAll(".options-container > *");

// when clicked on settings header toggle .option-selected class
settingsHeader.addEventListener("click", () => {
	settingsHeader.classList.add("option-selected");
	audioHeader.classList.remove("option-selected");
	optionMenus.forEach((optionMenu) => {
		optionMenu.style.translate = "0%";
	});
});

// when clicked on audio header toggle .option-selected class
audioHeader.addEventListener("click", () => {
	audioHeader.classList.add("option-selected");
	settingsHeader.classList.remove("option-selected");
	optionMenus.forEach((optionMenu) => {
		optionMenu.style.translate = "-100%";
	});
});

// -- general settings

// setting to change ripple animation style ( new or old )
let rippleStyleSetting = document.querySelector("#ripple-style");

rippleStyleSetting.addEventListener("change", () => {
	let style = rippleStyleSetting.value;

	if (style === "new") {
		rippleClass = "ripple-new";
	} else {
		rippleClass = "ripple-old";
	}
});

// setting to stop/start random ripple animation duration
let rippleAnimationDuration = document.querySelector("#anim-duration");

rippleAnimationDuration.addEventListener("change", () => {
	let checked = rippleAnimationDuration.checked;

	if (checked === true) {
		randomAnimDuration = true;
	} else {
		randomAnimDuration = false;
	}
});

// -- audio settings

// enable/disable music setting
let musicEnableSetting = document.querySelector("#music-play");

// check if audio is playing then change icon
if (myAudio.paused === true) {
	volumeIconChange();
	musicEnableSetting.checked = false;
} else {
	musicEnableSetting.checked = true;
}

musicEnableSetting.addEventListener("change", () => {
	let checked = musicEnableSetting.checked;

	if (checked === true) {
		myAudio.play();
		volumeIconChange();
	} else {
		myAudio.pause();
		volumeIconChange();
	}
});

// music volume setting
let volumeSetting = document.querySelectorAll("input[name=music-volume]");

volumeSetting.forEach((x) => {
	x.addEventListener("change", () => {
		volumeSetting[0].value = volumeSetting[1].value = x.value;
		let volume = x.value / 100;
		myAudio.volume = volume;
	});
});
