# DS-Property-Percolator

[![License: MPL 2.0](https://img.shields.io/badge/license-MPL--2.0-informational)](https://github.com/virtualarchitectures/zeeschuimer/blob/master/LICENSE)

<p align="center"><img alt="A screenshot of DS-Property-Percolator's status window" src="images/example_screenshot.png"></p>

The Data Stories Property Percolator is a browser extension designed for researchers investigating planning, property and housing data in Ireland at a local level. The extension is a fork of [Zeeschuimer](https://github.com/digitalmethodsinitiative/zeeschuimer), a browser extension that monitors internet traffic while you are browsing a social media website and collects data about the items you see in a platform's web interface for later analysis.

The extension does not interfere with your normal browsing and never uploads data automatically. It uses the
[WebRequest](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest) browser API to
locally collect and parse the data that platforms send to your browser as you use them. Data can be exported as an NDJSON file and integrated into your own analysis pipeline.

Currently, it supports the following platforms:

- [Daft](https://www.daft.ie/)
- [MyHome](https://www.myhome.ie/)

## How to use

Install the browser extension in a Firefox browser. A button with the extension icon will appear in the browser toolbar. Click it to open the interface. Enable capturing for the sites you want to capture from.

Note that after installation, the extension icon may not be immediately visible in the toolbar. If you can't find it, look for the 'Extensions' icon (a puzzle piece); clicking it will show all available extensions not shown in the main toolbar.

Next, simply browse a supported platform's site. You will see the amount of items detected per platform increase as you browse. When you have the items you need, you can export the data as an [ndjson](https://ndjson.org) file for use in your own analysis pipeline.

## Limitations

Due to technical limitations, it may not be possible to collect all items from all 'views' for each supported platform. Data capture may break or change based on platform changes. Always cross-reference captured data with what you are seeing in your browser.

## Development andf Testing

1. Clone the respoitory.
2. Open the Firefox browser.
3. Navigate to `about:debugging#/runtime/this-firefox` in your browser.
4. Click "This Firefox"
5. Click "Load Temporary Add-on"
6. Select the manifest.json file from your extension directory

## Credits & license

DS-Property-Percolator is a fork of Zeeschuimer, originally developed by Stijn Peeters for the [Digital Methods Initiative](https://digitalmethods.net). Both are licensed under the Mozilla Public License, 2.0. Refer to the LICENSE file for more information.

Interface icons by [Font Awesome](https://fontawesome.com/license/free).
[Open Sans](https://fonts.google.com/specimen/Open+Sans) and [Lobster](https://fonts.google.com/specimen/Lobster) fonts from Google Fonts.
