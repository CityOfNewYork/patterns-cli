# Utilities

Utilities allow the flexibility to change specific properties of every Pattern in certain views. For example, if a Pattern is set to `display: block` in one view but in another it needs to be set to `display: inline`, one solution would be to create another type of the Pattern. However, a UI developer may need to repeat this process for other Patterns.

A Utility class, such as Tailwind’s `.inline` [display utility](https://tailwindcss.com/docs/display), allows the developer to reuse this attribute without creating a different pattern type. This use case can be extended to every possible CSS attribute, such as color, position, font-families, margin, padding, etc. In addition, they can be bundled within media queries so certain utilities can work for specific screen sizes.

## Tailwind.css

[![Tailwind CSS](https://tailwindcss.com/img/twitter-large-card.png)](https://tailwindcss.com)

The NYCO Patterns Framework integrates the [Tailwind Utility Framework](https://tailwindcss.com), a library processed by [PostCSS](https://postcss.org/) that accepts [custom configuration](https://tailwindcss.com/docs/configuration) to specific utility modules, breakpoints, colors, etc. To get started using the utilities look at the Tailwind documentation along with the configuration file of the particular Pattern library in **config/tailwind.js**. By default, not all properties are enabled so it’s important to be familiar with a particular project's configuration.
