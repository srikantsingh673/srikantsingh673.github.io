/* ============================================================
   main.js  —  Navigation, markdown loading, TOC, utils
   ============================================================ */

'use strict';

/* ── Sidebar toggle (mobile) ──────────────────────────────── */
function initSidebar() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!hamburger) return;

  function open() { sidebar.classList.add('open'); overlay.classList.add('visible'); hamburger.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { sidebar.classList.remove('open'); overlay.classList.remove('visible'); hamburger.classList.remove('open'); document.body.style.overflow = ''; }

  hamburger.addEventListener('click', () => sidebar.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => e.key === 'Escape' && close());
  sidebar.querySelectorAll('.nav__link').forEach(link => link.addEventListener('click', close));
}

/* ── Active nav link ──────────────────────────────────────── */
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── Scroll-reveal ────────────────────────────────────────── */
function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.06 });
  document.querySelectorAll('.sr').forEach(el => io.observe(el));
}

/* ── Reading progress bar ─────────────────────────────────── */
let _progressScrollCleanup = null;
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  if (_progressScrollCleanup) { _progressScrollCleanup(); _progressScrollCleanup = null; }
  function update() {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) || 0;
    bar.style.transform = `scaleX(${pct})`;
  }
  window.addEventListener('scroll', update, { passive: true });
  _progressScrollCleanup = () => window.removeEventListener('scroll', update);
}

/* ── TOC builder ──────────────────────────────────────────── */
let _tocScrollCleanup = null;
function buildTOC(contentEl, tocEl) {
  if (!contentEl || !tocEl) return;
  const headings = contentEl.querySelectorAll('h2, h3');
  if (!headings.length) { tocEl.closest('.post-aside')?.remove(); return; }

  const list = document.createElement('ul');
  list.className = 'toc__list';

  headings.forEach((h, i) => {
    if (!h.id) h.id = 'heading-' + i;
    const item = document.createElement('li');
    item.className = 'toc__item depth-' + h.tagName.slice(1);
    const link = document.createElement('a');
    link.className = 'toc__link';
    link.href = '#' + h.id;
    link.textContent = h.textContent;
    link.addEventListener('click', e => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    item.appendChild(link);
    list.appendChild(item);
  });

  tocEl.innerHTML = '';
  const title = document.createElement('div');
  title.className = 'toc__title';
  title.textContent = 'On this page';
  tocEl.appendChild(title);
  tocEl.appendChild(list);

  // Highlight active section based on scroll position — no dead zones
  const links = tocEl.querySelectorAll('.toc__link');
  if (_tocScrollCleanup) { _tocScrollCleanup(); _tocScrollCleanup = null; }

  function updateActive() {
    let current = null;
    headings.forEach(h => {
      if (h.getBoundingClientRect().top <= 120) current = h;
    });
    links.forEach(l => l.classList.remove('active'));
    const target = current
      ? tocEl.querySelector(`a[href="#${current.id}"]`)
      : links[0];
    if (target) target.classList.add('active');
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  _tocScrollCleanup = () => window.removeEventListener('scroll', updateActive);
  updateActive();
}

/* ── Front-matter parser ──────────────────────────────────── */
function parseFrontMatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const sep = line.indexOf(':');
    if (sep < 0) return;
    const key = line.slice(0, sep).trim();
    let val = line.slice(sep + 1).trim().replace(/^["']|["']$/g, '');
    // Handle inline arrays: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
    }
    meta[key] = val;
  });
  return { meta, body: match[2] };
}

/* ── Markdown renderer (marked + KaTeX + Prism) ──────────── */
if (window.marked) marked.setOptions({ gfm: true, breaks: false });

