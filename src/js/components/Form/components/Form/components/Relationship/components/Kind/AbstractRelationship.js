import { h, Component } from 'preact';

/** @jsx h */

import Option from '../../components/Option/Option';

export default class AbstractRelationship extends Component {

    constructor() {
        super();

        this.defaultValue = '';
    }

    /**
     * Creates an option list for a relationship field
     *
     * @param {Object} fieldOptions - field options
     * @param {Object} i18n - translations
     * @param {string} [value] - field value to be selected
     * @param {string} [placeholder] - placeholder (first option)
     * @param {boolean} [isRequired] - disable the placeholder when field is require
     * @returns {Array} options list
     */
    createOptions(fieldOptions, i18n, value, placeholder, isRequired) {
        const formFieldOptions = [];
        let selectedSet = false;

        // check for a placeholder and add it as first option
        if (placeholder) {
            const selectPlaceholder = !value;

            formFieldOptions.push(<Option
                optionValue={ '' }
                value={ placeholder }
                disabled={ isRequired }
                i18n={ i18n }
            />);

            if (selectPlaceholder) {
                this.defaultValue = '';
            }

            selectedSet = selectPlaceholder;
        }

        fieldOptions.forEach(option => {
            let selected = false;

            // todo: this logic shouldnt be here in the frontend
            // relationship values are empty objects
            if (value || (option.selected && typeof value === 'object')) {

                // see if the value (the stored option) matches the currently processed option
                selected = (value === option.slug || option.selected);
            } else {
                if (!selectedSet) {
                    selectedSet = true;

                    // ensure first option is selected when no selection could be extracted from state
                    selected = true;
                }
            }

            // save the value to be selected
            if (selected) {
                this.defaultValue = option.slug;
            }

            formFieldOptions.push(<Option
                optionValue={ option.slug }
                value={ option.name }
                translationKey={ option.translationKey }
                i18n={ i18n }
            />);
        });

        return formFieldOptions;
    }
}
