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

        // hide modal and spinner(if not already hidden)

        document.querySelector('#spinner').classList.remove('hidden');

        const api = ApiFactory.get('neon');

        let params, endPoint;
        const apiConfig = api.getConfig();

        //
        if (entity.id > 0) {

            // a parentId was provided, assume 'child' entities need to be retrieved
            params = {
                urlParams: {
                    parameters: {
                        fields: 'id,organisationName,childOrganisations,projects,projectName,product,productName'
                    },
                    identifiers: {
                        identifier: entity.id
                    }
                }
            };

            endPoint = apiConfig.endpoints.organisations.childEntities;
        } else {

            // parentId is '0', assume the 'root' entities need to be retrieved
            params = {
                urlParams: {
                    parameters: {
                        fields: 'id,organisationName'
                    }
                }
            };

            endPoint = apiConfig.endpoints.organisations.rootEntities;
        }

        // request entities
        api.get(
            api.getBaseUrl(),
            endPoint,
            params
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');

            // store panel entities in state
            this.actions.fetchEntities(entity.id, response);

            // now that the new entities are available in the state, update the path to reflect the change
            this.actions.updatePath(entity, panelId);

            // last, update the detail panel
            this.fetchDetailPanelData(entity.id);
        }).catch(error => {
            this.actions.addAlert({ type: 'error', text: error });
        });
    }

    fetchDetailPanelData(organisationId) {

        // note that the LTP root organisation with id 0 has no associated detail panel data and is thus ignored

        if (organisationId > 0) {
            const api = ApiFactory.get('neon');
            let params, endPoint;
            const apiConfig = api.getConfig();

            params = {
                urlParams: {
                    parameters: {
                        fields: 'id,organisationName,childOrganisations,projects,projectName,product,productName'
                    },
                    identifiers: {
                        identifier: organisationId
                    }
                }
            };

            endPoint = apiConfig.endpoints.organisations.detailPanelData;

            // request entities
            api.get(
                api.getBaseUrl(),
                endPoint,
                params
            ).then(response => {
                this.actions.fetchDetailPanelData(organisationId, response);
            }).catch(error => {
                this.actions.addAlert({ type: 'error', text: error });
            });
        }
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
                detailPanelData = { this.props.detailPanelData }
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
    detailPanelData: state.organisationsReducer.detailPanelData,
    forms: state.organisationsReducer.forms,
    pathNodes: state.organisationsReducer.pathNodes
});

export default connect(mapStateToProps)(Index);
