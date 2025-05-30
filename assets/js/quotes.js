document.addEventListener("DOMContentLoaded", () => {
	function getQuoteFromHash() {
		const hash = decodeURIComponent(window.location.hash);
		if (hash.startsWith('#/')) {
			const num = parseInt(hash.slice(2), 10);
			if (!isNaN(num) && num >= 0) {
				return num;
			}
		}
		return -1;
	}
	window.addEventListener('hashchange', () => {
		container.innerHTML = '';
		shownQuotes.clear();
		addBtn.disabled = false;
		
    	const forcedQuote = getQuoteFromHash();
		const isForced = forcedQuote >= 0 && forcedQuote < quotesData.length;
		const first = isForced ? quotesData[forcedQuote] : getUnusedQuote();

		shownQuotes.add(first.quote + '|' + first.author);
		addQuote(first, isForced);
	});
	const quotesButtonMenu = document.querySelector('.quotes-menu-button');
	const container = document.getElementById('quotes-box');

	quotesButtonMenu.addEventListener('click', event => {
		event.preventDefault();
		closeMenu();
		window.scrollTo({
			top: container.offsetTop - 200,
			behavior: "smooth"
		});
	});

	let quotesData = [];
	let shownQuotes = new Set();

	const addBtn = document.getElementById('add-quote-btn');
	const resetBtn = document.getElementById('reset-quotes-btn');

	function addQuote(quoteObj, scroll=false) {
		const { quote, author, image, index } = quoteObj;
		const side = container.children.length % 2 === 0 ? 'right' : 'left';

		const formattedQuote = quote.replace(/\n/g, '<br>');

		const box = document.createElement('button');
		box.className = 'quote-box';
		box.quote_index = index;
		const imageUrl = `url("${image}"), linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.7) 100%)`;
		box.style.backgroundImage = imageUrl;
		box.style.transform = side === 'left' ? 'scaleX(-1)' : 'none';

		const content = document.createElement('div');
		content.className = 'quote-content';
		content.style.transform = side === 'left' ? 'scaleX(-1)' : 'none';
		content.innerHTML = `
			<p class="quote-text ${side}">${formattedQuote}</p>
			<p class="quote-author ${side}">~ ${author}</p>
		`;

		box.appendChild(content);
		container.appendChild(box);

		if (scroll) {
			setTimeout(() => {
				box.scrollIntoView({ behavior: "smooth", block: "center" });
			}, 1000);
		}
	}

	function getUnusedQuote() {
		const unused = quotesData.filter(({ quote, author }) =>
			!shownQuotes.has(quote + '|' + author)
		);
		if (unused.length === 0) return null, 0;
		if (unused.length === 1) addBtn.disabled = true;
		const index = Math.floor(Math.random() * unused.length);
		return unused[index];
	}

	fetch('assets/json/quotes.json')
		.then(response => {
			if (!response.ok) throw new Error("Failed to load quotes");
			return response.json();
		})
		.then(data => {
			quotesData = data.map((item, idx) => ({ ...item, index: idx }));

			const imagePaths = [...new Set(data.map(item => item.image))];
			imagePaths.forEach(path => {
				const img = new Image();
				img.src = path;
			});

			const forcedQuote = getQuoteFromHash();
			const isForced = forcedQuote >= 0 && forcedQuote < quotesData.length;
			const first = isForced ? quotesData[forcedQuote] : getUnusedQuote();

			shownQuotes.add(first.quote + '|' + first.author);
			addQuote(first, isForced);
		})
		.catch(err => {
			console.error("Quote loading error:", err);
		});


	// BUTTON HANDLERS
	addBtn.addEventListener('click', () => {
		const quote = getUnusedQuote();
		if (!quote) return;
		shownQuotes.add(quote.quote + '|' + quote.author);
		addQuote(quote);
	});

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

	document.addEventListener('click', event => {
		const classes = event.target.classList;
		if (
			classes.contains('quote-box') ||
			classes.contains('quote-text') ||
			classes.contains('quote-author') ||
			classes.contains('quote-content')
		) {
			event.preventDefault();
			
			const quoteBox = event.target.closest('.quote-box');
			const quoteIndex = quoteBox?.quote_index;

			if (quoteIndex !== undefined) {
				const link = `https://emptyhead.dev/#/${quoteIndex}`;
				copyToClipboard(link);
			} else {
				console.warn('quote_index not found on the clicked quote box.');
			}
		}
	});

	function copyToClipboard(text) {
		try {
			navigator.clipboard.writeText(text);
			showCopyPopup("Link to quote copied!");
		} catch (err) {
			console.error('Failed to copy text: ', err);
			showCopyPopup("Failed to copy link.");
		}
	}

	function showCopyPopup(text) {
		const popup = document.getElementById('copy-popup');

		popup.textContent = text;
		popup.style.opacity = '1';
		clearTimeout(popup._timeout);
		popup._timeout = setTimeout(() => {
			popup.style.opacity = '0';
		}, 2000);
	}
});
