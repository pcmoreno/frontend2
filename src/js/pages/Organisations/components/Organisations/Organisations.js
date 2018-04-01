import { h, Component } from 'preact';

/** @jsx h */

import Logger from '../../../../utils/logger';
import Panels from './components/Panels/Panels';
import Path from './components/Path/Path';
import Detailpanel from './components/Detailpanel/Detailpanel';
import Form from './../../../../components/Form';
import style from './style/organisations.scss';

export default class Organisations extends Component {
    constructor(props) {
        super(props);

        this.logger = Logger.instance;
        this.getDetailPanelDataForPathNode = this.getDetailPanelDataForPathNode.bind(this);
    }

    getDetailPanelDataForPathNode(pathNode) {

        let newDetailPanelData;

        // see if currently processed data from collection matches active path node id
        this.props.detailPanelData.forEach(dataForEntity => {
            if (dataForEntity.entity.id === pathNode.id) {
                newDetailPanelData = dataForEntity;
            }
        });

        if (newDetailPanelData) {
            return newDetailPanelData;
        }

        // panel data not loaded yet. while it loads, show empty detail panel with name from requested pathNode
        // and id set to 0, so no tabs will be shown by the detailPanelNavigation component further down
        return {
            entity:
            {
                name: pathNode.name,
                type: 'organisation',
                id: 0
            }
        };
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
            changeFormFieldValueForFormId,
            refreshDataWithMessage,
            closeModalToAddOrganisation
        } = this.props;

        // define properties for the Panels component
        const panelContainer = <Panels
            panels={ panels }
            pathNodes={ pathNodes }
            fetchEntities={ fetchEntities }
            fetchDetailPanelData={ fetchDetailPanelData }
            openModalToAddOrganisation={ openModalToAddOrganisation }
        />;

        let pathNode = { id: 0 }; // default to 0 for root organisation in case pathNodes are not defined yet todo: still needed?

        // determine id of currently active pathNode so it can be matched with already received detail panel data
        if (pathNodes.length > 0) {
            pathNode = pathNodes[pathNodes.length - 1];
        }

        const dataForCurrentEntity = this.getDetailPanelDataForPathNode(pathNode);

        return (
            <div className={ style.organisations }>
                { alertComponent }
                <Path pathNodes={ pathNodes } fetchEntities={ fetchEntities } />
                <section className={ style.panels_container } id="panels_container">
                    { panelContainer }
                    <Detailpanel
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
                        {/*forms = { forms }*/}
                        {/*storeFormDataInFormsCollection={ storeFormDataInFormsCollection }*/}
                        {/*changeFormFieldValueForFormId={ changeFormFieldValueForFormId }*/}
                        {/*afterSubmit = { refreshDataWithMessage }*/}
                        {/*closeModal={ closeModalToAddOrganisation }*/}
                    {/*/>*/}
                </aside>
            </div>
        );
    }
}
