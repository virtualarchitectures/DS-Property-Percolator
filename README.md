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

## Ethical Considerations

Bellingcat have previously reviewed Zeeschuimer for the purposes of OSINT research and investigative journalism and have provider useful guidance on ethical considerations regarding it's use: [Bellingcat's Online Investigation Toolkit - Zeeschuimer](https://bellingcat.gitbook.io/toolkit/more/all-tools/zeeschuimer)

In particular Bellingcat highlight the following issues which are also worth considering in relation to research into planning, property and housing data:

> **Terms of Service Compliance:** Capturing data by simulating normal browsing likely violates the spirit (if not letter) of some platforms’ terms of service. While you are only recording what you can already see, some platforms forbid any automated data collection. There is a gray area here: Zeeschuimer isn’t a bot scraping hundreds of pages per minute – it’s you scrolling – but you should still be mindful that using the data outside the platform (especially for publication) might contravene platform policies. Journalists should weigh the public interest of the investigation against these terms and possibly seek guidance if unsure.
>
> **Privacy of Content:** Consider the privacy implications for the people whose posts you collect. Even if content is “public” on a social media platform, individuals might not expect their posts to be aggregated and analyzed by third parties. If you plan to publish any data or findings, think about anonymizing personal data (usernames, etc.) or focusing on aggregate insights. For example, collecting posts from private groups or accounts (which you have access to) is especially sensitive – you have the right to see it as a member, but sharing that data further could invade privacy.
>
> **Bias and Algorithmic Personalization:** Zeeschuimer captures a personalized view of social media. This means the dataset you collect is influenced by your account’s history, your social graph, or other personalization factors (especially on platforms like TikTok, where the For You feed varies by user). Ethically, you should acknowledge this if you use the data in analysis: it’s your algorithmic bubble. One way to mitigate this is to use fresh or burner accounts with minimal personalization, or multiple accounts from different perspectives, to collect comparative data. Be transparent in your reporting about how the data was collected and its potential biases.
>
> **Data Security:** The extension stores data locally in your browser until you export it. Ensure that once you export data (particularly if it contains sensitive or personal content), you handle it securely. If you upload to 4CAT or any cloud service, be aware of that service’s security measures: you wouldn’t want a leaked dataset to expose individuals in ways that could cause harm. Also, if working on sensitive investigations, consider the operational security of using your own account or device to browse (you might use a sock-puppet account or a separate browser profile to avoid linking research activity to your personal identity).
>
> **Use in Reporting:** When publishing findings from Zeeschuimer collections, clearly explain how you obtained and analyzed the material so others can assess and, where appropriate, replicate your work. If you illustrate a point with a single post, include a faithful capture of what was visible at the time of collection with date, time, and URL; for broader claims drawn from many posts, summarize your methodology, including time window, selection criteria, and limitations. Where reporting could feed accountability processes, preserve an unaltered evidentiary copy, and maintain logs and metadata; work from separate working copies. If disclosing full technical details would create safety, legal, or ethical risks, state that certain steps are withheld for justified reasons while retaining internal documentation. Make clear that the findings come from an open‑source collection via a browser extension rather than an official dataset.
>
> In summary, Zeeschuimer empowers you to gather data in situations where the platforms themselves don’t provide easy access. Use that power responsibly: respect user privacy as much as possible, be aware of biases in the data, and operate within legal/ethical bounds for your jurisdiction and profession. When in doubt, consult with an editor or a legal advisor, especially if dealing with large-scale personal data.

## Development and Testing

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
