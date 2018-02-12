import { h, Component } from 'preact';
/** @jsx h */

import Panels from './components/Panels/Panels';
import Form from './../../../../components/Form';
import style from './style/organisations.scss';

export default class Organisations extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { items } = this.props;
        console.log('this.props.addOrganisationActive: ',this.props.addOrganisationActive);

        return (
            <section className={ style.organisations }>
                <div className={ style.bar } id = "fetching-data-indicator" />
                <Panels items={ items } addOrganisation={ this.props.addOrganisation } />
                <aside className={ style.modal }>
                    <Form
                        formId={ "organisation" }
                        ignoredFields={ [
                            "created",
                            "updated",
                            "manyOrganisationToManyCompetency",
                            "manyOrganisationToManyProduct",
                            "manyOrganisationToOneOrganisation",
                            "updated",
                            "updated",
                            "organisationType",
                            "organisationSlug"
                        ] }
                        forms = { this.props.forms }
                        storeFormDataInFormsCollection={ this.props.storeFormDataInFormsCollection }
                        changeFormFieldValueForFormId={ this.props.changeFormFieldValueForFormId }
                        baseUrl = { this.props.baseUrl }
                        afterSubmit = { this.props.getItems }
                        active={ this.props.addOrganisationActive }
                        closeModal={ this.props.closeModal }
                    />
                </aside>
            </section>
        )
    }
}
