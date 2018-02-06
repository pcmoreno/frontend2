import * as actionType from '../constants/ActionTypes';

export function setFormFields(formFields) {
    return {
        type: actionType.SET_FORM_FIELDS,
        formFields
    };
}
