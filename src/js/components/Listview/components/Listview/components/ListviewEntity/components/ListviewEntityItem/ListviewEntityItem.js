import { h, Component } from 'preact';
import ListviewEntityItemButton from './components/ListviewEntityItemButton/ListviewEntityItemButton';
import ListviewEntityItemWidget from './components/ListviewEntityItemWidget/ListviewEntityItemWidget';
import style from './style/listviewentityitem.scss';

/** @jsx h */

export default class ListviewEntityItem extends Component {
    translate(element) {

        // returns either the translation for element, or the original element
        const { translationKey, i18n } = this.props;

        if (translationKey) {

            // convert to lowercase and replace space with dash
            // todo: add Sander' util here to convert camelCase to snake_case

            const translatableElement = element.replace(/\s+/g, '-').toLowerCase();

            if (i18n[`${translationKey}${translatableElement}`]) {
                return i18n[`${translationKey}${translatableElement}`];
            }
        }

        return element;
    }

    render() {
        const { entityId } = this.props;
        let { value } = this.props;
        let title;

        if (Array.isArray(value)) {

            // value is an array: iterate over it, find translation for each element, and construct as type string
            let convertedValues = '';

            value.forEach((key, index) => {

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

            // value is a link
            const buttonLabel = this.translate(value);
            const buttonLink = this.props.link;
            const buttonClass = 'action_button';

            value = <ListviewEntityItemButton
                buttonLabel = { buttonLabel }
                buttonLink = { buttonLink }
                buttonClass = { buttonClass }
            />;

            title = buttonLabel;

        } else if (this.props.widget) {

            // value is  a widget
            value = <ListviewEntityItemWidget
                widgetType = { this.props.widget.type }
                widgetLabel = { this.props.widget.value }
                widgetAction = { this.props.widget.action }
            />;

            title = this.props.widget.value;

        } else if (value !== null && value !== 'undefined') {

            // value is not a link or widget, so get its translation
            value = this.translate(value);
            title = value;
        }

        return (
            <td title={ title } className={ `${style.td} ${entityId}` }>
                { value }
            </td>
        );
    }
}
