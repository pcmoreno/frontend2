
# Description

Rebuild the current LTP *Frontend* as a standalone Javascript SPA with the following specs:

# Features

__Deployment__

- Webpack for bundling of files and definition of tasks
- NPM Scripts instead of Gulp / Grunt for global tasks (test, lint, deploy)
- Yarn instead of NPM (faster and improved caching of dependencies)
- JS and CSS code is bundled, uglified, minified
- Sourcemaps for JS and CSS

__HTML and CSS__

- Behaves like a Progressive Web Application (following manifest)
- Preconfigured to work offline (service-worker)
- Fully HTML5, CSS3 compliant (using feature queries instead of modernizr: https://24ways.org/2017/cascading-web-design)
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
- Asynchronous fetching of data (with proper error handling), asynchronous DOM updates (without ghosting)
- Solve the browser caching issue
- Allow writing functional tests following Enzyme syntax with Jest as test runner (and render-spy as a helper)

__Integration__

- Communicates (using Fetch, instead of Ajax) with *Section Field* endpoints
- Replaces current *Frontend* (and, if possible, *Styleguide*)
- Has a way to implement access rights (roles) and translations
- Can automate building of forms based on *Section Field* configuration

# Todo

- decide what to do with *Styleguide* (may I recommend merging into *Frontend*?)
- implement *NeOn Frontend* (static content) on a per-page base
- refactor views using CSS Grid Layout: https://hackernoon.com/how-css-grid-beats-bootstrap-85d5881cf163
- figure out where the translations are loaded from
- figure out how application can load/show only the components the user is authorised for
- refactor components that use Bootstrap classes and remove the dependency
- replace command flow with API calls using Fetch

# Quick start

Just install, build and run the project. You will find commands for common tasks here:

install dependencies:

`yarn install`

add dependency:

`yarn add <package> --dev`

build:

`yarn run build:dev (--watch)`

test:

`yarn run test`

lint:

`yarn run lint`

build for deployment: (lint, test, build)

`yarn run build:acc`
`yarn run build:prod`

note that if you add a '--quiet' parameter to a linting command, warnings will be suppressed.

## Env / build variables
Environment variables are configured in the repository CI settings.
The required variables to build the project can be found in the scripts configuration in `package.json`.
Other environment vars to deploy to S3 are also in the repo's CI settings and are referenced in the CI yml file.

# Development

The whole application functions as a Single-Page Application. Only the logic for the current route is loaded initially.
There is only one index.html file, the rest is rendered using the JSX syntax to allow writing HTML in Javascript.

__Javascript__

The Javascript code is structured in 3 basic concepts following best practices from React and Redux:

1) Root component: *src/js/App.js*

The root component combines reducers, sets up the Redux store and ties routing components together. There should only be
one root component, unless specific applications need to be set up. For example, one just for filling in a
questionnaire. Also, this is the only place where reducers should be loaded, combined and passed on to the store.

2) Container component: *src/js/pages/Example/index.js*

The container component defines actions, initial data, maps the state to props, configures dispatchers. In our old
*Frontend* this was stored in *containers/App.js* but wasnt really concerned with what it should be concerned with: just
the data. What does the initial data look like, how is new data retrieved, how is data stored. It ensures this data is
then passed on to a presentational component. Container components should be placed underneath 'pages', since each page
in the application usually requires its own container- and child components and logic. Also, it should be called
index.js to avoid confusion with presentational components and ease importing.

3) Presentational component: *src/js/Example/js/Example.js*

The presentational component is concerned with the actual layout. Has its own css, and its own component methods. This
is where you would store child components and methods that deal with presentation (ie tabs, modals, panels, sorting).
Keep in mind that it is allowed to import generic components from the *src/js/components* folder if required. Likewise it
is possible to import generic functions from the *src/js/utils* folder if needed. These components need to be as small and
simple as possible! All non-UI logic needs to be defined in the container component! UI-logic can be stored in a local
state which I would call localState to avoid confusion with the 'real' state.

__Stylesheets__

