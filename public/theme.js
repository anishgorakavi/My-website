(() => {
  const storageKey = 'anish-site-theme';
  const root = document.documentElement;

  function getSavedTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function getPreferredTheme() {
    const savedTheme = getSavedTheme();
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme, persist = false) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', theme === 'light' ? '#eef5fb' : '#080c13');
    }

    if (persist) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch {
        // The selected theme still applies when storage is unavailable.
      }
    }

    window.dispatchEvent(new CustomEvent('site-theme-change', { detail: { theme } }));
    return theme;
  }

  window.siteTheme = {
    get: () => root.dataset.theme || getPreferredTheme(),
    set: theme => applyTheme(theme, true),
    toggle: () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true),
  };

  applyTheme(getPreferredTheme());
})();
