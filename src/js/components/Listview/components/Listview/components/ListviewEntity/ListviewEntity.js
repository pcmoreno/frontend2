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

            entityItems.push(
                <ListviewEntityItem
                    key={ entityKey }
                    entityId={ entityKey }
                    value={ value }
                    link={ link }
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
