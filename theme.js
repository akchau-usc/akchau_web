// theme.js - lightweight theme manager
(function(){
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;

  function getStoredTheme(){
    try{ return localStorage.getItem(STORAGE_KEY); }catch(e){ return null }
  }

  function storeTheme(t){
    try{ if(t) localStorage.setItem(STORAGE_KEY,t); else localStorage.removeItem(STORAGE_KEY) }catch(e){}
  }

  function prefersDark(){
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(theme){
    if(theme === 'dark') root.setAttribute('data-theme','dark');
    else root.removeAttribute('data-theme');
    // smooth color transitions (non-layout properties)
    document.documentElement.classList.add('theme-transition');
    window.clearTimeout(window._themeTimeout);
    window._themeTimeout = setTimeout(()=>document.documentElement.classList.remove('theme-transition'),300);
    // update toggle button if present
    const btn = document.getElementById('theme-toggle');
    if(btn){
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
    // notify listeners
    try{ window.dispatchEvent(new CustomEvent('themechange',{detail:{theme}})); }catch(e){}
  }

  function resolveInitialTheme(){
    const stored = getStoredTheme();
    if(stored === 'dark' || stored === 'light') return stored;
    return prefersDark() ? 'dark' : 'light';
  }

  function initTheme(){
    const t = resolveInitialTheme();
    applyTheme(t);
  }

  function toggleTheme(){
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    storeTheme(next);
    applyTheme(next);
  }

  // expose API
  window.ThemeManager = { initTheme, applyTheme, toggleTheme, getStoredTheme };
  window.__toggleSiteTheme = toggleTheme;

  // init on load
  initTheme();

  // keyboard activation for the toggle button
  document.addEventListener('keydown', function(e){
    const btn = document.getElementById('theme-toggle');
    if(!btn) return;
    if(document.activeElement === btn && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')){
      e.preventDefault();
      toggleTheme();
    }
  });

  // keep localStorage key in sync with our STORAGE_KEY
  // listen for external changes (other tabs)
  window.addEventListener('storage', function(e){
    if(e.key === STORAGE_KEY) applyTheme(e.newValue === 'dark' ? 'dark' : 'light');
  });
})();
