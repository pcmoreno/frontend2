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
        const { items } = this.props;
        const panels = <Panels items={ items } openModalToAddOrganisation={ this.props.openModalToAddOrganisation } />;

        return (
            <div className={ style.organisations }>
                { this.props.alertComponent }
                <Path />
                <section className={ style.panels_container } id="panels_container">
                    { panels }
                    <Detailpanel />
                </section>
                <aside className={ `${style.modal_container} hidden` } id="modal_organisation" >
                    <Form
                        formId={ 'organisation' }
                        ignoredFields={ [
                            'uuid',
                            'created',
                            'updated',
                            'manyOrganisationToManyCompetency',
                            'manyOrganisationToManyProduct',
                            'oneOrganisationToManyOrganisation',
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
