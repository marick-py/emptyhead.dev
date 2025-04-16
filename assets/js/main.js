const menuToggles = document.getElementsByClassName('menu-toggle');
const globalHeader = document.getElementById('global-header');
const menuOverlay = document.getElementsByClassName('overlay');

const contentSectionCss = document.querySelector('#content');

const homeButtonCss = document.querySelector('.home-button');
const aboutButtonCss = document.querySelector('.about-button');
const contactButtonCss = document.querySelector('.contact-button');

const menuOverlayCss = document.querySelector('.overlay');
const lateralMenuCss = document.querySelector('#menu');
const bannerCss = document.querySelector('.banner');

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
window.addEventListener('scroll', () => {
	const currentScrollY = window.scrollY;
    if (currentScrollY > bannerCss.offsetHeight) {
		if (currentScrollY > prevScrollY) {
			globalHeader.classList.add('scrolled');
		} else if (currentScrollY < prevScrollY) {
			globalHeader.classList.remove('scrolled');
		}
    } else {
        globalHeader.classList.add('scrolled');
    }

    prevScrollY = currentScrollY;
});

window.addEventListener('click', event => {
    if ((!event.target.closest('button')) && (prevScrollY > bannerCss.offsetHeight)) {
		globalHeader.classList.toggle('scrolled');
    }
});