import { h, Component } from 'preact';

/** @jsx h */

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
    }


    render() {
        const { panels, fetchEntities, openModalToAddOrganisation, pathNodes, detailPanelData } = this.props;

        // define properties for the Panels component
        const panelContainer = <Panels
            panels={ panels }
            pathNodes={ pathNodes }
            fetchEntities={ fetchEntities }
            openModalToAddOrganisation={ openModalToAddOrganisation }
        />;

        let detailPanelDataForActiveItem;

        // note that the name of the detail panel is taken from the path, not the state (much faster)
        let detailPanelName = AppConfig.global.organisations.rootEntitiesParentName;
        if (pathNodes.length > 1) {
            detailPanelName = (pathNodes.slice(-1).pop()).name;
        }

        if (this.props.pathNodes.length > 1) {

            // this depends on the view. on mobile devices use slice(0). I think.. :)
            const activePathNode = this.props.pathNodes.slice(-1).pop();
            const activePathNodeId = activePathNode.id;

            if (detailPanelData) {
                detailPanelData.forEach(panel => {
                    if (panel.id === activePathNodeId) {
                        detailPanelDataForActiveItem = panel.data;
                    }
                });
            } else {
                console.log('no detail panel data received');
            }
        }

        return (
            <div className={ style.organisations }>
                { this.props.alertComponent }
                <Path pathNodes={ pathNodes } fetchEntities={ fetchEntities } />
                <section className={ style.panels_container } id="panels_container">
                    { panelContainer }
                    <Detailpanel
                        data = { detailPanelDataForActiveItem }
                        name = { detailPanelName }
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
