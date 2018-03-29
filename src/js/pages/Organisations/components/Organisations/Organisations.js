import { h, Component } from 'preact';

/** @jsx h */

import Logger from '../../../../utils/logger';
import Panels from './components/Panels/Panels';
import Path from './components/Path/Path';
import Detailpanel from './components/Detailpanel/Detailpanel';
import AppConfig from './../../../../App.config';
/* todo: there is a webpack plugin that can search within a root path which prevents ./../../../.. hell like this */
import Form from './../../../../components/Form';
import style from './style/organisations.scss';

export default class Organisations extends Component {
    constructor(props) {
        super(props);

        this.logger = Logger.instance;
    }

    render() {
        const {
            panels,
            fetchEntities,
            openModalToAddOrganisation,
            pathNodes,
            detailPanelData,
            alertComponent,
            fetchDetailPanelData
        } = this.props;

        // define properties for the Panels component
        const panelContainer = <Panels
            panels={ panels }
            pathNodes={ pathNodes }
            fetchEntities={ fetchEntities }
            fetchDetailPanelData={ fetchDetailPanelData }
            openModalToAddOrganisation={ openModalToAddOrganisation }
        />;

        // note that the name of the detail panel is taken from the path, not the state (much faster)
        let nameForCurrentEntity = AppConfig.global.organisations.rootEntitiesParentName;
        let dataForCurrentEntity;

        // find the active data 'panel' (if available)
        if (detailPanelData) {
            detailPanelData.forEach(dataForEntity => {
                if (dataForEntity.active) {

                    // grab its data
                    dataForCurrentEntity = dataForEntity;

                    // overwrite the default name (not taken from the data, to ensure its always defaulting to LTP)
                    nameForCurrentEntity = dataForEntity.entityName;
                }
            });
        } else {
            this.logger.error({
                component: 'Organisations',
                message: 'no detail panel data exists'
            });
        }

        return (
            <div className={ style.organisations }>
                { alertComponent }
                <Path pathNodes={ pathNodes } fetchEntities={ fetchEntities } />
                <section className={ style.panels_container } id="panels_container">
                    { panelContainer }
                    <Detailpanel
                        name = { nameForCurrentEntity }
                        data = { dataForCurrentEntity }
                    />
                </section>
                <aside className={ `${style.modal_container} hidden` } id="modal_organisation">
                    {/*<Form*/}
                        {/*formId={ 'organisation' }*/}
                        {/*ignoredFields={ [*/}
                            {/*'uuid',*/}
                            {/*'created',*/}
                            {/*'updated',*/}
                            {/*'manyOrganisationToManyCompetency',*/}
                            {/*'manyOrganisationToManyProduct',*/}
                            {/*'oneOrganisationToManyOrganisation',*/}
                            {/*'updated',*/}
                            {/*'updated',*/}
                            {/*'organisationType',*/}
                            {/*'organisationSlug'*/}
                        {/*] }*/}
                        {/*forms = { this.props.forms }*/}
                        {/*storeFormDataInFormsCollection={ this.props.storeFormDataInFormsCollection }*/}
                        {/*changeFormFieldValueForFormId={ this.props.changeFormFieldValueForFormId }*/}
                        {/*afterSubmit = { this.props.refreshDataWithMessage }*/}
                        {/*closeModal={ this.props.closeModalToAddOrganisation }*/}
                    {/*/>*/}
                </aside>
            </div>
        );
    }
}
