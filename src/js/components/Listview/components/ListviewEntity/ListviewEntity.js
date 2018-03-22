import { h, Component } from 'preact';

/** @jsx h */

import ListviewEntityItem from './components/ListviewEntityItem/ListviewEntityItem';

export default class ListviewEntity extends Component {
    render() {
        const { entity, i18n, translationKey } = this.props;
        const entityItems = [];

        console.log(entity.id);

        Object.keys(entity).forEach(key => {
            const value = entity[key].value;

            // in case a link was supplied together with a value, hand it over to the child component
            let link;

            if (entity[key].link) {
                link = entity[key].link;
            }

            // todo: note that value = { entity.id } was changed in order to get it to work
            // todo: this is because the mocked entities received from the API do not have object properties
            entityItems.push(
                <ListviewEntityItem
                    key={ key }
                    entityId={ key }
                    value={ entity.id }
                    link={ link }
                    i18n={ i18n }
                    translationKey={ translationKey }
                />
            );
        });

        return (
            <tr>
                { entityItems }
            </tr>
        );
    }
}
