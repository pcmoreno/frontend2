import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as organisationsActions from './actions/organisations';
import * as alertActions from './../../components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from '../../utils/api/factory';
import Organisations from './components/Organisations/Organisations';
import AppConfig from './../../App.config';
import Logger from '../../utils/logger';
import translator from '../../utils/translator';

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
        this.resetChangedFieldsForFormId = this.resetChangedFieldsForFormId.bind(this);
        this.openModalToAddOrganisation = this.openModalToAddOrganisation.bind(this);
        this.closeModalToAddOrganisation = this.closeModalToAddOrganisation.bind(this);
        this.fetchEntities = this.fetchEntities.bind(this);
        this.fetchDetailPanelData = this.fetchDetailPanelData.bind(this);
        this.refreshDataWithMessage = this.refreshDataWithMessage.bind(this);

        this.logger = Logger.instance;
    }

    storeFormDataInFormsCollection(formId, formFields) {

        // dispatch action to update forms[] state with new form data (will overwrite for this id)
        this.actions.storeFormDataInFormsCollection(formId, formFields);
    }

    changeFormFieldValueForFormId(formId, formInputId, formInputValue) {

        // react controlled component pattern takes over the built-in form state when input changes
        this.actions.changeFormFieldValueForFormId(formId, formInputId, formInputValue);
    }

    resetChangedFieldsForFormId(formId) {
        this.actions.resetChangedFieldsForFormId(formId);
    }

    componentWillMount() {
        document.title = 'Organisations';
    }

    componentWillUnmount() {

        // reset organisations in state
        // because we currently want to refresh all data when the component is re-opened
        // in the future we may use the old state to reduce the loading time
        this.actions.resetOrganisations();
    }

    componentDidMount() {
        updateNavigationArrow();

        // fetch entities for static id '0', which is reserved for root entities. name of panel is defined in AppConfig
        this.fetchEntities(AppConfig.global.organisations.rootEntity, 0);
    }

    refreshDataWithMessage(entity) {

        // reload the last opened panel (todo: this will break whenever you add organisation for a panel that is not the last)
        this.fetchEntities(entity, this.props.pathNodes.length - 1);

        // hide modal
        document.querySelector('#modal_add_organisation').classList.add('hidden');

        // Show a message
        // todo: translate this message
        // todo: this message should also be adapted to support delete messages. Something like a form action?
        this.actions.addAlert({ type: 'success', text: 'The organisation was successfully saved.' });

        // refresh the items
        // todo: is this actually needed? shouldnt React re-render because the state changes? test!
        // this.fetchEntities({ id: 0, name: 'what to put here' }, null);
    }

    getSectionForEntityType(entity) {

        // determines the endpoint for which children or detail panel data should be fetched from
        switch (entity.type) {
            case 'organisation':
                return 'organisation';

            case 'project':

                // even though projects cant have children, perform the API call. this is because this behaviour may
                // change in the future, and, more important, the subsequent actions need to be triggered
                return 'project';

            case 'jobFunction':
                return 'organisation';

            default:
                this.logger.error({
                    component: 'index',
                    message: `no entity.type available on entity ${entity.name}`
                });
                return false;
        }
    }

    fetchEntities(entity, panelId) {

        // console.table(entity);
        // console.log(panelId);

        document.querySelector('#spinner').classList.remove('hidden');

        const api = ApiFactory.get('neon');
        const apiConfig = api.getConfig();
        let params, endPoint;

        if (entity.id === 0) {

            // entity.id is '0', assume the 'root' entities need to be retrieved
            params = {
                urlParams: {
                    parameters: {
                        fields: 'id,uuid,organisationName,organisationType'
                    }
                }
            };

            endPoint = apiConfig.endpoints.organisations.rootEntities;
        } else {

            const section = this.getSectionForEntityType(entity);

            // an entity.id was provided, assume 'child' entities need to be retrieved
            params = {
                urlParams: {
                    parameters: {
                        fields: 'id,uuid,organisationName,organisationType,childOrganisations,projects,projectName,product,productName',
                        limit: 10000
                    },
                    identifiers: {
                        identifier: entity.id,
                        type: section
                    }
                }
            };

            endPoint = apiConfig.endpoints.organisations.childEntities;
        }

        // request entities
        api.get(
            api.getBaseUrl(),
            endPoint,
            params
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');

            if (entity.type !== 'project') {

                // store panel entities in state UNLESS they are children of a project (they do not exist!)
                // by wrapping an if.. here instead of around the API call, subsequent actions will still take place
                this.actions.fetchEntities(entity.id, entity.type, response);
            }

            // now that the new entities are available in the state, update the path to reflect the change
            this.actions.updatePath(entity, panelId);

            // last, update the detail panel (cant do this earlier since no way to tell if entities will fetch ok)
            this.fetchDetailPanelData(entity);
        }).catch(error => {
            this.actions.addAlert({ type: 'error', text: error });
        });
    }

    fetchDetailPanelData(entity) {

        // note that the LTP root organisation with id 0 has no associated detail panel data and is ignored (like neon1)
        if (entity.id > 0) {
            document.querySelector('#spinner_detail_panel').classList.remove('hidden');
            const api = ApiFactory.get('neon');
            const apiConfig = api.getConfig();
            const section = this.getSectionForEntityType(entity);

            const params = {
                urlParams: {
                    parameters: {
                        fields: 'id,organisationName,projectName,participantSessions,genericRoleStatus,accountHasRole,account,firstName,infix,lastName',
                        limit: 10000
                    },
                    identifiers: {
                        identifier: entity.id,
                        type: section
                    }
                }
            };

            const endPoint = apiConfig.endpoints.organisations.detailPanelData;

            // request data for detail panel
            api.get(
                api.getBaseUrl(),
                endPoint,
                params
            ).then(response => {
                document.querySelector('#spinner_detail_panel').classList.add('hidden');

                // store detail panel data in the state (and send the amend method with it)
                this.actions.fetchDetailPanelData(entity, response, this.amendParticipant);
            }).catch(error => {
                this.actions.addAlert({ type: 'error', text: error });
            });
        }
    }

    amendParticipant(id) {
        console.log('amending participant id '+id);
    }

    // todo: refactor below methods into one 'toggle' method with parameter 'id'

    openModalToAddOrganisation() {
        document.querySelector('#modal_add_organisation').classList.remove('hidden');
    }

    closeModalToAddOrganisation() {
        document.querySelector('#modal_add_organisation').classList.add('hidden');
    }

    openModalToAddParticipant() {
        document.querySelector('#modal_add_participant').classList.remove('hidden');
    }

    closeModalToAddParticipant() {
        document.querySelector('#modal_add_participant').classList.add('hidden');
    }

    render() {
        const { panels, forms, detailPanelData, pathNodes } = this.props;

        return (
            <Organisations
                panels = { panels }
                forms={ forms }
                detailPanelData = { detailPanelData }
                pathNodes = { pathNodes }
                fetchEntities = { this.fetchEntities }
                fetchDetailPanelData = { this.fetchDetailPanelData }
                refreshDataWithMessage={ this.refreshDataWithMessage }
                storeFormDataInFormsCollection={ this.storeFormDataInFormsCollection }
                changeFormFieldValueForFormId={ this.changeFormFieldValueForFormId }
                resetChangedFieldsForFormId={ this.resetChangedFieldsForFormId }
                openModalToAddOrganisation={ this.openModalToAddOrganisation }
                closeModalToAddOrganisation={ this.closeModalToAddOrganisation }
                openModalToAddParticipant = { this.openModalToAddParticipant }
                closeModalToAddParticipant = { this.closeModalToAddParticipant }
                i18n = { translator(this.props.languageId, 'organisations') }
                languageId = { this.props.languageId }
            />
        );
    }
}

const mapStateToProps = state => ({
    panels: state.organisationsReducer.panels,
    detailPanelData: state.organisationsReducer.detailPanelData,
    forms: state.organisationsReducer.forms,
    pathNodes: state.organisationsReducer.pathNodes,
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
