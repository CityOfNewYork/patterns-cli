[← Table of Contents](../docs.md#table-of-contents)

# Prototyping

## Figma

Using Figma and the [HTML to Figma](https://www.figma.com/c/plugin/747985167520967365/HTML-To-Figma) is recommended for creating static prototypes using a pattern library created with the Patterns Framework. It will allow you to import styled HTML from a pattern's static site to retrieve basic elements such as colors, layouts, etc. This will get 90% of the work done. The HTML to Figma app will not be able to include fonts and svgs and may have trouble with the styling of background, psuedo elements, and elements hidden on the screen.

Separately, the pattern libraries assets will need to be downloaded. Those can be downloaded from the following directories

* **/dist/fonts**
* **/dist/svg**
* **/dist/images**

## Browser

Using the CDN method of the installation is recommended for building prototypes in the browser. Import the pattern library's global stylesheet and scripts via the CDN into any web page (replace the appropriate `{{ vars }}` with desired variables).

### Stylesheet

    <link href="https://cdn.jsdelivr.net/gh/cityofnewyork/{{ pattern library }}@v{{ version }}/dist/styles/site-default.css" rel="stylesheet">

Each pattern's HTML markup is documented on it's demo page. Copy and paste the markup sample in the same web page. The pattern should render appropriately.

### Script

    <script src="https://cdn.jsdelivr.net/gh/cityofnewyork/{{ pattern library }}@v{{ version }}/dist/scripts/{{ main }}.js"></script>

Components scripts must be initialized individually.

    <script type="text/javascript">
      var patterns = new {{ Main }}(); // initialize the global script
      patterns.accordion(); // initialize an individual component
    </script>

Each pattern's initialization is documented on it's demo page. The main source JavaScript import file will also show how each component needs to be initialized if it isn't specified in the pattern's documentation.

