Demo Dip Calculator — PWA/APK button update
Base: live website version 31.2.0

Files updated/added:
- index.html: separate “Install App” and “Download Android APK” buttons
- style.css: responsive button styling
- manifest.json: root-relative PWA identity/start URL
- pwa-install.js: install prompt handling and APK availability check
- service-worker.js: app-shell/offline caching for same-origin files

IMPORTANT APK NOTE
The APK button is intentionally safe: it checks for downloads/Demo-Dip-Calculator.apk before downloading. No APK binary was included in the supplied project, so an actual Android APK must still be built/signed and uploaded to:
Demo-Application-Dip-Calculator/downloads/Demo-Dip-Calculator.apk
Do not create an empty file with that name; it must be a real, signed APK.

Deploy all project files to the root of the GitHub Pages repository for Demo-Dip-Calculator-App. Keep tank1.js and script.js unchanged. After deployment, test in Chrome and clear old site cache/service worker if the old UI remains.
