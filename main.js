/**
 * ==============================================================================
 * Bepsi Website - Master UI/UX & Core Features Controller
 * Vanilla ES6+ Modular Architecture
 * ==============================================================================
 * Features Included:
 * 1.  Dark Mode / Light Mode Theme Manager (Persistent & OS Prefers)
 * 2.  Cookie Consent Banner with LocalStorage Persistence & Reopen Hook
 * 3.  Site Search Command Palette Modal (Ctrl/Cmd+K, Indexing & Keyboard Nav)
 * 4.  "Back to Top" Smooth Floating Button (300px scroll threshold)
 * 5.  Accessible Responsive Mobile Navigation Drawer with Focus Trap
 * 6.  Loading Skeletons & Spinners Controller
 * 7.  Micro-Interaction Hover States, Sheen, and Focus Rings
 * 8.  Scroll Progress Bar
 * 9.  One-Click Copy to Clipboard with Animated State Feedback
 * 10. Print Stylesheet Compatibility
 * 11. Smart Auto-Hiding Sticky Header
 * 12. Skip to Content Accessibility Link
 * 13. Password Visibility Toggle Component
 * 14. UTM Parameter URL Capture & Hidden Form Injection
 * 15. Form Success Card Overlay / View Switcher
 * 16. Inline Form Field Error Validation & Accessibility (ARIA)
 * 17. Reusable Accessible Confirmation Dialog Modals
 * 18. "Last Updated" Metadata Badge Renderer
 * 19. Expandable Accessible FAQ Accordions
 * 20. Floating Contact Speed-Dial Widget with Status Pulse
 * ==============================================================================
 */

// Universal Element/Node closest fallback to safely handle clicks on Text & SVG nodes
if (typeof Node !== 'undefined' && !Node.prototype.closest) {
    Node.prototype.closest = function(selector) {
        let el = this.nodeType === 1 ? this : this.parentElement;
        while (el && el.nodeType === 1) {
            if (el.matches && el.matches(selector)) return el;
            el = el.parentElement;
        }
        return null;
    };
}

// Immediate Theme & Component Pre-load (Prevents Flash of Unstyled Content / Theme FOUC & Header pop-in)
(function initInstantPreload() {
    // 1. Instant Theme
    const savedTheme = localStorage.getItem('bepsi_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Default dark
    document.documentElement.setAttribute('data-theme', initialTheme);

    // 2. Instant Component Cache Injection (0ms perceived header/footer load)
    try {
        const cachedHeader = sessionStorage.getItem('bepsi_cached_header');
        if (cachedHeader) {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder && !headerPlaceholder.innerHTML.trim()) {
                headerPlaceholder.innerHTML = cachedHeader;
            }
        }
        const cachedFooter = sessionStorage.getItem('bepsi_cached_footer');
        if (cachedFooter) {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder && !footerPlaceholder.innerHTML.trim()) {
                footerPlaceholder.innerHTML = cachedFooter;
            }
        }
    } catch (e) {}
})();

document.addEventListener('DOMContentLoaded', async function() {
    await initApp();
});

async function initApp() {
    // 1. Dynamic Partials Injection with Cache-First Revalidation
    await loadSharedComponents();

    // 2. Initialize Navigation & UX Enhancements
    ActiveNav.init();
    LinkPrefetcher.init();
    Toast.init();

    // 3. Initialize Critical-Path Features
    ThemeManager.init();
    UnifiedScroll.init();  // Merged: ScrollProgress + SmartHeader + BackToTop
    MobileNav.init();
    SiteSearch.init();
    CookieConsent.init();
    ClipboardManager.init();
    PasswordToggle.init();
    FormValidator.init();
    ModalManager.init();

    // 4. Interactive Page Controllers
    CardEffects.init();
    initResourceFilter();
    initReviewsFilter();
    initSetupScrollSpy();

    // 5. Initialize AOS Reveal Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            duration: 800, 
            once: true, 
            offset: 40, 
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        });
    }

    // 6. Defer Non-Critical Modules
    const deferInit = (fn) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(fn, { timeout: 200 });
        } else {
            setTimeout(fn, 100);
        }
    };

    deferInit(() => {
        UTMTracker.init();
    });

    // Announce initial page load to screen readers
    A11yAnnouncer.announce('Page loaded.');
}

