const menuToggles = document.getElementsByClassName('menu-toggle');
const globalHeader = document.getElementById('global-header');
const localHeader = document.getElementById('local-header');
const menuOverlay = document.getElementsByClassName('overlay');

const contactButtonMenu = document.querySelector('.contact-button');

const menuOverlayCss = document.querySelector('.overlay');
const lateralMenuCss = document.querySelector('#menu');

const contactBtn = document.querySelector(".footer-contact-button");
const icons = document.querySelectorAll(".social-links .fa");

window.addEventListener("load", () => {
	document.body.classList.remove('loading');
	const loadingScreen = document.getElementById('loading-screen');
	if (loadingScreen) {
		loadingScreen.style.opacity = '0';
		loadingScreen.style.pointerEvents = 'none';
		setTimeout(() => loadingScreen.remove(), 1500);
	}
});

function closeMenu() {
	menuOverlayCss.classList.toggle('open');
	lateralMenuCss.classList.toggle('open');
}

[...menuToggles, ...menuOverlay].forEach(menuToggle => {
	menuToggle.addEventListener('click', () => {
		closeMenu()
	});
});

contactButtonMenu.addEventListener('click', event => {
	event.preventDefault();
	closeMenu();
	const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
	window.scrollTo({
		top: documentHeight,
		behavior: "smooth"
	});
});

let prevScrollY = window.scrollY;
const localHeaderHeight = localHeader.offsetHeight;
window.addEventListener('scroll', () => {
	const currentScrollY = window.scrollY;
	if (currentScrollY > localHeaderHeight) {
		globalHeader.classList.toggle('scrolled', currentScrollY > prevScrollY);
	} else {
		globalHeader.classList.add('scrolled');
	}
	prevScrollY = currentScrollY;
});

window.addEventListener('click', event => {
    if ((!event.target.closest('button')) && (window.scrollY > localHeaderHeight)) {
		globalHeader.classList.toggle('scrolled');
    }
});

contactBtn.addEventListener("click", event => {
	event.preventDefault();
	icons.forEach(icon => icon.classList.add("glow"));
	setTimeout(() => {
		icons.forEach(icon => icon.classList.remove("glow"));
	}, 1000);
});

document.getElementById("year").textContent = new Date().getFullYear();