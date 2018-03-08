import * as actionType from '../constants/ActionTypes';

/**
 * Add alert action
 * @param {Object} alert - alert
 * @returns {{type, alert: *}} alert object with alert type
 */
export function addAlert(alert) {
    return {
        type: actionType.ADD_ALERT,
        alert
    };
}

/**
 * Clear alerts
 * @returns {{type}} alert type
 */
export function clearAlerts() {
    return {
        type: actionType.CLEAR_ALERTS
    };
}
