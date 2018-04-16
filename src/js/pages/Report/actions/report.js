import * as actionType from '../constants/ActionTypes';

/**
 * Get report action
 * @param {array} report - report
 * @returns {{type, report: *}} report with action type
 */
export function getReport(report) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.GET_REPORT,
        report
    };
}