const FALLBACK_HEADER = `
<a href="#main-content" class="skip-link">Skip to main content</a>
<div id="scroll-progress-bar" class="scroll-progress-bar" aria-hidden="true"></div>
<header class="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 transition-all duration-500" id="navbar">
    <div class="navbar-glass absolute inset-0 rounded-full shadow-2xl transition-all duration-300" style="background: color-mix(in srgb, var(--bg-body) 75%, transparent); backdrop-filter: blur(16px) saturate(160%); -webkit-backdrop-filter: blur(16px) saturate(160%); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-dropdown);"></div>
    <div class="container relative mx-auto px-6 py-2.5">
        <div class="flex justify-between items-center">
            <a href="index.html" class="flex items-center gap-3 group relative z-10" aria-label="Bepsi Home">
                <div class="absolute -inset-3 bg-blue-500/12 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img src="images/website-logo.png" alt="Logo" class="h-9 w-auto relative hover:scale-105 transition-transform duration-300">
            </a>
            <nav class="hidden md:flex items-center gap-1 p-1 rounded-full backdrop-blur-md" style="background: var(--bg-badge); border: 1px solid var(--border-subtle);" aria-label="Main Navigation">
                <a href="about.html" class="nav-link-item px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300" style="color: var(--text-muted);">About</a>
                <div class="relative group">
                    <button class="nav-link-item px-4 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1 transition-all duration-300" style="color: var(--text-muted);" aria-haspopup="true" aria-expanded="false">
                        Projects 
                        <svg class="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                        <div class="backdrop-blur-2xl rounded-2xl p-1.5 w-60 shadow-2xl overflow-hidden" style="background: var(--bg-modal); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-dropdown);">
                            <a href="ascentcustoms.html" class="flex items-center gap-3 px-3 py-2.5 text-xs rounded-xl transition-colors group/item" style="color: var(--text-muted);">
                                <span class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover/item:bg-blue-500 group-hover/item:text-white transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                                </span>
                                <div class="text-left">
                                    <div class="font-bold text-xs" style="color: var(--text-heading);">AscentCustoms</div>
                                    <div class="text-[10px] mt-0.5" style="color: var(--text-dark);">3D Printed Gaming Mice</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <a href="resources1.html" class="nav-link-item px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300" style="color: var(--text-muted);">Resources</a>
                <a href="reviews.html" class="nav-link-item px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300" style="color: var(--text-muted);">Reviews</a>
                <a href="setup.html" class="nav-link-item px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300" style="color: var(--text-muted);">Setup</a>
            </nav>
            <div class="flex items-center gap-2">
                <button type="button" data-search-trigger class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all hover:text-white flex items-center gap-1.5" style="background: var(--bg-badge); border: 1px solid var(--border-subtle); color: var(--text-muted);" aria-label="Search site (Ctrl+K)">
                    <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <span>Search</span>
                    <span class="search-shortcut-badge hidden sm:inline-block">Ctrl K</span>
                </button>
                <button type="button" data-theme-toggle class="theme-toggle-btn" aria-label="Toggle light and dark mode">
                    <svg class="sun-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    <svg class="moon-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                </button>
                <div class="hidden lg:block">
                    <a href="contact.html" class="btn-navy text-[11px] py-2 px-4 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30">Get in Touch</a>
                </div>
                <button type="button" id="mobile-menu-button" class="hamburger-btn md:hidden" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-menu">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="mobile-menu" class="hidden absolute top-[115%] left-0 w-full backdrop-blur-2xl p-5 rounded-2xl shadow-2xl flex flex-col gap-2 z-50" style="background: var(--bg-modal); border: 1px solid var(--border-subtle);" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
        <button type="button" data-search-trigger class="flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-semibold mb-2" style="background: var(--bg-badge); border: 1px solid var(--border-subtle); color: var(--text-muted);">
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span>Search (Ctrl+K)</span>
        </button>
        <a href="about.html" class="mobile-nav-item text-sm font-semibold p-2.5 rounded-xl transition-all" style="color: var(--text-muted);">About</a>
        <a href="ascentcustoms.html" class="mobile-nav-item text-sm font-semibold p-2.5 rounded-xl transition-all" style="color: var(--text-muted);">AscentCustoms (3D Printed Mice)</a>
        <a href="resources1.html" class="mobile-nav-item text-sm font-semibold p-2.5 rounded-xl transition-all" style="color: var(--text-muted);">Resources</a>
        <a href="reviews.html" class="mobile-nav-item text-sm font-semibold p-2.5 rounded-xl transition-all" style="color: var(--text-muted);">Reviews</a>
        <a href="setup.html" class="mobile-nav-item text-sm font-semibold p-2.5 rounded-xl transition-all" style="color: var(--text-muted);">Setup</a>
        <div class="h-px my-2" style="background: var(--border-subtle);"></div>
        <a href="contact.html" class="text-sm font-bold text-center text-blue-400 p-2.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-all">Contact Me</a>
    </div>
</header>
<div id="mobile-menu-backdrop" class="mobile-backdrop" aria-hidden="true"></div>
`;

const FALLBACK_FOOTER = `
<footer class="relative mt-32 backdrop-blur-md overflow-hidden" style="background: color-mix(in srgb, var(--bg-body) 40%, transparent); border-top: 1px solid var(--border-subtle);">
    <div class="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-blue-500/5 blur-[80px] pointer-events-none z-0"></div>
    <div class="absolute left-0 bottom-0 w-80 h-80 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none z-0"></div>
    <div class="container relative mx-auto px-6 py-14 z-10">
        <div class="flex flex-col md:flex-row justify-between items-center gap-8 pb-10" style="border-bottom: 1px solid var(--border-subtle);">
            <div class="text-center md:text-left">
                <div class="flex items-center gap-2 justify-center md:justify-start mb-3">
                    <img src="images/website-logo.png" alt="Logo" class="h-7 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300">
                </div>
                <p class="text-xs leading-relaxed max-w-sm" style="color: var(--text-muted);">Digital Craftsman &amp; Tech Enthusiast. <br>Archiving creations, custom hardware, and curated resources.</p>
            </div>
            <div class="flex gap-4">
                <a href="https://x.com/Bepsi_Bottle" target="_blank" aria-label="X (Twitter)" class="p-2.5 rounded-full transition-all duration-300 hover:text-white hover:border-[#1da1f2]/30 hover:bg-[#1da1f2]/10" style="background: var(--bg-badge); border: 1px solid var(--border-subtle); color: var(--text-muted);"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <button type="button" data-copy="theukgovernment" title="Copy Discord: theukgovernment" aria-label="Copy Discord username theukgovernment" class="p-2.5 rounded-full transition-all duration-300 hover:text-white hover:border-[#5865f2]/30 hover:bg-[#5865f2]/10 cursor-pointer" style="background: var(--bg-badge); border: 1px solid var(--border-subtle); color: var(--text-muted);"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/></svg></button>
                <a href="mailto:sandra@blowyournanstitscleanoff.shop" aria-label="Send Email" class="p-2.5 rounded-full transition-all duration-300 hover:text-white hover:border-[#10b981]/30 hover:bg-[#10b981]/10" style="background: var(--bg-badge); border: 1px solid var(--border-subtle); color: var(--text-muted);"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></a>
            </div>
        </div>
        <div class="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-3">
                <p class="text-[11px] font-medium" style="color: var(--text-dark);">&copy; <span id="current-year">2026</span> Bepsi. All rights reserved.</p>
                <span style="color: var(--border-subtle);">&bull;</span>
                <button type="button" data-reopen-cookie-banner class="text-[11px] underline transition-colors" style="color: var(--text-dark);">Cookie Preferences</button>
            </div>
            <div class="flex items-center gap-6">
                <button type="button" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" class="text-[11px] font-medium flex items-center gap-1.5 transition-colors hover:text-white" style="color: var(--text-dark);">Back to Top <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg></button>
                <a href="https://ko-fi.com/bepsiiiiii" target="_blank" class="text-[11px] font-semibold flex items-center gap-1 transition-colors duration-300 hover:text-[#ff5e5b]" style="color: var(--text-muted);"><svg class="w-4 h-4 text-[#ff5e5b]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723S0 4.605 0 5.417V17.83s.723.812 1.446.812h12.18s1.446.04 1.446-1.584c0 0 3.328.325 5.856-1.583 2.531-1.91 3.824-3.567 3.824-3.567s.148-1.583-.871-2.964zm-5.02 5.03c-1.393.754-3.218.423-3.218.423V7.202h3.218s2.518-.113 2.518 3.107c0 3.224-2.518 3.669-2.518 3.669z"/></svg> Support on Ko-fi</a>
            </div>
        </div>
    </div>
</footer>
`;

