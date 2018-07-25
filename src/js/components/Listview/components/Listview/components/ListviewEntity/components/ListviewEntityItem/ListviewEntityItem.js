import { h, Component } from 'preact';
import Logger from '../../../../../../../../utils/logger';
import Pencil from './components/widgets/Pencil/Pencil';
import Button from './components/widgets/Button/Button';
import Checkbox from './components/widgets/Checkbox/Checkbox';
import CompetencyType from './components/widgets/CompetencyType/CompetencyType';
import style from './style/listviewentityitem.scss';
import ListItemTypes from '../../../../../../constants/ListItemTypes';
import Utils from '../../../../../../../../utils/utils';

/** @jsx h */

export default class ListviewEntityItem extends Component {
    constructor(props) {
        super(props);

        this.logger = Logger.instance;
    }

    translate(element) {

        // returns either the translation for element, or the original element
        const { translationKeyPrefix, i18n } = this.props;

        if (translationKeyPrefix) {

            // convert to snake case
            const translatableElement = Utils.camelCaseToSnakeCase(element);

            // construct the key required to extract the translation from the i18n object by combining translationKeyPrefix and the lowercased element key
            if (i18n[`${translationKeyPrefix}${translatableElement}`]) {
                return i18n[`${translationKeyPrefix}${translatableElement}`];
            }
        }

        return element;
    }

    render() {
        const { entityId, active } = this.props;
        let { value } = this.props;
        let title;
        let action;

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
                case ListItemTypes.PENCIL:
                    value = <Pencil action={ this.props.widget.action } disabled={ this.props.widget.disabled }/>;
                    break;

                case ListItemTypes.CHECKBOX:
                    value = <Checkbox
                        checked={ active }
                        action={ this.props.widget.action }
                        disabled={ this.props.widget.disabled }
                    />;
                    break;

                case ListItemTypes.BUTTON: value = <Button
                    label={ this.props.widget.label }
                    action={ this.props.widget.action }
                    link={ this.props.widget.link }
                    target={ this.props.widget.target }
                    i18n={ this.props.i18n }
                    disabled={ this.props.widget.disabled }
                    translationKeyPrefix={ this.props.translationKeyPrefix }
                />;
                    break;

                case ListItemTypes.COMPETENCY_TYPE:
                    value = <CompetencyType competencyType={ this.props.widget.competencyType }/>;
                    break;

                case ListItemTypes.HIDDEN:
                default:
                    value = '';
            }

            title = this.translate(this.props.widget.value);
        } else if (value !== null && value !== 'undefined') {
            title = this.translate(value);
            value = this.translate(value);

            if (this.props.action) {
                action = this.props.action;
            }
        } else {

            // default to empty string, so sorting still works
            // todo: is this fallback still required after introducing the widgets and the way they are handled?
            value = '';
            title = '';
        }

        return (
            <td
                title={ title }
                className={ `${style.td} ${entityId} ${this.props.widget ? this.props.widget.type : ''}` }
                onClick={ action }
            >
                { value }
            </td>
        );
    }
}
