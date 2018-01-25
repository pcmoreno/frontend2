import * as actionType from '../constants/ActionTypes';

export function getFormFields(formFields) {
    return {
        type: actionType.GET_FORM_FIELDS,
        formFields
    };
}
