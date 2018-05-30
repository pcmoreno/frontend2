import { h, Component } from 'preact';

/** @jsx h */

import Option from '../../components/Option/Option';

export default class AbstractRelationship extends Component {

    createOptions(options) {
        const formFieldOptions = [];
        let selectedSet = false;

        options.forEach(option => {
            let selected = false;

            if (this.props.value && this.props.value.length > 0) {
                selected = this.props.value === option.slug;
            } else {
                if (!selectedSet) {
                    selectedSet = true;

                    // ensure first option is selected when no selection could be extracted from state
                    selected = true;
                }
            }

            formFieldOptions.push(<Option
                optionValue={ option.slug }
                value={option.name}
                selected={ selected }
            />);
        });

        return formFieldOptions;
    }
}
