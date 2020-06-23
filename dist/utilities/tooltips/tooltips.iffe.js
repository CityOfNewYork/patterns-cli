var Forms = (function () {
  'use strict';

  /**
   * Creates a tooltips. The constructor is passed an HTML element that serves as
   * the trigger to show or hide the tooltips. The tooltip should have an
   * `aria-describedby` attribute, the value of which is the ID of the tooltip
   * content to show or hide.
   */

  var Tooltips = function Tooltips(el) {
    var this$1 = this;
    this.trigger = el;
    this.tooltip = document.getElementById(el.getAttribute('aria-describedby'));
    this.active = false;
    this.tooltip.classList.add(Tooltips.CssClass.TOOLTIP);
    this.tooltip.classList.add(Tooltips.CssClass.HIDDEN);
    this.tooltip.setAttribute('aria-hidden', 'true');
    this.tooltip.setAttribute('role', 'tooltip'); // Stop click propagation so clicking on the tip doesn't trigger a
    // click on body, which would close the tooltips.

    this.tooltip.addEventListener('click', function (event) {
      event.stopPropagation();
    });
    document.querySelector('body').appendChild(this.tooltip);
    this.trigger.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      this$1.toggle();
    });
    window.addEventListener('hashchange', function () {
      this$1.hide();
    });
    Tooltips.AllTips.push(this);
    return this;
  };
  /**
   * Displays the tooltips. Sets a one-time listener on the body to close the
   * tooltip when a click event bubbles up to it.
   * @method
   * @return {this} Tooltip
   */


  Tooltips.prototype.show = function show() {
    var this$1 = this;
    Tooltips.hideAll();
    this.tooltip.classList.remove(Tooltips.CssClass.HIDDEN);
    this.tooltip.setAttribute('aria-hidden', 'false');
    var body = document.querySelector('body');

    var hideTooltipOnce = function () {
      this$1.hide();
      body.removeEventListener('click', hideTooltipOnce);
    };

    body.addEventListener('click', hideTooltipOnce);
    window.addEventListener('resize', function () {
      this$1.reposition();
    });
    this.reposition();
    this.active = true;
    return this;
  };
  /**
   * Hides the tooltip and removes the click event listener on the body.
   * @method
   * @return {this} Tooltip
   */


  Tooltips.prototype.hide = function hide() {
    this.tooltip.classList.add(Tooltips.CssClass.HIDDEN);
    this.tooltip.setAttribute('aria-hidden', 'true');
    this.active = false;
    return this;
  };
  /**
   * Toggles the state of the tooltips.
   * @method
   * @return {this} Tooltip
   */


  Tooltips.prototype.toggle = function toggle() {
    if (this.active) {
      this.hide();
    } else {
      this.show();
    }

    return this;
  };
  /**
   * Positions the tooltip beneath the triggering element.
   * @method
   * @return {this} Tooltip
   */


  Tooltips.prototype.reposition = function reposition() {
    var pos = {
      'position': 'absolute',
      'left': 'auto',
      'right': 'auto',
      'top': 'auto',
      'bottom': 'auto',
      'width': ''
    };

    var style = function (attrs) {
      return Object.keys(attrs).map(function (key) {
        return key + ": " + attrs[key];
      }).join('; ');
    };

    var g = 8; // Gutter. Minimum distance from screen edge.

    var tt = this.tooltip;
    var tr = this.trigger;
    var w = window; // Reset

    this.tooltip.setAttribute('style', style(pos)); // Determine left or right alignment.

    if (tt.offsetWidth >= w.innerWidth - 2 * g) {
      // If the tooltip is wider than the screen minus gutters, then position
      // the tooltip to extend to the gutters.
      pos.left = g + 'px';
      pos.right = g + 'px';
      pos.width = 'auto';
    } else if (tr.offsetLeft + tt.offsetWidth + g > w.innerWidth) {
      // If the tooltip, when left aligned with the trigger, would cause the
      // tip to go offscreen (determined by taking the trigger left offset and
      // adding the tooltip width and the left gutter) then align the tooltip
      // to the right side of the trigger element.
      pos.left = 'auto';
      pos.right = w.innerWidth - (tr.offsetLeft + tr.offsetWidth) + 'px';
    } else {
      // Align the tooltip to the left of the trigger element.
      pos.left = tr.offsetLeft + 'px';
      pos.right = 'auto';
    } // Position TT on top if the trigger is below the middle of the window


    if (tr.offsetTop - w.scrollY > w.innerHeight / 2) {
      pos.top = tr.offsetTop - tt.offsetHeight - g + 'px';
    } else {
      pos.top = tr.offsetTop + tr.offsetHeight + g + 'px';
    }

    this.tooltip.setAttribute('style', style(pos));
    return this;
  };

  Tooltips.selector = '[data-js*="tooltip"]';
  /**
   * Array of all the instantiated tooltips.
   * @type {Array<Tooltip>}
   */

  Tooltips.AllTips = [];
  /**
   * Hide all Tooltips.
   * @public
   */

  Tooltips.hideAll = function () {
    Tooltips.AllTips.forEach(function (element) {
      element.hide();
    });
  };
  /**
   * CSS classes used by this component.
   * @enum {string}
   */


  Tooltips.CssClass = {
    HIDDEN: 'hidden',
    TOOLTIP: 'tooltip-bubble'
  };

  return Tooltips;

}());