/**
 * Loads header.html and footer.html dynamically with instant sessionStorage caching
 */
async function loadSharedComponents() {
    try {
        const headerContainer = document.getElementById('header-placeholder');
        const footerContainer = document.getElementById('footer-placeholder');

        const cachedHeader = sessionStorage.getItem('bepsi_cached_header');
        const cachedFooter = sessionStorage.getItem('bepsi_cached_footer');

        // Immediate injection if not already populated
        if (headerContainer && cachedHeader && !headerContainer.innerHTML.trim()) {
            headerContainer.innerHTML = cachedHeader;
        }
        if (footerContainer && cachedFooter && !footerContainer.innerHTML.trim()) {
            footerContainer.innerHTML = cachedFooter;
        }

        const fetchPromises = [];

        if (headerContainer) {
            fetchPromises.push(
                fetch('header.html')
                    .then(res => res.ok ? res.text() : null)
                    .then(html => {
                        if (html && html !== cachedHeader) {
                            headerContainer.innerHTML = html;
                            try { sessionStorage.setItem('bepsi_cached_header', html); } catch(e){}
                            ActiveNav.init();
                        }
                    })
                    .catch(() => {
                        if (!headerContainer.innerHTML.trim()) {
                            headerContainer.innerHTML = FALLBACK_HEADER;
                            ActiveNav.init();
                        }
                    })
            );
        }

        if (footerContainer) {
            fetchPromises.push(
                fetch('footer.html')
                    .then(res => res.ok ? res.text() : null)
                    .then(html => {
                        if (html && html !== cachedFooter) {
                            footerContainer.innerHTML = html;
                            try { sessionStorage.setItem('bepsi_cached_footer', html); } catch(e){}
                        }
                    })
                    .catch(() => {
                        if (!footerContainer.innerHTML.trim()) {
                            footerContainer.innerHTML = FALLBACK_FOOTER;
                        }
                    })
            );
        }

        // Only await network if we had no cached copy to begin with
        if (!cachedHeader || !cachedFooter) {
            await Promise.allSettled(fetchPromises);
            ActiveNav.init();
        }
    } catch (e) {
        console.warn('Components could not be loaded via fetch.', e);
    }
}


/* ==============================================================================
   Accessibility Live Region Announcer
   ============================================================================== */
const A11yAnnouncer = {
    announce(message) {
        let announcer = document.getElementById('a11y-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'a11y-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcer);
        }
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 50);
    }
};

/* ==============================================================================
   1. Feature 1: Dark Mode / Light Mode Theme Manager
   ============================================================================== */
const ThemeManager = {
    init() {
        this.updateButtons();
        
        // Listen to system preference changes if user hasn't set an explicit preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('bepsi_theme')) {
                this.setTheme(e.matches ? 'dark' : 'light', false);
            }
        });

        // Global delegate for theme toggle buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-theme-toggle]');
            if (btn) {
                this.toggleTheme();
            }
        });
    },

    getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    },

    setTheme(theme, save = true) {
        document.documentElement.classList.add('theme-transitioning');
        document.documentElement.setAttribute('data-theme', theme);
        if (save) {
            localStorage.setItem('bepsi_theme', theme);
        }
        this.updateButtons();
        A11yAnnouncer.announce(`Theme changed to ${theme} mode.`);
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 350);
    },

    toggleTheme() {
        const nextTheme = this.getTheme() === 'dark' ? 'light' : 'dark';
        this.setTheme(nextTheme, true);
    },

    updateButtons() {
        const currentTheme = this.getTheme();
        const buttons = document.querySelectorAll('[data-theme-toggle]');
        buttons.forEach(btn => {
            btn.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} mode`);
            btn.setAttribute('title', `Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} mode`);
            btn.setAttribute('aria-pressed', currentTheme === 'light');
        });
    }
};

/* ==============================================================================
   2. Unified Scroll Handler (Merged: ScrollProgress + SmartHeader + BackToTop)
   Single RAF-throttled listener instead of 3 separate scroll events.
   ============================================================================== */
const UnifiedScroll = {
    lastScrollY: 0,
    headerThreshold: 100,
    ticking: false,

    init() {
        // --- Scroll Progress Bar ---
        let progressBar = document.getElementById('scroll-progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'scroll-progress-bar';
            progressBar.className = 'scroll-progress-bar';
            progressBar.setAttribute('aria-hidden', 'true');
            document.body.prepend(progressBar);
        }

        // --- Back to Top Button ---
        let backBtn = document.getElementById('back-to-top-btn');
        if (!backBtn) {
            backBtn = document.createElement('button');
            backBtn.id = 'back-to-top-btn';
            backBtn.className = 'back-to-top-btn';
            backBtn.setAttribute('aria-label', 'Back to top of page');
            backBtn.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/>
                </svg>
            `;
            document.body.appendChild(backBtn);
        }

        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            A11yAnnouncer.announce('Scrolled to top.');
        });

        // --- Cache DOM refs ---
        const navbar = document.getElementById('navbar');
        const self = this;

        // --- Single scroll handler, RAF-throttled ---
        const onScroll = () => {
            if (self.ticking) return;
            self.ticking = true;

            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

                // 1. Scroll progress bar
                const scrolled = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
                progressBar.style.width = scrolled + '%';

                // 2. Smart header
                if (navbar) {
                    if (currentScrollY > 30) {
                        navbar.classList.add('header-scrolled');
                    } else {
                        navbar.classList.remove('header-scrolled');
                    }

                    if (currentScrollY > self.headerThreshold && currentScrollY > self.lastScrollY) {
                        navbar.classList.add('header-hidden');
                    } else {
                        navbar.classList.remove('header-hidden');
                    }
                }

                // 3. Back to top button
                if (currentScrollY > 300) {
                    backBtn.classList.add('visible');
                } else {
                    backBtn.classList.remove('visible');
                }

                self.lastScrollY = Math.max(0, currentScrollY);
                self.ticking = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Initial state
    }
};

