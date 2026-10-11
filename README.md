# Digital Fuel Dip Calculator — V31.3.0

## What's new
- Added an in-app PWA update notification with **Update Now** and **Later** actions.
- Updates are applied through the service worker; no APK download is required for the installed PWA.
- The update code does not clear or overwrite customer `localStorage` data (readings, charts, and individual settings).
- Added `version.json` with version and release notes.

## Deploy to GitHub Pages
1. Back up the existing repository and keep a customer-data backup before deployment.
2. Upload the contents of `Demo-Application-Dip-Calculator/` to the repository's published root, preserving the existing folder structure.
3. Wait for GitHub Pages deployment to complete, then open the app online once so the service worker can check for the new version.
4. Existing installed PWAs should check for the update when opened online. When the new service worker is ready, the user can select **Update Now** or **Later**.
5. Test with one device first. Confirm tank charts, readings, settings, and PIN remain intact before wider rollout.

## Important notes
- This is a static PWA update flow. It does not provide a remote admin panel or synchronize settings between devices.
- Per-customer settings remain local to each device/browser.
- PWA updates require an internet connection to download new files. Previously cached features may continue to work offline.
- Always keep a backup of the previous release and test the deployment before asking all customers to update.
