[← Table of Contents](./readme.md#table-of-contents)


# Patterns

All of the Patterns source is organized into four directories: [Elements](#elements), [Components](#components), [Objects](#objects), and [Utilities](#utilities). This naming convention is influenced by “[BEMIT: Taking the BEM Naming Convention a Step Further](https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/).” Our four buckets included Elements, Components, Objects, and Utilities. If you are familiar with Brad Frost’s [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/), this structure will sound very familiar.

![Elements, Components, Objects](./images/naming-01.png)

## Elements

Elements are the smallest building blocks and include colors, icons, buttons, links, layouts, and more. They can be seen within [Components](#components) and [Objects](#objects). They are often customized default HTML tags (`<button>`,  `<table>`, `<ul>`, `<a>`, etc.). They require smaller amounts of markup and styling to customize.

## Components

Components are smaller patterns that require more complex markup and styling than elements. Often, they include multiple elements such as buttons, lists, links, etc.. Component CSS classes are denoted with the `.c-` prefix.

## Objects

Objects are the most complex patterns and require a great deal of custom styling and markup to function. They can be global elements (`<footer>`) or appear only in certain views. Object CSS classes are denoted with the `.o-` prefix.

![Elements and Components within Objects](./images/naming-02.png)

## Utilities

Utilities are reusable single-attribute styles used to customize markup so that fewer patterns need to be written. They are not tied to any element, component, or object, but they can help override styling in certain contexts and build views more efficiently. It is recommended to use the [Tailwind CSS Framework](https://tailwindcss.com/), however it is optional.

![Utilities](./images/naming-03.png)
