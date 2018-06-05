import { h, Component } from 'preact';

/** @jsx h */

import ListviewEntityItem from './components/ListviewEntityItem/ListviewEntityItem';
import style from './style/listviewentity.scss';

export default class ListviewEntity extends Component {
    render() {
        const { entity, i18n, translationKey } = this.props;
        const entityItems = [];

        Object.keys(entity).forEach(entityKey => {
            const value = entity[entityKey].value;

            // in case a link was supplied together with a value, hand it over to the child component
            let link;

            if (entity[entityKey].link) {
                link = entity[entityKey].link;
            }

            // in case a widget was supplied together with a value, hand it over to the child component
            // todo: at some point investigate if 'link' can be turned into a widget, too
            let widget;

            if (entity[entityKey].type) {

                // type was specified, assume its a widget and construct an object that can be passed on
                widget = {
                    type: entity[entityKey].type,
                    value: entity[entityKey].value,
                    action: entity[entityKey].action
                };
            }

            entityItems.push(
                <ListviewEntityItem
                    key={ entityKey }
                    entityId={ entityKey }
                    value={ value }
                    link={ link }
                    widget={ widget }
                    i18n={ i18n }
                    translationKey={ translationKey }
                />
            );
        });

        return (
            <tr className={ style.tableRow }>
                { entityItems }
            </tr>
        );
    }
}
