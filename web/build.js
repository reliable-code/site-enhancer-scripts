const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(__dirname, 'dist');
const CATEGORIES = ['systematic', 'specific'];

function readScripts(category) {
    const categoryDir = path.join(ROOT_DIR, category);

    return fs.readdirSync(categoryDir)
        .filter((fileName) => fileName.endsWith('.user.js'))
        .sort((left, right) => left.localeCompare(right))
        .map((fileName) => parseMetadata(category, fileName));
}

function parseMetadata(category, fileName) {
    const filePath = path.join(ROOT_DIR, category, fileName);
    const source = fs.readFileSync(filePath, 'utf8');
    const metadata = {};

    source.split('\n')
        .slice(0, source.split('\n').findIndex((line) => line.includes('// ==/UserScript==')))
        .forEach((line) => {
            const match = line.match(/^\/\/\s+@([^\s]+)\s+(.+?)\s*$/);
            if (match) metadata[match[1]] = match[2];
        });

    if (!metadata.name || !metadata.downloadURL) {
        throw new Error(`Missing @name or @downloadURL in ${category}/${fileName}`);
    }

    return {
        name: metadata.name,
        description: metadata.description || '',
        version: metadata.version || '',
        downloadURL: metadata.downloadURL,
    };
}

function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function createScriptCard(script) {
    return `
        <article class="script-card">
            <div class="script-card__body">
                <h3>${escapeHtml(script.name)}</h3>
                <p>${escapeHtml(script.description)}</p>
            </div>
            <div class="script-card__footer">
                <span class="version">v${escapeHtml(script.version)}</span>
                <a class="install-link" href="${escapeHtml(script.downloadURL)}" target="_blank" rel="noopener">
                    Install
                    <span aria-hidden="true">↗</span>
                </a>
            </div>
        </article>`;
}

function createCategorySection(category, scripts) {
    const title = category === 'systematic' ? 'Systematic' : 'Specific';
    const description = category === 'systematic'
        ? 'Built with a shared approach.'
        : 'Built for specific purposes.';

    return `
        <section class="script-section" data-category="${category}">
            <div class="section-heading">
                <div>
                    <h2>${title}</h2>
                </div>
                <p>${description}</p>
            </div>
            <div class="script-grid">
                ${scripts.map(createScriptCard).join('')}
            </div>
        </section>`;
}

function createPage(categories) {
    const allScripts = Object.values(categories).flat();
    const sections = CATEGORIES.map((category) => createCategorySection(
        category,
        categories[category],
    )).join('');
    const scriptsJson = JSON.stringify(allScripts).replaceAll('<', '\\u003c');

    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>Site Enhancer Scripts</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <main class="page-shell">
        <header class="hero">
            <div class="hero-copy">
                <p class="eyebrow">Personal toolkit</p>
                <h1>Site enhancer scripts</h1>
                <p class="hero-description">Small browser tools for a calmer, more useful web.</p>
            </div>
            <div class="hero-count"><strong>${allScripts.length}</strong><span>available tools</span></div>
        </header>

        <div class="toolbar">
            <label class="search-box">
                <span class="search-icon" aria-hidden="true">⌕</span>
                <span class="visually-hidden">Search scripts</span>
                <input id="script-search" type="search" placeholder="Search scripts" autocomplete="off">
            </label>
            <p id="result-count" class="result-count">${allScripts.length} scripts</p>
        </div>

        <div id="script-list">
            ${sections}
        </div>

        <p id="empty-state" class="empty-state" hidden>No scripts match your search.</p>
        <footer class="page-footer">Install with your userscript manager.</footer>
    </main>
    <script>
        const scripts = ${scriptsJson};
        const search = document.querySelector('#script-search');
        const resultCount = document.querySelector('#result-count');
        const emptyState = document.querySelector('#empty-state');
        const cards = [...document.querySelectorAll('.script-card')];

        search.addEventListener('input', () => {
            const query = search.value.trim().toLowerCase();
            let visibleCount = 0;

            cards.forEach((card, index) => {
                const script = scripts[index];
                const isVisible = !query
                    || (script.name + ' ' + script.description).toLowerCase().includes(query);
                card.hidden = !isVisible;
                if (isVisible) visibleCount += 1;
            });

            document.querySelectorAll('.script-section').forEach((section) => {
                section.hidden = !section.querySelector('.script-card:not([hidden])');
            });
            resultCount.textContent = visibleCount + (visibleCount === 1 ? ' script' : ' scripts');
            emptyState.hidden = visibleCount !== 0;
        });
    </script>
</body>
</html>`;
}

const categories = Object.fromEntries(CATEGORIES.map((category) => [category, readScripts(category)]));
fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), createPage(categories));
fs.copyFileSync(path.join(__dirname, 'styles.css'), path.join(OUTPUT_DIR, 'styles.css'));
console.log(`Built ${Object.values(categories).flat().length} scripts in ${OUTPUT_DIR}`);
