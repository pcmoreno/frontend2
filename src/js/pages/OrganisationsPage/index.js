import { h, Component } from 'preact';
/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as organisationsActions from './actions/organisations'
import API from '../../utils/api';
import AppConfig from '../../App.config';
import Alert from './../../components/Alert';

import Organisations from './components/Organisations/Organisations'

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, organisationsActions),
            dispatch
        );

        // since alerts are being injected from this component, create an empty alert object
        this.alert = {
            text: '',
            type: ''
        };

        // couple local state (including actions) with this method
        this.storeFormDataInFormsCollection = this.storeFormDataInFormsCollection.bind(this);
        this.changeFormFieldValueForFormId = this.changeFormFieldValueForFormId.bind(this);
        this.openModalToAddOrganisation = this.openModalToAddOrganisation.bind(this);
        this.closeModalToAddOrganisation = this.closeModalToAddOrganisation.bind(this);
        this.addAlert = this.addAlert.bind(this);
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
        // hide modal and spinner(if not already hidden)
        document.querySelector('#modal_organisation').classList.add('hidden');
        document.querySelector('#spinner').classList.remove('hidden');

        let api = new API('neon'),
            apiConfig = AppConfig.api.neon;

        // request organisations
        api.get(
            api.baseUrl,
            apiConfig.endpoints.organisation,
            {
                urlParams: {
                    parameters: {
                        fields: 'id,organisationName'
                    }
                }
            }
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');
            this.actions.getItems(response);
        }).catch(error => {
            this.addAlert(
                'somethign went wrong: ' + error.message,
                'error'
            );
        });
    }

    /* todo: actually I would just import the addAlert function from the Alert component here and leave the component in the place where you want it to appear, ie in the header */
    addAlert(text, type) {
        this.alert = {
            text,
            type
        };

        /* todo: get this to work so the alert actually times out and hides (no, css wont do) */
        setTimeout(
            () => {
                this.alert = {text: '', type: ''};
                console.log('attempting to hide the alert dialog');
            },
            5000);
    }

    openModalToAddOrganisation() {
        document.querySelector('#modal_organisation').classList.remove('hidden');
    }

    closeModalToAddOrganisation() {
        document.querySelector('#modal_organisation').classList.add('hidden');
    }

    render() {

        /* todo: seriously impressed that it is possible to pass on a component like this. but UGLY as hell so no. */
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
                alertComponent = { <Alert alert={ this.alert }/> }
            >
            </Organisations>
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
