The {{ this.package.nice }} integrates [tailwindcss](https://tailwindcss.com), a CSS utility-first framework processed by [PostCSS](https://postcss.org). A simple example for using a utility to add padding to an element would be to use the utility `.p-1`. This will add `8px` of padding on all sides of an element.

    .p-1 {
      padding: 8px
    }

    <div class="p-1"></div>

### Configuration

There are three parts to the **tailwindcss** configuration.

* [Theme](#config-theme): This object contains customizations for particular utilities such as font families, colors, margin, padding, etc. [Source documentation](https://tailwindcss.com/docs/theme).
* [Variants](#config-variants-and-core-plugins): This object contains variants that represent different states that the utilities appear in such as media queries, `:hover`, and `:focus` states. [Source documentation](https://tailwindcss.com/docs/configuring-variants).
* [Core Plugins](#config-variants-and-core-plugins): This array is a white list of utility plugins that defines what sets of utilities will be compiled in the final stylesheet distribution. [Source documentation](https://tailwindcss.com/docs/configuration#core-plugins).

#### Theme

Example; the padding plugin is customized to use `8px` as the basis for all padding increments. `.p-2` would add `8px × 2 = 16px` padding on all sides of an element.

    <div class="p-2"></div>

Colors are part of the theme configuration but are described in more detail in the [Color Utility documentation](/colors).

#### Variants

Example; to have padding only appear for desktop screens within NYCO Patterns the prefix `screen-desktop:` is added to the `.p-1` utility.

    <div class="screen-desktop:p-1"></div>

The plugin table below describes the available variants for each utility. An empty array `[]` means only the default state is available. The [screens theme configuration](#config-screens) describes the avaliable break points for the [responsive variants](#config-variants-and-core-plugins).

#### Core Plugins

Example; the core plugin for padding is `padding`. Adding or removing it to the array will determine wether those utilities are compiled to the global stylesheet.

include{{ utilities/tailwindcss/tailwindcss.slm }}

### Installation

**tailwindcss** is not imported the same way as other patterns. All utilities are compiled to a Sass file which can be imported in a Sass project...

    @use 'node_modules/{{ this.package.name }}{{ this.package.cdn.tailwindsass }}';

Or a a CSS file in the **/dist** folder which can be included through a CDN.

    <link href="{{ this.package.cdn.url }}@v{{ this.package.version }}{{ this.package.cdn.tailwindcss }}" rel="stylesheet" type="text/css">