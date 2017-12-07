import * as actionType from './../constants/ActionTypes';

// initially populate the state with defaults (there is no controller and thus no js.html.twig with default values)
const initialState = {
    active: false,
	items: [
	    {id: 'initial item 1'},
        {id: 'initial item 2'}
    ]
};

export default function exampleReducer(state = initialState, action) {
    switch (action.type) {
        // attempt to match the action type from the action.type parameter received from the action
        case actionType.ADD_RANDOM_ITEM:
            // copy the state (state is immutable object by JS design)
            let newState = Object.assign({}, state);

            // todo: investigate why spread operator not working:
            // let newState = { ...state };

            // create temporary new array
            let existingItems = [];

            // loop through the existing items in the state, add each entry to the temporary new array
            newState.items.map(item => {existingItems.push({id: item.id})});

            // add the new entry taken from the action
            existingItems.push({id: action.item});

            // mutate the items in the copied state
            newState.items = existingItems;

            // return the copied, mutated state
            return newState;

            // while all this may seem like a hassle, it seems the only way to update nested properties:
            // see https://redux.js.org/docs/faq/ReactRedux.html#react-not-rerendering
            // alternatively, ensure the reducer receives a 'flattened' sub-state. google around for more options.
        default:
            return state
    }
}

