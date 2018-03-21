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
        // todo: name should be set by .env or App.config.js
        // todo: I dont like the 'null' parameter in here, but since the root organisation has no ID, I saw no other way
        // todo: needs documentation
        this.fetchEntities(null, 'LTP', 0);
    }

    refreshDataWithMessage() {

        // hide modal
        document.querySelector('#modal_organisation').classList.add('hidden');

        // Show a message
        // todo: translate this message
        // todo: this message should also be adapted to support delete messages. Something like a form action?
        this.actions.addAlert({ type: 'success', text: 'The organisation was successfully saved.' });

        // refresh the items
        // todo: is this actually needed? shouldnt React re-render because the state changes? test!
        this.fetchEntities(null, 'what to put here', null);
    }

    fetchEntities(entityId, entityName, panelId) {

        // todo: rename to fetchEntities
        // todo: implement check to see if entities already exist in state.panels. in that case, do not retrieve them again (cache)

        document.querySelector('#spinner').classList.remove('hidden');

        const api = new API('neon'),
            apiConfig = AppConfig.api.neon;

        let params, endPoint;

        if (entityId !== null) {

            // a parentId was provided, assume child entities need to be retrieved
            params = {
                urlParams: {
                    parameters: {
                        fields: 'id,organisationName'
                    },
                    identifiers: {
                        identifier: entityId
                    }
                }
            };

            endPoint = apiConfig.endpoints.division;
        } else {

            // no parentId was provided, assume the 'root' entities need to be retrieved
            params = {
                urlParams: {
                    parameters: {
                        fields: 'id,organisationName'
                    }
                }
            };

            endPoint = apiConfig.endpoints.organisation;
        }

        api.get(
            apiConfig.baseUrl,
            endPoint,
            params
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');

            // store panel entities in state
            this.actions.fetchEntities(entityId ? entityId : null, response);

            // now that the new entities are available in the state, update the path to reflect the change
            this.actions.updatePath(entityId, entityName, panelId);
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
                panels = { this.props.panels }
                pathNodes = { this.props.pathNodes }
                fetchEntities = { this.fetchEntities.bind(this) }
                forms={this.props.forms}
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
    panels: state.organisationsReducer.panels,
    forms: state.organisationsReducer.forms,
    pathNodes: state.organisationsReducer.pathNodes
});

export default connect(mapStateToProps)(Index);
