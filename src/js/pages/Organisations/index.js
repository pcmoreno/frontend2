import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as organisationsActions from './actions/organisations';
import * as alertActions from './../../components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from '../../utils/api/factory';
import Organisations from './components/Organisations/Organisations';
import AppConfig from './../../App.config';

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
        this.fetchEntities = this.fetchEntities.bind(this);
        this.fetchDetailPanelData = this.fetchDetailPanelData.bind(this);
    }

    storeFormDataInFormsCollection(formId, formFields) {

        // dispatch action to update forms[] state with new form data (will overwrite for this id)
        this.actions.storeFormDataInFormsCollection(formId, formFields);
    }

    changeFormFieldValueForFormId(formId, formInputId, formInputValue) {

        // react controlled component pattern takes over the built-in form state when input changes
        this.actions.changeFormFieldValueForFormId(formId, formInputId, formInputValue);
    }

    componentWillMount() {
        document.title = 'Organisations';
    }

    componentDidMount() {
        updateNavigationArrow();

        // fetch entities for static id '0', which is reserved for root entities. name of panel is defined in AppConfig
        this.fetchEntities({ id: 0, name: AppConfig.global.organisations.rootEntitiesParentName }, 0);
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
        this.fetchEntities({ id: 0, name: 'what to put here' }, null);
    }

    fetchEntities(entity, panelId) {
        document.querySelector('#spinner').classList.remove('hidden');

        const api = ApiFactory.get('neon');
        const apiConfig = api.getConfig();
        let params, endPoint;

        if (entity.id === 0) {

            // entity.id is '0', assume the 'root' entities need to be retrieved
            params = {
                urlParams: {
                    parameters: {
                        fields: 'id,organisationName,organisationType'
                    }
                }
            };

            endPoint = apiConfig.endpoints.organisations.rootEntities;
        } else {

            // an entity.id was provided, assume 'child' entities need to be retrieved
            params = {
                urlParams: {
                    parameters: {
                        fields: 'id,organisationName,organisationType,childOrganisations,projects,projectName,product,productName'
                    },
                    identifiers: {
                        identifier: entity.id,
                        type: entity.section
                    }
                }
            };

            endPoint = apiConfig.endpoints.organisations.childEntities;
        }

        // request entities
        if (entity.section !== null) {
            api.get(
                api.getBaseUrl(),
                endPoint,
                params
            ).then(response => {
                document.querySelector('#spinner').classList.add('hidden');

                // store panel entities in state
                this.actions.fetchEntities(entity.id, response);

                // todo: in case user clicked a project, that has no children, so API request will fail
                // todo: its possible to skip the API call, but that would mean the following two
                // todo: subsequent requests wont be executed. so its impossible to retrieve information
                // todo: from a project currently, or update the path. need to find a solution for that.

                // now that the new entities are available in the state, update the path to reflect the change
                this.actions.updatePath(entity, panelId);

                // last, update the detail panel (cant do this earlier since no way to tell if entities will fetch ok)
                this.fetchDetailPanelData(entity);
            }).catch(error => {
                this.actions.addAlert({ type: 'error', text: error });
            });
        }
    }

    fetchDetailPanelData(entity) {

        // note that the LTP root organisation with id 0 has no associated detail panel data and is ignored (like neon1)
        if (entity.id > 0) {
            document.querySelector('#spinner_detail_panel').classList.remove('hidden');
            const api = ApiFactory.get('neon');
            const apiConfig = api.getConfig();

            if (entity.section !== null) {
                const params = {
                    urlParams: {
                        parameters: {
                            fields: 'id,organisationName,childOrganisations,projects,projectName,product,productName'
                        },
                        identifiers: {
                            identifier: entity.id,
                            type: entity.section
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

                    // store detail panel data in the state
                    this.actions.fetchDetailPanelData({ id: entity.id, type: entity.type, section: entity.section, name: entity.name }, response);
                }).catch(error => {
                    this.actions.addAlert({ type: 'error', text: error });
                });
            }
        }
    }

    openModalToAddOrganisation() {
        document.querySelector('#modal_organisation').classList.remove('hidden');
    }

    closeModalToAddOrganisation() {
        document.querySelector('#modal_organisation').classList.add('hidden');
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
                openModalToAddOrganisation={ this.openModalToAddOrganisation }
                closeModalToAddOrganisation={ this.closeModalToAddOrganisation }
            />
        );
    }
}

const mapStateToProps = state => ({
    panels: state.organisationsReducer.panels,
    detailPanelData: state.organisationsReducer.detailPanelData,
    forms: state.organisationsReducer.forms,
    pathNodes: state.organisationsReducer.pathNodes
});

export default connect(mapStateToProps)(Index);
