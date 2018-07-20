import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as organisationsActions from './actions/organisations';
import * as alertActions from './../../components/Alert/actions/alert';
import * as formActions from './../../components/Form/actions/form';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from '../../utils/api/factory';
import Organisations from './components/Organisations/Organisations';
import AppConfig from './../../App.config';
import Logger from '../../utils/logger';
import translator from '../../utils/translator';
import Utils from '../../utils/utils';
import ListItemTypes from '../../components/Listview/constants/ListItemTypes';
import ParticipantStatus from '../../constants/ParticipantStatus';
import OrganisationsError from './constants/OrganisationsError';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, alertActions, organisationsActions, formActions),
            dispatch
        );

        this.openModalToAddOrganisation = this.openModalToAddOrganisation.bind(this);
        this.closeModalToAddOrganisation = this.closeModalToAddOrganisation.bind(this);

        this.openModalToAddJobFunction = this.openModalToAddJobFunction.bind(this);
        this.closeModalToAddJobFunction = this.closeModalToAddJobFunction.bind(this);

        this.openModalToAddProject = this.openModalToAddProject.bind(this);
        this.closeModalToAddProject = this.closeModalToAddProject.bind(this);

        this.openModalToAddParticipant = this.openModalToAddParticipant.bind(this);
        this.closeModalToAddParticipant = this.closeModalToAddParticipant.bind(this);

        this.openModalToAmendParticipant = this.openModalToAmendParticipant.bind(this);
        this.closeModalToAmendParticipant = this.closeModalToAmendParticipant.bind(this);

        this.openModalToInviteParticipant = this.openModalToInviteParticipant.bind(this);
        this.closeModalToInviteParticipant = this.closeModalToInviteParticipant.bind(this);

        this.openModalToEditCompetencies = this.openModalToEditCompetencies.bind(this);
        this.closeModalToEditCompetencies = this.closeModalToEditCompetencies.bind(this);

        this.fetchEntities = this.fetchEntities.bind(this);
        this.fetchDetailPanelData = this.fetchDetailPanelData.bind(this);
        this.refreshPanelDataWithMessage = this.refreshPanelDataWithMessage.bind(this);
        this.refreshDetailPanelParticipantsWithMessage = this.refreshDetailPanelParticipantsWithMessage.bind(this);

        this.toggleParticipant = this.toggleParticipant.bind(this);
        this.inviteParticipants = this.inviteParticipants.bind(this);

        this.toggleSelectAllParticipants = this.toggleSelectAllParticipants.bind(this);
        this.updateCompetencySelection = this.updateCompetencySelection.bind(this);
        this.addCustomCompetency = this.addCustomCompetency.bind(this);
        this.getGlobalAndCustomCompetencies = this.getGlobalAndCustomCompetencies.bind(this);
        this.toggleCompetency = this.toggleCompetency.bind(this);

        this.logger = Logger.instance;
        this.api = ApiFactory.get('neon');

        this.panelHeaderAddMethods = {
            organisation: this.openModalToAddOrganisation,
            jobFunction: this.openModalToAddJobFunction,
            project: this.openModalToAddProject
        };

        this.i18n = translator(this.props.languageId, ['organisations']);

        // flag if we have a full screen modal locked (can't close)
        this.modalLocked = false;

        this.localState = {
            selectedParticipants: [],
            selectedParticipantSlug: null,
            editCompetenciesActiveTab: null,
        };

        this.selectedCompetencies = [];

        // keep track of current entity shown in detail panel
        this.detailPanelEntity = null;
    }

    toggleSelectAllParticipants(event) {
        const participants = this.props.detailPanelData.entity && this.props.detailPanelData.entity.participantListView;
        const checked = event.target && event.target.checked;
        let selected = [];

        // state array needs to be cloned
        this.localState.selectedParticipants.forEach(participant => {
            selected.push(participant);
        });

        // based on selected state, (de)select the participant
        participants.forEach(row => {
            let participantId = null;
            let disabled = null;

            for (let i = 0; i < row.length; i++) {
                if (row[i].type === ListItemTypes.CHECKBOX) {
                    participantId = row[i].id;
                    disabled = row[i].disabled;
                    break;
                }
            }

            if (checked) {
                if (!disabled && !~selected.indexOf(participantId)) {
                    selected.push(participantId);
                }
            } else {
                selected = [];
            }
        });

        // save and update state
        this.localState.selectedParticipants = selected;
        this.setState(this.localState);
    }

    toggleParticipant(participantId) {
        const tempArray = [];

        this.localState.selectedParticipants.forEach(participant => {
            tempArray.push(participant);
        });

        if (tempArray.indexOf(participantId) > -1) {

            // deselect
            tempArray.splice(tempArray.indexOf(participantId), 1);
        } else {

            // select
            tempArray.push(participantId);
        }

        this.localState.selectedParticipants = tempArray;
        this.setState(this.localState);
    }

    inviteParticipants(selectedParticipants) {

        // only proceed if not in locked state
        if (!this.modalLocked) {

            // set locked state to avoid new calls and closing the modal
            this.modalLocked = true;

            this.api.post(
                this.api.getBaseUrl(),
                this.api.getEndpoints().organisations.inviteParticipants,
                {
                    payload: {
                        data: {
                            participants: selectedParticipants
                        },
                        type: 'form',
                        formKey: 'invite_participant_form'
                    }
                }
            ).then(() => {
                let successMessage = this.i18n.organisations_invite_participant_success;

                if (selectedParticipants.length > 1) {
                    successMessage = this.i18n.organisations_invite_participants_success;
                }

                // show message and reload detail panel
                this.refreshDetailPanelParticipantsWithMessage(successMessage);

                // unlock the modal again
                this.modalLocked = false;

                // close modal
                this.closeModalToInviteParticipant();

            }).catch(() => {

                // Show a message, is translated in form definition on Organisations.js
                this.actions.addAlert({ type: 'error', text: this.i18n.organisations_invite_participant_error });

                // unlock the modal again
                this.modalLocked = false;

                // close modal
                this.closeModalToInviteParticipant();
            });
        }
    }

    componentWillMount() {
        document.title = 'Organisations';
    }

    componentWillUnmount() {

        // reset organisations in state
        this.actions.resetOrganisations();
    }

    componentDidMount() {
        updateNavigationArrow();

        // fetch entities for static id '0', which is reserved for root entities. name of panel is defined in AppConfig.
        this.fetchEntities(AppConfig.global.organisations.rootEntity, 0);
    }

    /**
     * Reloads the detail panel and shows success message
     * @param {string} message - message to show
     * @param {Object} [options] - options
     * @param {Object} [options.addedParticipant] - added participant
     * @returns {undefined}
     */
    refreshDetailPanelParticipantsWithMessage(message, options = {}) {
        let newParticipantUuid = null;

        if (options.addedParticipant && options.addedParticipant.entry && options.addedParticipant.entry.uuid) {
            newParticipantUuid = options.addedParticipant.entry.uuid;
        }

        // check if there was a participant added that we need to select
        if (newParticipantUuid) {
            this.localState.selectedParticipants.push(newParticipantUuid);
            this.setState(this.localState);
        }

        this.refreshDetailPanelWithMessage(message);
    }

    refreshDetailPanelWithMessage(message) {

        // show a message, is translated in form definition on Organisations.js
        if (message) {
            this.actions.addAlert({ type: 'success', text: message });
        }

        // get panelId of last open panel, take + 1 into account as we have the LTP root organisation
        // which is present in pathNodes but not in panels
        const panelId = this.props.pathNodes[this.props.pathNodes.length - 1].panelId;
        const lastSelectedItem = this.props.pathNodes[panelId + 1];

        // refresh detail panel of last selected item
        this.fetchDetailPanelData(lastSelectedItem);
    }

    /**
     * This method is used for refreshing a panel and selecting the newly added entity
     *
     * @param {string} message - message to show
     * @param {Object} newEntity - newly added entity
     * @returns {undefined}
     */
    refreshPanelDataWithMessage(message, newEntity) {
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
        const selectedItem = this.props.pathNodes[panelId];

        // Show a message, is translated in form definition on Organisations.js
        this.actions.addAlert({ type: 'success', text: message });

        // this will reload the selected entity properties and load it in the last panel (index)
        // panel id is a non zero-based index, but we want the previous panel to be updated first, so we subtract 1
        this.fetchEntities(selectedItem, panelId, false).then(() => {
            let entityToRefresh = null;

            // get panel of which an item was added
            const currentPanel = this.props.panels[panelId];

            // loop through results to find the newly added item to acquire full data
            for (let i = 0; i < currentPanel.entities.length; i++) {
                if (newId === currentPanel.entities[i].id) {
                    entityToRefresh = currentPanel.entities[i];
                    break;
                }
            }

            try {
                const listItem = document.querySelector(`#panel-${panelId}-${entityToRefresh.id}`);
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

            // if the entity was retrieved from the updated panel, go fetch its children
            if (entityToRefresh) {
                this.fetchEntities(entityToRefresh, panelId, true);
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

        // determines the endpoint from which children or detail panel data should be fetched
        switch (entity.type) {

            // todo: could do with some constant defintions

            case 'organisation':
                return 'organisation';

            case 'project':

                // even though projects cant have children, perform the API call. this is because this behaviour may
                // change in the future, and, more important, the subsequent actions need to be triggered
                return 'project';

            case 'jobFunction':

                // job functions are modeled as organisations, since their behaviour is indifferent
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
                        fields: 'id,uuid,organisationName,organisationType',
                        limit: 10000
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
                        limit: 10000,
                        depth: 5 // depth control: otherwise we will get redundant product projects: projects[0].product.projects
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

                // update path nodes first as they are leading for the panels
                this.actions.updatePath(entity, panelId);

                if (entity.type !== 'project') {

                    // store panel entities in state UNLESS they are children of a project (they do not exist!)
                    // by wrapping an if.. here instead of around the API call, subsequent actions will still take place
                    this.actions.fetchEntities(entity.id, entity.type, response);
                }

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

    fetchParticipantsForProject(entity) {

        // check if we are reloading or loading a new entity, to reset selected participants
        if (this.detailPanelEntity && this.detailPanelEntity.id !== entity.id && this.detailPanelEntity.type !== entity.type) {
            this.localState.selectedParticipants = [];
            this.setState(this.localState);
        }

        // set the current entity
        this.detailPanelEntity = entity;

        // note that the LTP root organisation with id 0 has no associated detail panel data and is ignored (like neon1)
        if (entity.id > 0) {
            document.querySelector('#spinner_detail_panel').classList.remove('hidden');
            const api = ApiFactory.get('neon');
            const apiConfig = api.getConfig();
            const section = this.getSectionForEntityType(entity);

            const params = {
                urlParams: {
                    parameters: {
                        fields: 'id,uuid,organisationName,projectName,participantSessions,genericRoleStatus,accountHasRole,account,firstName,infix,lastName',
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
                this.actions.fetchDetailPanelData(entity, response, this.openModalToAmendParticipant, this.toggleParticipant);
            }).catch(error => {
                this.actions.addAlert({ type: 'error', text: error });
            });
        } else {

            // reset back to LTP root organisation
            this.actions.resetDetailPanel();
        }
    }

    fetchSelectedCompetenciesForProject(projectSlug) {
        document.querySelector('#spinner_detail_panel').classList.remove('hidden');
        const api = ApiFactory.get('neon');
        const apiConfig = api.getConfig();
        const params = {
            urlParams: {
                parameters: {
                    fields: 'competencies,organisation,organisationName,competencyName,competencySlug,translationKey',
                    limit: 10000
                },
                identifiers: {
                    slug: projectSlug
                }
            }
        };

        const endPoint = apiConfig.endpoints.competencies.selectedCompetencies;

        // request data for detail panel
        api.get(
            api.getBaseUrl(),
            endPoint,
            params
        ).then(response => {
            document.querySelector('#spinner_detail_panel').classList.add('hidden');
            this.actions.fetchSelectedCompetencies(projectSlug, response.competencies);
        }).catch(error => {
            this.actions.addAlert({ type: 'error', text: error });
        });
    }

    fetchDetailPanelData(entity) {
        if (entity.type === 'project' && entity.uuid) {
            this.fetchParticipantsForProject(entity);
            this.fetchSelectedCompetenciesForProject(entity.uuid);
        } else {
            this.actions.fetchDetailPanelData(entity, [], this.openModalToAmendParticipant, this.toggleParticipant);
        }
    }

    /**
     * Fetch form fields
     * @param {string} formId - form id
     * @param {Object} options - call options
     * @param {string} options.section - section name
     * @param {string|number} [options.id] - section id
     * @param {Object} [options.urlParams] - url params for api module
     * @returns {undefined}
     */
    getFormFields(formId, options) {
        const urlParams = options.urlParams || {};

        // show loader
        document.querySelector('#spinner').classList.remove('hidden');

        // parse endpoint url with section name and optional id
        const endpoint = `${this.api.getEndpoints().sectionInfo}/${options.section}${options.id ? `/${options.id}` : ''}`;

        // execute request
        this.api.get(
            this.api.getBaseUrl(),
            endpoint,
            {
                urlParams
            }
        ).then(response => {

            // todo: either add the formId_ to the form fields here (by iterating over each field!) or in the reducer

            // hide loader and pass the fields to the form
            document.querySelector('#spinner').classList.add('hidden');
            this.actions.storeFormDataInFormsCollection(formId, response.fields);

        }).catch((/* error */) => {

            // This is an unexpected API error and the form cannot be loaded
            this.actions.addAlert({ type: 'error', text: this.i18n.organisations_could_not_process_your_request });
        });
    }

    // todo: refactor below methods into a combined function

    /**
     * Opens modal to add organisation
     * @param {Object} options - options
     * @param {string|number} options.panelId - panel id that opens the modal
     * @returns {undefined}
     */
    openModalToAddOrganisation(options) {

        // store panel id so we know what panel was active when opening the form
        this.actions.setFormOpenByPanelId(options.panelId);

        // fetch entity form data and show modal/form
        this.getFormFields('addOrganisation', {
            section: 'organisation',
            urlParams: {
                parameters: {
                    fields: 'organisationName,organisationType'
                }
            }
        });
        document.querySelector('#modal_add_organisation').classList.remove('hidden');
    }

    closeModalToAddOrganisation() {

        // after closing the form, reset the selected panel
        this.actions.setFormOpenByPanelId(null);
        document.querySelector('#modal_add_organisation').classList.add('hidden');

        this.actions.resetForms();
    }

    openModalToAddParticipant() {

        // fetch entity form data and show modal/form
        this.getFormFields('addParticipant', {
            section: 'participantSession',
            urlParams: {
                parameters: {
                    fields: 'accountFirstName,accountInfix,accountLastName,accountGender,accountHasRoleEmail,accountHasRoleLanguage,educationLevel,participantSessionAppointmentDate,consultant'
                }
            }
        });
        document.querySelector('#modal_add_participant').classList.remove('hidden');
    }

    closeModalToAddParticipant() {
        document.querySelector('#modal_add_participant').classList.add('hidden');

        this.actions.resetForms();
    }

    /**
     * Opens modal to add job function
     * @param {Object} options - options
     * @param {string|number} options.panelId - panel id that opens the modal
     * @returns {undefined}
     */
    openModalToAddJobFunction(options) {

        // store panel id so we know what panel was active when opening the form
        this.actions.setFormOpenByPanelId(options.panelId);

        // fetch entity form data and show modal/form
        this.getFormFields('addJobFunction', {
            section: 'organisation',
            urlParams: {
                parameters: {
                    fields: 'organisationName'
                }
            }
        });
        document.querySelector('#modal_add_job_function').classList.remove('hidden');
    }

    closeModalToAddJobFunction() {

        // after closing the form, reset the selected panel
        this.actions.setFormOpenByPanelId(null);
        document.querySelector('#modal_add_job_function').classList.add('hidden');

        this.actions.resetForms();
    }

    /**
     * Opens modal to add project
     * @param {Object} options - options
     * @param {string|number} options.panelId - panel id that opens the modal
     * @returns {undefined}
     */
    openModalToAddProject(options) {

        // store panel id so we know what panel was active when opening the form
        this.actions.setFormOpenByPanelId(options.panelId);

        // get organisation id (todo: use slug)
        const organisationId = this.props.pathNodes[options.panelId].id;

        // fetch entity form data and show modal/form
        // give options to make sure that we only get products for projects that are available for this organisation
        this.getFormFields('addProject', {
            section: 'project',
            urlParams: {
                parameters: {
                    options: `product|join:organisations|value:${organisationId}`,
                    fields: 'projectName,product'
                }
            }
        });
        document.querySelector('#modal_add_project').classList.remove('hidden');
    }

    closeModalToAddProject() {

        // after closing the form, reset the selected panel
        this.actions.setFormOpenByPanelId(null);
        document.querySelector('#modal_add_project').classList.add('hidden');

        this.actions.resetForms();
    }

    // todo: note that when the id is replaced for slug (uuid) as described in NEON-3971 this method only needs 2 params
    openModalToAmendParticipant(participantId, participantStatus, participantSlug) {

        // save and update state (its passed on to Organisations component to facilitate the PUT call)
        this.localState.selectedParticipantSlug = participantSlug;
        this.setState(this.localState);

        switch (participantStatus) {
            case ParticipantStatus.ADDED:
            case ParticipantStatus.INVITED:
            case ParticipantStatus.TERMS_AND_CONDITIONS_ACCEPTED:

                // all fields
                this.getFormFields('amendParticipant', {
                    section: `participantSession/${participantId}`,
                    urlParams: {
                        parameters: {
                            fields: 'accountGender,accountHasRoleLanguage,comments,consultant,account,educationLevel,accountFirstName,accountInfix,accountLastName,accountHasRoleEmail,participantSessionAppointmentDate'
                        }
                    }
                });
                break;

            case ParticipantStatus.INVITATION_ACCEPTED:

                // all previous fields except email
                this.getFormFields('amendParticipant', {
                    section: `participantSession/${participantId}`,
                    urlParams: {
                        parameters: {
                            fields: 'accountGender,accountHasRoleLanguage,comments,consultant,account,educationLevel,accountFirstName,accountInfix,accountLastName,participantSessionAppointmentDate'
                        }
                    }
                });
                break;

            case ParticipantStatus.REDIRECTED_TO_ONLINE:
            case ParticipantStatus.STARTED:
            case ParticipantStatus.HNA_FINISHED:
            case ParticipantStatus.PERSONA_FIT_FINISHED:

                // all previous fields education level
                this.getFormFields('amendParticipant', {
                    section: `participantSession/${participantId}`,
                    urlParams: {
                        parameters: {
                            fields: 'accountGender,accountHasRoleLanguage,comments,consultant,account,accountFirstName,accountInfix,accountLastName,participantSessionAppointmentDate'
                        }
                    }
                });
                break;

            default:
                break;
        }

        document.querySelector('#modal_amend_participant').classList.remove('hidden');
    }

    closeModalToAmendParticipant() {
        document.querySelector('#modal_amend_participant').classList.add('hidden');

        this.actions.resetForms();
    }

    openModalToInviteParticipant() {
        document.querySelector('#modal_invite_participant').classList.remove('hidden');
    }

    closeModalToInviteParticipant() {
        if (!this.modalLocked) {
            document.querySelector('#modal_invite_participant').classList.add('hidden');
        }
    }

    getGlobalAndCustomCompetencies(organisationSlug) {
        document.querySelector('#spinner').classList.remove('hidden');

        // todo: remove static slug

        const api = ApiFactory.get('neon');
        const apiConfig = api.getConfig();

        const params = {
            urlParams: {
                parameters: {
                    limit: 10000
                },
                identifiers: {
                    slug: 'c3245b96-8f65-4b66-8d48-94bce51ab4a9'
                }
            }
        };

        const endPoint = apiConfig.endpoints.competencies.availableCompetencies;

        this.api.get(
            api.getBaseUrl(),
            endPoint,
            params
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');
            this.actions.fetchAvailableCompetencies(organisationSlug, response, this.toggleCompetency);
            this.modalLocked = false;

            // fill up the local state that keeps track of the selected competencies
            this.props.selectedCompetencies.forEach(selectedCompetency => {
                this.selectedCompetencies.push(selectedCompetency[0].value);
            });
        }).catch(error => {
            this.actions.addAlert({ type: 'error', text: error });
        });
    }

    openModalToEditCompetencies() {
        this.modalLocked = true;

        // note that at this point the selectedCompetencies are already fetched (by the detail panel)
        // therefore only the available competencies need to be fetched

        document.querySelector('#modal_edit_competencies').classList.remove('hidden');

        // retrieve global and custom competencies and add them to the state
        this.getGlobalAndCustomCompetencies(this.props.pathNodes[1].uuid);
    }

    closeModalToEditCompetencies(message) {
        if (!this.modalLocked) {
            document.querySelector('#modal_edit_competencies').classList.add('hidden');

            // override the active tab to the first one, then immediately reset it so user can switch to other tabs
            this.localState.editCompetenciesActiveTab = 'organisations_edit_global_competencies';
            this.setState(this.localState, () => {
                this.localState.editCompetenciesActiveTab = null;
            });

            // to be sure the user always gets the latest status, also reset competencies when merely closing the modal
            this.actions.resetCompetencies();

            if (message) {
                this.refreshDetailPanelWithMessage(message);
            } else {
                this.refreshDetailPanelWithMessage();
            }
        }
    }

    toggleCompetency(competencySlug) {
        if (this.selectedCompetencies.indexOf(competencySlug) > -1) {

            // deselect
            this.selectedCompetencies.splice(this.selectedCompetencies.indexOf(competencySlug), 1);
        } else {

            // select
            this.selectedCompetencies.push(competencySlug);
        }
    }

    updateCompetencySelection(message) {
        console.log('selection is now: ');
        console.table(this.selectedCompetencies);

        if (!this.modalLocked) {
            this.modalLocked = true;

            // example PUT: http://dev.ltponline.com:8000/api/v1/section/project/slug/some-slug?form%5Bcompetencies%5D%5B0%5D=comp-slug-1&form%5Bcompetencies%5D%5B1%5D=comp-slug-2

            // todo: add promise, then in the success do this:
            this.modalLocked = false;
            this.closeModalToEditCompetencies(message);
        }
    }

    addCustomCompetency(competencyName, competencyDefinition) {

        // check input values
        if (!competencyName || !competencyDefinition) {
            throw new Error(OrganisationsError.ALL_FIELDS_REQUIRED);
        }

        // lock until request is handled
        if (!this.modalLocked) {
            this.modalLocked = true;
        }

        // construct the slug
        const owningOrganisationSlug = this.props.pathNodes[1].uuid;

        return new Promise((resolve, reject) => {
            this.api.post(
                this.api.getBaseUrl(),
                this.api.getEndpoints().competencies.addCompetency,
                {
                    payload: {
                        type: 'form',
                        data: {
                            competencyName,
                            competencyDefinition,
                            owningOrganisationSlug
                        }
                    }
                }
            ).then(response => {
                this.modalLocked = false;

                // if the response throws errors, reject the request and return the errors
                if (response && response.errors) {
                    return reject(response.errors);
                }

                // switch tab to edit custom competencies, then immediately reset it so user can switch to other tabs
                this.localState.editCompetenciesActiveTab = 'organisations_edit_custom_competencies';
                this.setState(this.localState, () => {
                    this.localState.editCompetenciesActiveTab = null;
                });

                // retrieve competencies again (including the one that was just added)
                this.getGlobalAndCustomCompetencies(this.props.pathNodes[1].uuid);

                // show success message
                this.actions.addAlert({ type: 'success', text: this.i18n.organisations_add_custom_competency_success });

                return resolve();
            }).catch(() => {
                reject(new Error(OrganisationsError.UNEXPECTED_ERROR));
            });
        });
    }

    render() {
        const { panels, detailPanelData, pathNodes, formOpenByPanelId } = this.props;

        return (
            <Organisations
                panels={ panels }
                formOpenByPanelId={ formOpenByPanelId }
                panelHeaderAddMethods={ this.panelHeaderAddMethods }
                detailPanelData={ detailPanelData }
                pathNodes={ pathNodes }
                fetchEntities={ this.fetchEntities }
                fetchDetailPanelData={ this.fetchDetailPanelData }
                refreshPanelDataWithMessage={ this.refreshPanelDataWithMessage }
                refreshDetailPanelParticipantsWithMessage={ this.refreshDetailPanelParticipantsWithMessage }
                closeModalToAddOrganisation={ this.closeModalToAddOrganisation }
                closeModalToAddJobFunction={ this.closeModalToAddJobFunction }
                closeModalToAddProject={ this.closeModalToAddProject }
                openModalToAddParticipant={ this.openModalToAddParticipant }
                closeModalToAddParticipant={ this.closeModalToAddParticipant }
                openModalToAmendParticipant={ this.openModalToAmendParticipant }
                closeModalToAmendParticipant={ this.closeModalToAmendParticipant }
                openModalToInviteParticipant={ this.openModalToInviteParticipant }
                closeModalToInviteParticipant={ this.closeModalToInviteParticipant }
                openModalToEditCompetencies={ this.openModalToEditCompetencies }
                closeModalToEditCompetencies={ this.closeModalToEditCompetencies }
                inviteParticipants={ this.inviteParticipants }
                selectedParticipants={ this.localState.selectedParticipants }
                selectedParticipantSlug={ this.localState.selectedParticipantSlug }
                toggleSelectAllParticipants={ this.toggleSelectAllParticipants }
                i18n={ translator(this.props.languageId, ['organisations', 'competencies', 'form']) }
                languageId={ this.props.languageId }
                selectedCompetencies={ this.props.selectedCompetencies }
                availableCompetencies={ this.props.availableCompetencies }
                updateCompetencySelection={ this.updateCompetencySelection }
                addCustomCompetency={ this.addCustomCompetency }
                editCompetenciesActiveTab={ this.localState.editCompetenciesActiveTab }
            />
        );
    }
}

const mapStateToProps = state => ({
    panels: state.organisationsReducer.panels,
    formOpenByPanelId: state.organisationsReducer.formOpenByPanelId,
    detailPanelData: state.organisationsReducer.detailPanelData,
    selectedCompetencies: state.organisationsReducer.selectedCompetencies,
    availableCompetencies: state.organisationsReducer.availableCompetencies,
    pathNodes: state.organisationsReducer.pathNodes,
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
