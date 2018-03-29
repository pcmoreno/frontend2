import { h, Component } from 'preact';

/** @jsx h */

import Panels from './components/Panels/Panels';
import Path from './components/Path/Path';
import Detailpanel from './components/Detailpanel/Detailpanel';

/* todo: there is a webpack plugin that can search within a root path which prevents ./../../../.. hell like this */
import Form from './../../../../components/Form';
import style from './style/organisations.scss';

export default class Organisations extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { panels, fetchEntities, openModalToAddOrganisation, pathNodes } = this.props;

        // define properties for the Panels component
        const panelContainer = <Panels
            panels={ panels }
            pathNodes={ pathNodes }
            fetchEntities={ fetchEntities }
            openModalToAddOrganisation={ openModalToAddOrganisation }
        />;

        return (
            <div className={ style.organisations }>
                { this.props.alertComponent }
                <Path pathNodes={ pathNodes } fetchEntities={ fetchEntities } />
                <section className={ style.panels_container } id="panels_container">
                    { panelContainer }
                    <Detailpanel entity={ pathNodes.slice(-1).pop() } />
                </section>
                <aside className={ `${style.modal_container} hidden` } id="modal_organisation">
                    <Form
                        formId={ 'organisation' }
                        ignoredFields={ [
                            // 'uuid',
                            'created',
                            'updated',
                            // 'manyOrganisationToManyCompetency',
                            // 'manyOrganisationToManyProduct',
                            // 'oneOrganisationToManyOrganisation',
                            'updated',
                            'updated',
                            'organisationType',
                            'organisationSlug'
                        ] }
                        forms = { this.props.forms }
                        storeFormDataInFormsCollection={ this.props.storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId={ this.props.changeFormFieldValueForFormId }
                        afterSubmit = { this.props.refreshDataWithMessage }
                        closeModal={ this.props.closeModalToAddOrganisation }
                    />
                </aside>
            </div>
        );
    }
}
