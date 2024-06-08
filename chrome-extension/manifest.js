import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';

const sidePanelConfig = {
  side_panel: {
    default_path: 'sidepanel/index.html',
  },
  permissions: !isFirefox ? ['sidePanel'] : [],
};

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = Object.assign(
  {
    manifest_version: 3,
    default_locale: 'en',
    /**
     * if you want to support multiple languages, you can use the following reference
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
     */
    name: '__MSG_extensionName__',
    version: packageJson.version,
    description: '__MSG_extensionDescription__',
    permissions: ['storage', 'sidePanel', 'activeTab', 'scripting', 'tabs'].concat(sidePanelConfig.permissions),
    host_permissions: ['<all_urls>'],
    options_page: 'options/index.html',
    background: {
      service_worker: 'background.iife.js',
      type: 'module',
    },
    action: {
      default_icon: {
        34: 'icon-34_light.png',
        48: 'icon-48_light.png',
        128: 'icon-128_light.png',
      },
      default_title: 'Click to open Side Panel',
    },
    icons: {
      48: 'icon-48_light.png',
      128: 'icon-128_light.png',
    },
  },
  !isFirefox && { side_panel: { ...sidePanelConfig.side_panel } },
);

export default manifest;
