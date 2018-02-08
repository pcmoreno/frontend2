import { h, Component } from 'preact';
/** @jsx h */

import Form from './components/Form/Form'

export default class Index extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // retrieve formFields for this form using the Promise below
        this.getFormFields(this.props.formId);
    }

    getFormFields(formId) {
        let url = 'http://dev.ltponline.com:8001/api/v1/section/' + formId;
        document.getElementById('fetching-data-indicator').classList.add('visible');

        fetch(url, {
            method: "options"
        }).then(response => {
            document.getElementById('fetching-data-indicator').classList.remove('visible');
            if (response.ok) {
                response.json().then((response) => {
                    // this stores the retrieved form id and fields in the global state via a parent method
                    this.props.storeFormDataInFormsCollection(this.props.formId, response.fields);
                }).catch(error => {
                    return Promise.reject(console.log('JSON error: ' + error.message));
                });
                return response;
            }
            if (response.status === 404) {
                return Promise.reject(console.log('Endpoint error: '));
            }
            return Promise.reject(console.log('HTTP error: ' + response.status));
        }).catch(error => {
            return Promise.reject(console.log('URL error: ' + error.message));
        });
    }

    submitForm(event) {
        // todo: add method / API call that submits the form. the URL can be build up dynamically from the formID
        // todo: not sure yet how data is extracted. its taken from the component' state, right? or local state?
        // todo: look for some examples.
        // todo: the thing is, we are now INSIDE the form component. forms state is kept in the PARENT container
        // todo: I want the submit logic to stay in this component
        // todo: but where then do I store the input? also in here, I suppose.
        // todo: but I dont want to introduce a reducer flow in here, since its merely a component
        // todo: would that mean it needs localState after all? pondering...
        // todo: cant you call a container method to update the state? one that is inside examplePage?
        // todo: not sure. would have to copy that to each page component. not efficient.
        // todo: true. but you are doing that already with the forms[] state.. cant you leverage that?

        console.log('form submitted', event.target);

        let form = event.target;
        let formData = new FormData(event.currentTarget);
        console.log(form['organisationName'].value)

        // formData.values().map((bla) => {
        //     console.log(bla);
        // });
        //console.log(formData.values());
    }

    changeInputValue(event) {
        // todo: add handler for changes in form input. this is by design of the controlled component pattern
        // todo: all this does is save the (changed) input to the state. the state being forms.formId.formFields
        // todo: do we just add a key to forms for this? so: forms: [ {formId, formFields, formInput} ] ?
        console.log('input value changed', event.target);
    }

    render() {
        // pass on formid, ignoredfields, the whole forms collection, the method to retrieve the formfields if they
        // were not in forms[] yet, and the submit- and change methods for the form
        return (<Form
            formId={this.props.formId}
            ignoredFields={this.props.ignoredFields}
            forms={this.props.forms}
            storeFormDataInFormsCollection={this.props.storeFormDataInFormsCollection}
            submitForm={this.submitForm}
            changeInputValue={this.changeInputValue}
        />)
    }
}
