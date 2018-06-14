import { h, Component } from 'preact';
import Logger from '../../../../../../../../utils/logger';
import Pencil from './components/widgets/Pencil/Pencil';
import Button from './components/widgets/Button/Button';
import Checkbox from './components/widgets/Checkbox/Checkbox';
import style from './style/listviewentityitem.scss';
import ListWidgetTypes from '../../../../../../constants/WidgetTypes';

/** @jsx h */

export default class ListviewEntityItem extends Component {
    constructor(props) {
        super(props);

        this.logger = Logger.instance;
    }

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
                if (value && index < value.length - 1) {
                    convertedValues += ', ';
                }
            });

            value = convertedValues;
        } else if (this.props.widget) {

            // a widget was provided. determine its type and output the relevant component with its required props
            switch (this.props.widget.type) {
                case ListWidgetTypes.PENCIL:
                    value = <Pencil widgetAction={ this.props.widget.action } />;
                    break;

                case ListWidgetTypes.CHECKBOX:
                    value = <Checkbox widgetAction={ this.props.widget.action } />;
                    break;

                case ListWidgetTypes.BUTTON: value = <Button
                    label={ this.props.widget.label }
                    link={ this.props.widget.link }
                    i18n={ this.props.i18n }
                    translationKey={ this.props.translationKey }
                />;
                    break;

                default:
                    value = '';
            }

            title = this.props.widget.value;
        } else if (value !== null && value !== 'undefined') {

            // value is not a widget
            title = value;
        } else {

            // default to empty string, so sorting still works
            value = '';
            title = value;
        }

        return (
            <td title={ title } className={ `${style.td} ${entityId}` }>
                { value }
            </td>
        );
    }
}
