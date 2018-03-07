import * as actionType from './../constants/ActionTypes';

const initialState = {
    alerts: []
};

export default function alertReducer(state = initialState, action) {
    let newState = Object.assign({}, state);

    switch (action.type) {

        case actionType.ADD_ALERT:
            newState.alerts = [];

            // always build up the entire key again
            state.alerts.forEach(alert => {
                newState.alerts.push(alert)
            });

            newState.alerts.push(action.alert);

            // return the copied, mutated state
            return newState;

        case actionType.CLEAR_ALERTS:
            newState.alerts = [];

            // return the copied, mutated state
            return newState;

        default:
            return state
    }
}
