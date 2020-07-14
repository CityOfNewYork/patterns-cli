# Newsletter

The Newsletter Utility uses JavaScript to enhance an [embedded Mailchimp form](https://mailchimp.com/help/add-a-signup-form-to-your-website/#Generate_embedded_form_code). It will use the Form Utility for validation of the form and will display success or error messaging based on the response from the MailChimp subscription endpoint.

## Usage

### JavaScript

    import Newsletter from '@nycopportunity/patterns-framework/src/utilities/newsletter/newsletter';

    let newsletter = new Newsletter(document.querySelector(Newsletter.selector));

    // Optional, set the parent element for input error messages
    newsletter.form.selectors.ERROR_MESSAGE_PARENT = '.c-question__container';

### Markup

Below is the minium markup for a form to collect email addresses but it is recommended to use the MailChimp Form builder and use the generated markup (select the option without JavaScript). The entire form is serialized and posted to the MailChimp subscription endpoint so any segmentation inputs created by the MailChimp Form Builder can be added. The only custom elements are the **parent wrapper** (`data-js="newsletter"`) and **alert boxes** (`data-js*="alert"`, `data-js-alert="text"`) used to display responses from the MailChimp.

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
