let winHeight, winWidth, running, mousePosX, mousePosY;
let rippleContainer = document.querySelector(".rippleContainer");

// get  window width and height
const resizeObserver = new ResizeObserver((entries) => {
	winHeight = entries[0].target.clientHeight;
	winWidth = entries[0].target.clientWidth;
});

resizeObserver.observe(document.body);

// get mouse location
rippleContainer.onmousemove = function (e) {
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
function setRandomInterval(intervalFunction, minDelay, maxDelay) {
	let timeout;

	const runInterval = () => {
		const timeoutFunction = () => {
			intervalFunction();
			runInterval();
		};

		const delay = getRandomInt(minDelay, maxDelay);
		timeout = setTimeout(timeoutFunction, delay);
	};

	return {
		start() {
			runInterval();
			running = true;
		},
		stop() {
			clearTimeout(timeout);
			running = false;
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
	let timeout;

	const runInterval = () => {
		const timeoutFunction = () => {
			if (rippleContainer.childElementCount > 10) {
				rippleContainer.removeChild(rippleContainer.firstChild);
			}
			runInterval();
		};
		timeout = setTimeout(timeoutFunction, 500);
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

// start ripple remove function
const removeRipple = removeRippleNode();
removeRipple.start();

// start ripple add function
const addRipple = setRandomInterval(placeRippleNode, 500, 1500);
addRipple.start();

// function for toggle ripples
let Ripples = {
	toggle: function () {
		if (running === true) {
			addRipple.stop();
			// removeRipple.stop();
			playPauseIconChange();
		} else {
			addRipple.start();
			// removeRipple.start();
			playPauseIconChange();
		}
	},
	// function for start ripples
	start: function () {
		if (running === false) {
			addRipple.start();
			// removeRipple.start();
			playPauseIconChange();
		}
	},
	// function for stop ripples
	stop: function () {
		if (running === true) {
			addRipple.stop();
			// removeRipple.stop();
			playPauseIconChange();
		}
	},
};

// toggles ripples on window focus so it doesn't keep running in the background
window.addEventListener("blur", Ripples.stop);
window.addEventListener("focus", Ripples.start);

// getting play pause buttons and their container
let playPauseContainer = document.querySelector(".play-pause");
let playPauseBtn = document.querySelectorAll(".play-pause > .icon");

// pause ripples on click
playPauseContainer.addEventListener("click", Ripples.toggle);

// change play pause button icons
function playPauseIconChange() {
	playPauseBtn.forEach((btn) => {
		btn.classList.toggle("hide");
	});
}

// add ripple on click where mouse is
rippleContainer.addEventListener("click", placeRippleNodeOnMouse);

function placeRippleNodeOnMouse() {
	let o1 = document.createElement("div");
	o1.classList.add("ripple");

	o1.style.left = mousePosX + "px";
	o1.style.top = mousePosY + "px";
	o1.style.animationDuration = getRandomInt(1000, 3000) + "ms";

	rippleContainer.appendChild(o1);
}
