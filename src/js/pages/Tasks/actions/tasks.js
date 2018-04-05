import * as actionType from '../constants/ActionTypes';

/**
 * Get tasks action
 * @param {array} tasks - tasks
 * @returns {{type, tasks: *}} tasks with action type
 */
export function getTasks(tasks) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.GET_TASKS,
        tasks
    };
}
