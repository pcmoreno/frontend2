import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as organisationsActions from './actions/organisations';
import * as alertActions from './../../components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
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

        // dispatch action to update forms[] state with new form data (will overwrite for this id)
        this.actions.storeFormDataInFormsCollection(formId, formFields);
    }

    changeFormFieldValueForFormId(formId, formInputId, formInputValue) {
        this.actions.changeFormFieldValueForFormId(formId, formInputId, formInputValue);
    }

    componentWillMount() {
        document.title = 'Organisations';
    }

    componentDidMount() {
        updateNavigationArrow();

        // get items for first time
        this.getItems();
    }

    refreshDataWithMessage() {

        // hide modal
        document.querySelector('#modal_organisation').classList.add('hidden');

        // Show a message
        // todo: translate this message
        // todo: this message should also be adapted to support delete messages. Something like a form action?
        this.actions.addAlert({ type: 'success', text: 'The organisation was successfully saved.' });

        // refresh the items
        this.getItems();
    }

    getItems() {

        // todo: merge this with getChildElements

        document.querySelector('#spinner').classList.remove('hidden');

        const api = new API('neon'),
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
            // this.actions.getItems(response);
            this.actions.fetchEntities('FAKE_ROOT_ID_SINCE_IT_LOADS_INITIAL_ITEMS', response);
        }).catch(error => {
            this.actions.addAlert({ type: 'error', text: error });
        });
    }

    getChildElements() {

        // todo: rename to fetchEntities

        document.querySelector('#spinner').classList.remove('hidden');

        const api = new API('neon'),
            apiConfig = AppConfig.api.neon;

        // request organisations
        // todo: it will ATM always load child entities for this parent id: eentje-2018-02-19
        api.get(
            apiConfig.baseUrl,
            apiConfig.endpoints.division,
            {
                urlParams: {
                    parameters: {
                        fields: 'id,organisationName'
                    },
                    identifiers: {
                        identifier: 'eentje-2018-02-19'
                    }
                }
            }
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');

            // todo: it will ATM always load child entities for this parent id: eentje-2018-02-19
            this.actions.fetchEntities('eentje-2018-02-19', response);
        }).catch(error => {
            this.actions.addAlert({ type: 'error', text: error });
        });
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
                items2 = { this.props.items2 }
                panels = { this.props.panels }
                getChildElements = { this.getChildElements.bind(this) }
                forms={this.props.forms}
                getItems={ this.getItems.bind(this) }
                refreshDataWithMessage={ this.refreshDataWithMessage.bind(this) }
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
    items2: state.organisationsReducer.items2,
    panels: state.organisationsReducer.panels,
    forms: state.organisationsReducer.forms
});

export default connect(mapStateToProps)(Index);
