let winHeight, winWidth, running, paused, mousePosX, mousePosY;
let rippleContainer = document.querySelector(".rippleContainer");

// get  window width and height
const resizeObserver = new ResizeObserver((entries) => {
	winHeight = entries[0].target.clientHeight;
	winWidth = entries[0].target.clientWidth;
});

resizeObserver.observe(document.body);

// get mouse location
document.onmousemove = function (e) {
	mousePosX = e.clientX;
	mousePosY = e.clientY;
	// console.log(mousePosX + " " + mousePosY);
};

// get random number
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
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
function placeRippleNode() {
	let o1 = document.createElement("div");
	o1.classList.add("ripple");

	let x = getRandomInt(0, winWidth);
	let y = getRandomInt(0, winHeight);

	o1.style.left = x + "px";
	o1.style.top = y + "px";
	o1.style.animationDuration = getRandomInt(1500, 3000) + "ms";

	rippleContainer.appendChild(o1);
}

// remove extra ripple objects from dom so its not cluttered
function removeRippleNode() {
	if (rippleContainer.childElementCount > 10) {
		rippleContainer.removeChild(rippleContainer.firstChild);
	}
}

// declare ripple add function
const addRipple = setRangedInterval(placeRippleNode, 500, 1500);
addRipple.start();
running = true;
paused = false;

// declare ripple remove function
const removeRipple = setRangedInterval(removeRippleNode, 500, 1500);
removeRipple.start();

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

// getting play pause buttons and their container
let playPauseContainer = document.querySelector(".play-pause");
let playPauseBtn = document.querySelectorAll(".play-pause > .icon");

// pause ripples on click
playPauseContainer.addEventListener("click", () => {
	Ripples.toggle();
	paused === false ? (paused = true) : (paused = false);
});

// change play pause button icons
function playPauseIconChange() {
	playPauseBtn.forEach((btn) => {
		btn.classList.toggle("hide");
	});
}

// add ripple on mouse when clicked and dragged

// function to place ripples where mouse is
function placeRippleNodeOnMouse() {
	let o1 = document.createElement("div");
	o1.classList.add("ripple");

	o1.style.left = mousePosX + "px";
	o1.style.top = mousePosY + "px";
	o1.style.animationDuration = getRandomInt(1000, 3000) + "ms";

	rippleContainer.appendChild(o1);
}

// make function to place ripples on mouse at a 200ms~ interval
const placeRippleNodeOnDrag = setRangedInterval(
	placeRippleNodeOnMouse,
	200,
	200
);

// on mouse down place a ripple and when dragged
rippleContainer.addEventListener("mousedown", () => {
	let oldWinHeight = winHeight;
	let oldWinWidth = winWidth;
	placeRippleNodeOnMouse();
	if (winHeight !== oldWinHeight && winWidth !== oldWinWidth) {
		placeRippleNodeOnDrag.start();
	}
});

// on mouse up stop mouse ripples
rippleContainer.addEventListener("mouseup", () => {
	placeRippleNodeOnDrag.stop();
});
