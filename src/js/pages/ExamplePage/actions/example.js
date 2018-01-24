import * as actionType from '../constants/ActionTypes';

export function getItems(items) {
    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.GET_ITEMS,
        items: items
    };
}
