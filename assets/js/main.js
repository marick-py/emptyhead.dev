const menuToggles = document.getElementsByClassName('menu-toggle');
const globalHeader = document.getElementById('global-header');
const localHeader = document.getElementById('local-header');
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
    if ((!event.target.closest('button')) && (prevScrollY > bannerCss.offsetHeight)) {
		globalHeader.classList.toggle('scrolled');
    }
});

document.addEventListener("DOMContentLoaded", () => {
	let quotesData = [];
	let shownQuotes = new Set();

	const container = document.getElementById('quotes-box');
	const addBtn = document.getElementById('add-quote-btn');
	const resetBtn = document.getElementById('reset-quotes-btn');

	// Crea un blocco di citazione
	function addQuote(quoteObj) {
		const { quote, author, image } = quoteObj;
		const side = container.children.length % 2 === 0 ? 'right' : 'left';

		// Sostituire i caratteri di nuova linea con <br>
		const formattedQuote = quote.replace(/\n/g, '<br>');

		const box = document.createElement('div');
		box.className = 'quote-box';
		const imageUrl = `url("${image}"), linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.7) 100%)`;
		box.style.backgroundImage = imageUrl;
		box.style.transform = side === 'left' ? 'scaleX(-1)' : 'none';

		const content = document.createElement('div');
		content.style.transform = side === 'left' ? 'scaleX(-1)' : 'none';
		content.innerHTML = `
			<p class="quote-text ${side}">${formattedQuote}</p>
			<p class="quote-author ${side}">~ ${author}</p>
		`;

		box.appendChild(content);
		container.appendChild(box);
	}

	// Ottieni una citazione non ancora mostrata
	function getUnusedQuote() {
		const unused = quotesData.filter(({ quote, author }) =>
			!shownQuotes.has(quote + '|' + author)
		);
		if (unused.length === 0) return null;
		const index = Math.floor(Math.random() * unused.length);
		return unused[index];
	}

	// Inizializza
	fetch('assets/json/quotes.json')
		.then(response => {
			if (!response.ok) throw new Error("Failed to load quotes");
			return response.json();
		})
		.then(data => {
			quotesData = data;
			const first = getUnusedQuote();
			if (first) {
				shownQuotes.add(first.quote + '|' + first.author);
				addQuote(first);
			}
		})
		.catch(err => {
			console.error("Quote loading error:", err);
		});

	// Aggiungi nuova citazione
	addBtn.addEventListener('click', () => {
		const quote = getUnusedQuote();
		if (!quote) {
			addBtn.disabled = true;
			return;
		}
		shownQuotes.add(quote.quote + '|' + quote.author);
		addQuote(quote);
	});

	// Reset
	resetBtn.addEventListener('click', () => {
		container.innerHTML = '';
		shownQuotes.clear();
		addBtn.disabled = false;
		const first = getUnusedQuote();
		if (first) {
			shownQuotes.add(first.quote + '|' + first.author);
			addQuote(first);
		}
	});
});