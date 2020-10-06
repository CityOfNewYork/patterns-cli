# Toggle

The Toggle utility uses JavaScript to expand and collapse elements based on user interaction. This will toggle dynamic aria attributes as well as dynamic classes on both the toggling element and target of the toggle. The class "hidden" will be toggled on the target element and the class "active" will be toggled on the toggling element and target element. The target is selected using the static `aria-controls` attribute by its `id`.

## Usage

### JavaScript

    import Toggle from '@nycopportunity/patterns-framework/src/utilities/toggle/toggle';

    new Toggle();

### Markup

Elements must have the hidden or active state classes and attributes set before initialization.

**Hidden**

    <button aria-controls="toggle-target" aria-expanded="false" data-js="toggle" type="button">
      Toggle
    </button>

    <div aria-hidden="true" class="hidden" id="toggle-target">
      <p>Targeted toggle element. <a href='#' tabindex='-1'>A focusable child element</a>.</p>
    </div>

**Active**

    <button class="active" aria-controls="toggle-target" aria-expanded="true" data-js="toggle" type="button">
      Toggle
    </button>

    <div aria-hidden="false" class="active" id="toggle-target">
      <p>Targeted toggle element. <a href='#'>A focusable child element</a>.</p>
    </div>

The use of the dynamic `aria-expanded` attribute on the toggling element is recommended for toggling elements as it will announce that the target of the toggle is "expanded" or "collapsed." Optionally, the attribute `aria-pressed` can be used instead to announce that the toggle button is "pressed" or "not pressed". These attributes provide different feedback to screenreaders and are appropriate for different component types. `aria-expanded` would be used for patterns such as [**collapsible sections**](https://inclusive-components.design/collapsible-sections/) and `aria-pressed` would be used for [**toggle buttons**](https://inclusive-components.design/toggle-button/) or **switches**. A full list of dynamic and static attributes is described below.

### Tabindex

Elements that have aria-hidden set to `true` should not contain focusable elements. Setting their tabindex to `-1` will prevent them from being focused on. By default, child elements in the target element will have their `tabindex` toggled. Refer to the full list of potentially focusable elements below that will be toggled. This can be disabled by passing `false` to the `focusable` attribute of the [configuration object](#configuration).

### Element Proximity and Anchor Toggles

Placement of the target should follow the toggling element so that it appears next in order on the page for screen readers. For targets that are far apart or appear in a different section of the page, the **Anchor Toggle** may be more appropriate. By default it will visibly jump by scrolling to the element and shift focus to the target by setting the `tabindex` of the target to `0`. Anchor toggles should use the `<a>` tag for markup. This can be disabled by passing `false` to the `jump` attribute of the [configuration object](#configuration).

**Hidden**

    <a href="toggle-target" aria-expanded="false" data-js="toggle">
      Jump to Anchor
    </a>

    <div aria-hidden="true" class="hidden" id="toggle-target">
      <p>Targeted toggle element.</p>
    </div>

**Active**

    <a class="active" href="toggle-target" aria-expanded="true" data-js="toggle">
      Jump to Anchor
    </button>

    <div aria-hidden="false" class="active" id="toggle-target" tabindex="0">
      <p>Targeted toggle element.</p>
    </div>

### Multiple Toggle Elements (Triggers)

The Toggle Utility supports having more than one toggle element per toggle target. An example use case is for "close" buttons within dialogue elements.

    <button aria-controls="toggle-target" aria-expanded="false" data-js="toggle" type="button">
      Toggle
    </button>

    <div aria-hidden="true" class="hidden" id="toggle-target">
      <p>Targeted Toggle Element</p>

      <button tabindex="-1" aria-controls="main-menu" aria-expanded="false" data-js="toggle">
        Close
      </button>
    </div>

### Form Elements

In addition to listening to "click" events on `<a>` and `<button>` tags the utility will listen to the "change" event on form elements: `<input>`, `<select>`, and `<textarea>`. Their targets will toggled based on passing HTML5 form validation of the element. The target will only be toggled if the form element has a value when it is required or if the value matches a required pattern.

    <label for="question-1">Question 1</label>

    <select id="question-1" name="question[1]" aria-controls="next-question" aria-expanded="false" required="true">
      <option value="">Please select 1 or 2</option>
      <option value="option-1">Option 1</option>
      <option value="option-2">Option 2</option>
    </select>

    <div id="next-question" class="hidden" aria-expanded="false">
      <label for="question-2">Question 2</label>

      <select id="question-2" name="question[2]" tabindex="-1">
        <option value="">Please select A or B</option>
        <option value="option-a">Option A</option>
        <option value="option-b">Option B</option>
      </select>
    </div>

### Attributes

Attributes on the Element, Target, and the Target's children, such as `aria-hidden`, `aria-controls`, `aria-expanded`, `type`, and `tabindex` help assistive technologies understand the relationship between each element and their respective states of visibility. Some attributes are required on the element on page load.

Some attributes may be interchanged with others based on the use case. Below is an explanation of all attributes that can be used with the toggle utility. *Static* attributes will not change. *Dynamic* attributes will change when the toggle event is fired.

**Toggling Element Attributes**

Attribute       | State     | Importance   | Description
----------------|-----------|--------------|-
`aria-controls` | *static*  | **required** | ID of the target element. Used by the toggle to select the target element.
`tabindex`      | *dynamic* | **required** | If a child element of the target element is potentially focusable it's tabindex will be toggled to `-1` to prevent it's visibility from screen readers. Refer to the list below of potentially focusable elements that will be toggled.
`aria-expanded` | *dynamic* | recommended  | Boolean that announces that target content is "expanded" or "collapsed" when the toggling element is clicked.
`type`          | *static*  | recommended  | Setting a `<button>` element type to "button" will distinguish it from other button types, such as "submit" and "reset," but only within `<form>` elements. By default, a `<button>` is the type "submit" within a form.
`aria-pressed`  | *dynamic* | optional     | Boolean that announces that the toggling element is toggled. Not recommended for use with `aria-expanded`. Commonly used with buttons that act as switches for options that are on or off.
`role`          | *static*  | optional     | If the toggling element is not a `<button>` element, but looks and behaves like a button (see documentation for the [Button Element](/buttons)), then setting the `role` attribute to "button" is recommended. See [MDN documentation for the "button" role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role) for more information

**Target Element Attributes**

Attribute         | State     | Importance  | Description
------------------|-----------|-------------|-
`aria-hidden`     | *dynamic* | recommended | Boolean that hides the content of the target element when "collapsed."
`role`            | *static*  | optional    | Setting the target element's `role` to "region" identifies the target as a significant area. See [MDN documentation for the "region" role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Region_role) for more information.
`aria-labelledby` | *static*  | optional    | This is used along with the `role` attribute to label the content of a "region." This can be set to the toggling elements `id` but can also be set to a different elements `id`.

**Target Element Child Attributes**

Attribute              | State     | Importance  | Description
-----------------------|-----------|-------------|-
`tabindex`             | *dynamic* | recommended | Setting the toggle target's focusable children's `tabindex` attribute to "-1" will prevent them from being focused on when the parent is hidden. See the list below of potentially focusable elements that are supported.
`data-toggle-tabindex` | *static*  | optional      If an child element has a `tabindex` that needs to be set when the parent target is visible then the default value can be stored in this data attribute.

**Potentially Focusable Elements**

    a, button, input, select, textarea, object, embed, form,
    fieldset, legend, label, area, audio, video, iframe, svg,
    details, table, [tabindex], [contenteditable], [usemap]

### Configuration

The Toggle Utility accepts an object `{}` with the following properties:

Option          | Type             | Importance | Description
----------------|------------------|------------|-
`selector`      | *string*         | optional   | Full selector string of the toggle element (this is passed to the `.matches()` method).
`namespace`     | *string*         | optional   | The namespace for data selectors associated with the toggle element. Can be used in conjunction with customizing the selector. The default is `toggle`. Ex; the namespace in the `data-toggle-tabindex` selector (described above) would change the namespace in brackets; `data-{{ namespace }}-tabindex`.
`inactiveClass` | *string/boolean* | optional   | Single class name that will be toggled on the toggle and target element when the element is inactive or "collapsed." Pass "false" to skip toggling an inactive class (there is no inactive class for the toggle element).
`activeClass`   | *string/boolean* | optional   | Single class name that will be toggled on the target element when the element is active or "expanded." Pass "false" to skip toggling an active class.
`before`        | *function*       | optional   | A function that will be executed before the toggling element and target classes and attributes are toggled. The function is passed the instance of the toggle class with several values that may be useful in the callback such as the settings, toggle element, toggle target, and initial click event. See below for details.
`after`         | *function*       | optional   | A function that will be executed after the toggling element and target classes and attributes are toggled. The function is passed the instance of the toggle class with several values that may be useful in the callback such as the settings, toggle element, toggle target, and initial click event. See below for details.
`focusable`     | *boolean*        | optional   | Wether or not to use the focusable method to toggle the `tabindex` of potentially focusable children.
`jump`          | *boolean*        | optional   | Wether to jump and shift focus to the target when using anchor links as toggling elements.

**Before/After Callback Instance Properties**

The entire instance and it's properties/methods are passed to the before and after callback. Below is an explanation of some of it's contents.

Property     | Type           | Description
-------------|----------------|-
`element`    | *Node Element* | The element that triggered the toggle.
`event`      | *Click Event*  | The original click event.
`focusable`  | *Node List*    | A list of elements within the toggle target that can receive focus.
`others`     | *Node List*    | A list of other toggle elements that can trigger the toggle.
`settings`   | *Object*       | The settings of the toggle instance.
`target`     | *Node Element* | The target toggle element.

## Usage in a Pattern Module

    'use strict';

    import Toggle from '@nycopportunity/patterns-framework/src/utilities/toggle/toggle';

    class MobileMenu {
      constructor() {
        this.selector = MobileMenu.selector;

        this.namespace = MobileMenu.namespace;

        this.selectors = MobileMenu.selectors;

        this.toggle = new Toggle({
          // Pass the pattern's custom selector
          selector: this.selector,
          // Pass the pattern's custom namespace
          namespace: this.namespace,
          // Pass a callback with functionality unique to the Mobile Menu Pattern
          after: toggle => {
            // Shift focus from the open to the close button in the Mobile Menu when toggled
            if (toggle.target.classList.contains(Toggle.activeClass)) {
              toggle.target.querySelector(this.selectors.CLOSE).focus();

              // When the last focusable item in the list looses focus loop to the first
              toggle.focusable.item(toggle.focusable.length - 1)
                .addEventListener('blur', () => {
                  toggle.focusable.item(0).focus();
                });
            } else {
              document.querySelector(this.selectors.OPEN).focus();
            }
          }
        });

        return this;
      }
    }

    MobileMenu.selector = '[data-js*="mobile-menu"]';

    MobileMenu.namespace = 'mobile-menu';

    MobileMenu.selectors = {
      CLOSE: '[data-js-mobile-menu*="close"]',
      OPEN: '[data-js-mobile-menu*="open"]'
    };

    export default MobileMenu;

## Polyfills

The script uses the `Element.prototype.matches`, `Element.prototype.removes`, `Nodelist.prototype.forEach` methods which require polyfills for IE11 support.

## Demo

include{{ utilities/toggle/toggle.slm }}
