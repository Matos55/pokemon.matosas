const resultsEl = document.getElementById('results');
const searchEl = document.getElementById('search');

let people = [];

// placeholder SVG data URL used when image file is missing
const PLACEHOLDER_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#f0f2f4" width="100%" height="100%"/><text x="50%" y="50%" font-size="20" text-anchor="middle" fill="#9aa4ad" dy="7">no image</text></svg>'
);

function createCard(p) {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
    <img class="avatar" src="${p.image}" alt="${p.avatar}">
    <div class="person-name">${p.name}</div>
    <div class="person-avatar">${p.avatar}</div>
  `;
    const img = el.querySelector('img');
    img.onerror = () => {
        img.src = PLACEHOLDER_SVG;
        img.dataset.missing = '1';
    };
    return el;
}

function render(list) {
    resultsEl.innerHTML = '';
    if (!list.length) {
        const empty = document.createElement('div');
        empty.className = 'empty';
        empty.textContent = 'No results — try another term.';
        resultsEl.appendChild(empty);
        return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(p => frag.appendChild(createCard(p)));
    resultsEl.appendChild(frag);
}

function doSearch(q) {
    q = (q || '').trim().toLowerCase();
    if (!q) return render(people);
    const filtered = people.filter(p => {
        return p.name.toLowerCase().includes(q) || p.avatar.toLowerCase().includes(q);
    });
    render(filtered);
}

fetch('people.json')
    .then(r => r.json())
    .then(data => {
        people = data;
        render(people);
    })
    .catch(err => {
        resultsEl.innerHTML = '<div class="empty">Unable to load people.json</div>';
        console.error(err);
    });

searchEl.addEventListener('input', ev => doSearch(ev.target.value));
