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
        if (this.props.detailPanelData) {
            newDetailPanelData = this.props.detailPanelData;
        }

        if (newDetailPanelData) {
            return newDetailPanelData;
        }

        // no panel data loaded yet. while it loads, show empty detail panel with root entity data (is that always relevant?)
        return { entity: AppConfig.global.organisations.rootEntity };
    }

    render() {
        const {
            panels,
            formOpenByPanelId,
            fetchEntities,
            panelHeaderAddMethods,
            pathNodes,
            alertComponent,
            fetchDetailPanelData,
            forms,
            storeSectionInfoInSectionsCollection,
            changeFormFieldValueForFormId,
            resetChangedFieldsForFormId,
            refreshPanelDataWithMessage,
            refreshDetailPanelDataWithMessage,
            closeModalToAddOrganisation,
            openModalToAddParticipant,
            closeModalToAddParticipant,
            openModalToAmendParticipant,
            closeModalToAmendParticipant,
            languageId,
            closeModalToAddJobFunction,
            closeModalToAddProject,
            selectedParticipants,
            inviteParticipants,
            toggleSelectAllParticipants,
            openModalToInviteParticipant,
            closeModalToInviteParticipant,
            i18n
        } = this.props;

        // define properties for the Panels component
        const panelContainer = <Panels
            panels={ panels }
            pathNodes={ pathNodes }
            panelHeaderAddMethods={ panelHeaderAddMethods }
            fetchEntities={ fetchEntities }
            fetchDetailPanelData={ fetchDetailPanelData }
            i18n={i18n}
        />;

        const dataForCurrentEntity = this.getDetailPanelData();

        if (!panels || !panels.length) {
            return null;
        }

        /* todo: remove hiddenFields property and instead use the ?fields= prop insite the openModal... methods to determine which fields should be retrieved by the API call */

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
                        openModalToInviteParticipant = { openModalToInviteParticipant }
                        selectedParticipants={ selectedParticipants }
                        toggleSelectAllParticipants={ toggleSelectAllParticipants }
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
                            'organisationSlug'
                        ] }
                        hiddenFields={[{ name: 'organisationType', value: 'organisation' }]}
                        headerText={i18n.organisations_add_organisation}
                        submitButtonText={i18n.organisations_add}
                        forms={ forms }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        resetChangedFieldsForFormId={ resetChangedFieldsForFormId }
                        afterSubmit = { response => {
                            refreshPanelDataWithMessage(i18n.organisations_add_organisation_success, response);
                        } }
                        closeModal={ closeModalToAddOrganisation }
                        languageId={ languageId }
                    />
                </aside>
                <aside className={ `${style.modal_container} hidden` } id="modal_add_participant">
                    <Form
                        formId={ 'addParticipant' }
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
                            'participantSessionSlug',
                            'accountDisplayName'
                        ] }
                        hiddenFields={[{ name: 'manyParticipantSessionToOneProject', value: pathNodes[pathNodes.length - 1].uuid }]}
                        headerText={i18n.organisations_add_participant}
                        submitButtonText={i18n.organisations_add}
                        forms={ forms }
                        storeSectionInfoInSectionsCollection={ storeSectionInfoInSectionsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        resetChangedFieldsForFormId={ resetChangedFieldsForFormId }
                        afterSubmit = { response => {
                            refreshDetailPanelDataWithMessage(i18n.organisations_add_participant_success, {
                                addedParticipant: response
                            });
                        } }
                        closeModal={ closeModalToAddParticipant }
                        languageId={ this.props.languageId }
                    />
                </aside>
                <aside className={ `${style.modal_container} hidden` } id="modal_add_job_function">
                    <Form
                        formId={ 'addJobFunction' }
                        sectionId={ 'organisation' }
                        method={ FormMethod.CREATE_SECTION }
                        ignoredFields={ [
                            'uuid',
                            'created',
                            'updated',
                            'childOrganisations',
                            'availableCompetencies',
                            'selectedCompetencies',
                            'products',
                            'projects',
                            'organisationSlug'
                        ] }

                        // when panelId was not set, fallback to pathnode 0
                        hiddenFields={[
                            { name: 'organisationType', value: 'jobFunction' },
                            { name: 'manyOrganisationToOneOrganisation', value: pathNodes[formOpenByPanelId || 0].uuid }
                        ]}
                        headerText={i18n.organisations_add_job_function}
                        submitButtonText={i18n.organisations_add}
                        forms={ forms }
                        translationKeysOverride={{
                            organisationName: {
                                label: 'form_job_function_name',
                                placeholder: 'form_job_function_name_placeholder'
                            }
                        }}
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        resetChangedFieldsForFormId={ resetChangedFieldsForFormId }
                        afterSubmit = { response => {
                            refreshPanelDataWithMessage(i18n.organisations_add_job_function_success, response);
                        } }
                        closeModal={ closeModalToAddJobFunction }
                        languageId={ languageId }
                    />
                </aside>
                <aside className={ `${style.modal_container} hidden` } id="modal_add_project">
                    <Form
                        formId={ 'addProject' }
                        sectionId={ 'project' }
                        method={ FormMethod.CREATE_SECTION }
                        ignoredFields={ [
                            'uuid',
                            'projectSlug',
                            'created',
                            'updated',
                            'participantSessions',
                            'competencies'
                        ] }
                        hiddenFields={[
                            { name: 'manyProjectToOneOrganisation', value: pathNodes[formOpenByPanelId || 0].uuid }
                        ]}
                        headerText={i18n.organisations_add_project}
                        submitButtonText={i18n.organisations_add}
                        forms={ forms }
                        translationKeysOverride={{
                            manyProjectToOneProduct: {
                                label: 'form_project_product'
                            }
                        }}
                        storeSectionInfoInSectionsCollection={ storeSectionInfoInSectionsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        resetChangedFieldsForFormId={ resetChangedFieldsForFormId }
                        afterSubmit = { response => {
                            refreshPanelDataWithMessage(i18n.organisations_add_project_success, response);
                        } }
                        closeModal={ closeModalToAddProject }
                        languageId={ languageId }
                    />
                </aside>
                <aside className={ `${style.modal_container} hidden` } id="modal_amend_participant">
                    <Form
                        formId={ 'amendParticipant' }
                        sectionId={ 'participantSession' }
                        method={ FormMethod.UPDATE_SECTION }
                        ignoredFields={ [
                            'accountGender',
                            'created',
                            'updated',
                            'calculatedScores',
                            'accountHasRoleGenericRoleStatus',
                            'oneParticipantSessionToOneReport',
                            'oneParticipantSessionToOneAccountHasRole',
                            'manyParticipantSessionToOneProject',
                            'startedOn',
                            'onlineId',
                            'participantSessionSlug',
                            'accountDisplayName'
                        ] }
                        headerText={i18n.organisations_amend_participant}
                        submitButtonText={i18n.organisations_save}
                        forms={ forms }
                        storeSectionInfoInSectionsCollection={ storeSectionInfoInSectionsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        resetChangedFieldsForFormId={ resetChangedFieldsForFormId }
                        afterSubmit = { () => {
                            refreshDetailPanelWithMessage(i18n.organisations_amend_participant_success);
                        } }
                        closeModal={ closeModalToAmendParticipant }
                        languageId={ languageId }
                    />
                </aside>
                <aside className={ `${style.modal_container} hidden` } id="modal_invite_participant">
                    <section role="dialog">
                        <section tabIndex="0" className={ style.background } onClick={ this.props.closeModalToInviteParticipant } role="button" />
                        <form>
                            <header>
                                <h3>{ selectedParticipants.length > 1
                                    ? i18n.organisations_invite_participants_title : i18n.organisations_invite_participant_title
                                }</h3>
                            </header>
                            <main>{ selectedParticipants.length > 1
                                ? i18n.organisations_invite_participants_confirmation : i18n.organisations_invite_participant_confirmation
                            }</main>
                            <footer>
                                <button
                                    className={ 'action_button action_button__secondary' }
                                    type={ 'button' }
                                    value={ i18n.organisations_close }
                                    onClick={ closeModalToInviteParticipant }
                                >
                                    { i18n.organisations_close }
                                </button>
                                <button
                                    className={ 'action_button' }
                                    type={ 'button' }
                                    value={ i18n.organisations_invite }
                                    onClick={ () => inviteParticipants(selectedParticipants) }
                                >
                                    { i18n.organisations_invite }
                                </button>
                            </footer>
                        </form>
                    </section>
                </aside>
            </main>
        );
    }
}

export default connect()(Organisations);
