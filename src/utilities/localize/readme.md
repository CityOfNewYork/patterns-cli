# Localize

This is a shortcut for fetching localized strings on ACCESS NYC. There is a global `LOCALIZED_STRINGS` array defined on the HTML template that exposes those strings to WPML translation. The `LOCALIZED_STRINGS` array is composed of objects with a `slug` key whose value is some constant, and a `label` value which is the translated equivalent. This function takes a slug name and returns the label.

## Usage

### Markup

    <script>
      const LOCALIZED_STRINGS = [
        {
          "label": "This field is required",
          "slug": "VALID_REQUIRED"
        }
      };
    </script>

### JavaScript

    import localize from '@nycopportunity/patterns-framework/src/utilities/localize/localize';

    let validationMessage = localize('VALID_REQUIRED');

