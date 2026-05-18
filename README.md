# DS-Property-Percolator

[![License: MPL 2.0](https://img.shields.io/badge/license-MPL--2.0-informational)](https://github.com/virtualarchitectures/zeeschuimer/blob/master/LICENSE)

<p align="center"><img alt="A screenshot of DS-Property-Percolator's status window" src="images/example_screenshot.png"></p>

DS-Property-Percolator is a fork of [Zeeschuimer](https://github.com/digitalmethodsinitiative/zeeschuimer), a browser extension that monitors internet traffic while you are browsing a social media site and collects data about the items you see in a platform's web interface for later systematic analysis. Its target audience is researchers who wish to systematically study content on social media platforms that resist conventional scraping or API-based data collection.

You can, for example, browse TikTok and later export a list of all posts you saw in the order you saw them in. Data can be exported as an NDJSON file and integrated into your own analysis pipeline.

Currently, it supports the following platforms:
* [Daft](https://www.daft.ie/)
* [MyHome](https://www.myhome.ie/)

The extension does not interfere with your normal browsing and never uploads data automatically. It uses the
[WebRequest](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest) browser API to
locally collect and parse the data that platforms send to your browser as you use them.

## How to use

Install the browser extension in a Firefox browser. A button with the extension icon will appear in the browser toolbar. Click it to open the interface. Enable capturing for the sites you want to capture from.

Note that after installation, the extension icon may not be immediately visible in the toolbar. If you can't find it, look for the 'Extensions' icon (a puzzle piece); clicking it will show all available extensions not shown in the main toolbar.

Next, simply browse a supported platform's site. You will see the amount of items detected per platform increase as you browse. When you have the items you need, you can export the data as an [ndjson](https://ndjson.org) file for use in your own analysis pipeline.

Don't forget to reset the data as needed. For example, if you want to create a dataset for a given TikTok hashtag, first reset the TikTok data in the interface, _then_ go to the hashtag's "Explore" page on TikTok, and then export the dataset when you've scrolled down enough to be satisfied with the amount of items.

If you find yourself scrolling a lot to collect data, consider using another browser extension to do it for you, for example [FoxScroller](https://addons.mozilla.org/en-US/firefox/addon/foxscroller/).

## Testing

1. Open the Firefox browser.
2. Navigate to `about:debugging#/runtime/this-firefox` in your browser.
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the manifest.json file from your extension directory

## Limitations

Due to technical limitations, it may not be possible to collect all items from all 'views' for each supported platform. The following limitations are known:

* *Instagram* items that cannot be captured:
  * Stories
  * Posts from the 'Tagged' and 'Reels' tabs on a profile page
  * Posts from the 'Saved' overview of bookmarked posts
  * Posts from the 'For You' feed on the 'Explore' page (the 'Not personalized' feed _does_ work)
  * 'Suggested for you' and 'Sponsored' posts on the front page feed
* *TikTok* items that cannot be captured:
  * Live streams

For some platforms, the level of detail of the data that can be collected depends on the page it is captured from:

* *Pinterest* items may lack some metadata unless captured from the individual post's page, most notably the timestamp of the post.
* *RedNote/Xiaohongshu* items will often lack the item's post description, timestamp, and video URL, unless captured by opening the post's own page.

Note that these are *known* limitations; data capture may break or change based on platform changes. Always cross-reference captured data with what you are seeing in your browser.

## Credits & license

DS-Property-Percolator is a fork of Zeeschuimer, originally developed by Stijn Peeters for the [Digital Methods Initiative](https://digitalmethods.net). Both are licensed under the Mozilla Public License, 2.0. Refer to the LICENSE file for more information.

Interface icons by [Font Awesome](https://fontawesome.com/license/free).
[Open Sans](https://fonts.google.com/specimen/Open+Sans) and [Lobster](https://fonts.google.com/specimen/Lobster) fonts from Google Fonts.
