/* PWA installation and safe update prompt for Digital Fuel Dip Calculator */
(() => {
  let deferredInstallPrompt = null;
  let swRegistration = null;
  let updateBanner = null;
  let refreshing = false;
  const installButton = document.getElementById('pwaInstallBtn');
  const help = document.getElementById('appInstallHelp');

  function say(message) { if (help) help.textContent = message; }
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (installButton) installButton.disabled = false;
    say('Ready to install. Tap “Install App” to add it to your home screen.');
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    say('App installed successfully. You can open it from your home screen or app list.');
  });

  window.installPWA = async function installPWA() {
    if (isStandalone()) {
      say('This app is already installed. Open it from your home screen or app list.');
      return;
    }
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const result = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      say(result.outcome === 'accepted' ? 'Installation accepted. Follow your device prompts to finish.' : 'Installation was cancelled. You can install later from your browser menu.');
      return;
    }
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) {
      say('On iPhone/iPad: tap Share, then “Add to Home Screen”.');
    } else {
      say('Use Chrome menu (⋮) → Install app or Add to Home screen. If it is already installed, open it from your app list.');
    }
  };

  window.downloadAndroidAPK = function downloadAndroidAPK() {
    const apkUrl = new URL('downloads/Demo-Dip-Calculator.apk', document.baseURI).href;
    fetch(apkUrl, { method: 'HEAD', cache: 'no-store' }).then((response) => {
      if (response.ok) {
        const link = document.createElement('a');
        link.href = apkUrl;
        link.download = 'Demo-Dip-Calculator.apk';
        document.body.appendChild(link); link.click(); link.remove();
        say('APK download started. Only install APK files from a source you trust.');
      } else {
        say('Android APK has not been published to this website. Use the PWA Install option instead.');
      }
    }).catch(() => say('Could not check for the APK file. Please try again when you are online.'));
  };

  function showUpdateBanner() {
    if (updateBanner || !document.body) return;
    updateBanner = document.createElement('div');
    updateBanner.id = 'pwaUpdateBanner';
    updateBanner.setAttribute('role', 'status');
    updateBanner.style.cssText = 'position:fixed;z-index:99999;left:12px;right:12px;bottom:calc(16px + env(safe-area-inset-bottom));max-width:560px;margin:0 auto;padding:16px;background:#102d59;color:#fff;border:1px solid #5279b9;border-radius:16px;box-shadow:0 8px 28px rgba(0,0,0,.28);font:14px/1.45 system-ui,sans-serif;';
    updateBanner.innerHTML = '<div style="font-size:16px;font-weight:700;margin-bottom:4px">✨ Update Available</div><div style="margin-bottom:12px">A new version is ready. Your saved readings, tank charts and personal settings will be kept on this device.</div><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" id="pwaUpdateLater" style="padding:9px 13px;border:1px solid #cbd5e1;border-radius:9px;background:transparent;color:#fff;font-weight:600">Later</button><button type="button" id="pwaUpdateNow" style="padding:9px 13px;border:0;border-radius:9px;background:#fff;color:#102d59;font-weight:700">Update Now</button></div>';
    document.body.appendChild(updateBanner);
    document.getElementById('pwaUpdateLater').addEventListener('click', () => { updateBanner.remove(); updateBanner = null; });
    document.getElementById('pwaUpdateNow').addEventListener('click', () => {
      const button = document.getElementById('pwaUpdateNow');
      button.disabled = true; button.textContent = 'Updating…';
      if (swRegistration && swRegistration.waiting) swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      else window.location.reload();
    });
  }

  function watchForUpdates(registration) {
    swRegistration = registration;
    if (registration.waiting && navigator.serviceWorker.controller) showUpdateBanner();
    registration.addEventListener('updatefound', () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner();
      });
    });
    // Check for a newer deployment when the app is opened; no continuous polling.
    registration.update().catch(() => {});
  }

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js?v=31.3.0', { updateViaCache: 'none' })
        .then(watchForUpdates)
        .catch((error) => console.warn('Service worker registration failed:', error));
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }

  if (isStandalone()) say('App is running in installed mode.');
})();
