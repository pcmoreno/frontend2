import * as actionType from './../constants/ActionTypes';

const initialState = {
    active: false,
	items: []
};

export default function exampleReducer(state = initialState, action) {
    switch (action.type) {
        case actionType.GET_ITEMS:
            // copy the state (state is immutable object by JS design)
            let newState = Object.assign({}, state);

            // clear current items from newState
            newState.items = [];

            // loop through newly retrieved items from the action and add to the newState
            action.items.map(item => {
                newState.items.push({id: item.id})
            });

            // return the copied, mutated state
            return newState;
        default:
            return state
    }
}

