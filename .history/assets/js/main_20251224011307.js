const menuToggles = document.getElementsByClassName('menu-toggle');
const globalHeader = document.getElementById('global-header');
const localHeader = document.getElementById('local-header');
const menuOverlay = document.getElementsByClassName('overlay');

const contactButtonMenu = document.querySelector('.contact-button');

const menuOverlayCss = document.querySelector('.overlay');
const lateralMenuCss = document.querySelector('#menu');

const contactBtn = document.querySelector(".footer-contact-button");
const icons = document.querySelectorAll(".social-links .fa");

function handleMissingAsset(element, type) {
    // Avoid double handling
    if (element.dataset.missingHandled) return;
    element.dataset.missingHandled = true;

    console.warn(`Missing ${type}:`, element.src || element.currentSrc);
    
    element.style.display = 'none';
    
    const placeholder = document.createElement('div');
    placeholder.className = 'missing-asset-placeholder';
    placeholder.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    placeholder.style.border = '1px dashed #666';
    placeholder.style.color = '#888';
    placeholder.style.padding = '2rem';
    placeholder.style.textAlign = 'center';
    placeholder.style.borderRadius = '8px';
    placeholder.style.margin = '1rem 0';
    placeholder.innerHTML = `<i class="fa-solid fa-image-slash" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>${type.charAt(0).toUpperCase() + type.slice(1)} not found`;
    
    element.parentNode.insertBefore(placeholder, element);
}

// Handle images
document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) {
        handleMissingAsset(img, 'image');
    } else {
        img.addEventListener('error', () => handleMissingAsset(img, 'image'));
    }
});

// Handle videos
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', () => handleMissingAsset(video, 'video'), true);
    // Check if video source failed (for <source> tags, error events don't bubble to video element in all browsers, but capturing phase might work or checking network state)
    const sources = video.querySelectorAll('source');
    sources.forEach(source => {
        source.addEventListener('error', () => handleMissingAsset(video, 'video'));
    });
});

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