/* PWA install controls for Demo Dip Calculator V31.2.0 */
(() => {
  let deferredInstallPrompt = null;
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
    say('App installed successfully. You can open it from your home screen.');
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
      say('If Chrome says the app is already installed, tap that option to open it. Otherwise use Chrome menu (⋮) → Install app or Add to Home screen.');
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
        say('Android APK has not been published to this website yet. The APK must first be built and uploaded to the downloads folder. The PWA Install button is ready to use.');
      }
    }).catch(() => say('Could not check for the APK file. Please try again when you are online.'));
  };

  if (isStandalone()) say('App is running in installed mode.');
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js?v=31.2.0').catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
    });
  }
})();