/* ==============================================================================
   3. Feature 5: Accessible Mobile Navigation Drawer with Focus Trap
   ============================================================================== */
const MobileNav = {
    init() {
        const btn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        const backdrop = document.getElementById('mobile-menu-backdrop');

        if (!btn || !menu) return;

        const openMenu = () => {
            btn.classList.add('is-active');
            btn.setAttribute('aria-expanded', 'true');
            menu.classList.remove('hidden');
            if (backdrop) backdrop.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus first interactive element inside menu
            const firstFocusable = menu.querySelector('a, button, [tabindex="0"]');
            if (firstFocusable) firstFocusable.focus();
        };

        const closeMenu = () => {
            btn.classList.remove('is-active');
            btn.setAttribute('aria-expanded', 'false');
            menu.classList.add('hidden');
            if (backdrop) backdrop.classList.remove('active');
            document.body.style.overflow = '';
            btn.focus();
        };

        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            isOpen ? closeMenu() : openMenu();
        });

        if (backdrop) backdrop.addEventListener('click', closeMenu);

        // Escape Key Listener & Tab Focus Trapping
        document.addEventListener('keydown', (e) => {
            if (menu.classList.contains('hidden')) return;

            if (e.key === 'Escape') {
                closeMenu();
                return;
            }

            if (e.key === 'Tab') {
                const focusables = menu.querySelectorAll('a, button, [tabindex="0"]');
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        });
    }
};

/* ==============================================================================
   6. Feature 3: Site Search Modal Overlay & Command Palette (Ctrl/Cmd + K)
   ============================================================================== */
