import * as actionType from '../constants/ActionTypes';

export function addRandomItem(itemId) {
    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.ADD_RANDOM_ITEM,
        item: itemId
    };
}
