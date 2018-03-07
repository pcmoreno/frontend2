import * as actionType from '../constants/ActionTypes';

export function addAlert(alert) {
    // return action type and the value(s) to be sent to reducer for state mutation
    return {
        type: actionType.ADD_ALERT,
        alert
    };
}
export function clearAlerts() {
    // return action type and the value(s) to be sent to reducer for state mutation
    return {
        type: actionType.CLEAR_ALERTS
    };
}
