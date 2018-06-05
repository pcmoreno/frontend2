import { h, Component } from 'preact';

/** @jsx h */

import Logger from '../../../../utils/logger';
import Panels from './components/Panels/Panels';
import Path from './components/Path/Path';
import DetailPanel from './components/DetailPanel/DetailPanel';
import Form from './../../../../components/Form';
import AppConfig from './../../../../App.config';
import style from './style/organisations.scss';
import FormMethod from '../../../../components/Form/components/Form/constants/FormMethod';

export default class Organisations extends Component {
    constructor(props) {
        super(props);

        this.logger = Logger.instance;
        this.getDetailPanelData = this.getDetailPanelData.bind(this);
    }

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
        const {
            panels,
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
            panelHeaderAddMethods={panelHeaderAddMethods}
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
                        afterSubmit = { refreshDataWithMessage }
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
                        afterSubmit = { refreshDataWithMessage }
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
                        hiddenFields={[
                            { name: 'organisationType', value: 'jobFunction' },
                            { name: 'manyOrganisationToOneOrganisation', value: pathNodes[pathNodes.length - 1].uuid }
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
                        afterSubmit = { refreshDataWithMessage }
                        closeModal={ closeModalToAddJobFunction }
                        languageId={ this.props.languageId }
                    />
                </aside>
            </main>
        );
    }
}
