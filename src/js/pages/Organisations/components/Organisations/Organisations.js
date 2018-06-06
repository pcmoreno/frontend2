import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as alertActions from './../../../../components/Alert/actions/alert';
import Logger from '../../../../utils/logger';
import Panels from './components/Panels/Panels';
import Path from './components/Path/Path';
import DetailPanel from './components/DetailPanel/DetailPanel';
import Form from './../../../../components/Form';
import AppConfig from './../../../../App.config';
import style from './style/organisations.scss';
import FormMethod from '../../../../components/Form/components/Form/constants/FormMethod';

class Organisations extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, alertActions),
            dispatch
        );

        this.logger = Logger.instance;
        this.getDetailPanelData = this.getDetailPanelData.bind(this);
    }

    // todo: can this be moved to index.js?
    getDetailPanelData() {
        let newDetailPanelData;

        // return the active detail panel data instance
        this.props.detailPanelData.forEach(dataForEntity => {
            if (dataForEntity.active) {
                newDetailPanelData = dataForEntity;
            }
        });

        if (newDetailPanelData) {
            return newDetailPanelData;
        }

        // no panel data loaded yet. while it loads, show empty detail panel with root entity data (is that always relevant?)
        return { entity: AppConfig.global.organisations.rootEntity };
    }

    render() {
        const {
            panels,
            fetchEntities,
            openModalToAddOrganisation,
            pathNodes,
            alertComponent,
            fetchDetailPanelData,
            forms,
            storeFormDataInFormsCollection,
            storeSectionInfoInSectionsCollection,
            changeFormFieldValueForFormId,
            resetChangedFieldsForFormId,
            refreshDataWithMessage,
            closeModalToAddOrganisation,
            openModalToAddParticipant,
            closeModalToAddParticipant,
            openModalToAmendParticipant,
            closeModalToAmendParticipant,
            i18n,
            languageId
        } = this.props;

        // define properties for the Panels component
        const panelContainer = <Panels
            panels={ panels }
            pathNodes={ pathNodes }
            fetchEntities={ fetchEntities }
            fetchDetailPanelData={ fetchDetailPanelData }
            openModalToAddOrganisation={ openModalToAddOrganisation }
            i18n={i18n}
        />;

        const dataForCurrentEntity = this.getDetailPanelData();

        if (!panels || !panels.length) {
            return null;
        }

        return (
            <main className={ style.organisations }>
                { alertComponent }
                <Path pathNodes={ pathNodes } fetchEntities={ fetchEntities } />
                <section className={ style.panels_container } id="panels_container">
                    { panelContainer }
                    <DetailPanel
                        data = { dataForCurrentEntity }
                        openModalToAddParticipant = { openModalToAddParticipant }
                        closeModalToAddParticipant = { closeModalToAddParticipant }
                        openModalToAmendParticipant = { openModalToAmendParticipant }
                        closeModalToAmendParticipant = { closeModalToAmendParticipant }
                        i18n = { i18n }
                    />
                </section>
                <aside className={ `${style.modal_container} hidden` } id="modal_add_organisation">
                    <Form
                        formId={ 'addOrganisation' }
                        sectionId={ 'organisation' }
                        method={ FormMethod.CREATE_SECTION }
                        ignoredFields={ [
                            'uuid',
                            'created',
                            'updated',
                            'childOrganisations',
                            'availableCompetencies',
                            'selectedCompetencies',
                            'manyOrganisationToOneOrganisation',
                            'products',
                            'projects',
                            'organisationType',
                            'organisationSlug'
                        ] }
                        hiddenFields={[]}
                        headerText={i18n.organisations_add_organisation}
                        submitButtonText={i18n.organisations_add}
                        forms={ forms }
                        storeFormDataInFormsCollection={ storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        resetChangedFieldsForFormId={ resetChangedFieldsForFormId }
                        afterSubmit = { refreshDataWithMessage }
                        closeModal={ closeModalToAddOrganisation }
                        languageId={ languageId }
                    />
                </aside>
                <aside className={ `${style.modal_container} hidden` } id="modal_add_participant">
                    <Form
                        formId={ 'addParticipantSection' }
                        sectionId={ 'participantSession' }
                        method={ FormMethod.CREATE_SECTION }
                        ignoredFields={ [
                            'uuid',
                            'created',
                            'updated',
                            'calculatedScores',
                            'accountHasRoleGenericRoleStatus',
                            'oneParticipantSessionToOneReport',
                            'oneParticipantSessionToOneAccountHasRole',
                            'startedOn',
                            'onlineId',
                            'participantSessionSlug'
                        ] }
                        hiddenFields={[{ name: 'manyParticipantSessionToOneProject', value: pathNodes[pathNodes.length - 1].uuid }]}
                        headerText={i18n.organisations_add_participant}
                        submitButtonText={i18n.organisations_add}
                        forms={ forms }
                        storeFormDataInFormsCollection={ storeFormDataInFormsCollection }
                        storeSectionInfoInSectionsCollection={ storeSectionInfoInSectionsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        resetChangedFieldsForFormId={ resetChangedFieldsForFormId }
                        afterSubmit = { () => {
                            refreshDataWithMessage(pathNodes[pathNodes.length - 1]);
                            this.actions.addAlert({ type: 'success', text: i18n.organisations_add_participant_success });
                        } }
                        closeModal={ closeModalToAddParticipant }
                        languageId={ languageId }
                    />
                </aside>
                <aside className={ `${style.modal_container} hidden` } id="modal_amend_participant">
                    <Form
                        formId={ 'amendParticipantSection' }
                        sectionId={ 'participantSession' }
                        method={ FormMethod.UPDATE_SECTION }
                        ignoredFields={ [
                            'uuid',
                            'created',
                            'updated',
                            'calculatedScores',
                            'accountHasRoleGenericRoleStatus',
                            'oneParticipantSessionToOneReport',
                            'oneParticipantSessionToOneAccountHasRole',
                            'manyParticipantSessionToOneProject',
                            'startedOn',
                            'onlineId',
                            'participantSessionSlug'
                        ] }
                        headerText={i18n.organisations_amend_participant}
                        submitButtonText={i18n.organisations_save}
                        forms={ forms }
                        storeFormDataInFormsCollection={ storeFormDataInFormsCollection }
                        storeSectionInfoInSectionsCollection={ storeSectionInfoInSectionsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        resetChangedFieldsForFormId={ resetChangedFieldsForFormId }
                        afterSubmit = { () => {
                            refreshDataWithMessage(pathNodes[pathNodes.length - 1]);
                            this.actions.addAlert({ type: 'success', text: i18n.organisations_amend_participant_success });
                        } }
                        closeModal={ closeModalToAmendParticipant }
                        languageId={ languageId }
                    />
                </aside>
            </main>
        );
    }
}

export default connect()(Organisations);