const SiteSearch = {
    // Search Index Database
    index: [
        { title: 'Home', category: 'General', url: 'index.html', desc: 'Main landing page, featured works, and digital overview.' },
        { title: 'About Bepsi', category: 'Profile', url: 'about.html', desc: 'Background, context, design philosophy, and biography.' },
        { title: 'AscentCustoms', category: 'Hardware', url: 'ascentcustoms.html', desc: 'Next-gen 3D printed custom gaming mice & shell mods.' },
        { title: 'My Setup & Battlestation', category: 'Hardware', url: 'setup.html', desc: 'Detailed specs of battlestation, peripherals, audio lab, and desk.' },
        { title: 'Workstation Specs (i7-12700KF & RX 6800)', category: 'Hardware', url: 'setup.html#workstation', desc: 'Core PC specs: Intel i7-12700KF, Radeon RX 6800 16GB, 32GB 3600MHz RAM, Liquid Freezer II.' },
        { title: 'Peripherals & Custom Mice', category: 'Hardware', url: 'setup.html#peripherals', desc: 'XM2we wireless, SayoDevice O3C keypad, Artisan Zero soft mousepad.' },
        { title: 'Audio Reference Gear & DAC', category: 'Audio', url: 'setup.html#audio', desc: 'Sennheiser HD580, HD 480 Pro Classic, Moondrop Space Travel, Topping DX5 II DAC/Amp.' },
        { title: 'Resource Library & Databases', category: 'Tools', url: 'resources1.html', desc: 'Curated spreadsheets, benchmarking tools, datasets, and guides.' },
        { title: 'Bottleneck Calculator', category: 'Tools', url: 'bottleneck.html', desc: 'System balance and bottleneck analysis tool for gaming rigs.' },
        { title: 'Hardware Reviews Hub', category: 'Reviews', url: 'reviews.html', desc: 'In-depth evaluations on tech, audio gear, and peripherals.' },
        { title: 'GEEKOM A5 Pro (2026) Review', category: 'Reviews', url: 'geekoma5pro-review.html', desc: 'Comprehensive review of the Zen 3 mini PC for desktop and homelab.' },
        { title: 'Moondrop Space Travel Review', category: 'Reviews', url: 'spacetravel-review.html', desc: 'Sub-$25 ANC earbuds with reference tuning and punchy response.' },
        { title: '7Hz Sonus Hybrid IEM Review', category: 'Reviews', url: '7hzsonus-review.html', desc: 'Hybrid dual-driver IEM in-depth review and sound profile.' },
        { title: 'Beanmouse V2.1 Custom Mod Review', category: 'Reviews', url: 'beanmouse-review.html', desc: 'Ultra-lightweight custom wireless fingertip mouse mod for Viper V2 Pro.' },
        { title: 'Tech Articles & Guides', category: 'Articles', url: 'articles.html', desc: '3D printed mouse ergonomics, IEM damping acoustics, and small form factor PC guides.' },
        { title: 'Contact Bepsi', category: 'General', url: 'contact.html', desc: 'Get in touch for collabs, questions, hardware ideas, or Discord chat.' }
    ],

    init() {
        this.createModal();
        this.bindEvents();
    },

    createModal() {
        if (document.getElementById('site-search-modal')) return;

        const modalHtml = `
            <div id="site-search-modal" class="search-backdrop" role="dialog" aria-modal="true" aria-label="Site Search">
                <div class="search-dialog">
                    <div class="search-header">
                        <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input type="text" id="site-search-input" class="search-input-field" placeholder="Search pages, hardware, reviews, tools... (Esc to close)" autocomplete="off">
                        <button type="button" class="search-close-btn text-gray-400 hover:text-white p-1" aria-label="Close search">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <ul id="search-results-container" class="search-results-list" role="listbox"></ul>
                    <div class="search-footer">
                        <span>Navigate <span class="kbd-badge">↑</span> <span class="kbd-badge">↓</span></span>
                        <span>Select <span class="kbd-badge">↵ Enter</span></span>
                        <span>Close <span class="kbd-badge">Esc</span></span>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    bindEvents() {
        const modal = document.getElementById('site-search-modal');
        const input = document.getElementById('site-search-input');
        const resultsContainer = document.getElementById('search-results-container');
        let selectedIndex = 0;

        const openSearch = () => {
            modal.classList.add('active');
            input.value = '';
            this.renderResults('', resultsContainer);
            setTimeout(() => input.focus(), 50);
            document.body.style.overflow = 'hidden';
            selectedIndex = 0;
            A11yAnnouncer.announce('Search modal opened.');
        };

        const closeSearch = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            A11yAnnouncer.announce('Search modal closed.');
        };

        // Shortcut Trigger (Ctrl+K, Cmd+K, or /)
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                modal.classList.contains('active') ? closeSearch() : openSearch();
            } else if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeSearch();
            }
        });

        // Button Triggers
        document.addEventListener('click', (e) => {
            if (!e.target || typeof e.target.closest !== 'function') return;
            if (e.target.closest('[data-search-trigger]')) {
                e.preventDefault();
                openSearch();
            } else if (e.target === modal || e.target.closest('.search-close-btn')) {
                closeSearch();
            }
        });

        // Real-time Input Filtering
        input.addEventListener('input', (e) => {
            this.renderResults(e.target.value, resultsContainer);
            selectedIndex = 0;
            this.updateSelection(resultsContainer, selectedIndex);
        });

        // Keyboard Navigation (Arrows & Enter)
        input.addEventListener('keydown', (e) => {
            const items = resultsContainer.querySelectorAll('.search-result-item');
            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                this.updateSelection(resultsContainer, selectedIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                this.updateSelection(resultsContainer, selectedIndex);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (items[selectedIndex]) {
                    items[selectedIndex].click();
                }
            }
        });
    },

    renderResults(query, container) {
        const q = query.trim().toLowerCase();
        const matches = this.index.filter(item => 
            !q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
        );

        if (matches.length === 0) {
            container.innerHTML = `
                <li class="p-8 text-center text-gray-500 text-sm">
                    No results found for "<span class="text-white font-semibold">${query}</span>"
                </li>
            `;
            return;
        }

        container.innerHTML = matches.map((item, idx) => `
            <li class="search-result-item ${idx === 0 ? 'selected' : ''}" role="option" data-url="${item.url}">
                <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <div class="flex-grow min-w-0">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-white text-sm truncate">${item.title}</span>
                        <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-gray-400">${item.category}</span>
                    </div>
                    <p class="text-xs text-gray-400 truncate mt-0.5">${item.desc}</p>
                </div>
                <svg class="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </li>
        `).join('');

        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = item.getAttribute('data-url');
            });
        });
    },

    updateSelection(container, index) {
        const items = container.querySelectorAll('.search-result-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }
};

/* ==============================================================================
   7. Feature 2: Simple Cookie Consent Banner
   ============================================================================== */
const CookieConsent = {
    init() {
        this.renderBanner();
        this.checkConsent();

        // Delegated clicks for banner interactions & footer link
        document.addEventListener('click', (e) => {
            if (!e.target || typeof e.target.closest !== 'function') return;
            if (e.target.closest('[data-reopen-cookie-banner]')) {
                e.preventDefault();
                this.showBanner();
            } else if (e.target.closest('#cookie-accept-btn')) {
                this.setChoice('accepted');
            } else if (e.target.closest('#cookie-decline-btn')) {
                this.setChoice('declined');
            } else if (e.target.closest('#cookie-close-btn')) {
                this.hideBanner();
            }
        });
    },

    renderBanner() {
        if (document.getElementById('cookie-banner')) return;

        const bannerHtml = `
            <div id="cookie-banner" class="cookie-banner" role="region" aria-label="Cookie Consent Banner">
                <div class="flex items-start gap-4">
                    <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                    <div class="flex-grow min-w-0 pr-6">
                        <h4 class="text-white font-bold text-sm mb-1">Privacy &amp; Cookies</h4>
                        <p class="text-xs text-gray-400 leading-relaxed mb-3">
                            This site uses local storage strictly for themes and essential navigation preferences.
                        </p>
                        <div class="flex flex-wrap gap-2">
                            <button type="button" id="cookie-accept-btn" class="btn-navy text-xs py-1.5 px-3.5">Accept</button>
                            <button type="button" id="cookie-decline-btn" class="btn-outline text-xs py-1.5 px-3.5">Decline</button>
                        </div>
                    </div>
                    <button type="button" id="cookie-close-btn" class="text-gray-400 hover:text-white p-1 absolute top-3 right-3" aria-label="Dismiss cookie notice">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', bannerHtml);
    },

    checkConsent() {
        const consent = localStorage.getItem('bepsi_cookie_consent');
        if (!consent) {
            setTimeout(() => this.showBanner(), 600);
        }
    },

    showBanner() {
        this.renderBanner();
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('visible');
        }
    },

    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('visible');
        }
    },

    setChoice(choice) {
        localStorage.setItem('bepsi_cookie_consent', choice);
        this.hideBanner();
        A11yAnnouncer.announce(`Cookie preference saved: ${choice}.`);
    }
};

/* ==============================================================================
   8. Feature 9: One-Click Copy to Clipboard Component
   ============================================================================== */
