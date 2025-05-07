document.addEventListener("DOMContentLoaded", () => {
	let quotesData = [];
	let shownQuotes = new Set();

	const container = document.getElementById('quotes-box');
	const addBtn = document.getElementById('add-quote-btn');
	const resetBtn = document.getElementById('reset-quotes-btn');

	function addQuote(quoteObj) {
		const { quote, author, image } = quoteObj;
		const side = container.children.length % 2 === 0 ? 'right' : 'left';

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

	function getUnusedQuote() {
		const unused = quotesData.filter(({ quote, author }) =>
			!shownQuotes.has(quote + '|' + author)
		);
		if (unused.length === 0) return null;
		const index = Math.floor(Math.random() * unused.length);
		return unused[index];
	}

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

	addBtn.addEventListener('click', () => {
		const quote = getUnusedQuote();
		if (!quote) {
			addBtn.disabled = true;
			return;
		}
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
});