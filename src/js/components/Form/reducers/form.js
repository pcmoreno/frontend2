import * as actionType from './../constants/ActionTypes';

const initialState = {
    formFields: []
};

export default function formReducer(state = initialState, action) {
    switch (action.type) {
        case actionType.GET_FORM_FIELDS:
            let newState = Object.assign({}, state);

            // clear current items from newState
            newState.formFields = [];

            // loop through newly retrieved items from the action and add to the newState
            action.formFields.map(field => {
                newState.formFields.push({field})
            });

            // return the copied, mutated state
            return newState;
        default:
            return state
    }
}

