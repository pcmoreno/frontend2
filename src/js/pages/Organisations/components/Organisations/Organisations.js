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

        // no panel data loaded yet. while it loads, show empty detail panel with root entity data
        return { entity: AppConfig.global.organisations.rootEntity };
    }

    render() {
        // panel id represents the non-zero based index the active panel, used to determine the right parent
        // when trying to add entities. Which is current panel - 1 (previous selected item)

        const {
            panels,
            formOpenByPanelId,
            fetchEntities,
            panelHeaderAddMethods,
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
            closeModalToAddParticipant,
            closeModalToAddJobFunction,
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
                        openModalToAddParticipant = { this.props.openModalToAddParticipant }
                        closeModalToAddParticipant = { this.props.closeModalToAddParticipant }
                        openModalToInviteParticipant = { this.props.openModalToInviteParticipant }
                        selectedParticipants = { this.props.selectedParticipants }
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
                        storeFormDataInFormsCollection={ storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        resetChangedFieldsForFormId={ resetChangedFieldsForFormId }
                        afterSubmit = { response => {
                            refreshDataWithMessage(i18n.organisations_add_organisation_success, response, 'organisation');
                        } }
                        closeModal={ closeModalToAddOrganisation }
                        languageId={ this.props.languageId }
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
                            { name: 'manyOrganisationToOneOrganisation', value: pathNodes[(formOpenByPanelId || 1) - 1].uuid }
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
                        storeFormDataInFormsCollection={ storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        resetChangedFieldsForFormId={ resetChangedFieldsForFormId }
                        afterSubmit = { response => {
                            refreshDataWithMessage(i18n.organisations_add_job_function_success, response, 'jobFunction');
                        } }
                        closeModal={ closeModalToAddJobFunction }
                        languageId={ this.props.languageId }
                    />
                </aside>
                <aside className={ `${style.modal_container} hidden` } id="modal_invite_participant">
                    <section role="dialog">
                        <section tabIndex="0" className={ style.background } onClick={ this.props.closeModalToInviteParticipant } role="button" />
                        <form>
                            <header>
                                <h3>invite participant</h3>
                            </header>
                            <main>weet je dat zeker JONGEH</main>
                            <footer>
                                <button
                                    className={ 'action_button action_button__secondary' }
                                    type={ 'button' }
                                    value={ i18n.organisations_close }
                                    onClick={ this.props.closeModalToInviteParticipant }
                                >
                                    { i18n.organisations_close }
                                </button>
                                <button
                                    className={ 'action_button' }
                                    type={ 'button' }
                                    value={ i18n.organisations_invite }
                                    onClick={ () => this.props.inviteParticipants(this.props.selectedParticipants) }
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
