import { h, Component } from 'preact';

/** @jsx h */

import ListviewEntity from './components/ListviewEntity/ListviewEntity';
import style from './style/listview.scss';
import Utils from '../../../../utils/utils';
import ListWidgetTypes from '../../constants/WidgetTypes';

/** Preact Listview Component v2.2
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
 * Features:
 * allows providing an array of values instead of single value (arrays are sorted alphabetically by default)
 * for each value / array key an attempt to find a matching translation is made (values are trimmed and lowercased)
 * by providing a sortingKey, values can be displayed independent from their sorting behaviour (useful for dates)
 * values can be strings, arrays of strings, or arrays of objects. (but they need to be in the 'value' key, see example)
 *
 *
 * Widgets:
 * you can add a custom widget (button, icon, checkbox etc) with the following syntax:
 *
 *  a_table_head_label_that_can_be_left_empty_in_your_i18n_if_required: {
 *      type: ListWidgetTypes.PENCIL,
 *      value: '',
 *      action: () => { action.amendParticipant(account.id); }
 * }
 *
 * the 'type' can be extended with your own custom type if required
 * the 'value' can be leveraged to provide texts for buttons or labels
 * the 'action' is the method that is called on clicking the widget. note this needs to be passed on to action / reducer
 *
 *
 * Selecting entities:
 * In order to allow selecting individual entities in the listview, you can pass on an array of id's called
 * selectedEntities containing entity id's that should receive the class 'active'. The match is made on entity.id.
 * Note the actual selecting / deselecting should be done by a checkbox widget and a method in the calling component.
 *
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

    setDefaultSorting() {

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

        if (returnValue && returnValue.length > 0) {

            // note that widgets dont always have a value

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

    setAndSortEntities(entities) {
        const storedAmount = this.localEntities.length;

        // set the new set of entities
        if (!storedAmount || this.localEntities !== entities) {
            this.localEntities = entities;
        }

        // if we initially didn't have entities, perform the default sorting
        if (!storedAmount) {
            this.setDefaultSorting();
        } else {
            this.sortEntities(this.localEntities, this.localState.sortBy, this.localState.sortOrder);
        }
    }

    render() {
        const { entities, i18n, translationKey } = this.props;

        // don't render when both given and stored entities are empty
        if (!!entities && !entities.length && !this.localEntities.length) {
            return null;
        }

        // set and order the entities
        this.setAndSortEntities(entities);

        // use the first entry in the collection to get the keys as labels and find their translation if available
        const columns = [];

        Object.keys(this.localEntities[0]).forEach(key => {
            if (this.localEntities[0].hasOwnProperty(key)) {
                const entity = this.localEntities[0][key];
                const translatedLabel = i18n[`${translationKey || ''}${Utils.camelCaseToSnakeCase(key)}`];

                columns.push({
                    label: translatedLabel || '',
                    key: Utils.camelCaseToSnakeCase(key),
                    type: entity.type
                });
            }
        });

        const output = [];

        this.localEntities.forEach((entity, index) => {
            let activeFlag = false;

            Object.keys(entity).forEach(key => {
                if (entity.hasOwnProperty(key)) {
                    if (entity[key].type === ListWidgetTypes.CHECKBOX) {
                        const entityId = entity[key].id;

                        if (this.props.selectedEntities && ~this.props.selectedEntities.indexOf(entityId)) {
                            activeFlag = true;
                        }
                    }
                }
            });

            output.push(<ListviewEntity
                key={ index }
                entity={ entity }
                i18n={ i18n }
                translationKey={ translationKey }
                active={ activeFlag }
            />);
        });

        const tableHead = [];

        // build table headers based on their widget types
        columns.forEach(column => {

            // build column headers per type
            switch (column.type) {
                case ListWidgetTypes.CHECKBOX:

                    // todo: add checkbox and select all method
                    tableHead.push(<th
                        key={column.key}
                        className={column.key}
                    >
                        {column.label}
                    </th>);

                    break;

                case ListWidgetTypes.PENCIL:
                case ListWidgetTypes.BUTTON:

                    tableHead.push(<th
                        key={column.key}
                        className={column.key}
                    >
                        {column.label}
                    </th>);

                    break;

                case ListWidgetTypes.LABEL:
                default:

                    tableHead.push(<th
                        key={column.key}
                        className={column.key}
                        onClick={this.listByEntityName.bind(this, column.key)}
                    >
                        {column.label}
                    </th>);

                    break;
            }
        });

        return (
            <table className={ style.listview } id="listview">
                <thead>
                    <tr>
                        { tableHead }
                    </tr>
                </thead>
                <tbody>
                    { output }
                </tbody>
            </table>
        );
    }
}
