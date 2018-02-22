import { h, Component } from 'preact';
/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as organisationsActions from './actions/organisations'

import Organisations from './components/Organisations/Organisations'

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, organisationsActions),
            dispatch
        );

        // keep track of whether the modal for adding organisation should be visible
        this.localState = {
            modalToAddOrganisation: false
        };

        // couple local state (including actions) with this method
        this.storeFormDataInFormsCollection = this.storeFormDataInFormsCollection.bind(this);
        this.changeFormFieldValueForFormId = this.changeFormFieldValueForFormId.bind(this);
        this.openModalToAddOrganisation = this.openModalToAddOrganisation.bind(this);
        this.closeModalToAddOrganisation = this.closeModalToAddOrganisation.bind(this);
    }

    storeFormDataInFormsCollection(formId, formFields) {
        // todo: investigate extracting this to helper function since this will be copied to all page components

        // dispatch action to update forms[] state with new form data (will overwrite for this id)
        this.actions.storeFormDataInFormsCollection(formId, formFields);
    }

    changeFormFieldValueForFormId(formId, formInputId, formInputValue) {
        // todo: investigate extracting this to helper function since this will be copied to all page components

        this.actions.changeFormFieldValueForFormId(formId, formInputId, formInputValue);
    }

    componentWillMount() {
        document.title = 'Organisations';
    }

    componentDidMount() {
        // get items for first time
        this.getItems();

        // hide the modal(s) initially (todo: figure out how to add this straight on the aside element (use classNames))
        document.querySelector('#modal_organisation').classList.add('hidden');
    }

    getItems() {
        document.querySelector('#modal_organisation').classList.add('hidden');

        let url = this.props.baseUrl + 'organisation?fields=id,organisationName';
        document.getElementById('fetching-data-indicator').classList.add('visible');

        fetch(url, {
            method: "get"
        }).then(response => {
            document.getElementById('fetching-data-indicator').classList.remove('visible');
            if (response.ok) {
                // response.json() is not available yet. wrap it in a promise:
                response.json().then((response) => {
                    this.actions.getItems(response);
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

    openModalToAddOrganisation() {
        //this.setState(this.localState.modalToAddOrganisation = true);
        document.querySelector('#modal_organisation').classList.remove('hidden');
    }

    closeModalToAddOrganisation() {
        // this is only used to pass on the 'active' flag to the form modal?
        // seems a bit useless. why not add the 'hidden' class to the aside holding the form component instead?
        //this.setState(this.localState.modalToAddOrganisation = false);

        document.querySelector('#modal_organisation').classList.add('hidden');
    }

    render() {
        return (
            <Organisations
                items = { this.props.items }
                forms={this.props.forms}
                baseUrl={ this.props.baseUrl }
                getItems={ this.getItems.bind(this) }
                storeFormDataInFormsCollection={ this.storeFormDataInFormsCollection }
                changeFormFieldValueForFormId={ this.changeFormFieldValueForFormId }
                openModalToAddOrganisation={ this.openModalToAddOrganisation }
                closeModalToAddOrganisation={ this.closeModalToAddOrganisation }
                modalToAddOrganisation={ this.localState.modalToAddOrganisation }
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        items: state.organisationsReducer.items,
        forms: state.organisationsReducer.forms
    }
};

export default connect(mapStateToProps)(Index);
