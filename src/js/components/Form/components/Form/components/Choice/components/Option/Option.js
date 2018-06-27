import { h, Component } from 'preact';
import Utils from '../../../../../../../../utils/utils';

/** @jsx h */

export default class Option extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { optionValue, value, selected, i18n, translationKey } = this.props;
        let translatedValue = value || '';

        // try to fetch translation based on translation key first, then on value
        if (translationKey) {
            if (i18n[`form_option_${translationKey}`]) {
                translatedValue = i18n[`form_option_${translationKey}`];
            }
        } else {
            let translatedName = '';
            let optionName = value.trim().replace(/ /g, '_');

            if (optionName === optionName.toUpperCase()) {
                translatedName = optionName.toLowerCase();
            } else {

                // convert name to trimmed, snake case string to compare for translations later
                translatedName = Utils.camelCaseToSnakeCase(optionName);
            }

            if (i18n[`form_option_${translatedName}`]) {
                translatedValue = i18n[`form_option_${translatedName}`];
            }
        }

        return (<option value={ optionValue } selected={ selected }>{ translatedValue }</option>);
    }
}
