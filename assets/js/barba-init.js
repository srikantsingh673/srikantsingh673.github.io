/* ============================================================
   barba-init.js  —  Page transitions via Barba.js
   ============================================================ */

'use strict';

barba.init({
  /* Skip external links, anchors, mailto, javascript: hrefs */
  prevent: ({ el }) => {
    const href = el.getAttribute('href') || '';
    return (
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('#') ||
      href.startsWith('javascript') ||
      el.target === '_blank'
    );
  },

  transitions: [{
    name: 'fade',

    leave({ current }) {
      return new Promise(resolve => {
        current.container.style.transition = 'opacity 0.22s ease';
        current.container.style.opacity = '0';
        setTimeout(resolve, 220);
      });
    },

    enter({ next }) {
      /* Scroll to top while content is still invisible */
      window.scrollTo(0, 0);
      /* Update active nav link immediately */
      initActiveNav();
      /* Attach scroll-reveal observer to static .sr elements in new container */
      initScrollReveal();

      next.container.style.opacity = '0';
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          next.container.style.transition = 'opacity 0.28s ease';
          next.container.style.opacity = '1';
          setTimeout(resolve, 280);
        });
      });
    }
  }],

  /* Start loading page content in beforeEnter so the fetch runs
     during the leave animation, keeping perceived load time low */
  views: [
    { namespace: 'home',              beforeEnter() { window.initPage('home'); } },
    { namespace: 'projects',          beforeEnter() { window.initPage('projects'); } },
    { namespace: 'research-articles', beforeEnter() { window.initPage('research-articles'); } },
    { namespace: 'about',             beforeEnter() { window.initPage('about'); } },
    { namespace: 'post',              beforeEnter() { window.initPage('post'); } }
  ]
});