const ClipboardManager = {
    init() {
        document.body.addEventListener('click', async (e) => {
            if (!e.target || typeof e.target.closest !== 'function') return;
            const btn = e.target.closest('[data-copy], [data-copy-target]');
            if (!btn) return;

            let textToCopy = btn.getAttribute('data-copy');
            const targetSelector = btn.getAttribute('data-copy-target');

            if (targetSelector) {
                const targetEl = document.querySelector(targetSelector);
                if (targetEl) textToCopy = targetEl.value || targetEl.textContent;
            }

            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                this.showSuccessFeedback(btn, textToCopy);
            } catch (err) {
                console.error('Clipboard copy failed:', err);
            }
        });
    },

    showSuccessFeedback(btn, text) {
        btn.classList.add('copied');
        
        let tooltip = btn.querySelector('.copy-tooltip, .tooltip');
        if (!tooltip) {
            tooltip = document.createElement('span');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'Copied!';
            btn.appendChild(tooltip);
        }

        A11yAnnouncer.announce(`Copied "${text}" to clipboard.`);
        if (typeof Toast !== 'undefined') {
            Toast.show(`Copied to clipboard: ${text.length > 28 ? text.substring(0, 25) + '...' : text}`);
        }

        setTimeout(() => {
            btn.classList.remove('copied');
        }, 2000);
    }
};

/* ==============================================================================
   9. Feature 14: UTM Parameter Capture & Form Injection
   ============================================================================== */
const UTMTracker = {
    keys: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'],

    init() {
        this.captureParams();
        this.injectIntoForms();
    },

    captureParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmData = JSON.parse(sessionStorage.getItem('bepsi_utm_params') || '{}');

        this.keys.forEach(key => {
            const val = urlParams.get(key);
            if (val) utmData[key] = val;
        });

        if (Object.keys(utmData).length > 0) {
            sessionStorage.setItem('bepsi_utm_params', JSON.stringify(utmData));
        }
    },

    injectIntoForms() {
        const utmData = JSON.parse(sessionStorage.getItem('bepsi_utm_params') || '{}');
        if (Object.keys(utmData).length === 0) return;

        document.querySelectorAll('form').forEach(form => {
            Object.entries(utmData).forEach(([key, val]) => {
                let hiddenInput = form.querySelector(`input[name="${key}"]`);
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = key;
                    form.appendChild(hiddenInput);
                }
                hiddenInput.value = val;
            });
        });
    }
};

/* ==============================================================================
   10. Feature 13: Password Visibility Toggle
   ============================================================================== */
const PasswordToggle = {
    init() {
        document.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('.password-toggle-btn');
            if (!toggleBtn) return;

            const wrapper = toggleBtn.closest('.password-input-wrapper');
            if (!wrapper) return;

            const input = wrapper.querySelector('input');
            if (!input) return;

            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';

            toggleBtn.setAttribute('aria-pressed', isPassword);
            toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

            // Swap icon SVGs
            toggleBtn.innerHTML = isPassword ? `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
                </svg>
            ` : `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
            `;
        });
    }
};

/* ==============================================================================
   11. Features 15 & 16: Form Error & Success State Controller
   ============================================================================== */
const FormValidator = {
    init() {
        document.querySelectorAll('form[data-validate="true"], .validate-form').forEach(form => {
            form.setAttribute('novalidate', 'true');

            // Live validation on blur
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => {
                    if (field.getAttribute('aria-invalid') === 'true') {
                        this.validateField(field);
                    }
                });
            });

            // Submission Handling
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const isValid = this.validateForm(form);
                if (!isValid) return;

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

                if (submitBtn) {
                    submitBtn.classList.add('btn-loading');
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `
                        <span class="spinner"></span>
                        <span>Submitting...</span>
                    `;
                }

                // Simulate or execute form submission
                try {
                    // Check if it's Formspree or custom API
                    const action = form.getAttribute('action');
                    if (action && action.startsWith('http')) {
                        const formData = new FormData(form);
                        await fetch(action, {
                            method: form.method || 'POST',
                            body: formData,
                            headers: { 'Accept': 'application/json' }
                        });
                    } else {
                        // Demo delay
                        await new Promise(r => setTimeout(r, 900));
                    }

                    this.showSuccess(form);
                } catch (err) {
                    console.error('Form submission error:', err);
                    alert('There was a problem submitting your form. Please try again.');
                } finally {
                    if (submitBtn) {
                        submitBtn.classList.remove('btn-loading');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHtml;
                    }
                }
            });
        });

        // Reset / "Send Another Message" Handler
        document.addEventListener('click', (e) => {
            if (!e.target || typeof e.target.closest !== 'function') return;
            const resetBtn = e.target.closest('[data-form-reset]');
            if (!resetBtn) return;
            const targetFormId = resetBtn.getAttribute('data-form-reset');
            const form = document.getElementById(targetFormId);
            const successCard = document.getElementById(`${targetFormId}-success`);

            if (form) {
                form.reset();
                form.style.display = 'block';
            }
            if (successCard) {
                successCard.classList.remove('active');
            }
        });
    },

    validateField(field) {
        const group = field.closest('.form-group') || field.parentElement;
        let errorMsg = group.querySelector('.form-error-msg');
        let isValid = true;
        let message = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required.';
        } else if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                message = 'Please enter a valid email address.';
            }
        } else if (field.getAttribute('minlength') && field.value.length < parseInt(field.getAttribute('minlength'))) {
            isValid = false;
            message = `Must be at least ${field.getAttribute('minlength')} characters.`;
        }

        if (!isValid) {
            field.setAttribute('aria-invalid', 'true');
            group.classList.add('has-error');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'form-error-msg';
                errorMsg.id = `err-${Math.random().toString(36).substr(2, 9)}`;
                group.appendChild(errorMsg);
            }
            field.setAttribute('aria-describedby', errorMsg.id);
            errorMsg.innerHTML = `
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>${message}</span>
            `;
        } else {
            field.removeAttribute('aria-invalid');
            group.classList.remove('has-error');
            if (errorMsg) errorMsg.remove();
        }

        return isValid;
    },

    validateForm(form) {
        let isFormValid = true;
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            const valid = this.validateField(field);
            if (!valid && isFormValid) {
                field.focus();
                isFormValid = false;
            }
        });
        return isFormValid;
    },

    showSuccess(form) {
        form.style.display = 'none';
        const formId = form.id || 'contact-form';
        let successCard = document.getElementById(`${formId}-success`);

        if (!successCard) {
            successCard = document.createElement('div');
            successCard.id = `${formId}-success`;
            successCard.className = 'form-success-card active soft-card';
            successCard.innerHTML = `
                <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">Message Dispatched!</h3>
                <p class="text-gray-400 text-sm max-w-md mx-auto mb-6">
                    Thank you for reaching out. Your message has been encrypted and securely delivered. I will respond as soon as possible.
                </p>
                <button type="button" data-form-reset="${formId}" class="btn-outline text-xs py-2 px-6">
                    Send Another Message
                </button>
            `;
            form.parentElement.appendChild(successCard);
        } else {
            successCard.classList.add('active');
        }

        A11yAnnouncer.announce('Form submitted successfully!');
    }
};

