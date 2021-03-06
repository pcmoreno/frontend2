
# Description

Rebuild the current LTP *Frontend* as a standalone Javascript SPA with the following specs:

# Features

__Deployment__

- Webpack for task automation / bundling of files
- NPM Scripts instead of Gulp / Grunt
- Yarn instead of NPM (faster and improved caching of dependencies)
- JS and CSS code is bundled, uglified, minified
- Sourcemaps for JS and CSS

__HTML and CSS__

- Behaves like a Progressive Web Application (following manifest)
- Fully HTML5, CSS3 compliant (using feature queries instead of modernizr)
- Preconfigured to work offline (service-worker)
- CSS modules (CSS locally scoped and imported by the JS component)
- support for CSS, SCSS, SASS
- PostCSS with NextCSS, Autoprefixer, CSSNano (and most SASS-like features)
- CSS Grid (replacing Bootstrap and Flexbox for layout)
- Aria support (screen readers)

__Javascript__

- Preact (with preact-compat) replaces React
- Redux handles state management
- Native React/Preact Routing
- support for ES2017 that transpiles to es5 (with polyfill)
- Fully component based (using root-container-presentational pattern)

__Performance__

- Much faster delivery using Gzipped assets and lazy loading
- Much faster building of assets (and no more syncing issues?)
- Synchronous fetching (with proper error handling) but asynchronous DOM updates (without ghosting)

__Integration__

- Communicates (using Fetch, instead of Ajax) with *Section Field* endpoints
- Replaces current *Frontend* (and, if possible, *Styleguide*)
- Has a way to implement access rights (roles) and translations
- Can automate building of forms based on *Section Field* configuration

# Quick start

install dependencies:

`yarn install`

add dependency:

`yarn add <package> --dev`

build:

`yarn run build (--watch)`

build:prod:

`yarn run build:prod (--watch)`

test:

`yarn run test`

lint:

`yarn run lint`

deploy: (build, lint, test)

`yarn run deploy`

# Todo

- add tests for Example component
- add ARIA support for visually impaired
- figure out how not to load everything at once but lazy load the components that arent needed initially (prpl pattern)
- add Dockerfile so a docker image can be built and frontend can run as a docker container
- move repository to Githost
- decide what to do with *Styleguide* (may I recommend merging into *Frontend*?)
- implement *NeOn Frontend* (static content) on a per-page base
- refactor views using CSS Grid Layout
- figure out where the translations are loaded from
- figure out how application can load/show only the components the user is authorised for
- refactor components that use Bootstrap classes and remove the dependency
- replace command flow with API calls using Fetch

# Development

The whole application functions as a Single-Page Application. Unknown at this point is whether the non-initial routes
(or pages) are loaded from the beginning. In best case this is pre-fetched or lazy loaded when required. As such there
is only one index.html file, the rest is rendered using the JSX syntax to allow writing HTML in Javascript.

__Javascript__

The Javascript code is structured in 3 basic concepts following best practices from React and Redux:

1) Root component: *src/js/App.js*

The root component combines reducers, sets up the Redux store and ties routing components together. There should only be
one root component, unless specific applications need to be set up. For example, one just for filling in a
questionnaire. Also, this is the only place where reducers should be loaded, combined and passed on to the store.

2) Container component: *src/js/pages/Example/index.js*

The container component defines actions, initial data, maps the state to props, dispatchers. In our old frontend this was
stored in *containers/App.js* but wasnt really concerned with what it should be concerned with: just the data. What does
the initial data look like, how is new data retrieved, how is data stored. It ensures this data is then passed on to a
presentational component. Container components should be placed underneath 'pages', since each page in the application
usually requires its own container- and child components and logic. Also, it should be called index.js to avoid
confusion with presentational components and ease importing.

3) Presentational component: *src/js/Example/js/Example.js*

The presentational component is concerned with the actual layout. Has its own css, and its own component methods. This
is where you would store child components and methods that deal with presentation (ie tabs, modals, panels, sorting).
Keep in mind that it is allowed to import generic components from the *src/js/components* folder if required. Likewise it
is possible to import generic methods from the *src/js/utils* folder if needed. These components need to be as small and
simple as possible! All non-UI logic needs to be defined in the container component!

(And did you know that *src/js/utils/common.js* gets executed on page load? useful for some third-party libraries!)

__Stylesheets__

The root component imports common CSS declarations like colours and typography. While this does not follow the
root-container pattern per se, it allows you to have global CSS together with the specific CSS defined in your components.
It is also much easier to write client-specific CSS code in the future.

The presentational component and (optionally) its children import their own CSS declarations from the
*js/src/pages/**/style* folder. This follows the concept of CSS modules meaning that any CSS code inside will become
available just for that specific component. This means: no more conflicts, specific dependencies and no global scope.
Selector names can be very simple this way although I'd still recommend sticking to BEM naming conventions.

Keep in mind that every child component requires its own style import on top. Without this, no CSS is assigned to that
component. Also, specifically importing CSS will just assign the global selectors from it. To be able to use your own,
custom selectors you will need to refer to your imported styles in your elements. For example:

`import style from './../style/someMasterComponentStylesheet.css
(...)
<someElement className={ style.someCustomSelector }`

