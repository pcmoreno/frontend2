import * as actionType from '../constants/ActionTypes';

export function getItems(items) {
    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.GET_ITEMS,
        items
    };
}

export function storeFormDataInFormsCollection(formId, formFields) {
    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.STORE_FORM_DATA,
        formId,
        formFields
    };
}

export function changeFormFieldValueForFormId(formId, formInputId, formInputValue) {
    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.UPDATE_FORM_FIELD,
        formId,
        formInputId,
        formInputValue
    };
}
