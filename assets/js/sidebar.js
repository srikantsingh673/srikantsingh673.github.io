/* Shared sidebar HTML — injected by each page */
const SIDEBAR_HTML = `
<aside class="sidebar" id="sidebar">
  <div class="sidebar__header">
    <div class="sidebar__avatar">S</div>
    <div class="sidebar__name">Srikant Singh</div>
    <div class="sidebar__tagline">Software Developer &amp; Researcher · Python · NLP · AI</div>
  </div>

  <nav class="sidebar__nav">
    <div class="nav__label">Menu</div>
    <a class="nav__link" href="index.html">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 6l7-5 7 5v8a1 1 0 01-1 1H2a1 1 0 01-1-1V6z"/><path d="M6 15V9h4v6"/></svg>
      Home
    </a>
    <a class="nav__link" href="projects.html">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
      Projects
    </a>
    <a class="nav__link" href="research.html">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2h12v12H2z"/><path d="M5 5h6M5 8h6M5 11h3"/></svg>
      Research & Articles
    </a>
    <a class="nav__link" href="about.html">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6"/></svg>
      About &amp; Contact
    </a>
  </nav>

  <div class="sidebar__social">
    <a class="social__link" href="https://github.com/srikant-siddhiyoga" target="_blank" title="GitHub">
      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
    </a>
    <a class="social__link" href="https://linkedin.com/in/srikant" target="_blank" title="LinkedIn">
      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
    </a>
    <a class="social__link" href="mailto:srikantsingh673@gmail.com" title="Email">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="14" height="10" rx="1.5"/><path d="M1 4l7 5 7-5"/></svg>
    </a>
    <a class="social__link" href="#" title="Google Scholar">
      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 7.5L0 3l8-3 8 3-8 4.5zM3 5.3V10c0 1.1 2.2 2.5 5 2.5s5-1.4 5-2.5V5.3L8 8 3 5.3z"/></svg>
    </a>
  </div>

  <div class="sidebar__footer">© 2025 Srikant</div>
</aside>

<div class="sidebar-overlay" id="sidebar-overlay"></div>

<header class="topbar">
  <a class="topbar__brand" href="index.html">Srikant</a>
  <button class="hamburger" id="hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</header>
`;

// Inject into page
document.getElementById('sidebar-root').innerHTML = SIDEBAR_HTML;
