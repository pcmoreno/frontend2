import { h, Component } from 'preact';

/** @jsx h */

import ListviewEntity from './components/ListviewEntity/ListviewEntity';
import style from './style/listview.scss';
import Utils from '../../../../utils/utils';
import ListItemTypes from '../../constants/ListItemTypes';
import Checkbox from './components/ListviewEntity/components/ListviewEntityItem/components/widgets/Checkbox/Checkbox';

/** List view Component
 *
 * requires its data (this.props.entities) to be a collection (array) of arrays with object written in this format:
 * All properties are optional, except the key property. The example below is created in a reducer and passed to the listview
 * @example
 * entities = [
 *     {
 *         type: ListItemTypes.CHECKBOX, // type of field, default a label, optional
 *         disabled: false, // controls will be disabled, disabled css class is added, optional
 *         key: 'columnLabel', // column label that is used to translate (to snake case), required
 *         id: 'entityId', // id of the entity, only required matching selected entities, optional
 *         value: 'value', // shown or used value depending on type, optional
 *         action: event => { // action that will fire when type is a button, optional
 *             action.toggleParticipant(participant.uuid, event);
 *         },
 *         sortingKey: 'sortingValue' // a custom value used to sort, for example only a last name, optional
 *     }
 * ]
 *
 * A description and example of the usage of the list view including all properties (including the entities above)
 * Selected entities that match ID's from the given entities will get an 'active' class.
 * When the entity has the property disabled set to true, the item will get a 'disabled' class.
 * @example
 * <Listview
 *     entities={ entities }
 *     selectedEntities={ ['12', '13] } // selected entities that will match with entity.id, optional
 *     toggleSelectAll={ selectAllMethod } // callback method for when the select all checkbox is checked, optional
 *     defaultSortingKey={ 'columnLabel' } // default entity key to sort, required
 *     defaultSortingOrder= { 'asc' } // sorting order, asc or desc, optional
 *
 *     // translation key prefix to translate snake case entity keys/column names and option values from select fields
 *     translationKeyPrefix={ 'prefix_' } // optional, but highly recommended
 *     i18n={ i18n } // translation object for the current component, required
 * </Listview>
 */

export default class Listview extends Component {
    constructor(props) {
        super(props);

        // introduce localState to keep track of the view
        this.localState = {
            sortBy: '',
            sortOrder: 'asc'
        };

        this.localEntities = [];

        this.sortEntities = this.sortEntities.bind(this);
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

            let aSortColumn = null,
                bSortColumn = null;

            for (let i = 0; i < a.length; i++) {
                if (sortBy === a[i].key) {
                    aSortColumn = a[i];
                    break;
                }
            }

            for (let i = 0; i < b.length; i++) {
                if (sortBy === b[i].key) {
                    bSortColumn = b[i];
                    break;
                }
            }

            let nameA = this.sortingKey(aSortColumn).toLowerCase();
            let nameB = this.sortingKey(bSortColumn).toLowerCase();

            // before sorting, ensure the field is translated if possible
            if (this.props.translationKeyPrefix) {
                const convertedNameA = Utils.camelCaseToSnakeCase(this.sortingKey(aSortColumn));
                const convertedNameB = Utils.camelCaseToSnakeCase(this.sortingKey(bSortColumn));

                if (this.props.i18n[`${this.props.translationKeyPrefix}${convertedNameA}`]) {
                    nameA = this.props.i18n[`${this.props.translationKeyPrefix}${convertedNameA}`].toLowerCase();
                }

                if (this.props.i18n[`${this.props.translationKeyPrefix}${convertedNameB}`]) {
                    nameB = this.props.i18n[`${this.props.translationKeyPrefix}${convertedNameB}`].toLowerCase();
                }
            }

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

        // set the new set of entities, and sort it
        if (!storedAmount || this.localEntities !== entities) {
            this.localEntities = entities;

            // only sort again when there are entities and there were entities before
            // otherwise it will fall back to the setDefaultSorting method call below
            if (this.localEntities.length && storedAmount > 0) {
                this.sortEntities(this.localEntities, this.localState.sortBy, this.localState.sortOrder);
            }
        }

        // if we initially didn't have entities, perform the default sorting (only at the first render with entities)
        if (!storedAmount) {
            this.setDefaultSorting();
        }
    }

    render() {
        const { entities, i18n, translationKeyPrefix, selectedEntities, toggleSelectAll } = this.props;

        // set and order the given entities
        this.setAndSortEntities(entities);

        // don't render if we don't have any list items
        if (!this.localEntities.length) {
            return null;
        }

        // use the first entry in the collection to get the keys as labels and find their translation if available
        const columns = [];

        this.localEntities[0].forEach(column => {

            // attempt to translate the given and lowercased key with prefix (if available)
            const translatedLabel = i18n[`${translationKeyPrefix || ''}${Utils.camelCaseToSnakeCase(column.key)}`];

            columns.push({
                label: translatedLabel || '',
                key: Utils.camelCaseToSnakeCase(column.key),
                type: column.type
            });

        });

        const output = [];

        // keep track of selected and disabled (unselected) checkboxes, as check all does not include disabled ones
        let selectedCount = 0;
        let disabledCount = 0;

        this.localEntities.forEach((row, index) => {
            let activeFlag = false;

            row.forEach(field => {
                if (field.type === ListItemTypes.CHECKBOX) {
                    const entityId = field.id;
                    const disabled = field.disabled;

                    if (selectedEntities && ~selectedEntities.indexOf(entityId)) {
                        activeFlag = true;
                        selectedCount++;
                    } else if (disabled) {
                        disabledCount++;
                    }
                }
            });

            output.push(<ListviewEntity
                key={ index }
                entity={ row }
                i18n={ i18n }
                translationKeyPrefix={ translationKeyPrefix }
                active={ activeFlag }
            />);
        });

        const tableHead = [];

        // build table headers based on their widget types
        columns.forEach(column => {

            // build column headers per type
            switch (column.type) {
                case ListItemTypes.CHECKBOX:

                    // render header for checkboxes
                    // add checkbox for select all if the select all method was given
                    tableHead.push(<th
                        key={column.key}
                        className={column.key}
                    >
                        {column.label}

                        { toggleSelectAll &&
                            <Checkbox
                                widgetAction={toggleSelectAll}
                                checked={ selectedCount > 0 && selectedCount === (this.localEntities.length - disabledCount) }
                            />
                        }
                    </th>);

                    break;

                case ListItemTypes.PENCIL:
                case ListItemTypes.BUTTON:
                case ListItemTypes.COMPETENCY_TYPE:

                    tableHead.push(<th
                        key={column.key}
                        className={column.key}
                    >
                        {column.label}
                    </th>);

                    break;

                case ListItemTypes.HIDDEN:

                // the 'hidden' type was introduced to be able to keep properties in the passed-on props without displaying them
                    break;

                case ListItemTypes.LABEL:
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

        // todo: cant use listview as id here, there are multiple listviews on the organisation view. convert to class.
        return (
            <table className={ `${style.listview} listview` }>
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
