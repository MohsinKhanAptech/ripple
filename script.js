let winHeight = window.innerHeight;
let winWidth = window.innerWidth;

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
	let timeout;

	const runInterval = () => {
		const timeoutFunction = () => {
			intervalFunction();
			runInterval();
		};

		const delay =
			Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

		timeout = setTimeout(timeoutFunction, delay);
	};

	runInterval();

	return {
		clear() {
			clearTimeout(timeout);
		},
	};
};

let body = document.querySelector("body");

function placeElement() {
	let o1 = document.createElement("div");
	o1.classList.add("ripple");

	let x = getRandomInt(0, winHeight);
	let y = getRandomInt(0, winWidth);

	o1.style.top = x + "px";
	o1.style.left = y + "px";
	o1.style.animationDuration = getRandomInt(1000, 3000) + "ms";

	body.appendChild(o1);
}

setRandomInterval(placeElement, 500, 1500);
setInterval(() => {
	if (body.childElementCount > 15) {
		body.removeChild(body.firstChild);
	}
}, 500);
