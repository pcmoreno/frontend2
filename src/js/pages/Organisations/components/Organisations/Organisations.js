import { h, Component } from 'preact';

/** @jsx h */

import Logger from '../../../../utils/logger';
import Panels from './components/Panels/Panels';
import Path from './components/Path/Path';
import DetailPanel from './components/DetailPanel/DetailPanel';
import Form from './../../../../components/Form';
import AppConfig from './../../../../App.config';
import style from './style/organisations.scss';

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
            openModalToAddOrganisation,
            pathNodes,
            alertComponent,
            fetchDetailPanelData,
            forms,
            storeFormDataInFormsCollection,
            storeSectionInfoInSectionsCollection,
            changeFormFieldValueForFormId,
            refreshDataWithMessage,
            closeModalToAddOrganisation,
            closeModalToAddParticipant
        } = this.props;

        // define properties for the Panels component
        const panelContainer = <Panels
            panels={ panels }
            pathNodes={ pathNodes }
            fetchEntities={ fetchEntities }
            fetchDetailPanelData={ fetchDetailPanelData }
            openModalToAddOrganisation={ openModalToAddOrganisation }
        />;

        const dataForCurrentEntity = this.getDetailPanelData();

        return (
            <div className={ style.organisations }>
                { alertComponent }
                <Path pathNodes={ pathNodes } fetchEntities={ fetchEntities } />
                <section className={ style.panels_container } id="panels_container">
                    { panelContainer }
                    <DetailPanel
                        data = { dataForCurrentEntity }
                        openModalToAddParticipant = { this.props.openModalToAddParticipant }
                        closeModalToAddParticipant = { this.props.closeModalToAddParticipant }
                    />
                </section>
                <aside className={ `${style.modal_container} hidden` } id="modal_organisation">
                    <Form
                        formId={ 'organisation' }
                        ignoredFields={ [
                            'uuid',
                            'created',
                            'updated',
                            'childOrganisations',
                            'competencies',
                            'manyOrganisationToOneOrganisation',
                            'products',
                            'projects',
                            'organisationType',
                            'organisationSlug'
                        ] }
                        headerText='Add organisation'
                        submitButtonText='Add'
                        forms={ forms }
                        storeFormDataInFormsCollection={ storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        afterSubmit = { refreshDataWithMessage }
                        closeModal={ closeModalToAddOrganisation }
                    />
                </aside>
                <aside className={ `${style.modal_container} hidden` } id="modal_participant">
                    <Form
                        formId={ 'account' }
                        ignoredFields={ [
                            'uuid',
                            'created',
                            'updated',
                            'accountHasRoles'
                        ] }
                        headerText='Add participant'
                        submitButtonText='Add'
                        forms={ forms }
                        storeFormDataInFormsCollection={ storeFormDataInFormsCollection }
                        storeSectionInfoInSectionsCollection={ storeSectionInfoInSectionsCollection }
                        changeFormFieldValueForFormId={ changeFormFieldValueForFormId }
                        afterSubmit = { refreshDataWithMessage }
                        closeModal={ closeModalToAddParticipant }
                    />
                </aside>
            </div>
        );
    }
}
