const REPO = 'reliable-code/site-enhancer-scripts';
const BRANCH = 'main';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/`;
const TREE_URL = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
const SCRIPT_PATTERN = /^(systematic|specific)\/[^/]+\.user\.js$/;
const CATEGORIES = [
    {
        id: 'systematic',
        title: 'Systematic',
        description: 'Built with a shared approach.',
    },
    {
        id: 'specific',
        title: 'Specific',
        description: 'Built for specific purposes.',
    },
];

const scriptList = document.querySelector('#script-list');
const search = document.querySelector('#script-search');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const errorState = document.querySelector('#error-state');
const errorMessage = document.querySelector('#error-message');
const retryButton = document.querySelector('#retry-button');
const scriptCount = document.querySelector('#script-count');
const sortSelect = document.querySelector('#script-sort');

let loaded = false;
let loadedScripts = [];

function parseMetadata(text) {
    const metadata = {};
    const header = text.split('// ==/UserScript==')[0];

    header.split('\n').forEach((line) => {
        const match = line.match(/^\/\/\s+@([^\s]+)\s+(.+?)\s*$/);
        if (match) metadata[match[1]] = match[2];
    });

    return metadata;
}

function fileName(path) {
    return path.split('/').pop().replace(/\.user\.js$/, '');
}

async function fetchScript(path, url) {
    const response = await fetch(url, {
        headers: { Range: 'bytes=0-2047' },
        cache: 'no-store',
    });

    if (!response.ok) throw new Error(`Failed to fetch ${path}: ${response.status}`);

    let text = await response.text();
    let metadata = parseMetadata(text);

    if (!metadata.version && !text.includes('// ==/UserScript==')) {
        const fullResponse = await fetch(url, { cache: 'no-store' });
        if (!fullResponse.ok) throw new Error(`Failed to fetch ${path}: ${fullResponse.status}`);
        text = await fullResponse.text();
        metadata = parseMetadata(text);
    }

    return {
        path,
        name: metadata.name || fileName(path),
        description: metadata.description || '',
        version: metadata.version || '',
        downloadURL: metadata.downloadURL || RAW_BASE + path,
    };
}

async function loadScripts() {
    const cacheBuster = Date.now();
    const response = await fetch(`${TREE_URL}&t=${cacheBuster}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    const tree = await response.json();
    const paths = tree.tree
        .filter((item) => item.type === 'blob' && SCRIPT_PATTERN.test(item.path))
        .map((item) => item.path)
        .sort();

    if (paths.length === 0) throw new Error('No user scripts found');

    return Promise.all(paths.map(async (path) => {
        const url = `${RAW_BASE}${path}?t=${cacheBuster}`;

        try {
            return await fetchScript(path, url);
        } catch {
            return {
                path,
                name: fileName(path),
                description: '',
                version: '',
                downloadURL: RAW_BASE + path,
            };
        }
    }));
}

function compareVersions(left, right) {
    const leftParts = left.version.split('.').map((part) => Number(part) || 0);
    const rightParts = right.version.split('.').map((part) => Number(part) || 0);
    const length = Math.max(leftParts.length, rightParts.length);

    for (let index = 0; index < length; index += 1) {
        const difference = (rightParts[index] || 0) - (leftParts[index] || 0);
        if (difference !== 0) return difference;
    }

    return 0;
}

function sortScripts(scripts, mode) {
    const sorted = [...scripts];

    if (mode === 'name') {
        sorted.sort((left, right) => left.name.localeCompare(right.name));
    } else {
        sorted.sort((left, right) => compareVersions(left, right) || left.name.localeCompare(right.name));
    }

    return sorted;
}

function createCard(script) {
    const card = document.createElement('article');
    card.className = 'script-card';
    card.dataset.search = `${script.name} ${script.description}`.toLowerCase();

    const body = document.createElement('div');
    body.className = 'script-card__body';

    const title = document.createElement('h3');
    title.textContent = script.name;
    body.append(title);

    if (script.description) {
        const description = document.createElement('p');
        description.textContent = script.description;
        body.append(description);
    }

    const footer = document.createElement('div');
    footer.className = 'script-card__footer';

    const version = document.createElement('span');
    version.className = 'version';
    version.textContent = script.version ? `v${script.version}` : 'v?';
    if (!script.version) version.title = 'Version unavailable';

    const link = document.createElement('a');
    link.className = 'install-link';
    link.href = script.downloadURL;
    link.target = '_blank';
    link.rel = 'noopener';
    link.append('Install');

    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    link.append(arrow);

    footer.append(version, link);
    card.append(body, footer);

    return card;
}

function createSection(category, scripts) {
    const section = document.createElement('section');
    section.className = 'script-section';
    section.dataset.category = category.id;

    const heading = document.createElement('div');
    heading.className = 'section-heading';

    const titleGroup = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = category.title;
    titleGroup.append(title);

    const description = document.createElement('p');
    description.textContent = category.description;

    heading.append(titleGroup, description);

    const grid = document.createElement('div');
    grid.className = 'script-grid';
    scripts.forEach((script) => grid.append(createCard(script)));

    section.append(heading, grid);
    return section;
}

function applySearch() {
    if (!loaded) return;

    const query = search.value.trim().toLowerCase();
    let visibleCount = 0;

    scriptList.querySelectorAll('.script-card').forEach((card) => {
        const isVisible = !query || card.dataset.search.includes(query);
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
    });

    scriptList.querySelectorAll('.script-section').forEach((section) => {
        section.hidden = !section.querySelector('.script-card:not([hidden])');
    });

    resultCount.textContent = visibleCount + (visibleCount === 1 ? ' script' : ' scripts');
    emptyState.hidden = visibleCount !== 0;
}

function render(scripts) {
    loadedScripts = scripts;
    const groups = new Map(CATEGORIES.map((category) => [category.id, []]));

    sortScripts(scripts, sortSelect.value).forEach((script) => {
        const categoryId = script.path.split('/')[0];
        if (groups.has(categoryId)) groups.get(categoryId).push(script);
    });

    scriptList.replaceChildren();

    CATEGORIES.forEach((category) => {
        const categoryScripts = groups.get(category.id);
        if (categoryScripts.length > 0) {
            scriptList.append(createSection(category, categoryScripts));
        }
    });

    scriptCount.textContent = String(scripts.length);
    loaded = true;
    applySearch();
}

function showError(message) {
    loaded = false;
    scriptList.replaceChildren();
    errorMessage.textContent = message;
    errorState.hidden = false;
    emptyState.hidden = true;
    resultCount.textContent = '0 scripts';
    scriptCount.textContent = '0';
}

async function init() {
    errorState.hidden = true;
    resultCount.textContent = 'Loading scripts…';
    scriptCount.textContent = '…';

    try {
        const scripts = await loadScripts();
        render(scripts);
    } catch {
        showError('Could not load scripts from GitHub. Check your connection and try again.');
    }
}

search.addEventListener('input', applySearch);
sortSelect.addEventListener('change', () => {
    if (loaded) render(loadedScripts);
});
retryButton.addEventListener('click', init);

init();