You can import any CSS type (CSS, SCSS, SASS) and don't even need to specify the extension (though your IDE may think
differently). You can only use the *@import* directive in .scss files to import another .scss file.

# About tests

In the Frontend we should only be concerned with Functional Tests (closely related to Integration Tests) written from
the end user perspective, covering as much as possible from functionality, interaction and integration. As an example,
when a button is clicked, does the state update? Or, does panel X appear? Or, is the navigation bar populated initially?

All Javascript components should contain such functional tests stored in the *js/src/**/test/* folder. Structurally they
are written in BDD-style: test(), expect(), describe()), it('should'), toBeString() etc.

# Mocking static assets and stylesheets

You can mock the CSS imports and imports for other file types by using fileMocks and identity-obj-proxy

`"jest": {
    "moduleNameMapper": {
          "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
          "\\.(css|less)$": "identity-obj-proxy"
    }
}`

# Mocking localStorage

You can also mock localStorage, using browserMocks.js:

`const localStorageMock = (function() {
let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => store[key] = value.toString(),
        clear: () => store = {}
    };
})();
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});`

and its configuration option in package.json:

`jest: {
    "setupFiles": [
        "<rootDir>/browserMocks.js"
    ],
}`

# Justification for included dependencies

- "@types/node":                  enable code completion (in your IDE) and make compilation possible
- "autoprefixer":                 automatically inserts CSS vendor prefixes
- "babel-core":                   core files of babel used to transpile es2015 to es5
- "babel-eslint":                 used babel parser for linting
- "babel-jest":                   used by the transformPreprocessor that converts JSX before running tests
- "babel-loader":                 loads js during webpacks process
- "babel-polyfill":
- "babel-preset-env":             allows transpiling es2015+ code to specified browser version (defaults to es5)
- "babel-preset-preact":          allows handling of JSX during transpiling
- "classnames":                   used to apply multiple classes to components
- "clean-webpack-plugin":         cleans out folders before copying new files in during deploy
- "compression-webpack-plugin":   used to gzip assets and files
- "copy-webpack-plugin":          used to copy files over during deploy phase
- "css-loader":                   loads css
- "cssnano":                      compresses css and removes comments
- "eslint":                       checks for javascript lint (CLI version)
- "eslint-plugin-css-modules":    will check for unused css declarations
- "eslint-plugin-jest":           contains linting support for jest
- "eslint-plugin-react":          contains linting support for react
- "extract-text-webpack-plugin":  allows extracting css imports from js components
- "file-loader":                  used to be able to load files in webpack
- "if-env":                       can be used to switch functionality per environment
- "jest":                         used to run test from commandline
- "jest-css-modules":             this solves a lot of issues with css modules not being recognised by jest
- "postcss":                      framework for loading css extensions in webpack
- "postcss-loader":               is able to load css and scss
- "preact":                       the DOM manipulation library
- "preact-cli":                   preact for cli, used by jest
- "preact-compat":                react compatibility library for preact
- "preact-render-spy":            collection of tools to facilitate jest testing
- "preact-router":                routing framework
- "precss":                       this is a module for postcss for mixins and nesting support
- "react-redux":
- "redux":
- "style-loader":                 loads the styles
- "stylelint":                    checks for css lint (CLI version)
- "uglifyjs-webpack-plugin":      uglifies, minifies javascript
- "webpack":                      webpack is an advanced task runner


# Notes
 
- Note that ES6 spread operator is not supported yet since its not JS spec. so unless you include 3 huge plugins (of
which one cannot be found) this isnt going to work. More details: https://github.com/babel/babel-preset-env/issues/326
- Currently there is no Redux middleware (Thunk) configured. Instead, all asynchronous code that communicates with
external services is written using a Promise that calls the action when successful. This seems a better, safer approach.
- You can build for production using yarn run build:prod. This changes the outcome of some of the configured tasks.
- Note that in dev mode console will throw a warning invalid prop children supplied. Please ignore this for now.
















------------------------------------------------------------

to-be-converted-to-notes:

note on lazy loading and retrieving data:

the components are lazy loaded. nothing is there initially: there is no initial state since we dont work with
controllers. therefore the data in the application needs to load asynchronously. to do this, we will make more use
of the lifecycle methods. every time a certain point in the application is reached that requires data, the component
lifecycle method loads this data and the redux store keeps it.

do you loose 'snappiness' ? I dont think so. once the data is there, it is displayed instantly, even after going to a
different page/route/component and coming back this is snappier than it used to be in the old frontend, where each route
required loading the data again. and sure enough, loading the page and views is faster, too. its instant once lazy
loaded.


// proposal organisations view data format thingie
let organisationItems =
[
    selectedParentId: LTPROOT,
    entities: [
        [],
        [],
        [],
    ]
],
[
    selectedParentId: 123,
    entities: [
        [
            type: project,
            id: 123
        ],
        [
            type: project,
            id: 456
        ],
        [
            type: project,
            id: 789
        ]
    ]
],
[
    selectedParentId: 456,
    entities: [
        [
            type: jobfunction,
            id: 987
        ],
    ]
],

// determines what content to show in detail panel
let activeOrganisationItemId = 987;

// determine from which point (column) the organisation view is rendered
let startDisplayingFromOrganisationItem = 1;

