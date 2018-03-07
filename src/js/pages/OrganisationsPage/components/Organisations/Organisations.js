import { h, Component } from 'preact';

/** @jsx h */

import Panels from './components/Panels/Panels';
import Path from './components/Path/Path';
import Detailpanel from './components/Detailpanel/Detailpanel';

/* todo: there is a webpack plugin that can search withing a root path which prevents ./../../../.. hell like this */
import Form from './../../../../components/Form';

import style from './style/organisations.scss';

export default class Organisations extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { items } = this.props;
        let panels = <Panels items={ items } openModalToAddOrganisation={ this.props.openModalToAddOrganisation } />;

        return (
            <div className={ style.organisations }>
                { this.props.alertComponent }
                <Path />
                <section className={ style.panels_container } id="panels_container">
                    { panels }
                    <Detailpanel />
                </section>
                <aside className={ style.modal_container } id="modal_organisation" >
                    <Form
                        formId={ 'organisation' }
                        ignoredFields={ [
                            'created',
                            'updated',
                            'manyOrganisationToManyCompetency',
                            'manyOrganisationToManyProduct',
                            'manyOrganisationToOneOrganisation',
                            'updated',
                            'updated',
                            'organisationType',
                            'organisationSlug'
                        ] }
                        forms = { this.props.forms }
                        storeFormDataInFormsCollection={ this.props.storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId={ this.props.changeFormFieldValueForFormId }
                        baseUrl = { this.props.baseUrl }
                        afterSubmit = { this.props.getItems }
                        closeModal={ this.props.closeModalToAddOrganisation }
                    />
                </aside>
            </div>
        );
    }
}
