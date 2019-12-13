[← Table of Contents](https://github.com/CityOfNewYork/nyco-patterns-framework/blob/master/docs.md#table-of-contents)

# Make

    pttrn make {{ type }} {{ pattern }}

This is the method for creating new patterns using templates defined in the [**config/make.js**](https://github.com/CityOfNewYork/nyco-patterns-framework/blob/master/config/make.js) directory. Running...

    pttrn make component accordion

... will generate a styles, markup (.slm), and markdown files from templates needed to add an Accordion Component to the Patterns. The parameters accepted are **pattern type** (“component”) and **name** (“accordion”). Currently the available types are element, component, object, and utility. The files will be generated and written according to these parameters;

    src/{{ type }}/{{ pattern }}/{{ pattern }}.slm
    src/{{ type }}/{{ pattern }}/_{{ pattern }}.scss

Once the script is run, a prompt will ask if you would like to create optional template files inlcuding a SASS configuration file for storing variables and mixins, a JavaScript file for enhanced pattern functionality, a view .slm template file for creating a page to view the pattern in the documentation, an any other custom files defined as optional in the [**config/make.js**](https://github.com/CityOfNewYork/nyco-patterns-framework/blob/master/config/make.js) file (see below about adding custom templates). The content of each file is determined by the templates defined in the [**config/make.js**](https://github.com/CityOfNewYork/nyco-patterns-framework/blob/master/config/make.js) file. Overwriting existing pattern files is not allowed, however, rerunning this script will ask the developer if they want to create any of the optional files defined in the `optional` constant in the [**config/make.js**](https://github.com/CityOfNewYork/nyco-patterns-framework/blob/master/config/make.js) file.

### Adding a File to an Existing Pattern

    pttrn make {{ type }} {{ pattern }} {{ template }}

Running this command will generate a prompt to create the specified file using templates in the [**config/make.js**](https://github.com/CityOfNewYork/nyco-patterns-framework/blob/master/config/make.js) file. It will not permit overwritting existing pattern files.

### Creating a New Template

Adding a custom template to be created automatically when patterns are generated via this script can be done by adding or modifying variables in the [**config/make.js**](https://github.com/CityOfNewYork/nyco-patterns-framework/blob/master/config/make.js) file. For example, these are the steps that it would take to add a [React](https://reactjs.org/) template for each Pattern via the `pttrn make` script.

#### Step 1: Template contents

First, the new template would be defined in the `templates` constant as "react" and the following template string would written to the content of any new React file;

    const templates = {
      ...
      'react': [
        'class {{ Pattern }} extends React.Component {
        '  render() {',
        '    return (',
        '      <div>',
        '        Hello {this.props.name}!',
        '      </div>',
        '    );',
        '  }',
        '}',
        '\n',
        'ReactDOM.render(',
        '  <{{ Pattern }} name="World" />,',
        '  document.getElementById('js-{{ pattern }}')',
        ');'
      ].join('\n'),
      ...
    };

**Template Variables**

Within the template string, there are a handful of variables referencing the new pattern's name that will be replaced when the template is compiled. They are denoted by double brackets `{{  }}`;

* `{{ type }}` The pattern type defined by the command. Will either be "elements", "objects", "utilities."
* `{{ prefix }}` The pattern prefix, will be defined by the type and `prefixes` constant in [**config/make.js**](https://github.com/CityOfNewYork/nyco-patterns-framework/blob/master/config/make.js).
* `{{ pattern }}` The lower case name of the pattern.
* `{{ Pattern }}` The uppercase name of the pattern.

#### Step 2: Filename

Next, provide a filename in the `files` constant. Filenames use the same template variables above.

    const files = {
      ...
      'react': '{{ pattern }}.jsx',
      ...
    };

#### Step 3: Is it optional?

Next, if it is an optional template then add 'react' to the `optional` constant. This will generate a prompt to create the file with a yes/no question when running the make script.

    const optional = [
      ...
      'react',
      ...
    ];

#### Step 4: Where to write the template

Next, if the template should written to every new pattern's dedicated directory (ex; **src/{{ type }}/{{ pattern }}/**) then add 'react' to the `patterns` constant. This is the default for most templates except views and Sass config.

    const patterns = [
      ...
      'react',
      ...
    ];

If you do not add 'react' to the `patterns` constant, then you must provide a path you would like it written to in the `paths` constant. For the most part, pattern templates should be closely associated with their pattern so keeping them together is recommended as opposed to writing them to a different directory. However, there may be cases where this needs to be done.

    const paths = {
      ...
      'react': Path.join(dirs.src, 'js', 'react'),
      ...
    };