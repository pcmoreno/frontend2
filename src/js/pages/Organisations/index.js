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
import Utils from '../../utils/utils';

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
        this.openModalToAddJobFunction = this.openModalToAddJobFunction.bind(this);
        this.closeModalToAddJobFunction = this.closeModalToAddJobFunction.bind(this);
        this.openModalToAddProject = this.openModalToAddProject.bind(this);
        this.closeModalToAddProject = this.closeModalToAddProject.bind(this);
        this.fetchEntities = this.fetchEntities.bind(this);
        this.fetchDetailPanelData = this.fetchDetailPanelData.bind(this);
        this.refreshDataWithMessage = this.refreshDataWithMessage.bind(this);

        this.logger = Logger.instance;

        this.panelHeaderAddMethods = {
            organisation: this.openModalToAddOrganisation,
            jobFunction: this.openModalToAddJobFunction,
            project: this.openModalToAddProject
        };

        this.i18n = translator(this.props.languageId, 'organisations');
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

    refreshDataWithMessage(message, newEntity, type) {
        const newId = newEntity && newEntity.entry && newEntity.entry.id;
        const panelId = this.props.formOpenByPanelId;

        if (!newId) {
            this.actions.addAlert({ type: 'error', text: this.i18n.organisations_unexpected_error });
            this.logger.error({
                component: 'organisations',
                message: `Entity should have been added, but no entity was returned from the API: ${newEntity}`
            });
            return;
        }

        // the selected entity is the path (node) of the current active panel (id)
        const selectedItem = this.props.pathNodes[panelId - 1];

        // we use - 2 because panelId is a non zero-based, but we want to remove the last panel
        // and because path nodes always has a root organisation at index 0
        this.props.pathNodes = this.props.pathNodes.slice(panelId - 2, this.props.pathNodes.length - 1);

        // Show a message, is translated in form definition on Organisations.js
        this.actions.addAlert({ type: 'success', text: message });

        // this will reload the selected entity properties and load it in the last panel (index)
        // panel id is a non zero-based index, but we want the previous panel to be updated first, so we subtract 1
        this.fetchEntities(selectedItem, panelId - 1, false).then(() => {
            let returnedNewEntity = null;

            const panels = this.props.panels;

            // loop through all panels to find the id
            // (which is already parsed by the reducer and can be used for path nodes)
            for (let i = 0; i < panels.length; i++) {
                for (let j = 0; j < panels[i].entities.length; j++) {
                    let item = panels[i].entities[j];

                    // match id and type
                    if (item.id === newId && item.type === type) {
                        returnedNewEntity = item;
                        break;
                    }
                }
            }

            try {
                const listItem = document.querySelector(`#panel-${panelId}-${returnedNewEntity.id}`);
                const list = listItem.parentElement;

                // check if the list item offset is exceeding the height of the list
                // or the list item offset is below the scroll top, both meaning we should scroll
                //
                // offsetTop is always measured based on the window size. Also after scrolling, this value always stays the same
                // scrollTop is the scrolling value on the list (ul) element
                // clientHeight is the rendered (visible) height of the list
                if (((listItem.offsetTop + listItem.clientHeight - list.offsetTop) > list.clientHeight) ||
                    listItem.offsetTop < list.scrollTop) {

                    // compare if the 'end' of the list item is smaller than the list height (item is in the first page view)
                    if ((listItem.offsetTop + listItem.clientHeight - list.offsetTop) < list.clientHeight) {

                        // this is a native function, but we also have a fallback for this (no anim)
                        Utils.scrollEaseInOut(list, 0, 200);

                    } else {

                        // this is a native function, but we also have a fallback for this (no anim)
                        // align the list item as the first shown item, calculation works for both up and down
                        Utils.scrollEaseInOut(list, (listItem.offsetTop - list.offsetTop), 200);
                    }
                }

            } catch (e) {
                this.logger.error({
                    component: 'organisations',
                    message: `DOM Query failed for scrolling after adding an entity. Exception: ${e}`
                });
            }

            // todo: this is the initial code to fetch the new item, but panels are cached...
            // subtract 2 because panelId is not zero-based index while this.props.panels is zero-based
            // const currentPanel = this.props.panels[panelId - 1];

            // loop through results to find the newly added item to acquire full data
            // for (let i = 0; i < currentPanel.entities.length; i++) {
            //     if (newId === currentPanel.entities[i].id) {
            //         returnedNewEntity = currentPanel.entities[i];
            //         break;
            //     }
            // }

            // if the entity was retrieved from the updated panel, go fetch its children
            if (returnedNewEntity) {
                this.fetchEntities(returnedNewEntity, panelId, true);
            }

        }).catch(error => {

            // show an alert message that we could not refresh the list properly
            this.actions.addAlert({ type: 'error', text: this.i18n.organisations_refresh_list_error });
            this.logger.error({
                component: 'organisations',
                message: `Could not refresh the organisations overview after adding an item: ${error}`
            });
        });
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
                    component: 'organisations',
                    message: `no entity.type available on entity ${entity.name}`
                });
                return false;
        }
    }

    /**
     * Fetches entities to fill the panels/lists
     *
     * @param {Object} entity - current selected entity
     * @param {number} entity.id - current selected entity id
     * @param {string} entity.type - current selected entity type
     * @param {number} panelId - index of the current panel
     * @param {boolean} fetchDetailPanel - whether this call is supposed to also load the detail panel
     * @returns {Promise<any>} promise
     */
    fetchEntities(entity, panelId, fetchDetailPanel = true) {
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

        return new Promise((resolve, reject) => {

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

                // fetch detail panel if desired
                if (fetchDetailPanel) {

                    // then, update the detail panel (cant do this earlier since no way to tell if entities will fetch ok)
                    this.fetchDetailPanelData(entity);
                }

                // finally, resolve with the response
                resolve(response);

            }).catch(error => {
                this.actions.addAlert({ type: 'error', text: error });
                reject(new Error(`Could not fetch sections for id: ${entity.id}, ${entity.type}`));
            });
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

    amendParticipant() {

        // todo: add real logic here, see NEON-3560
    }

    // todo: refactor below methods into one 'toggle' method with parameter 'id'

    openModalToAddOrganisation(panelId) {

        // store panel id so we know what panel was active when opening the form
        this.actions.setFormOpenByPanelId(panelId);
        document.querySelector('#modal_add_organisation').classList.remove('hidden');
    }

    closeModalToAddOrganisation() {

        // after closing the form, reset the selected panel
        this.actions.setFormOpenByPanelId(null);
        document.querySelector('#modal_add_organisation').classList.add('hidden');
    }

    openModalToAddParticipant() {
        document.querySelector('#modal_add_participant').classList.remove('hidden');
    }

    closeModalToAddParticipant() {
        document.querySelector('#modal_add_participant').classList.add('hidden');
    }

    openModalToAddJobFunction(panelId) {

        // store panel id so we know what panel was active when opening the form
        this.actions.setFormOpenByPanelId(panelId);
        document.querySelector('#modal_add_job_function').classList.remove('hidden');
    }

    closeModalToAddJobFunction() {

        // after closing the form, reset the selected panel
        this.actions.setFormOpenByPanelId(null);
        document.querySelector('#modal_add_job_function').classList.add('hidden');
    }

    openModalToAddProject(panelId) {

        // store panel id so we know what panel was active when opening the form
        this.actions.setFormOpenByPanelId(panelId);
        document.querySelector('#modal_add_project').classList.remove('hidden');
    }

    closeModalToAddProject() {

        // after closing the form, reset the selected panel
        this.actions.setFormOpenByPanelId(null);
        document.querySelector('#modal_add_project').classList.add('hidden');
    }

    render() {
        const { panels, forms, detailPanelData, pathNodes, formOpenByPanelId } = this.props;

        return (
            <Organisations
                panels = { panels }
                formOpenByPanelId = { formOpenByPanelId }
                panelHeaderAddMethods={ this.panelHeaderAddMethods }
                forms={ forms }
                detailPanelData = { detailPanelData }
                pathNodes = { pathNodes }
                fetchEntities = { this.fetchEntities }
                fetchDetailPanelData = { this.fetchDetailPanelData }
                refreshDataWithMessage={ this.refreshDataWithMessage }
                storeFormDataInFormsCollection={ this.storeFormDataInFormsCollection }
                changeFormFieldValueForFormId={ this.changeFormFieldValueForFormId }
                resetChangedFieldsForFormId={ this.resetChangedFieldsForFormId }
                closeModalToAddOrganisation={ this.closeModalToAddOrganisation }
                closeModalToAddJobFunction={ this.closeModalToAddJobFunction }
                closeModalToAddProject={ this.closeModalToAddProject }
                openModalToAddParticipant = { this.openModalToAddParticipant }
                closeModalToAddParticipant = { this.closeModalToAddParticipant }
                i18n = { this.i18n }
                languageId = { this.props.languageId }
            />
        );
    }
}

const mapStateToProps = state => ({
    panels: state.organisationsReducer.panels,
    formOpenByPanelId: state.organisationsReducer.formOpenByPanelId,
    detailPanelData: state.organisationsReducer.detailPanelData,
    forms: state.organisationsReducer.forms,
    pathNodes: state.organisationsReducer.pathNodes,
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
