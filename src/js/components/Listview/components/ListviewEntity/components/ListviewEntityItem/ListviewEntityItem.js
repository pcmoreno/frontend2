import { h, Component } from 'preact';

/** @jsx h */

import ListviewEntityItemButton from './components/ListviewEntityItemButton/ListviewEntityItemButton';

export default class ListviewEntityItem extends Component {
    translate(element) {

        // returns either the translation for element, or the original element
        const { translationKey, i18n } = this.props;

        if (translationKey) {

            // convert to lowercase and replace space with dash
            const translatableElement = element.replace(/\s+/g, '-').toLowerCase();

            if (i18n.translations[translationKey + '|' + translatableElement]) {
                return i18n.translations[translationKey + '|' + translatableElement];
            } else {
                return element;
            }
        } else {
            return element;
        }
    }

    render() {
        let { entityId, value } = this.props;

        console.log(entityId);

        if (Array.isArray(value)) {

            // value is an array: iterate over it, find translation for each element, and construct as type string
            let convertedValues = '';

            value.map((key, index) => {

                // if object was provided, extract take object.value
                if (key.hasOwnProperty('value')) {
                    key = key.value;
                } else if (key[0].hasOwnProperty('value')) {
                    key = key[0].value;
                }

                // add to string after attempting to get translation
                convertedValues += this.translate(key);

                // if not the last entry, add a comma

                if (index < value.length - 1) {
                    convertedValues += ', ';
                }
            });

            value = convertedValues;
        } else if (this.props.link) {

            // value is not an array. see if it is a link
            const buttonLabel = this.translate(value);
            const buttonLink = this.props.link;
            const buttonClass = 'button-action';

            value = <ListviewEntityItemButton
                buttonLabel = { buttonLabel }
                buttonLink = { buttonLink }
                buttonClass = { buttonClass }
            />;
        };
        // else if (value !== null && value.length > 0) {
        //
        //     // value is not a link. get translation (if applicable)
        //     value = this.translate(value);
        // }

        return (
            <td title={ value } className={ entityId }>
                { value }
            </td>
        );
    }
}
