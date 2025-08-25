const nodesContainer = document.getElementById('Nodes');
const linesContainer = document.getElementById('Lines');

const langToggle = document.getElementById('lang-toggle');


let enJsonData, itJsonData, jsonData;
let it_en_table, en_it_table;

function getLangFromURL() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    return (lang === 'en' || lang === 'it') ? lang : null;
}

function getPathFromHash() {
    const hash = decodeURIComponent(window.location.hash);
    if (hash.startsWith('#/')) {
        return hash.slice(2).split('/').filter(Boolean);
    }
    return ['About Me', 'Profile', 'Identity', 'Basic'];
}

function updateURL(new_path, lang) {
    currentPath = new_path;
    const newHash = '#/' + currentPath.map(encodeURIComponent).join('/');
    
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    
    
    if (window.location.hash !== newHash) {
        url.hash = newHash;
    }

    window.location = url;
}

let currentPath = getPathFromHash();

window.addEventListener('hashchange', () => {
    currentPath = getPathFromHash();
    updateGraph();
});


// GRAPH FUNCTIONS

function updateGraph() {    
    let current_node = jsonData;
    for (let i = 0; i < currentPath.length; i++) {
        current_node = current_node[currentPath[i]];
    }
    if (typeof current_node === 'object' && Object.keys(current_node).length == 1) {
        currentPath.push(Object.keys(current_node)[0]);
    }

    let nodeElements = [];
    let lineElements = [];

    function removeAllFromContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    function createNode(path_to_this_node, x, y, max_w, in_selected_path) {
        const node = document.createElement('button');
        if (in_selected_path) {
            node.className = 'node selected';
        } else {
            node.className = 'node';
        }
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.style.maxWidth = `${max_w}px`;
        node.path_to_this_node = path_to_this_node;
        node.innerHTML = path_to_this_node[path_to_this_node.length-1];
        node.x = x;
        node.y = y;
        return node;
    }

    function createLine(p1, p2, minDelta) {
        const line = document.createElement('div');
        let style = line.style;

        const delta = p2.x - p1.x;
        style.transformOrigin = `0px 0px`;

        const y_delta = p2.y - p1.y
        
        style.height = '2px';
        style.left = `${p1.x}px`;
        style.top = `${p1.y}px`;
        
        if (delta == 0) {
            line.className = 'vertical-line';

            style.width = `${Math.abs(p2.y - p1.y)}px`;
            style.transform = `rotate(${Math.PI/2}rad)`;
        } else {
            const absDelta = Math.abs(delta);

            line.className = minDelta < y_delta ? 'advanced-short-line' : 'advanced-line';

            style.setProperty('--after-before-size-2', `${y_delta/2}px`);
            
            current_delta = Math.min(minDelta, y_delta)
            style.width = `${absDelta - current_delta}px`;
            style.transform = `scaleX(${(delta > 0) ? 1 : -1}) translate(${current_delta/2}px, ${y_delta/2}px)`;
            style.setProperty('--after-before-size', `${current_delta/2}px`);
        }
        return line;
    }

    function renderPath(path) {
        const offset = (window.pageYOffset || document.documentElement.scrollTop);
        let x_space;
        let next_nodes = jsonData;
        let first_element;

        let last_row_of_lines = [];

        const interNodesSectionHeight = parseInt(
            getComputedStyle(document.documentElement)
                .getPropertyValue('--inter-nodes-section-height')
        );

        const useInLineNodeSpacing = parseInt(
            getComputedStyle(document.documentElement)
            .getPropertyValue('--use-in-line-node-spacing')
        );
        
        let y = useInLineNodeSpacing ? 100 : 0;

        for (let i = 0; i < path.length+1; i++) {
            y += interNodesSectionHeight;
            
            next_nodes = i==0 ? next_nodes : next_nodes[path[i-1]];
            if (typeof next_nodes === 'object') {
                x_space = window.innerWidth / (Object.keys(next_nodes).length + 1);
                Object.entries(next_nodes).forEach(([key, _], index) => {
                    const node = createNode(path.slice(0,i).concat([key]), x_space*(index+1), y, x_space, path.includes(key));
                    nodesContainer.appendChild(node)
                    if (useInLineNodeSpacing) {
                        y = (node.getBoundingClientRect().bottom + node.getBoundingClientRect().height * .25 + offset);
                    }
                    if (path.includes(key)) {
                        if (i != 0) {
                            lineElements.push(i === 1 ? [first_element, node] : [lineElements[lineElements.length - 1][1], node]);
                        } else {
                            node.className = "node first-element"
                            first_element = node;
                        }
                    }
                    if (i == path.length) {
                        last_row_of_lines.push(i === 1 ? [first_element, node] : [lineElements[lineElements.length - 1][1], node]);
                        node.className = "node last-row";
                    }
                    nodeElements.push(node);
                });
            } else {
                const node = createNode([next_nodes], window.innerWidth / 2, y, window.innerWidth, true);
                node.className = "node description";
                node.id = "description";

                nodesContainer.appendChild(node)
                nodeElements.push(node);

                y = node.getBoundingClientRect().bottom + node.getBoundingClientRect().height * .25 + offset;
                last_row_of_lines.push(i === 1 ? [first_element, node] : [lineElements[lineElements.length - 1][1], node]);
            }
        }
        lineElements = lineElements.concat(last_row_of_lines);
    }

    // Clear the containers
    removeAllFromContainer(nodesContainer);
    removeAllFromContainer(linesContainer);

    // Render the nodes and lines
    renderPath(currentPath);

    // Create lines between nodes
    // and add them to the lines container
    const get_deltas = ps => Math.abs(ps[0].x - ps[1].x);
    const minValue = Math.min(...lineElements.map(get_deltas).filter(d => d !== 0));

    lineElements.forEach(line => linesContainer.appendChild(createLine(...line, minValue)));

    // Set the height of the separator
    // to the maximum height of the nodes
    const y_scroll = (window.scrollY || window.pageYOffset);
    const get_y_max = node => node.getBoundingClientRect().bottom + y_scroll;

    const maxHeight = Math.max(...nodeElements.map(get_y_max));
    const separator = document.getElementById("content-spacer");

    let height = maxHeight - separator.getBoundingClientRect().top - y_scroll;

    separator.style.height = `${Math.max(height, 0)}px`;
}

function setLanguage(lang, save = true) {
    jsonData = (lang === 'en') ? enJsonData : itJsonData;
    currentPath = switchPathLanguage(currentPath, lang);
    updateGraph();
    updateURL(currentPath, lang);
    if (save) localStorage.setItem('preferredLang', lang);
}

function switchPathLanguage(path, targetLang) {
    const table = (targetLang === 'en') ? it_en_table : en_it_table;
    return path.map(segment => table[segment] || segment);
}

document.addEventListener('click', event => {
    if (event.target.classList.contains('node') && !event.target.classList.contains("description")) {
        updateURL(event.target.path_to_this_node, langToggle.checked ? 'en' : 'it');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/json/aboutme.json')
    .then(response => response.json())
    .then(data => {
        enJsonData = data.en;
        itJsonData = data.it;
        en_it_table = data.en_it;
        it_en_table = data.it_en;

        const urlLang = getLangFromURL();
        const savedLang = localStorage.getItem('preferredLang');
        const initialLang = urlLang || savedLang || 'en';

        setLanguage(initialLang, !urlLang);
        langToggle.checked = (initialLang === 'en');
    })
    .catch(console.error);
});

window.addEventListener('resize', () => {
    updateGraph();
});

langToggle.addEventListener('change', () => {
    const lang = langToggle.checked ? 'en' : 'it';
    setLanguage(lang, true);
});