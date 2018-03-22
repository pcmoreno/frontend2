import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as alertActions from './../../components/Alert/actions/alert';
import ListviewEntity from './components/ListviewEntity/ListviewEntity';

/** Preact Listview Component v2.0
 *
 *  requires data to be in this format:
 *
 *  [
 *    0 => [
 *      '<headerA>' => ['value' => '<some value>'],
 *      '<headerB>' => ['value' => '<another value>', 'sortingKey' => '<value another>'],
 *      '<headerC>' => ['value' => '['<value>','<value>','<value>']']
 *      '<headerD>' => ['value' => '[{'value' => '<value>'},{'value' => '<value>'}]
 *      '<headerE>' => ['value' => 'Toon Resultaten', 'link' => 'http://www.nu.nl']
 *    ]
 * ]
 *
 * allows providing an array of values instead of single value (arrays are sorted alphabetically by default)
 * for each value / array key an attempt to find a matching translation is made (values are first stripped and cast to lowercase)
 * if translationKey was not provided, retrieving a default translation will be attempted, too ('listview|<value>')
 * by providing a sortingKey, values can be displayed independent from their sorting behaviour (useful for dates)
 * values can be strings, arrays of strings, or arrays of objects. (but they need to be in the 'value' key, see example)
 * a <a href class="button-action"> is output when you provide a 'link' to go with the value, which itself becomes the button text
 * todo: consider always requiring an array even though this means rewriting some of the data structure in previous views
 **/

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, alertActions),
            dispatch
        );

        // introduce local state to keep track of the view
        // todo: rename to localState
        this.state = {
            localEntities: this.props.entities,
            sortBy: '',
            sortOrder: 'asc'
        };
    }

    componentWillMount() {

        // if a defaultSortingKey was provided, sort entities by this key. and, if the sortingOrder was provided aswell, in that order.
        if (this.props.defaultSortingKey) {
            this.sortEntities(
                this.state.localEntities,
                this.props.defaultSortingKey,
                this.props.defaultSortingOrder ? this.props.defaultSortingOrder : this.state.sortOrder
            );
        }
    }

    componentDidUpdate() {
        // new entities received, update local state so UI re-renders
        // todo: endless loop. fix this.
        // this.setState(this.state.localEntities = this.props.entities);
    }

    shouldComponentUpdate(nextProps) {

        // update the local state when its entities do not match the received entities
        if (nextProps !== this.state.localEntities) {
            console.log('updating local state and calling render method');

            this.setState(this.state.localEntities = nextProps.entities);

            if (this.props.defaultSortingKey) {
                this.sortEntities(
                    this.state.localEntities,
                    this.props.defaultSortingKey,
                    this.props.defaultSortingOrder ? this.props.defaultSortingOrder : this.state.sortOrder
                );
            }
        }
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

                returnValue.map(entity => {
                    arrayToString += entity;
                });

                returnValue = arrayToString;
            }
        }

        return entity.hasOwnProperty('sortingKey') ? entity.sortingKey : returnValue;
    }

    sortEntities(entities, sortBy, sortOrder) {

        // bubble sort the entities on given sortBy key in the order set by sortOrder
        entities.sort(function(a, b) {
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
            } else {
                if (nameA > nameB) {
                    return -1;
                }
                if (nameA < nameB) {
                    return 1;
                }

                // default return value (no sorting)
                return 0;
            }
        }.bind(this));
    }

    listByEntityName(sortBy) {

        // determine sort order
        if (this.state.sortBy === sortBy) {
            this.state.sortOrder === 'asc' ? this.state.sortOrder = 'desc' : this.state.sortOrder = 'asc';
        } else {
            this.state.sortBy = sortBy;
            this.state.sortOrder = 'asc';
        }

        // before sorting, make a copy of current sorted entities
        let previousSortingState = this.state.localEntities.slice(0);

        // sort the array with given key
        this.sortEntities(this.state.localEntities, sortBy, this.state.sortOrder);

        if (previousSortingState[0] === this.state.localEntities[0]) {

            // content already sorted this way, reversing order
            this.state.sortOrder === 'asc' ? this.state.sortOrder = 'desc' : this.state.sortOrder = 'asc';
            this.sortEntities(this.state.localEntities, sortBy, this.state.sortOrder);
        }

        // update the local state with newly sorted array (setState causes re-render of component)
        this.setState({localEntities: this.state.localEntities});
    }

    render() {
        const { entities, i18n, translationKey } = this.props;

        if (entities.length === 0) {
            return (<div>No results</div>);
        }

        // use the first entry in the collection to get the keys as labels and find their translation if available
        const labels = [];

        Object.keys(entities[0]).forEach(key => {
            let label = key;

            if (translationKey) {

                // if translationKey was provided, see if it can be retrieved. otherwise resort to key
                const translatedLabel = i18n.translations[translationKey + '|' + key];

                label = translatedLabel ? translatedLabel : key;
            }

            if (label === key) {

                // translationKey was not provided, see if a generic translation can be found
                // const genericLabel = i18n.translations['listview|' + key];
                const genericLabel = 'some label';

                label = genericLabel ? genericLabel : key;
            }

            labels.push([label, key]);
        });

        return (
            <table className="list-view table table-striped">
                <thead>
                    <tr>
                        {
                            labels.map(label => {
                                return (
                                    <th
                                        key={ label[1] }
                                        className={ label[1] }
                                        onClick={ this.listByEntityName.bind(this, label[1]) }
                                    >
                                        { label[0] }
                                    </th>
                                );
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.localEntities.map((entity, index) => {
                            return (
                                <ListviewEntity key={ index } entity={ entity } i18n={ i18n } translationKey={ translationKey } />
                            );
                        })
                    }
                </tbody>
            </table>
        );
    }
}

export default connect()(Index);