The root component imports common CSS declarations like colours and typography. While this does not follow the
root-container pattern per se, it allows you to have global CSS together with the specific CSS defined in your components.
It is also much easier to write client-specific CSS code in the future.

The presentational component and (optionally) its children import their own CSS declarations from the
*js/src/pages/**/style* folder. This follows the concept of CSS modules meaning that any CSS code inside will become
available just for that specific component. This means: no more conflicts, specific dependencies and no global scope.
Because of this, selector names can be very simple although I'd still recommend sticking to BEM naming conventions.

Keep in mind that every child component requires its own style import on top. Without this, no CSS is assigned to that
component. Also, specifically importing CSS will just assign the global selectors (h1, section, li) from it. To be able to use your own,
custom selectors (.something, .listView) you will need to refer to your imported styles in your elements. For example:

`import style from './../style/someStylesheet.css`

`<someElement className={ style.someCustomSelector }`

Note that named child component selectors (ie .someChildElement) will need to follow the same convention!

You can import any CSS type (CSS, SCSS, SASS) and don't even need to specify the extension (though your IDE may think
differently). Note however that you can only use the *@import* directive in .scss files to import another .scss file.

# About Redux

Redux is a JavaScript library that aims to simplify how we manage stateful data. Redux keeps all of our data in a single
JS object called the Store. A single function, the reducer, is responsible for making modifications to the Store. We
trigger the reducer by 'dispatching' an action - a JS object that describes how our data should change. The reducer
function receives the action as an argument and makes changes accordingly. Other parts of the code (usually React
Components) can subscribe to data in the Store. When data changes, Redux notifies subscribers of the change

# About lazy-loading

The preact-async-route package is used to lazy-load components. Instead of importing every component in App.js, define
functions that load the specific component when the user requests the route. Webpack automatically recognises these
system imports and writes separate 0.js, 1.js etc. bundles for those. Because of this, it doesnt make much sense to turn
the project into a PWA. This would only mean all split JS bundles are loaded right at the start by the service-worker,
making the lazy-load logic useless.

But then, having a service-worker for a data-driven application like NeOn is perhaps a bit useless altogether. Instead, implement
the service-worker a specific parts in the application where offline usage makes sense, for example the questionnaires.

### Loading of data

Technically the data for a component should be loaded when the component gets mounted. Ideally I would use the React
lifecycle methods for these. Remember, there is no initial state like in our old *Frontend*. This is no problem though,
after loading data for the first time it will remain in the store, even when you navigate to different routes. The
application will feel even snappier than it used to, thanks to the code splitting and heavily cut-down and compressed
assets.

# About tests

In the Frontend we should only be concerned with Functional Tests (closely related to Integration Tests) written from
the end user perspective, covering as much as possible from functionality, interaction and integration. As an example,
when a button is clicked, does the state update? Or, does panel X appear? Or, is the navigation bar populated initially?

