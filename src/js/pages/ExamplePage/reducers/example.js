import * as actionType from './../constants/ActionTypes';

const initialState = {
    active: false,
	items: [],
    forms: []
};

export default function exampleReducer(state = initialState, action) {
    // copy the state (state is immutable object by JS design)
    let newState = Object.assign({}, state);

    switch (action.type) {

        case actionType.GET_ITEMS:
            // clear current items from newState
            newState.items = [];

            // loop through newly retrieved items from the action and add to the newState
            action.items.map(item => {
                newState.items.push({id: item.id})
            });

            // return the copied, mutated state
            return newState;

        case actionType.GET_FORM:
            // add (or overwrite) the form configuration for the formId retrieved from the action
            //newState.forms[action.formId] = action.formId.formConfiguration;

            console.log('mutating state for forms by reducer');

            // return the copied, mutated state
            return newState;

        default:
            return state
    }


}

