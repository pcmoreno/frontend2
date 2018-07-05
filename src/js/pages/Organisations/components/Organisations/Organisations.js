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
import Modal from './../../../../components/Modal';
import AppConfig from './../../../../App.config';
import style from './style/organisations.scss';
import FormMethod from '../../../../components/Form/components/Form/constants/FormMethod';
import Tabs from '../../../../components/Tabs';
import EditGlobalCompetencies from './components/EditCompetencies/components/EditGlobalCompetencies/EditGlobalCompetencies';
import EditCustomCompetencies from './components/EditCompetencies/components/EditCustomCompetencies/EditCustomCompetencies';
import AddCustomCompetency from './components/EditCompetencies/components/AddCustomCompetency/AddCustomCompetency';

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

    /* generic method to close the newly written modal component. this is currently only used for edit competencies */
    // todo: start with replacing all closeModal**** methods with this one
    closeModal(id) {
        document.querySelector(`#${id}`).classList.add('hidden');
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
            refreshPanelDataWithMessage,
            refreshDetailPanelDataWithMessage,
            closeModalToAddOrganisation,
            openModalToAddParticipant,
            closeModalToAddParticipant,
            openModalToAmendParticipant,
            closeModalToAmendParticipant,
            openModalToEditCompetencies,
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
                        openModalToEditCompetencies = { openModalToEditCompetencies }
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
                        hiddenFields={[{ fieldId: 'organisationType', value: 'organisation' }]}
                        headerText={i18n.organisations_add_organisation}
                        submitButtonText={i18n.organisations_add}
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
                        hiddenFields={[{ fieldId: 'project', value: pathNodes[pathNodes.length - 1].uuid }]}
                        headerText={i18n.organisations_add_participant}
                        submitButtonText={i18n.organisations_add}
                        translationKeysOverride={{
                            accountFirstName: {
                                placeholder: 'form_participant_first_name_placeholder'
                            },
                            accountInfix: {
                                placeholder: 'form_participant_infix_placeholder'
                            },
                            accountLastName: {
                                placeholder: 'form_participant_last_name_placeholder'
                            },
                            accountHasRoleLanguage: {
                                placeholder: 'form_participant_language_placeholder'
                            },
                            accountHasRoleEmail: {
                                placeholder: 'form_participant_email_placeholder'
                            }
                        }}
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
                        hiddenFields={[
                            { fieldId: 'organisationType', value: 'jobFunction' },
                            { fieldId: 'organisation', value: pathNodes[formOpenByPanelId || 0].uuid }
                        ]}
                        headerText={i18n.organisations_add_job_function}
                        submitButtonText={i18n.organisations_add}
                        translationKeysOverride={{
                            organisationName: {
                                label: 'form_job_function_name',
                                placeholder: 'form_job_function_name_placeholder'
                            }
                        }}
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
                        hiddenFields={[
                            { fieldId: 'organisation', value: pathNodes[formOpenByPanelId || 0].uuid }
                        ]}
                        headerText={i18n.organisations_add_project}
                        submitButtonText={i18n.organisations_add}
                        translationKeysOverride={{
                            product: {
                                label: 'form_project_product'
                            }
                        }}
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
                        hiddenFields={[
                            { fieldId: 'uuid', value: this.props.selectedParticipantSlug }
                        ]}
                        headerText={i18n.organisations_amend_participant}
                        submitButtonText={i18n.organisations_save}
                        translationKeysOverride={{
                            accountFirstName: {
                                placeholder: 'form_participant_first_name_placeholder'
                            },
                            accountInfix: {
                                placeholder: 'form_participant_infix_placeholder'
                            },
                            accountLastName: {
                                placeholder: 'form_participant_last_name_placeholder'
                            },
                            accountHasRoleLanguage: {
                                placeholder: 'form_participant_language_placeholder'
                            },
                            accountHasRoleEmail: {
                                placeholder: 'form_participant_email_placeholder'
                            }
                        }}
                        afterSubmit = { () => {
                            refreshDetailPanelDataWithMessage(i18n.organisations_amend_participant_success);
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
                <Modal
                    i18n={ i18n }
                    id={ 'modal_edit_competencies' }
                    modalHeader={ i18n.organisations_edit_competencies }
                    closeModal={ () => this.closeModal('modal_edit_competencies') }
                    className={ `hidden` }
                >
                    <Tabs i18n={ i18n } activeTab="organisations_edit_global_competencies">
                        <EditGlobalCompetencies
                            id="organisations_edit_global_competencies"
                            label="organisations_edit_global_competencies"
                            i18n={ i18n }
                            closeModal={ () => this.closeModal('modal_edit_competencies') }
                        />
                        <EditCustomCompetencies
                            id="organisations_edit_custom_competencies"
                            label="organisations_edit_custom_competencies"
                            i18n={ i18n }
                            closeModal={ () => this.closeModal('modal_edit_competencies') }
                        />
                        <AddCustomCompetency
                            id="organisations_add_custom_competency"
                            label="organisations_add_custom_competency"
                            i18n={ i18n }
                            closeModal={() => this.closeModal('modal_edit_competencies')}
                        />
                    </Tabs>
                </Modal>
            </main>
        );
    }
}

export default connect()(Organisations);