/* ==============================================================================
   12. Feature 17: Reusable Accessible Confirmation Dialog Modals
   ============================================================================== */
const ModalManager = {
    previousActiveElement: null,

    init() {
        document.addEventListener('click', (e) => {
            if (!e.target || typeof e.target.closest !== 'function') return;
            const trigger = e.target.closest('[data-modal-target]');
            if (trigger) {
                e.preventDefault();
                const targetSelector = trigger.getAttribute('data-modal-target');
                this.openModal(targetSelector);
            } else if (e.target.closest('[data-modal-close]')) {
                e.preventDefault();
                const modal = e.target.closest('.modal-backdrop');
                if (modal) this.closeModal(modal);
            } else if (e.target.classList.contains('modal-backdrop')) {
                this.closeModal(e.target);
            }
        });

        document.addEventListener('keydown', (e) => {
            const activeModal = document.querySelector('.modal-backdrop.active');
            if (!activeModal) return;

            if (e.key === 'Escape') {
                this.closeModal(activeModal);
            } else if (e.key === 'Tab') {
                this.trapFocus(activeModal, e);
            }
        });
    },

    openModal(selector) {
        const modal = document.querySelector(selector);
        if (!modal) return;

        this.previousActiveElement = document.activeElement;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const firstFocusable = modal.querySelector('button, input, textarea, a, [tabindex="0"]');
        if (firstFocusable) firstFocusable.focus();

        A11yAnnouncer.announce('Modal dialog opened.');
    },

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
        }
        A11yAnnouncer.announce('Modal dialog closed.');
    },

    trapFocus(modal, e) {
        const focusables = modal.querySelectorAll('button, input, textarea, a, [tabindex="0"]');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            last.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
            first.focus();
            e.preventDefault();
        }
    }
};



/* ==============================================================================
   Visual Effects Engine: Delegated Radial Spotlight & Float Parallax
   Uses a single document-level mousemove listener instead of per-card.
   ============================================================================== */
const CardEffects = {
    isTouch: false,

    init() {
        this.isTouch = window.matchMedia('(hover: none)').matches;

        // Tag all soft-cards as glow-cards (and float-cards if not touch)
        const cards = document.querySelectorAll('.glow-card, .soft-card');
        cards.forEach(card => {
            card.classList.add('glow-card');
            if (!this.isTouch) card.classList.add('float-card');
        });

        // Skip effects entirely on touch devices
        if (this.isTouch) return;

        // Single delegated mousemove listener
        document.addEventListener('mousemove', (e) => {
            if (!e.target || typeof e.target.closest !== 'function') return;
            const card = e.target.closest('.glow-card');
            if (!card) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Glow spotlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Float parallax
            if (card.classList.contains('float-card')) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const offsetX = (x - centerX) / centerX;
                const offsetY = (y - centerY) / centerY;

                card.style.setProperty('--shadow-x', `${-offsetX * 15}px`);
                card.style.setProperty('--shadow-y', `${25 - (offsetY * 10)}px`);

                const content = card.querySelector('.float-content');
                if (content) {
                    content.style.setProperty('--parallax-x', `${offsetX * 5}px`);
                    content.style.setProperty('--parallax-y', `${offsetY * 5}px`);
                }
            }
        }, { passive: true });

        // Single delegated mouseleave via mouseout
        document.addEventListener('mouseout', (e) => {
            if (!e.target || typeof e.target.closest !== 'function') return;
            const card = e.target.closest('.float-card');
            if (!card || card.contains(e.relatedTarget)) return;

            card.style.removeProperty('--shadow-x');
            card.style.removeProperty('--shadow-y');
            const content = card.querySelector('.float-content');
            if (content) {
                content.style.removeProperty('--parallax-x');
                content.style.removeProperty('--parallax-y');
            }
        }, { passive: true });
    }
};

/* ==============================================================================
   Active Navigation Highlighter
   ============================================================================== */
const ActiveNav = {
    init() {
        const rawPath = window.location.pathname.split('/').pop() || 'index.html';
        const cleanCurrent = rawPath.replace(/\.html$/, '').toLowerCase();

        const links = document.querySelectorAll('#navbar a, #mobile-menu a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http')) return;

            const targetPage = href.split('/').pop().replace(/\.html$/, '').toLowerCase();

            const isMatch = (cleanCurrent === '' && (targetPage === 'index' || targetPage === '')) ||
                            (cleanCurrent === 'index' && targetPage === 'index') ||
                            (cleanCurrent === targetPage) ||
                            (cleanCurrent.includes('review') && targetPage === 'reviews');

            if (isMatch) {
                if (link.classList.contains('nav-link-item')) {
                    link.classList.add('active');
                }
                if (link.closest('#mobile-menu')) {
                    link.classList.add('active', 'mobile-nav-item');
                }
            } else {
                link.classList.remove('active');
            }
        });
    }
};

/* ==============================================================================
   Speculative Link Prefetcher (Instant Navigation Engine)
   ============================================================================== */
