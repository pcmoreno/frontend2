import { h, Component } from 'preact';

/** @jsx h */

import Option from '../../components/Option/Option';

export default class AbstractRelationship extends Component {

    createOptions(options, i18n, value) {
        const formFieldOptions = [];
        let selectedSet = false;

        options.forEach(option => {
            let selected = false;

            if (value) {

                // see if the value (the stored option) matches the currently processed option
                selected = (value === option.slug);
            } else {
                if (!selectedSet) {
                    selectedSet = true;

                    // ensure first option is selected when no selection could be extracted from state
                    selected = true;
                }
            }

            formFieldOptions.push(<Option
                optionValue={ option.slug }
                value={ option.name }
                translationKey={ option.translationKey }
                selected={ selected }
                i18n={ i18n }
            />);
        });

        return formFieldOptions;
    }
}