async function renderMarkdown(raw, targetEl) {
  if (!targetEl) return;

  const { meta, body } = parseFrontMatter(raw);

  if (window.marked) {
    // Pre-process: protect LaTeX blocks before marked parses
    let processed = body
      .replace(/\$\$([^$]+)\$\$/g, (_, m) => `<katex-block>${m}</katex-block>`)
      .replace(/\$([^$\n]+)\$/g, (_, m) => `<katex-inline>${m}</katex-inline>`);

    let html = marked.parse(processed);

    // Post-process: render KaTeX
    if (window.katex) {
      html = html
        .replace(/<katex-block>([\s\S]*?)<\/katex-block>/g, (_, tex) => {
          try { return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false }); }
          catch { return `<pre>${tex}</pre>`; }
        })
        .replace(/<katex-inline>([\s\S]*?)<\/katex-inline>/g, (_, tex) => {
          try { return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false }); }
          catch { return `<code>${tex}</code>`; }
        });
    }

    targetEl.innerHTML = html;
  } else {
    targetEl.textContent = body;
  }

  // Re-run Prism on code blocks
  if (window.Prism) Prism.highlightAllUnder(targetEl);

  return meta;
}

/* ── Load a content file and render post page ─────────────── */
async function loadPost() {
  const params = new URLSearchParams(window.location.search);
  const src = params.get('src');   // e.g. content/projects/nlp-pipeline.md
  const type = params.get('type');  // project | article | research

  const titleEl = document.getElementById('post-title');
  const metaEl = document.getElementById('post-meta');
  const proseEl = document.getElementById('prose');
  const tocEl = document.getElementById('toc');
  const loadingEl = document.getElementById('post-loading');

  if (!src || !proseEl) {
    if (loadingEl) loadingEl.remove();
    return;
  }

  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error('Not found');
    const text = await res.text();
    const meta = await renderMarkdown(text, proseEl);

    if (loadingEl) loadingEl.remove();

    if (titleEl && meta?.title) titleEl.textContent = meta.title;
    document.title = (meta?.title || 'Post') + ' — Srikant';

    // Build meta bar
    if (metaEl && meta) {
      const items = [];
      if (meta.date) items.push(`<span class="post-meta__item"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="2" width="14" height="13" rx="2"/><path d="M1 6h14M5 1v2M11 1v2"/></svg>${meta.date}</span>`);
      if (meta.venue) items.push(`<span class="post-meta__item"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2h12v10H2z"/><path d="M5 8h6M5 5h4"/></svg>${meta.venue}</span>`);
      if (meta.status) {
        const cls = { published: 'tag-green', review: 'tag-amber', preprint: 'tag-blue' }[meta.status] || '';
        items.push(`<span class="tag ${cls}">${meta.status}</span>`);
      }
      if (meta.github) items.push(`<a href="javascript:void(0)" 
       onclick="event.preventDefault();" 
       class="btn btn-outline disabled-link"
       style="font-size:0.75rem;padding:0.3em 0.85em;cursor:not-allowed;opacity:0.6;">
       GitHub🔒
    </a>`);
      if (meta.paper_url && meta.paper_url !== '#') items.push(`<a href="${meta.paper_url}" target="_blank" class="btn btn-dark" style="font-size:0.75rem;padding:0.3em 0.85em;">PDF ↗</a>`);
      metaEl.innerHTML = items.join('');
    }

    // Tech stack tags
    if (meta?.tags && proseEl) {
      const tagBar = document.createElement('div');
      tagBar.style.cssText = 'display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--border)';
      const arr = Array.isArray(meta.tags) ? meta.tags : [meta.tags];
      arr.forEach(t => {
        const s = document.createElement('span');
        s.className = 'tag tag-mono';
        s.textContent = t;
        tagBar.appendChild(s);
      });
      proseEl.appendChild(tagBar);
    }

    buildTOC(proseEl, tocEl);
    initScrollReveal();

  } catch (err) {
    if (proseEl) proseEl.innerHTML = `<p style="color:var(--ink-3)">Could not load content. Make sure you're running a local server.</p>`;
  }
}

/* ── Load listing data (projects / articles / research) ────── */
async function loadListing(jsonPath, renderFn, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error();
    const data = await res.json();
    el.innerHTML = '';
    renderFn(data, el);
    initScrollReveal();
  } catch {
    el.innerHTML = '<p style="color:var(--ink-3);font-size:0.875rem;">Could not load data. Run from a local server.</p>';
  }
}