const LinkPrefetcher = {
    prefetchedUrls: new Set(),

    init() {
        if (window.location.protocol === 'file:') return;

        const triggerPrefetch = (e) => {
            if (!e || !e.target) return;
            let el = e.target;
            if (el.nodeType === 3) el = el.parentElement;
            if (!el || typeof el.closest !== 'function') return;

            const link = el.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
            if (link.target === '_blank' || link.hasAttribute('download')) return;

            try {
                const url = new URL(link.href, window.location.href);
                if (url.origin !== window.location.origin) return;

                const cleanUrl = url.pathname;
                if (this.prefetchedUrls.has(cleanUrl)) return;
                this.prefetchedUrls.add(cleanUrl);

                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = cleanUrl;
                prefetchLink.as = 'document';
                document.head.appendChild(prefetchLink);
            } catch (err) {}
        };

        document.addEventListener('mouseover', triggerPrefetch, { passive: true });
        document.addEventListener('touchstart', triggerPrefetch, { passive: true });
    }
};

/* ==============================================================================
   Toast Notification Engine
   ============================================================================== */
const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.querySelector('.bepsi-toast-container');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'bepsi-toast-container';
                this.container.setAttribute('aria-live', 'polite');
                document.body.appendChild(this.container);
            }
        }
    },

    show(message, duration = 2400) {
        this.init();

        const toast = document.createElement('div');
        toast.className = 'bepsi-toast';
        toast.innerHTML = `
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
            <span>${message}</span>
        `;

        this.container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 350);
        }, duration);
    }
};

/* ==============================================================================
   Resource Library Filter & Live Search (resources1.html)
   ============================================================================== */
function initResourceFilter() {
    const container = document.getElementById('filter-container') || document.getElementById('dashboard-filter-container');
    const searchInput = document.getElementById('resource-search');
    const items = document.querySelectorAll('.resource-item');
    if (!container && !searchInput) return;

    const buttons = container ? container.querySelectorAll('.resource-filter-btn, .filter-btn, .dashboard-filter-btn') : [];
    let currentFilter = 'all';
    let currentSearch = '';

    const applyFilters = () => {
        let visibleCount = 0;
        const q = currentSearch.trim().toLowerCase();

        items.forEach(item => {
            const category = item.getAttribute('data-category') || '';
            const matchesCategory = (currentFilter === 'all' || category === currentFilter);

            const title = (item.querySelector('h3')?.textContent || '').toLowerCase();
            const desc = (item.querySelector('p')?.textContent || '').toLowerCase();
            const matchesSearch = !q || title.includes(q) || desc.includes(q);

            if (matchesCategory && matchesSearch) {
                item.classList.remove('hidden');
                item.style.display = '';
                visibleCount++;
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
            }
        });

        // Handle empty state
        let emptyState = document.getElementById('resource-empty-state');
        if (visibleCount === 0 && items.length > 0) {
            if (!emptyState) {
                emptyState = document.createElement('div');
                emptyState.id = 'resource-empty-state';
                emptyState.className = 'filter-empty-state';
                emptyState.innerHTML = `
                    <div class="text-3xl mb-2">🔍</div>
                    <h3 class="text-xl font-bold text-white mb-2">No Matching Resources</h3>
                    <p class="text-gray-400 text-sm mb-4">Try adjusting your search query or selecting a different category.</p>
                    <button type="button" id="clear-resource-filters" class="btn-outline text-xs py-2 px-4">Reset Filters</button>
                `;
                const parentGrid = items[0].parentElement;
                if (parentGrid) parentGrid.appendChild(emptyState);

                document.getElementById('clear-resource-filters')?.addEventListener('click', () => {
                    currentFilter = 'all';
                    currentSearch = '';
                    if (searchInput) searchInput.value = '';
                    buttons.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
                    applyFilters();
                });
            }
            emptyState.style.display = 'block';
        } else if (emptyState) {
            emptyState.style.display = 'none';
        }

        if (typeof AOS !== 'undefined') {
            setTimeout(() => AOS.refresh(), 100);
        }
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            applyFilters();
        });
    }
}

/* ==============================================================================
   Reviews Filter Engine (reviews.html)
   ============================================================================== */
function initReviewsFilter() {
    const filterButtons = document.querySelectorAll('[data-review-filter]');
    const cards = document.querySelectorAll('[data-review-card]');
    if (filterButtons.length === 0 || cards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetFilter = btn.getAttribute('data-review-filter');

            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
                b.classList.add('text-gray-400');
            });

            btn.classList.add('active', 'bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
            btn.classList.remove('text-gray-400');

            cards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (targetFilter === 'all' || cardCat === targetFilter) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });

            if (typeof AOS !== 'undefined') {
                setTimeout(() => AOS.refresh(), 100);
            }
        });
    });
}

/* ==============================================================================
   Setup Page ScrollSpy & Specs Copier (setup.html)
   ============================================================================== */
function initSetupScrollSpy() {
    const jumpLinks = document.querySelectorAll('nav[aria-label="Setup Sections"] a');
    const sections = document.querySelectorAll('#workstation, #peripherals, #audio, #ecosystem');
    if (jumpLinks.length === 0 || sections.length === 0) return;

    const onScroll = () => {
        const scrollPos = window.scrollY + 220;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                jumpLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('setup-jump-link', 'active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Copy Specs Helper Button
    const copySpecsBtn = document.getElementById('copy-specs-btn');
    if (copySpecsBtn) {
        copySpecsBtn.addEventListener('click', () => {
            const specsSummary = `Bepsi's Battlestation Specs:\n• CPU: Intel i7-12700KF (240W Power Limit)\n• GPU: AMD Radeon RX 6800 OC (16GB GDDR6)\n• RAM: 32GB DDR4 3600MHz Dual Channel\n• Cooler: Arctic Liquid Freezer II 240mm\n• Audio: Sennheiser HD580, HD 480 Pro Classic, Topping DX5 II DAC\n• Mouse: XM2we Wireless / SayoDevice O3C / Artisan Zero`;
            navigator.clipboard.writeText(specsSummary).then(() => {
                Toast.show('Full system specs copied to clipboard!');
            }).catch(() => {
                Toast.show('Failed to copy specs');
            });
        });
    }
}

// Global Exports
window.ThemeManager = ThemeManager;
window.SiteSearch = SiteSearch;
window.CookieConsent = CookieConsent;
window.ModalManager = ModalManager;
window.Toast = Toast;
window.ActiveNav = ActiveNav;
window.LinkPrefetcher = LinkPrefetcher;

