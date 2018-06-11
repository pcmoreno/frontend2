import { h, Component } from 'preact';

/** @jsx h */

import ListviewEntity from './components/ListviewEntity/ListviewEntity';
import style from './style/listview.scss';

/** Preact Listview Component v2.1
 *
 *  requires its data (this.props.entities) to be a collection (array) of objects written in this format:
 *
 *  {
 *     id: {
 *         value: participant.uuid
 *     },
 *     name: {
 *         value: `${participant.firstName} ${participant.infix} ${participant.lastName}`
 *     }
 *  }
 *
 * allows providing an array of values instead of single value (arrays are sorted alphabetically by default)
 * for each value / array key an attempt to find a matching translation is made (values are trimmed and lowercased)
 * if translationKey was not provided, retrieving a default translation will be attempted, too ('listview|<value>') todo: will this stay in?
 * by providing a sortingKey, values can be displayed independent from their sorting behaviour (useful for dates)
 * values can be strings, arrays of strings, or arrays of objects. (but they need to be in the 'value' key, see example)
 * a <a href class="button-action"> is output when you provide a 'link' to go with the value, which becomes its label
 * you can add a custom widget (for example, an icon) with the following syntax:
 *
 *  a_column_label_that_can_be_left_empty_in_your_i18n_if_required: {
 *      type: 'pencil',
 *      value: '',
 *      action: () => { action.amendParticipant(account.id); }
 * }
 *
 * the 'type' can be extended with your own custom type if required
 * the 'value' can be leveraged to provide texts for buttons or labels
 * the 'action' is the method that is called on clicking the widget. note this needs to be passed on to action / reducer
 **/

export default class Listview extends Component {
    constructor(props) {
        super(props);

        // introduce localState to keep track of the view
        this.localState = {
            sortBy: '',
            sortOrder: 'asc'
        };

        this.localEntities = [];
    }

    setDefaultSorting(entities) {

        // get given entities
        this.localEntities = entities;

        // set given sorting properties
        if (this.props.defaultSortingKey) {
            this.localState.sortBy = this.props.defaultSortingKey;
            this.localState.sortOrder = this.props.defaultSortingOrder ? this.props.defaultSortingOrder : this.localState.sortOrder;
        }

        // perform default sorting
        this.sortEntities(this.localEntities, this.localState.sortBy, this.localState.sortOrder);
    }

    sortingKey(entity) {

        // prevent null values breaking the sorting function
        if (entity.value === null) {
            entity.value = '';
        }

        // returns either provided value, provided sortingKey or stringified array of entities
        let returnValue = entity.value;

        if (returnValue.length > 0) {

            // if object was provided, extract take object.value
            if (returnValue.hasOwnProperty('value')) {
                returnValue = returnValue.value;
            } else if (returnValue[0].hasOwnProperty('value')) {
                returnValue = returnValue[0].value;
            }

            // if returnValue is an array, convert to string and use its stringified result as sortingKey
            if (Array.isArray(returnValue)) {
                let arrayToString;

                returnValue.forEach(entityReturn => {
                    arrayToString += entityReturn;
                });

                returnValue = arrayToString;
            }
        }

        return entity.hasOwnProperty('sortingKey') ? entity.sortingKey : returnValue;
    }

    sortEntities(entities, sortBy, sortOrder) {

        // bubble sort the entities on given sortBy key in the order set by sortOrder
        entities.sort((a, b) => {
            const nameA = this.sortingKey(a[sortBy]).toLowerCase();
            const nameB = this.sortingKey(b[sortBy]).toLowerCase();

            if (sortOrder === 'asc') {
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // default return value (no sorting)
                return 0;
            }

            if (nameA > nameB) {
                return -1;
            }

            if (nameA < nameB) {
                return 1;
            }

            // default return value (no sorting)
            return 0;
        });
    }

    listByEntityName(sortBy) {

        // determine sort order
        if (this.localState.sortBy === sortBy) {
            if (this.localState.sortOrder === 'asc') {
                this.localState.sortOrder = 'desc';
            } else {
                this.localState.sortOrder = 'asc';
            }
        } else {
            this.localState.sortBy = sortBy;
            this.localState.sortOrder = 'asc';
        }

        // before sorting, make a copy of current sorted entities
        const previousSortingState = this.localEntities.slice(0);

        // sort the array with given key
        this.sortEntities(this.localEntities, sortBy, this.localState.sortOrder);

        if (previousSortingState[0] === this.localEntities[0]) {

            // content already sorted this way, reversing order
            if (this.localState.sortOrder === 'asc') {
                this.localState.sortOrder = 'desc';
            } else {
                this.localState.sortOrder = 'asc';
            }

            this.sortEntities(this.localEntities, sortBy, this.localState.sortOrder);
        }

        // update the localState with newly sorted array (setState causes re-render of component)
        this.setState(this.localState);
    }

    render() {
        const { entities, i18n, translationKey } = this.props;

        if (this.localEntities.length === 0) {

            // when localEntities were not set (first render) perform default given sorting
            if (!entities || entities.length === 0) {
                return null; // no entities were given, do not render
            }

            // entities were given, but not yet sorted. Perform default sorting
            this.setDefaultSorting(entities);
        } else {
            if (this.localEntities !== entities) {

                // if entities are changed and not set, do not render
                if (!entities || !entities.length) {
                    return null;
                }

                // we got a new set of properties, so store them
                this.localEntities = entities;

                // sort in stored order
                this.sortEntities(this.localEntities, this.localState.sortBy, this.localState.sortOrder);
            }
        }

        // use the first entry in the collection to get the keys as labels and find their translation if available
        const labels = [];

        Object.keys(this.localEntities[0]).forEach(key => {
            let label = key;

            if (translationKey) {

                // todo: linting doesnt allow snake_case identifiers and Sanders' util needs to be integrated here
                if (key === 'amendParticipantLabel') {
                    key = 'amend_participant_label';
                }

                // if translationKey was provided, see if it can be retrieved. otherwise resort to key
                const translatedLabel = i18n[`${translationKey}${key}`];

                label = translatedLabel ? translatedLabel : key;
            }

            // todo: generic listview translations are currently disabled and I wonder whether we should bring it back
            // if (label === key) {
            //     translationKey was not provided, see if a generic translation can be found
            //     const genericLabel = i18n.translations['listview|' + key];
            //     const genericLabel = key;
            //     label = genericLabel ? genericLabel : key;
            // }

            labels.push([label, key]);
        });

        const output = this.localEntities.map((entity, index) =>
            <ListviewEntity
                key={ index }
                entity={ entity }
                i18n={ i18n }
                translationKey={ translationKey }
            />);

        return (
            <table className={ style.listview } id="listview">
                <thead>
                    <tr>
                        {
                            labels.map(label =>
                                <th
                                    key={ label[1] }
                                    className={ label[1] }
                                    onClick={ this.listByEntityName.bind(this, label[1]) }
                                >
                                    { label[0] }
                                </th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    { output }
                </tbody>
            </table>
        );
    }
}