All Javascript components should contain such functional tests and they should be stored in the *js/src/**/test/*
folder. They are using the Jest testing framework together with the preact-render-spy package to integrate with Preact.
Tests are written in BDD-style: test(), expect(), describe() it(should) etc. You can use basic Enzyme-style syntax.

A good cheatsheet for testing: `http://tobyho.com/2011/12/15/jasmine-spy-cheatsheet/`

## Mocking in tests

There are various ways you can mock parts of your code for testing purposes:

##### Setting or mocking state and props

First off, you need to be aware of the difference between shallow and deep testing. When shallow testing a child
component, pass on its props like you would in the actual code:

`const context = shallow(<ExampleItem items={ [{id: 'item 1'}, {id: 'item 2'}] } />);
    const list = (context.find('#project-list'));
    expect(list.find('li').length).toBe(2);`

For deep testing a container or root component, you can specify how deep you want child components to render and simply
set and test the (initial) state this way:

`context.setState({
    items: [
        {id: 'item 1'},
        {id: 'item 2'}
    ]
});
expect(context.state()).toEqual({
    items: [
        {id: 'item 1'},
        {id: 'item 2'}
    ]`

##### Mocking a (parent) function

You can use the Jest mocking function. At the top of your test file, put:

`jest.mock('../../../utils/showCurrentTime.js', () => jest.fn().mockReturnValue('12:34'));`

This is mocking the actual import in your code and will return the specified output value.

Now you can write your Expect this way:

`expect(context.find('span').at(0).text()).toBe('12:34');`

##### Mocking static assets and stylesheets

You can mock the CSS imports and imports for other file types by using fileMocks and identity-obj-proxy

`"jest": {
    "moduleNameMapper": {
          "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
          "\\.(css|less)$": "identity-obj-proxy"
    }
}`

##### Mocking localStorage

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
- "babel-polyfill":               not all parts of the es6 spec can be transpiled to es5. you need this polyfill, too
- "babel-preset-env":             allows transpiling es2015+ code to specified browser version (defaults to es5)
- "babel-preset-preact":          allows handling of JSX during transpiling
- "clean-webpack-plugin":         cleans out folders before copying new files in during deploy
- "compression-webpack-plugin":   used to gzip assets and files
- "copy-webpack-plugin":          used to copy files over during deploy phase
- "css-loader":                   loads css code encountered by webpack and resolves its dependencies
- "cssnano":                      compresses css and removes comments
- "eslint":                       checks for javascript lint (CLI version)
- "eslint-plugin-css-modules":    will check for unused css declarations
- "eslint-plugin-jest":           contains linting support for jest
- "eslint-plugin-jsx-a11y":       detects accessibility issues during linting
- "eslint-plugin-react":          contains linting support for react
- "extract-text-webpack-plugin":  allows extracting css imports from js components
- "file-loader":                  used to be able to load files in webpack
- "fontawesome":                  main fontawesome library
- "fontawesome-free-solid"        the free font-awesome glyph library that is used in neon
- "react-fontawesome":            helper component that renders the given fontawesome icon
- "file-loader":                  used to uhm, well. I have no idea. please figure out.
- "if-env":                       can be used to switch functionality per environment
- "jest":                         test runner for command line
- "jest-css-modules":             this solves a lot of issues with css modules not being recognised by jest
- "postcss":                      framework for loading css extensions in webpack
- "postcss-import":               allows using @import statements in css and puts them first
- "postcss-loader":               is able to load css and scss
- "preact":                       the DOM manipulation library
= "preact-async-route"            used to lazy load the components
- "preact-cli":                   preact for cli, used by jest
- "preact-compat":                react compatibility library for preact
- "preact-render-spy":            collection of tools to facilitate jest testing
- "preact-router":                routing framework for preact
- "precss":                       this is a module for postcss for mixins and nesting support
- "react-redux":                  connects (p)react with redux
- "redux":                        redux simplifies state management
- "sass-resources-loader":        injects global sass variables before compiling the extracted css js into css modules 
- "style-loader":                 handles resolved css and ensures it is written as a file
- "stylelint":                    checks for css lint (CLI version)
- "uglifyjs-webpack-plugin":      uglifies, minifies javascript
- "webpack":                      webpack is an advanced module bundler / task runner


# Notes
 
- Note that ES6 spread operator is not supported yet since its not JS spec. So unless you include 3 huge plugins (of
which one cannot be found) this isnt going to work. More details: https://github.com/babel/babel-preset-env/issues/326
- Currently there is no Redux middleware (Thunk) configured. Instead, all asynchronous code that communicates with
external services is written using a Promise that calls the action when successful. This seems a better, safer approach.
- You can build for production using yarn run build:prod. This changes the outcome of some of the configured tasks.
- Note that in dev mode console will throw a warning invalid prop children supplied. Please ignore this for now.
- To run a specific test, edit the "roots" key in package.json
- Note that *src/js/utils/common.js* gets executed on page load. Useful for some third-party libraries!
- Configuration for the ES and CSS linter can be found in the root of the project.
- You will need to have Node 8 or higher in order to successfully run the tests (something with the test-runner)
