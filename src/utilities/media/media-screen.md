The media breakpoints for the ACCESS NYC Patterns are configured to be mobile-first. As the screen width increases, media queries override the default styling of mobile elements. There are four screen breakpoints that correspond to small mobile screens, mobile screens, tablet screens, and desktop screens. The pixel values for these dimensions are defined in the [Patterns variable config file](https://github.com/CityOfNewYork/ACCESS-NYC-PATTERNS/blob/master/config/variables.js) under `screens`.

* `screen-desktop`
* `screen-tablet`
* `screen-mobile`
* `screen-sm-mobile`

Tailwind utilities are customized according to the [Responsive Design](https://tailwindcss.com/docs/responsive-design) documentation. There are a handful of Tailwind modules configured to include responsive selectors and can be seen in the [Patterns configuration for Tailwind](https://github.com/CityOfNewYork/ACCESS-NYC-PATTERNS/blob/master/config/tailwind.js).