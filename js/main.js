/* ============================================================
   main.js — Shared JavaScript across all pages

   This file is included on every page and handles:
   1. Building the sidebar nav from NAV_LINKS data
   2. Sticky header behavior
   3. Sidebar open/close
   4. Content iframe expand + scroll
   5. Accordion building (for cvraman.html)
   6. Teachers table building (for teachers.html)
   
   Data comes from data.js which must be loaded BEFORE this file.
   Both scripts are loaded at the bottom of <body> in this order:
     <script src="/js/data.js"></script>
     <script src="/js/main.js"></script>
   ============================================================ */


/* ============================================================
   UTILITY: Build sidebar nav links from data.js NAV_LINKS
   ============================================================ */
function buildSidebarNav() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  NAV_LINKS.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;

    a.addEventListener('click', (e) => {
      // Prevent the browser from navigating away from index.html
      e.preventDefault();

      // Manually load the page into the iframe
      const frame = document.getElementById('content-frame');
      if (frame) {
        frame.src = link.href;
      }

      openContentFrame();
      closeSidebar();
    });

    sidebar.appendChild(a);
  });
}


/* ============================================================
   STICKY HEADER
   ============================================================ */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  /* Record how far from top the header starts */
  const headerOffset = header.offsetTop;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle('site-header--sticky', !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: '0px' }
  );

  const sentinel = document.getElementById('header-sentinel');
  if (sentinel) observer.observe(sentinel);
}


/* ============================================================
   SIDEBAR OPEN / CLOSE
   ============================================================ */
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.add('is-open');
    sidebar.setAttribute('aria-hidden', 'false');
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.remove('is-open');
    sidebar.setAttribute('aria-hidden', 'true');
  }
}


/* ============================================================
   CONTENT IFRAME EXPAND
   ============================================================ */
function openContentFrame() {
  const frame = document.getElementById('content-frame');
  if (!frame) return;

  frame.classList.add('is-active');

  requestAnimationFrame(() => {
    frame.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}


/* ============================================================
   ACCORDION — builds floor plan accordions from CVR_FLOORS data
   Only runs on cvraman.html where #accordion-container exists.
   ============================================================ */
function buildAccordion() {
  const container = document.getElementById('accordion-container');
  if (!container || typeof CVR_FLOORS === 'undefined') return;

  CVR_FLOORS.forEach(floor => {
    /* Create button */
    const btn = document.createElement('button');
    btn.className = 'accordion-btn';
    btn.type = 'button';
    btn.textContent = floor.label;

    btn.setAttribute('aria-expanded', 'false');

    /* Create panel */
    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    panel.setAttribute('role', 'region');

    /* Create image */
    const img = document.createElement('img');
    
    img.src = `/assets/images/${floor.image}`;
    img.alt = floor.alt;
    img.style.width = '80%';
    img.loading = 'lazy';

    panel.appendChild(img);

    /* Toggle logic */
    btn.addEventListener('click', () => {
      const isOpen = panel.classList.contains('is-open');

      /* Close ALL panels first (only one open at a time) */
      document.querySelectorAll('.accordion-panel.is-open').forEach(p => {
        p.classList.remove('is-open');
      });
      document.querySelectorAll('.accordion-btn.is-active').forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-expanded', 'false');
      });

      /* Toggle current */
      if (!isOpen) {
        panel.classList.add('is-open');
        btn.classList.add('is-active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    container.appendChild(btn);
    container.appendChild(panel);
  });
}


/* ============================================================
   TEACHERS TABLE — builds from TEACHERS data in data.js
   Only runs on teachers.html where #teachers-table-body exists.
   ============================================================ */
function buildTeachersTable() {
  const tbody = document.getElementById('teachers-table-body');
  if (!tbody || typeof TEACHERS === 'undefined') return;

  TEACHERS.forEach((teacher, index) => {
    const tr = document.createElement('tr');

    /* Row number */
    const tdNum = document.createElement('td');
    tdNum.textContent = index + 1;
    tr.appendChild(tdNum);

    /* Letter group marker */
    const tdLetter = document.createElement('td');
    if (teacher.letter) {
      tdLetter.textContent = teacher.letter;
      tdLetter.className = 'letter-group';
    }
    tr.appendChild(tdLetter);

    /* Name */
    const tdName = document.createElement('td');
    tdName.textContent = teacher.name;
    tr.appendChild(tdName);

    /* Dept */
    const tdDept = document.createElement('td');
    tdDept.textContent = teacher.dept;
    tr.appendChild(tdDept);

    /* Location */
    const tdLoc = document.createElement('td');
    tdLoc.textContent = teacher.location;
    tr.appendChild(tdLoc);

    tbody.appendChild(tr);
  });
}


/* ============================================================
   FOOTER CREDITS — builds from CREDITS array in data.js
   ============================================================ */
function buildFooterCredits() {
  const el = document.getElementById('footer-credits');
  if (!el || typeof CREDITS === 'undefined') return;

  /* Join names with a separator and display as plain text */
  el.textContent = 'Made by: ' + CREDITS.join(' · ');
}


/* ============================================================
   CLOSE SIDEBAR WHEN CLICKING OUTSIDE IT
   ============================================================ */
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('nav-toggle');
  if (!sidebar) return;

  /* If click is outside sidebar AND not on the toggle button */
  if (!sidebar.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
    closeSidebar();
  }
});


/* ============================================================
   KEYBOARD: Close sidebar on Escape key
   ============================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});


/* ============================================================
   INIT — Run everything on page load
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildSidebarNav();
  initStickyHeader();
  buildAccordion();
  buildTeachersTable();
  buildFooterCredits();
});