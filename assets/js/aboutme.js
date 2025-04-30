const nodesContainer = document.getElementById('Nodes');
const linesContainer = document.getElementById('Lines');

let jsonData;

fetch('assets/json/aboutme.json')
.then(response => response.json())
.then(data => {
    jsonData = data;
    updateGraph();
})
.catch(error => {console.error('Error loading JSON:', error);});

// HASH FUNCTIONS
function getPathFromHash() {
    const hash = decodeURIComponent(window.location.hash);
    if (hash.startsWith('#/')) {
        return hash.slice(2).split('/');
    }
    return ['About Me'];
}
function updateURL() {
    const newHash = '#/' + currentPath.map(encodeURIComponent).join('/');
    if (window.location.hash !== newHash) {
        window.location.hash = newHash;
    }
}
window.addEventListener('hashchange', () => {
    currentPath = getPathFromHash();
    updateGraph();
});

let currentPath = getPathFromHash();
// GRAPH FUNCTIONS

function updateGraph() {
    let nodeElements = [];
    let lineElements = [];

    function removeAllFromContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    function createNode(path_to_this_node, x, y, max_w, in_selected_path) {
        const node = document.createElement('div');
        if (in_selected_path) {
            node.className = 'node selected';
        } else {
            node.className = 'node';
        }
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.style.maxWidth = `${max_w}px`;
        node.path_to_this_node = path_to_this_node;
        node.textContent = path_to_this_node[path_to_this_node.length-1];
        node.x = x;
        node.y = y;
        return node;
    }

    function createLine(p1, p2, minDelta) {
        const line = document.createElement('div');
        line.p1 = p1;
        line.p2 = p2;
        const delta = p2.x - p1.x;
        line.style.transformOrigin = `0px 0px`;

        const y_delta = p2.y - p1.y

        if (delta == 0) {
            line.className = 'vertical-line';

            line.style.width = `${Math.abs(p2.y - p1.y)}px`;
            line.style.height = '2px';
            line.style.left = `${p1.x}px`;
            line.style.top = `${p1.y}px`;
            line.style.transform = `rotate(${Math.PI/2}rad)`;
        
        } else {
            line.style.height = '2px';
            line.style.left = `${p1.x}px`;
            line.style.top = `${p1.y}px`;
            
            const absDelta = Math.abs(delta);
            if (minDelta < y_delta) {
                line.className = 'advanced-short-line';
                line.style.setProperty('--after-before-size', `${minDelta/2}px`);
                line.style.setProperty('--after-before-size-2', `${y_delta/2}px`);
                line.style.width = `${absDelta - minDelta}px`;
                line.style.transform = `scaleX(${(delta > 0) ? 1 : -1}) translate(${minDelta/2}px, ${y_delta/2}px)`;
            } else {
                line.className = 'advanced-line';
                line.style.width = `${absDelta - y_delta}px`;
                line.style.setProperty('--after-before-size', `${y_delta/2}px`);
                line.style.transform = `scaleX(${(delta > 0) ? 1 : -1}) translate(${y_delta/2}px, ${y_delta/2}px)`;
            }
        }
        return line;
    }

    function renderPath(path) {
        const offset = (window.pageYOffset || document.documentElement.scrollTop);
        let y = 150;
        let x_space;
        let next_nodes = jsonData;
        let first_element;

        let last_row_of_lines = [];

        for (let i = 0; i < path.length+1; i++) {
            if (i == 0) {
                next_nodes = next_nodes;
            } else {
                next_nodes = next_nodes[path[i-1]];
            }
            y += 50;
            if (typeof next_nodes === 'object') {
                x_space = window.innerWidth / (Object.keys(next_nodes).length + 1);
                Object.entries(next_nodes).forEach(([key, _], index) => {
                    let nx = x_space * (index + 1);
                    const node = createNode(path.slice(0,i).concat([key]), nx, y, x_space, path.includes(key));
                    nodesContainer.appendChild(node)
                    y = node.getBoundingClientRect().bottom + node.getBoundingClientRect().height * .25 + offset;
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
                nodesContainer.appendChild(node)
                y = node.getBoundingClientRect().bottom + node.getBoundingClientRect().height * .25 + offset;
                nodeElements.push(node);
                node.className = "node description";
                node.id = "description";
                last_row_of_lines.push(i === 1 ? [first_element, node] : [lineElements[lineElements.length - 1][1], node]);
            }
        }
        lineElements = lineElements.concat(last_row_of_lines);
    }

    removeAllFromContainer(nodesContainer);
    removeAllFromContainer(linesContainer);

    renderPath(currentPath);

    const get_deltas = ps => Math.abs(ps[0].x - ps[1].x);
    const minValue = Math.min(...lineElements.map(get_deltas).filter(d => d !== 0));

    lineElements.forEach(line => linesContainer.appendChild(createLine(...line, minValue)));

    const y_scroll = (window.scrollY || window.pageYOffset);
    const get_y_max = node => node.getBoundingClientRect().bottom + y_scroll;

    const maxHeight = Math.max(...nodeElements.map(get_y_max));
    const separator = document.getElementById("content-spacer");

    let height = maxHeight - separator.getBoundingClientRect().top - y_scroll;

    separator.style.height = `${Math.max(height, 0)}px`;
}

document.addEventListener('click', event => {
    if (event.target.classList.contains('node') && !event.target.classList.contains("description")) {
        currentPath = event.target.path_to_this_node;
        updateURL();
    }
});

window.addEventListener('resize', () => {
    updateGraph();
});