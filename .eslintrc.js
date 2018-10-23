module.exports = {
    "parser": "babel-eslint",
    "extends": [
        "eslint:recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:css-modules/recommended"
    ],
    "plugins": [
        "react",
        "jest",
        "jsx-a11y",
        "css-modules"
    ],
    "env": {
        "browser": true,
        "node": true,
        "mocha": true,
        "es6": true,
        "jest/globals": true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "modules": true,
            "jsx": true
        }
    },
    "settings": {
        "import/extensions": [
            ".js",
        ],
        "react": {
            "pragma": "h"
        }
    },
    "globals": {
        "sleep": 1
    },
    "rules": {
        "react/jsx-no-bind": [0, { "ignoreRefs": true }],
        "react/jsx-no-duplicate-props": 2,
        "react/self-closing-comp": 2,
        "react/prefer-es6-class": 2,
        "react/no-string-refs": 2,
        "react/require-render-return": 2,
        "react/no-find-dom-node": 2,
        "react/no-is-mounted": 2,
        "react/jsx-no-comment-textnodes": 2,
        "react/jsx-no-undef": 2,
        "react/jsx-uses-react": 2,
        "react/jsx-uses-vars": 2,
        "jest/no-disabled-tests": 1,
        "jest/no-focused-tests": 1,
        "jest/no-identical-title": 2,
        "jsx-a11y/tabindex-no-positive": 0, // ignore positive values as we want to create our own tab navigation flow
        "jsx-a11y/click-events-have-key-events": 0, // ignore key events as onClick will already support enough actions (click and enter)
        "jsx-a11y/no-noninteractive-element-interactions": 0, // allow onClick methods on any element instead of only "interactive" elements
        "jsx-a11y/no-noninteractive-element-to-interactive-role": 1, // allow own role definitions
        "jsx-a11y/label-has-for": [ 2, { // to ensure labels are correctly connected to input fields with react
            "required": {
                "every": [ "id" ]
            }
        }],

        // rules are initially copied / converted to json from eslint default
        // https://github.com/eslint/eslint/blob/v4.18.2/packages/eslint-config-eslint/default.yml
        "array-bracket-spacing": "error",
        "array-callback-return": "error",
        "arrow-body-style": [
            "error",
            "as-needed"
        ],
        "arrow-parens": [
            "error",
            "as-needed"
        ],
        "arrow-spacing": "error",
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "block-spacing": "error",
        "brace-style": [
            "error",
            "1tbs"
        ],
        "camelcase": "error",
        "callback-return": [
            "error",
            [
                "cb",
                "callback",
                "next"
            ]
        ],
        "class-methods-use-this": "off", // switched off. Otherwise all methods are required to be static when they do not use the this scope (e.g. render method)
        "comma-dangle": "error",
        "comma-spacing": "error",
        "comma-style": [
            "error",
            "last"
        ],
        "computed-property-spacing": "error",
        "consistent-return": "error",
        "curly": [
            "error",
            "all"
        ],
        "default-case": "error",
        "dot-location": [
            "error",
            "property"
        ],
        "dot-notation": [
            "error",
            {
                "allowKeywords": true
            }
        ],
        "eol-last": "error",
        "eqeqeq": "error",
        "func-call-spacing": "error",
        "func-style": [
            "error",
            "declaration",
            {
                "allowArrowFunctions": true // added this option to allow arrow functions like: const a = () => {}
            }
        ],
        "function-paren-newline": [
            "error",
            "consistent"
        ],
        "generator-star-spacing": "error",
        "guard-for-in": "error",
        "handle-callback-err": [
            "error",
            "err"
        ],
        "key-spacing": [
            "error",
            {
                "beforeColon": false,
                "afterColon": true
            }
        ],
        "keyword-spacing": "error",
        "lines-around-comment": [
            "error",
            {
                "beforeBlockComment": true,
                "afterBlockComment": false,
                "beforeLineComment": true,
                "afterLineComment": false
            }
        ],
        "max-len": [
            "error",
            160,
            {
                "ignoreComments": true,
                "ignoreUrls": true,
                "ignoreStrings": true,
                "ignoreTemplateLiterals": true,
                "ignoreRegExpLiterals": true
            }
        ],
        "max-statements-per-line": "error",
        "new-cap": "error",
        "new-parens": "error",
        "no-alert": "error",
        "no-array-constructor": "error",
        "no-async-promise-executor": "error",
        "no-buffer-constructor": "error",
        "no-caller": "error",
        "no-catch-shadow": "error",
        "no-confusing-arrow": "error",
        "no-console": "error",
        "no-delete-var": "error",
        "no-else-return": [
            "error",
            {
                "allowElseIf": false
            }
        ],
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-fallthrough": "error",
        "no-floating-decimal": "error",
        "no-global-assign": "error",
        "no-implied-eval": "error",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-loop-func": "error",
        "no-mixed-requires": "error",
        "no-mixed-spaces-and-tabs": [
            "error",
            false
        ],
        "no-multi-spaces": "error",
        "no-multi-str": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 2,
                "maxBOF": 0,
                "maxEOF": 0
            }
        ],
        "no-nested-ternary": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-object": "error",
        "no-new-require": "error",
        "no-new-wrappers": "error",
        "no-octal": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "warn", // warn for param reassign!
        "no-path-concat": "error",
        "no-process-exit": "error",
        "no-proto": "error",
        "no-prototype-builtins": "warn", // warn on prototype usage
        "no-redeclare": "error",
        "no-restricted-properties": [
            "error",
            {
                "property": "substring",
                "message": "Use .slice instead of .substring."
            },
            {
                "property": "substr",
                "message": "Use .slice instead of .substr."
            },
            {
                "object": "assert",
                "property": "equal",
                "message": "Use assert.strictEqual instead of assert.equal."
            },
            {
                "object": "assert",
                "property": "notEqual",
                "message": "Use assert.notStrictEqual instead of assert.notEqual."
            },
            {
                "object": "assert",
                "property": "deepEqual",
                "message": "Use assert.deepStrictEqual instead of assert.deepEqual."
            },
            {
                "object": "assert",
                "property": "notDeepEqual",
                "message": "Use assert.notDeepStrictEqual instead of assert.notDeepEqual."
            }
        ],
        "no-return-assign": "error",
        "no-script-url": "error",
        "no-self-assign": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-shadow": "error",
        "no-shadow-restricted-names": "error",
        "no-tabs": "error",
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef": [
            "error",
            {
                "typeof": true
            }
        ],
        "no-undef-init": "error",
        "no-undefined": "error",
        "no-underscore-dangle": [
            "error",
            {
                "allowAfterThis": true
            }
        ],
        "no-unmodified-loop-condition": "error",
        "no-unneeded-ternary": "error",
        "no-unused-expressions": "error",
        "no-unused-vars": [
            "error",
            {
                "vars": "all",
                "args": "after-used"
            }
        ],
        "no-use-before-define": "error",
        "no-useless-call": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "warn", // allow useless constructor as its a pattern in react
        "no-useless-escape": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-whitespace-before-property": "error",
        "no-with": "error",
        "no-var": "error",
        "object-curly-newline": [
            "error",
            {
                "consistent": true,
                "multiline": true
            }
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "object-property-newline": [
            "error",
            {
                "allowAllPropertiesOnSameLine": true
            }
        ],
        "object-shorthand": "error",
        "one-var-declaration-per-line": "error",
        "operator-assignment": "error",
        "operator-linebreak": "error",
        "padding-line-between-statements": [
            "error",
            {
                "blankLine": "always",
                "prev": [
                    "const",
                    "let",
                    "var"
                ],
                "next": "*"
            },
            {
                "blankLine": "any",
                "prev": [
                    "const",
                    "let",
                    "var"
                ],
                "next": [
                    "const",
                    "let",
                    "var"
                ]
            }
        ],
        "prefer-arrow-callback": "error",
        "prefer-const": "warn", // changed from error to warning to not enforce usage of const over let
        "prefer-numeric-literals": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "warn", // changed from error to warning to not enforce using template strings and allow regular string concatenation.
        "quotes": [
            "warn",
            "single", // prefer singlequotes
            {
                "avoidEscape": true
            }
        ],
        "quote-props": [
            "error",
            "as-needed"
        ],
        "radix": "error",
        "require-atomic-updates": "error",
        "require-jsdoc": "error",
        "rest-spread-spacing": "error",
        "semi": "error",
        "semi-spacing": [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "semi-style": "error",
        "space-before-blocks": "error",
        "space-before-function-paren": [
            "error",
            "never"
        ],
        "space-in-parens": "error",
        "space-infix-ops": "error",
        "space-unary-ops": [
            "error",
            {
                "words": true,
                "nonwords": false
            }
        ],
        "spaced-comment": [
            "error",
            "always",
            {
                "exceptions": [
                    "-"
                ]
            }
        ],
        "strict": [
            "error",
            "global"
        ],
        "switch-colon-spacing": "error",
        "symbol-description": "error",
        "template-curly-spacing": [
            "error",
            "never"
        ],
        "template-tag-spacing": "error",
        "unicode-bom": "error",
        "valid-jsdoc": [
            "error",
            {
                "prefer": {
                    "return": "returns"
                },
                "preferType": {
                    "String": "string",
                    "Number": "number",
                    "Boolean": "boolean",
                    "object": "Object",
                    "function": "Function"
                }
            }
        ],
        "wrap-iife": "error",
        "yield-star-spacing": "error",
        "yoda": [
            "error",
            "never"
        ]
    }
};
