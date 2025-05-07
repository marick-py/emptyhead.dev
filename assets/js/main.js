const menuToggles = document.getElementsByClassName('menu-toggle');
const globalHeader = document.getElementById('global-header');
const localHeader = document.getElementById('local-header');
const menuOverlay = document.getElementsByClassName('overlay');

const contactButtonCss = document.querySelector('.contact-button');

const menuOverlayCss = document.querySelector('.overlay');
const lateralMenuCss = document.querySelector('#menu');

function closeMenu() {
	menuOverlayCss.classList.toggle('open');
	lateralMenuCss.classList.toggle('open');
}

[...menuToggles, ...menuOverlay].forEach(menuToggle => {
	menuToggle.addEventListener('click', () => {
        closeMenu()
	});
});

contactButtonCss.addEventListener('click', function(event) {
	event.preventDefault();
	closeMenu()
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