/* ── Render helpers ───────────────────────────────────────── */
function renderProjectCards(items, el) {
  el.insertAdjacentHTML('beforeend', items.map(p => `
    <a href="post.html?src=${p.file}&type=project" class="card sr" style="text-decoration:none;color:inherit;">
      <div class="card__image">
        <img src="${p.image || 'assets/images/placeholder.svg'}" alt="${p.title}" loading="lazy" onerror="this.parentElement.style.background='var(--bg)'">
      </div>
      <div class="card__body">
        <div class="card__stack">
          ${(p.stack || []).slice(0, 4).map(s => `<span class="tag tag-mono">${s}</span>`).join('')}
          ${p.status === 'Production' ? '<span class="tag tag-green">Production</span>' : ''}
          ${p.status === 'Staging' ? '<span class="tag tag-amber">Staging</span>' : ''}
        </div>
        <div class="card__title">${p.title}</div>
        <div class="card__excerpt">${p.excerpt}</div>
        <div class="card__footer">
          <span class="card__meta">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="2" width="14" height="13" rx="2"/><path d="M1 6h14M5 1v2M11 1v2"/></svg>
            ${p.date || ''}
          </span>
          <span class="card__link">Read more <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>
        </div>
      </div>
    </a>`).join(''));
}

function renderArticleList(items, el) {
  el.insertAdjacentHTML('beforeend', items.map(a => {
    const d = new Date(a.date || '');
    const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();
    const day = isNaN(d) ? '' : d.getDate();
    return `
    <a href="post.html?src=${a.file}&type=article" class="article-item sr" style="text-decoration:none;">
      <div class="article-item__date">
        <div class="article-item__month">${month}</div>
        <div class="article-item__day">${day}</div>
      </div>
      <div class="article-item__body">
        <div class="article-item__title">${a.title}</div>
        <div class="article-item__excerpt">${a.excerpt}</div>
        <div class="article-item__tags">
          ${(a.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </a>`;
  }).join(''));
}

function renderResearchList(items, el) {
  el.insertAdjacentHTML('beforeend', items.map(r => {
    const badgeClass = { published: 'published', review: 'review', preprint: 'preprint' }[r.status] || 'review';
    return `
    <a href="post.html?src=${r.file}&type=research" class="research-item sr" style="display:block;text-decoration:none;color:inherit;">
      <div class="research-item__header">
        <span class="research-badge ${badgeClass}">${r.status || 'preprint'}</span>
        <div class="research-item__title">${r.title}</div>
      </div>
      <div class="research-item__venue">${r.venue || ''}</div>
      <div class="research-item__abstract">${r.abstract}</div>
      <div class="research-item__actions">
        <span class="btn btn-outline" style="font-size:0.75rem;padding:0.35em 1em;">Read →</span>
      </div>
    </a>`;
  }).join(''));
}

/* ── Contact form handler (used by about.html) ────────────── */
window.handleContact = async function handleContact(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('cf-btn');
  const status = document.getElementById('cf-status');

  btn.disabled = true;
  btn.textContent = 'Sending…';
  status.textContent = '';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      status.textContent = 'Message sent! Excited to connect with you.';
      status.style.color = 'var(--green)';
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    status.textContent = 'Something went wrong. Email me directly at srikantsingh673@gmail.com';
    status.style.color = 'var(--amber)';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Message';
    setTimeout(() => { status.textContent = ''; }, 6000);
  }
};

/* ── Page-specific init (called on first load + Barba transitions) ── */
window.initPage = function initPage(namespace) {
  initProgressBar();

  if (namespace === 'post') loadPost();
  if (namespace === 'projects') loadListing('content/data/projects.json', renderProjectCards, 'projects-list');
  if (namespace === 'research-articles') {
    loadListing('content/data/research.json', renderResearchList, 'research-list');
    loadListing('content/data/articles.json', renderArticleList, 'articles-list');
  }
  if (namespace === 'home') {
    loadListing('content/data/projects.json', (d, el) => renderProjectCards(d.slice(0, 3), el), 'featured-projects');
    loadListing('content/data/articles.json', (d, el) => renderArticleList(d.slice(0, 3), el), 'featured-articles');
    loadListing('content/data/research.json', (d, el) => renderResearchList(d.slice(0, 2), el), 'featured-research');
  }
};

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initActiveNav();
  initScrollReveal();

  const ns = document.querySelector('[data-barba="container"]')?.dataset.barbaNamespace;
  if (ns) window.initPage(ns);
});
