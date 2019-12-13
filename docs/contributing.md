[← Table of Contents](../docs.md#table-of-contents)

# Contributing

Starting the development server (assuming you've added the recommended [npm scripts](../readme.md#npm-scripts) to your package.json) will enable compilation and previewing changes to patterns;

    npm start

![Development Server](images/start.png)

The most important changes developers may need to make are to files within two directories: The **src/** directory, which includes all of the pattern source including scripts, styles, and template source, and the **config/** directory, which includes all of the configuration for the different node libraries and global variables for the Patterns.

Every Pattern is developed with Style, JavaScript, and Markup dependencies bundled together so they can all be exported and imported independently of the rest of the Patterns.

    src/{{ pattern type }}/{{ name }}/{{ name }}.{{ extension }}

For example, all of the relevant **Accordion Component** dependencies live in:

    src/component/accordion/accordion.slm   // Markup
    src/component/accordion/accordion.js    // JavaScript
    src/component/accordion/_accordion.scss // Styling
    src/component/accordion/accordion.md    // Documentation
    src/component/accordion/readme.md       // Developer Usage

The [`make` command](./commands/make.md) takes care of managing this organization for you when creating new patterns using the command. See the [documentation for more details](./commands/make.md).

### Style Guide

#### JavaScript

JavaScript is written as ES6 modules that conform to a standard set by [set by Rollup.js](https://rollupjs.org/guide/en#faqs) and linted by ESLint using the Google Standard. [Definitions can be found in the **package.json** file](https://github.com/CityOfNewYork/nyco-patterns-framework/blob/master/package.json).

If a Pattern requires targeting DOM elements by a selector, it is better to use data attributes with “js”; `data-js=”accordion”` or `data-js=”toggle”`. While using classes or ids as targets is less preferable, if it is required, it must have a “js” prefix in the name to avoid confusion: “.js-” or “#js-”.

#### Aria Attributes

The same principle applies to aria attributes. An example includes `aria-controls` which is typically set to a button element that toggles another element. It is easier to read `id="aria-c-{{ element name }}"` on the target element name and understand that it is influenced by another accessible control element. In this case the toggling control would have the `aria-controls` attribute set as "aria-c-{{ element name }}".

#### Styles

Styles are written accordion to a modified [BEMIT standard](https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/):

    .c-accordion {...}
    .c-accordion--type {...}
    .c-accordion__child-element {...}

Prefixes: `.c-` = components, `.o-` = objects. There are no prefixes for elements and utilities.

Templates source is written using [slm-lang](https://github.com/slm-lang/slm). Every Element, Component, and Object needs its dependant markup documented in a slm-lang template of the same name. For example, the Accordion Component template would be [**src/components/accordion/accordion.slm**](https://github.com/CityOfNewYork/nyco-patterns-framework/blob/master/src/components/accordion/accordion.slm).

#### Documentation

Documentation is written in [Markdown](https://daringfireball.net/projects/markdown/syntax). For example, with the Accordion Component, the **src/components/accordion/accordion.slm** is the template source. The corresponding documentation should live in **src/components/accordion/accordion.md**. Additional documentation may be required for things like developer usage and may be contained in the **src/components/accordion/readme.md** file.