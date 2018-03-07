import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as organisationsActions from './actions/organisations';
<<<<<<< HEAD
import * as alertActions from './../../components/Alert/actions/alert';
=======
>>>>>>> 68078d0a31abf606d02dd86a2769b77ef4047d96
import API from '../../utils/api';
import AppConfig from '../../App.config';

import Organisations from './components/Organisations/Organisations';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, alertActions, organisationsActions),
            dispatch
        );

        this.storeFormDataInFormsCollection = this.storeFormDataInFormsCollection.bind(this);
        this.changeFormFieldValueForFormId = this.changeFormFieldValueForFormId.bind(this);
        this.openModalToAddOrganisation = this.openModalToAddOrganisation.bind(this);
        this.closeModalToAddOrganisation = this.closeModalToAddOrganisation.bind(this);
    }

    storeFormDataInFormsCollection(formId, formFields) {
<<<<<<< HEAD
=======

        // todo: investigate extracting this to helper function since this will be copied to all page components

>>>>>>> 68078d0a31abf606d02dd86a2769b77ef4047d96
        // dispatch action to update forms[] state with new form data (will overwrite for this id)
        this.actions.storeFormDataInFormsCollection(formId, formFields);
    }

    changeFormFieldValueForFormId(formId, formInputId, formInputValue) {
<<<<<<< HEAD
=======

        // todo: investigate extracting this to helper function since this will be copied to all page components

>>>>>>> 68078d0a31abf606d02dd86a2769b77ef4047d96
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
            apiConfig.baseUrl,
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
<<<<<<< HEAD
        }).catch(error => {
            this.actions.addAlert({type: 'error',text: error});
=======
>>>>>>> 68078d0a31abf606d02dd86a2769b77ef4047d96
        });

        // .catch(error => {
        //
        //     // TODO: Show an error message
        // });
    }

    openModalToAddOrganisation() {
        document.querySelector('#modal_organisation').classList.remove('hidden');
    }

    closeModalToAddOrganisation() {
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
            />
        );
    }
}

const mapStateToProps = state => ({
    items: state.organisationsReducer.items,
    forms: state.organisationsReducer.forms
});

export default connect(mapStateToProps)(Index);
