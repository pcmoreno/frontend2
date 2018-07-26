import { h, Component } from 'preact';
import ListviewEntityItem from './components/ListviewEntityItem/ListviewEntityItem';
import style from './style/listviewentity.scss';

/** @jsx h */

export default class ListviewEntity extends Component {

    render() {
        const { entity, i18n, translationKeyPrefix, active } = this.props;
        const entityItems = [];

        Object.keys(entity).forEach(entityKey => {
            const value = entity[entityKey].value;
            let widget = null;

            // in case a type was specified, construct a widget object with all possible properties
            // todo: needs a switch here so only the props required for the desired widget are passed on instead of this mess
            if (entity[entityKey].type) {
                widget = {
                    type: entity[entityKey].type,
                    disabled: entity[entityKey].disabled,
                    value: entity[entityKey].value || '',
                    label: entity[entityKey].label || '',
                    action: entity[entityKey].action || '',
                    link: entity[entityKey].link || '',
                    target: entity[entityKey].target || '',
                    id: entity[entityKey].id || '',
                    competencyType: entity[entityKey].competencyType || ''
                };
            }

            entityItems.push(
                <ListviewEntityItem
                    key={ entityKey }
                    entityId={ entityKey }
                    value={ value }
                    widget={ widget }
                    i18n={ i18n }
                    translationKeyPrefix={ translationKeyPrefix }
                    active={ active }
                    action={ entity[entityKey].action }
                />
            );
        });

        return (
            <tr className={ `${style.tableRow} ${active && 'active'}` }>
                { entityItems }
            </tr>
        );
    }
}
