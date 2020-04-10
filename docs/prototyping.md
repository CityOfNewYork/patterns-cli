[Figma](#figma) | [Browser](#browser)

## Figma

Using Figma and the [HTML to Figma Plugin](https://www.figma.com/c/plugin/747985167520967365/HTML-To-Figma) is recommended for creating static prototypes using a pattern library created with the Patterns Framework.

![HTML to Figma Plugin](https://www.figma.com/community/plugin/747985167520967365/thumbnail)

It will allow you to import styled HTML from a pattern's static site to retrieve basic elements such as colors, layouts, etc. The HTML to Figma app will not be able to include fonts and svgs and may have trouble with the styling of background, psuedo elements, and elements hidden on the screen.

Pattern library assets including fonts, SVGs, and images can be downloaded. <a href="{{ this.package.cdn.archive }}/v{{ this.package.version }}.zip">Click here to download a copy of v{{ this.package.version }}.zip</a>. Assets for can be found in the following directories;

* Fonts; **/dist/fonts**
* SVGs (icons); **/dist/svg**
* Images; **/dist/images**

## Browser

Using the CDN method of the installation is recommended for building prototypes in the browser. Import the pattern library's global stylesheet and scripts via the CDN into any web page.

Compiled styles and scripts in the **/dist** folder of the GitHub repository can be imported on the page using a CDN such as [JsDelivr](https://www.jsdelivr.com). The following global stylesheet link can be copied and pasted into the the `<head>` of your html document.

    <link href="{{ this.package.cdn.url }}@v{{ this.package.version }}{{ this.package.cdn.styles }}" rel="stylesheet">

The following global script source can copied and pasted before the closing `</body>` tag of your html document.

    <script src="{{ this.package.cdn.url }}@v{{ this.package.version }}{{ this.package.cdn.scripts }}"></script>

The following url is the base url for all distributed files available via a CDN.

    {{ this.package.cdn.url }}@v{{ this.package.version }}/dist/

<a href="{{ this.package.cdn.source }}/tree/v{{ this.package.version }}/dist/">Visit the GitHub repository to browse all available files</a>. All Patterns are distributed with their own styles and script dependencies in the **/dist** folder. For example, all of the "Accordion" dependencies would live in the **/dist/components/accordion** folder.

Components scripts must be initialized individually.

    <script type="text/javascript">
      var patterns = new {{ this.package.instantiations.scripts }}(); // initialize the global script

      patterns.accordion(); // initialize an individual component
    </script>

Each pattern's initialization is documented on it's dedicated page.
