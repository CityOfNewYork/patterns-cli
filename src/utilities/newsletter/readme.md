# Newsletter

The Newsletter Utility uses JavaScript to enhance an [embedded Mailchimp form](https://mailchimp.com/help/add-a-signup-form-to-your-website/#Generate_embedded_form_code). It will use the Form Utility for validation of the form and will display success or error messaging with proper aria attributes based on the response from the MailChimp subscription endpoint.

## Usage

### JavaScript

    import Newsletter from '@nycopportunity/patterns-framework/src/utilities/newsletter/newsletter';

    let newsletter = new Newsletter(document.querySelector(Newsletter.selector));

### Markup

Below is the minium markup for a form to collect email addresses but it is recommended to use the MailChimp Form builder and use the generated markup (select the option without JavaScript). The entire form is serialized and posted to the MailChimp subscription endpoint so any segmentation inputs created by the MailChimp Form Builder can be added. The only custom elements are the **parent wrapper** (`data-js="newsletter"`) and **alert boxes** (`data-js*="alert"`, `data-js-alert="text"`) used to display responses from the MailChimp.

`aria-live="polite"` is dynamically toggled on the `data-js-alert="text"` element when the response is displayed.

    <div data-js="newsletter">
      <form action="https://nyc.us18.list-manage.com/subscribe/post?u={{ mailchimp account }}&id={{ form id }}" id="mc-embedded-subscribe-form" method="post" target="_blank">

        <label for="1473277eddca">Your email address.</label>
        <input id="1473277eddca" name="EMAIL" required="true" type="email" />

        <!-- This is a standard hidden input to help prevent spam -->
        <div aria-hidden="true" style="position: absolute; left: -5000px;">
          <input name="b_d04b7b607bddbd338b416fa89_98ff3f3900" tabindex="-1" type="text" value="" />
        </div>

        <button type="submit">Submit</button>

        <!-- Warning messages will be added to here -->
        <article aria-hidden="true" data-js="alert-warning">
          <p data-js-alert="text"></p>
        </article>

        <!-- Success messages will be added here -->
        <article aria-hidden="true" data-js="alert-success">
          <p data-js-alert="text"></p>
        </article>
      </form>
    </div>

### Configuration

There are several configurations that can be made to an instantiated Newsletter (and the instantiated Form within the newsletter).

#### Newsletter String Property

For example the list of strings below are used for validation and alert messaging. They can be overridden setting the `.strings` object with an object of new strings. Dynamic variables are passed to the strings (denoted by `{{ }}` below) is provided and rendered in the output of the string. This method can be used to provide a localized set of strings.

    let element = document.querySelector(Newsletter.selector);

    let newsletter = new Newsletter(element);

    newsletter.strings = {
      VALID_REQUIRED: 'This field is required.',
      VALID_EMAIL_REQUIRED: 'Email is required.',
      VALID_EMAIL_INVALID: 'Please enter a valid email.',
      VALID_CHECKBOX_BOROUGH: 'Please select a borough.',
      ERR_PLEASE_TRY_LATER: 'There was an error with your submission. Please try again later.',
      SUCCESS_CONFIRM_EMAIL: 'Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.',
      ERR_PLEASE_ENTER_VALUE: 'Please enter a value',
      ERR_TOO_MANY_RECENT: 'Recipient "{{ EMAIL }}" has too many recent signup requests',
      ERR_ALREADY_SUBSCRIBED: '{{ EMAIL }} is already subscribed to list {{ LIST_NAME }}.',
      ERR_INVALID_EMAIL: 'This email address looks fake or invalid. Please enter a real email address.',
      LIST_NAME: 'ACCESS NYC - Newsletter'
    };

#### Newsletter Callback Property

The MailChimp subscription endpoint loads a script with a custom callback. The callback property is assigned a unique key and set to the `window` object when the Newsletter is instatiated. A custom callback can be set

    let element = document.querySelector(Newsletter.selector);

    let newsletter = new Newsletter(element);

    window[newsletter.callback] = (data) => {
      // My custom callback
    };

#### Form Utility Properties

An optional but recommended propert to change in the Form Utility is the parent selector for input validation messages can be set with a new selector.

    newsletter.form.selectors.ERROR_MESSAGE_PARENT = '.c-question__container';
