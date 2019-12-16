# Toggle

The Toggle utility uses JavaScript to expand and collapse elements based on user interaction. This will toggle dynamic aria attributes as well as dynamic classes on both the toggling element and target of the toggle. The class "hidden" will be toggled on the target element and the class "active" will be toggled on the toggling element and target element. The target is selected using the static `aria-controls` attribute by its `id`.

## Usage

### JavaScript

    import Toggle from '@nycopportunity/patterns-framework/src/utilities/toggle/toggle';

    new Toggle();

### Markup

    <button aria-controls="toggle-target" aria-expanded="true" data-js="toggle" type="button">
      Toggle
    </button>

    <div aria-hidden="false" class="active" id="toggle-target">
      Targeted Toggle Element
    </div>

The use of the dynamic `aria-expanded` attribute on the toggling element is recommended for toggling elements as it will announce that the target of the toggle is "expanded" or "collapsed." Optionally, the attribute `aria-pressed` can be used instead to announce that the toggle button is "pressed" or "not pressed". These attributes provide different feedback to screenreaders and are appropriate for different component types. `aria-expanded` would be used for patterns such as [**collapsible sections**](https://inclusive-components.design/collapsible-sections/) and `aria-pressed` would be used for [**toggle buttons**](https://inclusive-components.design/toggle-button/) or **switches**. A full list of dynamic and static attributes is described below.

Placement of the target should follow the toggling element so that it appears next in order on the page for screen readers. For targets that are far apart or appear in a different section of the page, the Anchor Toggle may be more appropriate.

The Toggle Utility supports having more than one toggle element per toggle target.

### Attributes

Attributes such as `aria-controls`, `aria-expanded`, and `type` will help assistive technologies understand the relationship between the toggle element and the toggle target. These three attributes should be considered the bare minimum but they may be interchanged with others based on the use case. Below is an explanation of other possible attributes that can be used with the toggle utility. *Static* attributes will not change. *Dynamic* attributes will change when the toggle event is fired.

**Toggling Element Attributes**

Attribute       | State     | Importance    | Description
----------------|-----------|---------------|-
`aria-controls` | *static*  | required      | ID of the target element. Used by the toggle to select the target element.
`aria-expanded` | *dynamic* | recommended   | Boolean that announces that target content is "expanded" or "collapsed" when the toggling element is clicked.
`type`          | *static*  | recommended   | Setting a `<button>` element type to "button" will distinguish it from other button types, such as "submit" and "reset," but only within `<form>` elements. By default, a `<button>` is the type "submit" within a form.
`aria-pressed`  | *dynamic* | optional      | Boolean that announces that the toggling element is toggled. Not recommended for use with `aria-expanded`.
`role`          | *static*  | optional      | If the toggling element is not a `<button>` element, but looks and behaves like a button (see documentation for the [Button Element](/buttons)), then setting the `role` attribute to "button" is recommended. See [MDN documentation for the "button" role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role) for more information

**Target Element Attributes**

Attribute         | State     | Importance    | Description
------------------|-----------|---------------|-
`aria-hidden`     | *dynamic* | recommended   | Boolean that hides the content of the target element when "collapsed."
`role`            | *static*  | optional      | Setting the target element's `role` to "region" identifies the target as a significant area. See [MDN documentation for the "region" role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Region_role) for more information.
`aria-labelledby` | *static*  | optional      | This is used along with the `role` attribute to label the content of a "region." This can be set to the toggling elements `id` but can also be set to a different elements `id`.

### Configuration

The Toggle Utility accepts an object `{}` with the following properties:

Option          | Type             | Importance | Description
----------------|------------------|------------|-
`selector`      | *string*         | optional   | Full selector string of the toggle element (this is passed to the `.matches()` method).
`inactiveClass` | *string/boolean* | optional   | Single class name that will be toggled on the toggle and target element when the element is inactive or "collapsed." Pass "false" to skip toggling an inactive class (there is no inactive class for the toggle element).
`activeClass`   | *string/boolean* | optional   | Single class name that will be toggled on the target element when the element is active or "expanded." Pass "false" to skip toggling an active class.
`before`        | *function*       | optional   | A function that will be executed before the toggling element and target classes and attributes are toggled. The function is passed the instance of the toggle class.
`after`         | *function*       | optional   | A function that will be executed after the toggling element and target classes and attributes are toggled. The function is passed the instance of the toggle class.

## Polyfills

The script uses the `Element.prototype.matches`, `Element.prototype.removes`, `Nodelist.prototype.forEach` methods which require polyfills for IE11 support.