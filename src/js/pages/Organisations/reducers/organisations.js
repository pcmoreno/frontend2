import * as actionType from './../constants/ActionTypes';
import Logger from '../../../utils/logger';
import AppConfig from './../../../App.config';
import ListItemTypes from '../../../components/Listview/constants/ListItemTypes';
import ParticipantStatus from '../../../constants/ParticipantStatus';
import CompetencyType from '../constants/CompetencyType';
import Components from '../../../constants/Components';
import EntityType from '../../../constants/EntityType.js';

const initialState = {
    panels: [],
    sectionInfo: {},
    pathNodes: [],
    detailPanelData: {
        entity: {
            name: AppConfig.global.organisations.rootEntity.name,
            id: AppConfig.global.organisations.rootEntity.id,
            type: AppConfig.global.organisations.rootEntity.type,
            participants: []
        }
    },
    selectedCompetenciesListView: [],
    availableGlobalCompetenciesListView: null,
    availableCustomCompetenciesListView: null,

    // this value is set to determine which panel is active and opened a form
    formOpenByPanelId: null
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} state
 */
export default function organisationsReducer(state = initialState, action) {
    const newState = Object.assign({}, state);
    let tempCompetencies = [];
    let tempGlobalCompetencies = [];
    let tempCustomCompetencies = [];

    const logger = Logger.instance;

    switch (action.type) {

        case actionType.UPDATE_PATH: {

            try {

                newState.pathNodes = [];

                // construct the temporary path that is used to populate the new pathNodes state
                let tempPath = [];

                if (action.panelId >= 0) {

                    // user action at a certain panel so ensure the pathNodes are sliced up until that point
                    // + 1 because we have to take the LTP root organisation (which is not a panel) into account
                    tempPath = state.pathNodes.slice(0, action.panelId + 1);
                } else {
                    logger.error({
                        component: 'UPDATE_PATH',
                        message: 'attempting to update the path without a panelId'
                    });
                }

                let shouldAddPath = true;

                // build up the new pathNodes state
                tempPath.forEach(node => {
                    newState.pathNodes.push(node);

                    // be sure to mark if the new path was already present (on a refresh)
                    if (node.id === action.entity.id && node.type === action.entity.type) {
                        shouldAddPath = false;
                    }
                });

                // it could be possible upon refresh that the path/panel was already present, then don't add
                if (shouldAddPath) {

                    // push the new entry
                    newState.pathNodes.push({
                        id: action.entity.id,
                        panelId: action.panelId,
                        name: action.entity.name,
                        type: action.entity.type,
                        uuid: action.entity.uuid,
                        section: action.entity.section
                    });
                }
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in organisations reducer UPDATE_PATH: ${e}`,
                    component: Components.ORGANISATIONS
                });
            }

            break;
        }

        case actionType.FETCH_ENTITIES: {

            try {

                // will add a panel entity to the state containing all its children. this is NOT a representation of the
                // panel view since it can contain panels that are no longer visible. this serves as caching only.
                // todo: actually it currently overwrites the requested entity. ensure it skips the API call in such cases.

                // ensure a valid id is received
                if (action.parentId === 'undefined' || action.parentId === null) {
                    logger.error({
                        component: 'FETCH_ENTITIES',
                        message: 'encountered pathNode with invalid parent id'
                    });
                }

                // ensure a valid type is received
                if (action.parentType === 'undefined' || action.parentType === null) {
                    logger.error({
                        component: 'FETCH_ENTITIES',
                        message: 'encountered pathNode with invalid parent type'
                    });
                }

                // clear all panels from newState
                newState.panels = [];

                // rebuild panels from state
                state.panels.forEach(panel => {
                    let isActive = false;

                    for (let i = 0; i < newState.pathNodes.length; i++) {

                        // check whether this panel is active (based on path nodes)
                        if (panel.parentId === newState.pathNodes[i].id &&
                            panel.parentType === newState.pathNodes[i].type) {
                            isActive = true;
                            break;
                        }
                    }

                    // check it doesn't accidentally add a panel entry with the id from the payload (ensures it overwrites)
                    if (panel.parentId !== action.parentId && isActive) {

                        // take all properties from existing panel, except the active state
                        // note that parentType is needed to distinguish between organisations and projects with similar id's
                        newState.panels.push({
                            parentId: panel.parentId,
                            parentType: panel.parentType,
                            entities: panel.entities
                        });
                    }
                });

                // now the entities need to be constructed from the raw entity structure received from the API
                const tempEntities = [];

                // if entities contains organisations, process them
                if (action.entities.childOrganisations) {
                    action.entities.childOrganisations.forEach(entity => {

                        // attempt to extract product name if it exists
                        let productName = null;

                        if (entity.projects[0] && entity.projects[0].product) {
                            productName = entity.projects[0].product.productName;
                        }

                        tempEntities.push({
                            name: entity.organisationName,
                            id: entity.id,
                            type: entity.organisationType === EntityType.JOB_FUNCTION ? EntityType.JOB_FUNCTION : EntityType.ORGANISATION,
                            uuid: entity.uuid,
                            productName
                        });
                    });
                }

                // if entities contains projects, process them
                if (action.entities.projects) {
                    action.entities.projects.forEach(entity => {

                        const translationKey = entity.product ? entity.product.translationKey : null;

                        tempEntities.push({
                            name: entity.projectName,
                            id: entity.id,
                            type: EntityType.PROJECT,
                            uuid: entity.uuid,
                            productName: entity.product ? entity.product.productName : null,
                            translationKey: translationKey ? translationKey : null
                        });
                    });
                }

                // process (remaining?) entities (that are likely to be root entities / organisations)
                if (action.entities.length) {
                    action.entities.forEach(entity => {

                        // ensure the entity is a (root) organisation, then extract its properties and push to tempEntities
                        if (entity.id && entity.organisationName) {
                            tempEntities.push({
                                name: entity.organisationName,
                                id: entity.id,
                                type: EntityType.ORGANISATION,
                                uuid: entity.uuid
                            });
                        }
                    });
                }

                // sort alphabetically todo: move to utils
                tempEntities.sort((a, b) => {

                    if (a.name < b.name) {
                        return -1;
                    }

                    if (a.name > b.name) {
                        return 1;
                    }

                    return 0;
                });

                newState.panels.push({
                    parentId: action.parentId,
                    parentType: action.parentType,
                    active: true,
                    entities: tempEntities
                });
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in organisations reducer FETCH_ENTITIES: ${e}`,
                    component: Components.ORGANISATIONS
                });
            }

            break;
        }

        case actionType.FETCH_DETAIL_PANEL_DATA: {

            try {

                // clear all detailPanel data
                newState.detailPanelData = {};

                // extract the participants from the action
                const participantListView = [];

                if (action.data.participantSessions) {
                    action.data.participantSessions.forEach(participant => {

                        if (participant.hasOwnProperty('accountHasRole') && participant.accountHasRole.hasOwnProperty('account')) {

                            let participantInfix = ' ';
                            const account = participant.accountHasRole.account;

                            if (account.hasOwnProperty('infix') && account.infix !== 'undefined') {
                                participantInfix = ` ${account.infix} `;
                            }

                            let participantStatus = '';

                            if (participant.accountHasRole.hasOwnProperty('genericRoleStatus')) {
                                participantStatus = participant.accountHasRole.genericRoleStatus;
                            }

                            // construct consultant name
                            const participantName = `${account.firstName}${participantInfix}${account.lastName}`;
                            const sortValueForParticipantName = `${account.lastName}${participantInfix}${account.firstName}`;

                            // only invitation possible when:
                            const statusToInvite = [
                                ParticipantStatus.ADDED,
                                ParticipantStatus.INVITED,
                                ParticipantStatus.TERMS_AND_CONDITIONS_ACCEPTED
                            ];

                            // build the list view config for participants
                            participantListView.push([
                                {
                                    type: ListItemTypes.CHECKBOX,
                                    disabled: statusToInvite.indexOf(participantStatus) < 0,
                                    key: 'selectParticipantLabel',
                                    id: participant.uuid,
                                    action: event => {
                                        action.toggleParticipant(participant.uuid, event);
                                    }
                                },
                                {
                                    value: participantName,
                                    sortingKey: sortValueForParticipantName,
                                    key: 'name'
                                },
                                {
                                    key: 'status',
                                    value: participantStatus
                                },
                                {
                                    key: 'amendParticipantLabel',
                                    type: ListItemTypes.PENCIL,
                                    action: () => {
                                        action.openModalToAmendParticipant(participant.id, participantStatus, participant.uuid);
                                    }
                                }
                            ]);

                        } else {
                            logger.error({
                                component: 'FETCH_DETAIL_PANEL_DATA',
                                message: 'participant has no account'
                            });
                        }
                    });
                }

                action.entity.participantListView = participantListView;

                // store detail panel data
                newState.detailPanelData = {
                    entity: action.entity
                };
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in organisations reducer FETCH_DETAIL_PANEL_DATA: ${e}`,
                    component: Components.ORGANISATIONS
                });
            }

            break;
        }

        case actionType.FETCH_SELECTED_COMPETENCIES:

            try {

                newState.selectedCompetenciesListView = [];

                tempCompetencies = [];

                // todo: do we want to build list views like this in here (including all actions), i'd prefer not
                // todo: however, we will also run into issues with assigning back to the state when changing this later
                // todo: but this is not data access friendly, what if I would need a competency object within a component?
                action.data.forEach(competency => {
                    tempCompetencies.push(
                        [
                            {
                                type: ListItemTypes.HIDDEN,
                                key: 'competency_slug',
                                value: competency.competencySlug
                            },
                            {
                                key: 'competency_name',
                                value: competency.translationKey || competency.competencyName
                            },
                            {
                                type: ListItemTypes.COMPETENCY_TYPE,
                                key: 'competency_type',
                                disabled: false,
                                competencyType: competency.translationKey ? CompetencyType.GLOBAL : CompetencyType.CUSTOM
                            }
                        ]
                    );
                });

                newState.selectedCompetenciesListView = tempCompetencies;
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in organisations reducer FETCH_SELETED_COMPETENCIES: ${e}`,
                    component: Components.ORGANISATIONS
                });
            }

            break;

        case actionType.FETCH_AVAILABLE_COMPETENCIES:

            try {

                newState.availableGlobalCompetenciesListView = [];
                newState.availableCustomCompetenciesListView = [];

                tempGlobalCompetencies = [];
                tempCustomCompetencies = [];

                action.data.forEach(competency => {
                    if (competency.isGlobal) {
                        tempGlobalCompetencies.push(
                            [
                                {
                                    type: ListItemTypes.CHECKBOX,
                                    key: 'selectCompetencyLabel',
                                    id: competency.competencySlug,
                                    action: event => {
                                        action.toggleCompetency(competency.competencySlug, event);
                                    }
                                },
                                {
                                    key: 'competency_name',
                                    value: competency.translationKey || competency.competencyName,
                                    action: event => {
                                        action.toggleCompetency(competency.competencySlug, event);
                                    }
                                }
                            ]
                        );
                    } else {
                        tempCustomCompetencies.push(
                            [
                                {
                                    type: ListItemTypes.CHECKBOX,
                                    key: 'selectCompetencyLabel',
                                    id: competency.competencySlug,
                                    action: event => {
                                        action.toggleCompetency(competency.competencySlug, event);
                                    }
                                },
                                {
                                    key: 'competency_name',
                                    value: competency.translationKey || competency.competencyName,
                                    action: event => {
                                        action.toggleCompetency(competency.competencySlug, event);
                                    }
                                },
                                {
                                    key: 'amendCustomCompetency',
                                    type: ListItemTypes.PENCIL,
                                    action: () => {
                                        action.openEditCustomCompetencyTab({
                                            slug: competency.competencySlug,
                                            name: competency.competencyName,
                                            definition: competency.competencyDefinition
                                        });
                                    }
                                }
                            ]
                        );
                    }
                });

                newState.availableGlobalCompetenciesListView = tempGlobalCompetencies;
                newState.availableCustomCompetenciesListView = tempCustomCompetencies;
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in organisations reducer FETCH_AVAILABLE_COMPETENCIES: ${e}`,
                    component: Components.ORGANISATIONS
                });
            }

            break;

        case actionType.RESET_ORGANISATIONS:

            // reset state so all organisation data is refreshed
            newState.panels = [];
            newState.pathNodes = [];
            newState.detailPanelData = [];

            break;

        case actionType.SET_FORM_OPEN_BY_PANEL_ID:

            newState.formOpenByPanelId = action.panelId;

            break;

        case actionType.RESET_DETAIL_PANEL:

            newState.detailPanelData = Object.assign({}, initialState.detailPanelData);

            break;

        case actionType.RESET_COMPETENCIES:

            newState.selectedCompetenciesListView = [];
            newState.availableGlobalCompetenciesListView = null;
            newState.availableCustomCompetenciesListView = null;

            break;

        case actionType.UPDATE_AMENDED_ENTITY:
            try {
                const panelId = action.amendedEntity.panelId;
                const entityId = action.amendedEntity.id;
                const entities = state.panels[panelId].entities;
                let index = null;

                // get the index of the entity we want to change
                for (let i = 0; i < entities.length; i++) {
                    if (entities[i].id === entityId) {
                        index = i;
                        break;
                    }
                }

                // build the new entities array, with the changed object
                const newEntities = [
                    ...entities.slice(0, index),
                    Object.assign({}, entities[index], { name: action.value }),
                    ...entities.slice(index + 1)
                ];

                newState.panels = [
                    ...state.panels.slice(0, panelId),
                    Object.assign({}, state.panels[panelId], { entities: newEntities }),
                    ...state.panels.slice(panelId + 1)
                ];

                index = null;

                // get the index of the entity we want to change
                for (let i = 0; i < state.pathNodes.length; i++) {
                    if (state.pathNodes[i].uuid === action.amendedEntity.uuid &&
                        state.pathNodes[i].panelId === action.amendedEntity.panelId) {
                        index = i;
                        break;
                    }
                }

                // build the new entities array, with the changed object
                newState.pathNodes = [
                    ...state.pathNodes.slice(0, index),
                    Object.assign({}, state.pathNodes[index], { name: action.value }),
                    ...state.pathNodes.slice(index + 1)
                ];

                // finally update detail panel data, this is where the edit happened
                newState.detailPanelData.entity = Object.assign({}, state.detailPanelData.entity, { name: action.value });

            } catch (e) {
                Logger.instance.error({
                    message: `Exception in organisations reducer UPDATE_AMENDED_ENTITY: ${e}`,
                    component: Components.ORGANISATIONS
                });
            }

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
