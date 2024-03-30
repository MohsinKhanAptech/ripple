// get  window width and height
let winHeight, winWidth, running;
let rippleContainer = document.querySelector(".rippleContainer");

const resizeObserver = new ResizeObserver((entries) => {
	winHeight = entries[0].target.clientHeight;
	winWidth = entries[0].target.clientWidth;
});

resizeObserver.observe(document.body);

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

	let x = getRandomInt(0, winHeight);
	let y = getRandomInt(0, winWidth);

	o1.style.top = x + "px";
	o1.style.left = y + "px";
	o1.style.animationDuration = getRandomInt(1000, 3000) + "ms";

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
const removeRipple = setRandomInterval(removeRippleNode, 500, 500);
removeRipple.start();

// start ripple add function
const addRipple = setRandomInterval(placeRippleNode, 500, 1500);
addRipple.start();

// function for toggle ripples
let Ripples = {
	toggle: function () {
		if (running === true) {
			addRipple.stop();
			removeRipple.stop();
		} else {
			addRipple.start();
			removeRipple.start();
		}
	},
	// function for start ripples
	start: function () {
		if (running !== true) {
			addRipple.start();
			removeRipple.start();
		}
	},
	// function for stop ripples
	stop: function () {
		if (running === true) {
			addRipple.stop();
			removeRipple.stop();
		}
	},
};

// toggles ripples on window focus so it doesn't keep running in the background
window.addEventListener("blur", Ripples.stop);
window.addEventListener("focus", Ripples.start);

// pause ripples on click
document.querySelector(".play-pause").addEventListener("click", Ripples.toggle);

//
let pausePlayContainer = document.querySelector(".play-pause");
let pausePlayBtn = document.querySelectorAll(".play-pause > .icon");

pausePlayContainer.addEventListener("click", () => {
	pausePlayBtn.forEach((btn) => {
		btn.classList.toggle("hide");
	});
});
