# Forms

The Forms Utility uses HTML5 validation to detect invalid input values and display error messages to the user. By default the message is provided by the browser client, however, it can be overriden by setting the strings object of the instantiated class.

## Usage

A basic sample script;

    import Forms from '@nycopportunity/patterns-framework/src/forms/forms';

    /**
      * Pass the DOM element to the form.
      */
    const SELECTOR = '[data-js="my-form"]';
    const Form = new Forms(document.querySelector(SELECTOR));

    /**
      * A set of strings to override the
      */
    Form.strings = {
      'VALID_REQUIRED': 'This is required', // A generic message for required
                                            // inputs that are missing values.
      'VALID_{{ TYPE }}_INVALID': 'Invalid' // A validation message for a specific
                                            // type. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types
                                            // for available types.
    };

    /**
      * This function automatically watches inputs within the form and displays
      * error messages on the blur event for each input.
      */
    Form.watch();

    /**
      * The submit function for the form.
      */
    Form.submit = (event) => {
      {{ A submission handler for the form }}
    };

Additional settings can be found in the source.